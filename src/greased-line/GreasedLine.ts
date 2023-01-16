/**
 * @author roland@babylonjs.xyz
 */

import { BoundingSphere, Ray, VertexBuffer } from '@babylonjs/core';
import {
  Vector3,
  Buffer,
  Mesh,
  VertexData,
  Scene,
  Matrix,
} from '@babylonjs/core';
import { GreasedLineMaterial } from './GreasedLineMaterial';

export type GreasedLinePoints =
  | Vector3[]
  | Vector3[][]
  | Float32Array
  | Float32Array[]
  | number[][];

export interface GreasedLineParameters {
  points: number[][];
  widths?: number[];
  widthsDistribution?: WidthsDistribution;
  offsets?: number[];
  instance?: GreasedLine;
  updatable?: boolean;
  pbr?: boolean;
}

export enum ColorDistribution {
  Repeat,
  Even,
  Start,
  End,
  StartEnd,
  None,
}

export enum WidthsDistribution {
  Repeat,
  Even,
  Start,
  End,
  StartEnd,
  // None,
}

export class GreasedLine extends Mesh {
  private _vertexPositions: number[];
  private _offset?: number[];
  private _previous: number[];
  private _next: number[];
  private _side: number[];
  private _widths: number[];

  private _indices: number[];
  private _uvs: number[];
  private _counters: number[];
  private _colorPointers: number[];
  private _points: number[][];

  private _offsetsBuffer?: Buffer;
  private _WidthsBuffer?: Buffer;

  private _matrixWorld: Matrix;

  private _boundingSphere: BoundingSphere;

  constructor(
    public name: string,
    _scene: Scene,
    private _parameters: GreasedLineParameters,
    private _updatable: boolean = false,
    private _lazy = false
  ) {
    super(name, _scene, null, null, false, false);

    this._vertexPositions = [];
    this._indices = [];
    this._uvs = [];

    if (_parameters.offsets) {
      this._offset = [..._parameters.offsets];
    }
    this._previous = [];
    this._next = [];
    this._side = [];
    this._widths =
      _parameters.widths ?? new Array(_parameters.points.length).fill(1);
    this._counters = [];
    this._colorPointers = [];

    this._points = [];

    this._matrixWorld = this.getWorldMatrix();

    this._boundingSphere = new BoundingSphere(
      Vector3.Zero(),
      Vector3.Zero(),
      this._matrixWorld
    );

    if (this._parameters.points) {
      this.addPoints(this._parameters.points);
    }
  }

  public updateLazy() {
    this.setPoints(this._points);
    this._drawLine();
    this._updateRaycastBoundingInfo();

    if (this.material instanceof GreasedLineMaterial) {
      this.material.updateLazy();
    }
  }

  public isLazy() {
    return this._lazy;
  }

  public getSegmentWidths() {
    return this._widths;
  }

  public get positions() {
    return this._vertexPositions;
  }

  public get points() {
    return this._points;
  }

  public set points(points: number[][]) {
    this.setPoints(points);
  }

  public get lineCount() {
    return this._colorPointers.length;
  }

  public addPoints(points: number[][]) {
    const numberPoints = points;
    this._points.push(...numberPoints);
    if (!this._lazy) {
      this.setPoints(this._points);
    }
  }

  public setPoints(points: number[][]) {
    this._points = points;

    this._initGreasedLine();

    let indiceOffset = 0;

    points.forEach((p) => {
      const positions: number[] = [];
      const counters: number[] = [];
      const indices: number[] = [];

      for (let j = 0, jj = 0; jj < p.length; j++, jj += 3) {
        const c = jj / p.length;

        positions.push(p[jj], p[jj + 1], p[jj + 2]);
        positions.push(p[jj], p[jj + 1], p[jj + 2]);
        counters.push(c);
        counters.push(c);

        if (jj < p.length - 3) {
          const n = j * 2 + indiceOffset;
          indices.push(n, n + 1, n + 2);
          indices.push(n + 2, n + 1, n + 3);
        }
      }

      indiceOffset += (p.length / 3) * 2;

      const { previous, next, uvs, side } = this._preprocess(positions);

      this._vertexPositions.push(...positions);
      this._indices.push(...indices);
      this._counters.push(...counters);
      this._previous.push(...previous);
      this._next.push(...next);
      this._uvs.push(...uvs);
      this._side.push(...side);
    });

    if (!this._lazy) {
      this._drawLine();
      this._updateRaycastBoundingInfo();
    }
  }

  private _initGreasedLine() {
    this._vertexPositions = [];
    this._counters = [];
    this._previous = [];
    this._next = [];
    this._side = [];
    this._indices = [];
    this._uvs = [];
    this._colorPointers = [];
  }

  public setOffsets(offsets: number[]) {
    this._offsetsBuffer && this._offsetsBuffer.update(offsets);
  }
  public setSegmentWidths(widths: number[]) {
    this._widths = widths;
    if (!this._lazy) {
      this._WidthsBuffer && this._WidthsBuffer.update(widths);
    }
  }

  public raycast(raycaster: Ray, threshold = 0.2) {
    if (
      this._boundingSphere &&
      raycaster.intersectsSphere(this._boundingSphere, threshold) === false
    ) {
      return;
    }

    const vStart = new Vector3();
    const vEnd = new Vector3();
    const vOffsetStart = new Vector3();
    const vOffsetEnd = new Vector3();

    const indices = this.getIndices();
    const positions = this.getVerticesData(VertexBuffer.PositionKind);
    const widths = this._widths;

    const lineWidth =
      (this.material as GreasedLineMaterial).getParameters().width ?? 1;

    const intersects = [];
    if (indices !== null && positions !== null) {
      let i = 0,
        l = 0;
      for (i = 0, l = indices.length - 1; i < l; i += 3) {
        const a = indices[i];
        const b = indices[i + 1];

        vStart.fromArray(positions, a * 3);
        vEnd.fromArray(positions, b * 3);

        if (this._offset) {
          vOffsetStart.fromArray(this._offset, a * 3);
          vOffsetEnd.fromArray(this._offset, b * 3);
          vStart.addInPlace(vOffsetStart);
          vStart.addInPlace(vOffsetEnd);
        }

        const iFloored = Math.floor(i / 3);
        const width = widths[iFloored] !== undefined ? widths[iFloored] : 1;
        const precision = threshold + (lineWidth * width) / 2;

        const distance = raycaster.intersectionSegment(
          vStart,
          vEnd,
          precision / 1000
        );
        if (distance !== -1) {
          intersects.push({
            distance: distance,
            point: raycaster.direction
              .normalize()
              .multiplyByFloats(distance, distance, distance)
              .add(raycaster.origin),
            index: i,
            object: this,
          });
        }
      }
      i = l;
    }

    return intersects;
  }

  private _updateRaycastBoundingInfo() {
    const boundingInfo = this.getBoundingInfo();
    this._boundingSphere.reConstruct(
      boundingInfo.minimum,
      boundingInfo.maximum,
      this._matrixWorld
    );
  }

  private _compareV3(
    positionIdx1: number,
    positionIdx2: number,
    positions: number[]
  ) {
    const arrayIdx1 = positionIdx1 * 6;
    const arrayIdx2 = positionIdx2 * 6;
    return (
      positions[arrayIdx1] === positions[arrayIdx2] &&
      positions[arrayIdx1 + 1] === positions[arrayIdx2 + 1] &&
      positions[arrayIdx1 + 2] === positions[arrayIdx2 + 2]
    );
  }

  private _copyV3(positionIdx: number, positions: number[]) {
    positions = positions ?? this._vertexPositions;

    const arrayIdx = positionIdx * 6;
    return [
      positions[arrayIdx],
      positions[arrayIdx + 1],
      positions[arrayIdx + 2],
    ];
  }

  private _preprocess(positions: number[]) {
    const l = positions.length / 6;

    let v: number[] = [];

    const previous = [];
    const next = [];
    const side = [];
    const uvs = [];

    if (this._compareV3(0, l - 1, positions)) {
      v = this._copyV3(l - 2, positions);
    } else {
      v = this._copyV3(0, positions);
    }
    previous.push(v[0], v[1], v[2]);
    previous.push(v[0], v[1], v[2]);

    for (let j = 0; j < l; j++) {
      side.push(1);
      side.push(-1);

      // uvs
      uvs.push(j / (l - 1), 0);
      uvs.push(j / (l - 1), 1);

      if (j < l - 1) {
        v = this._copyV3(j, positions);
        previous.push(v[0], v[1], v[2]);
        previous.push(v[0], v[1], v[2]);
      }
      if (j > 0) {
        v = this._copyV3(j, positions);
        next.push(v[0], v[1], v[2]);
        next.push(v[0], v[1], v[2]);
      }
    }

    if (this._compareV3(l - 1, 0, positions)) {
      v = this._copyV3(1, positions);
    } else {
      v = this._copyV3(l - 1, positions);
    }
    next.push(v[0], v[1], v[2]);
    next.push(v[0], v[1], v[2]);

    return {
      previous,
      next,
      uvs,
      // width,
      side,
    };
  }

  private _drawLine() {
    const vertexData = new VertexData();
    vertexData.positions = this._vertexPositions;
    vertexData.indices = this._indices;
    vertexData.uvs = this._uvs;
    vertexData.applyToMesh(this, false);

    const engine = this._scene.getEngine();

    const previousBuffer = new Buffer(engine, this._previous, false, 3);
    this.setVerticesBuffer(previousBuffer.createVertexBuffer('previous', 0, 3));

    const nextBuffer = new Buffer(engine, this._next, false, 3);
    this.setVerticesBuffer(nextBuffer.createVertexBuffer('next', 0, 3));

    const sideBuffer = new Buffer(engine, this._side, false, 1);
    this.setVerticesBuffer(sideBuffer.createVertexBuffer('side', 0, 1));

    const countersBuffer = new Buffer(engine, this._counters, false, 1);
    this.setVerticesBuffer(countersBuffer.createVertexBuffer('counters', 0, 1));

    const widthBuffer = new Buffer(engine, this._widths, this._updatable, 1);
    this.setVerticesBuffer(widthBuffer.createVertexBuffer('widths', 0, 1));
    this._WidthsBuffer = widthBuffer;

    if (this._offset) {
      const offsetBuffer = new Buffer(engine, this._offset, this._updatable, 3);
      this.setVerticesBuffer(offsetBuffer.createVertexBuffer('offsets', 0, 3));
      this._offsetsBuffer = offsetBuffer;
    }
  }

  public getParameters() {
    return { ...this._parameters };
  }
}
