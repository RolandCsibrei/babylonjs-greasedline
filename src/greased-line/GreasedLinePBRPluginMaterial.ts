/**
 * @author roland@babylonjs.xyz
 */

import { Engine, RawTexture, Scene, SubMesh } from '@babylonjs/core';
import { MaterialPluginBase, UniformBuffer } from '@babylonjs/core';
import { Material } from '@babylonjs/core/Materials/material';
import { Matrix, Vector2 } from '@babylonjs/core/Maths/math.vector';

export interface GreasedLinePBRMaterialParameters {
  lazy?: boolean;
  width?: number;

  useColors?: boolean;
  colors?: Uint8Array;
  colorDistribution?: number;

  sizeAttenuation?: boolean;
  visibility?: number;

  resolution?: Vector2;
  dashArray?: number;
  dashOffset?: number;
  dashRatio?: number;
  useDash?: boolean;
}

export class GreasedLinePBRPluginMaterial extends MaterialPluginBase {
  private _colorsTexture?: RawTexture;
  private _parameters: GreasedLinePBRMaterialParameters;
  private _engine: Engine;
  private _isEnabled = false;

  constructor(
    material: Material,
    private _scene: Scene,

    parameters: GreasedLinePBRMaterialParameters
  ) {
    super(material, 'GreasedLinePBRPluginMaterial', 200);

    this._engine = this._scene.getEngine();

    if (parameters.colors) {
      this._colorsTexture = new RawTexture(
        new Uint8Array(parameters.colors),
        parameters.colors.length / 3,
        1,
        Engine.TEXTUREFORMAT_RGB,
        this._scene,
        false,
        true,
        RawTexture.NEAREST_NEAREST
      );
      this._colorsTexture.name = 'greased-line-colors';
    }

    this._parameters = parameters;

    this.isEnabled = true;
  }

  getAttributes(attributes: string[]) {
    attributes.push('offsets');
    attributes.push('previous');
    attributes.push('next');
    attributes.push('side');
    attributes.push('widths');
    attributes.push('counters');
  }

  getSamplers(samplers: string[]) {
    // samplers.push('colors');
  }

  getUniforms() {
    return {
      ubo: [
        { name: 'greasedLineProjection', size: 16, type: 'mat4' },
        { name: 'worldViewProjection', size: 16, type: 'mat4' },
        { name: 'lineWidth', size: 1, type: 'float' },
        { name: 'resolution', size: 2, type: 'vec2' },
        { name: 'sizeAttenuation', size: 1, type: 'float' },
        { name: 'dashArray', size: 1, type: 'float' },
        { name: 'dashOffset', size: 1, type: 'float' },
        { name: 'dashRatio', size: 1, type: 'float' },
        { name: 'useDash', size: 1, type: 'float' },
        { name: 'greasedLineVisibility', size: 1, type: 'float' },
        { name: 'colorsCount', size: 1, type: 'float' },
        { name: 'useColors', size: 1, type: 'float' },
      ],
      vertex: `
      uniform float lineWidth;
      uniform vec2 resolution;
      uniform float sizeAttenuation;
      uniform mat4 worldViewProjection;
      uniform mat4 greasedLineProjection;
      `,
      fragment: `
      uniform float dashArray;
      uniform float dashOffset;
      uniform float dashRatio;
      uniform float useDash;
      uniform float greasedLineVisibility;
      uniform float colorsCount;
      uniform float useColors;
      `,
    };
  }

  get isEnabled() {
    return this._isEnabled;
  }

  set isEnabled(enabled) {
    if (this._isEnabled === enabled) {
      return;
    }
    this._isEnabled = enabled;
    this.markAllDefinesAsDirty();
    this._enable(this._isEnabled);
  }

  bindForSubMesh(
    uniformBuffer: UniformBuffer,
    scene: Scene,
    engine: Engine,
    subMesh: SubMesh
  ) {
    if (this._isEnabled) {
      const activeCamera = this._scene.activeCamera;

      if (activeCamera) {
        const projection = activeCamera.getProjectionMatrix();
        uniformBuffer.updateMatrix('greasedLineProjection', projection);
      }

      const worldViewProjection = Matrix.Identity().multiply(
        scene.getTransformMatrix()
      );
      uniformBuffer.updateMatrix('worldViewProjection', worldViewProjection);
      uniformBuffer.updateFloat('lineWidth', this._parameters.width ?? 1);

      uniformBuffer.updateFloat(
        'greasedLineVisibility',
        this._parameters.visibility ?? 1
      );
      uniformBuffer.updateFloat(
        'useColors',
        GreasedLinePBRPluginMaterial._bton(this._parameters.useColors)
      );

      if (this._parameters.resolution) {
        uniformBuffer.updateFloat2(
          'resolution',
          this._parameters.resolution.x,
          this._parameters.resolution.y
        );
      } else {
        uniformBuffer.updateFloat2(
          'resolution',
          this._engine.getRenderWidth(),
          this._engine.getRenderHeight()
        );
      }
      uniformBuffer.updateFloat(
        'sizeAttenuation',
        GreasedLinePBRPluginMaterial._bton(this._parameters.sizeAttenuation)
      );
      uniformBuffer.updateFloat('dashArray', this._parameters.dashArray ?? 0);
      uniformBuffer.updateFloat('dashOffset', this._parameters.dashOffset ?? 0);
      uniformBuffer.updateFloat('dashRatio', this._parameters.dashRatio ?? 0.5);
      uniformBuffer.updateFloat(
        'useDash',
        GreasedLinePBRPluginMaterial._bton(this._parameters.useDash)
      );

      uniformBuffer.updateFloat(
        'useColors',
        GreasedLinePBRPluginMaterial._bton(this._parameters.useColors)
      );

      // uniformBuffer.setTexture('colors', this._colorsTexture);

      uniformBuffer.update();
    }
  }

  getClassName() {
    return 'GreasedLinePBRPluginMaterial';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCustomCode(shaderType: string): any {
    if (shaderType === 'vertex') {
      return {
        CUSTOM_VERTEX_DEFINITIONS: `
    attribute vec3 previous;
    attribute vec3 next;
    attribute float side;
    attribute float widths;
    attribute float counters;
    attribute vec3 offsets;
    // attribute vec2 greasedLineUv;

    // varying vec3 vNormalW;
    varying vec3 vNormal;
    // varying vec2 vUV;
    varying vec4 vColor;
    varying float vCounters;
    flat out int vColorPointers;

    vec2 fix( vec4 i, float aspect ) {
      vec2 res = i.xy / i.w;
      res.x *= aspect;
      return res;
  }
`,
        CUSTOM_VERTEX_UPDATE_NORMAL: `
`,

        CUSTOM_VERTEX_MAIN_END: `
    vCounters = counters;
    vColorPointers = gl_VertexID;
    float aspect = resolution.x / resolution.y;

    mat4 m = worldViewProjection;
    vec3 positionOffset = offsets;
    vec4 finalPosition = m * vec4( vPositionW + positionOffset, 1.0 );
    vec4 prevPos = m * vec4( previous + positionOffset, 1.0 );
    vec4 nextPos = m * vec4( next + positionOffset, 1.0 );

    vec2 currentP = fix( finalPosition, aspect );
    vec2 prevP = fix( prevPos, aspect );
    vec2 nextP = fix( nextPos, aspect );

    float w =  lineWidth * widths;

    vec2 dir;
    if( nextP == currentP ) dir = normalize( currentP - prevP );
    else if( prevP == currentP ) dir = normalize( nextP - currentP );
    else {
        vec2 dir1 = normalize( currentP - prevP );
        vec2 dir2 = normalize( nextP - currentP );
        dir = normalize( dir1 + dir2 );

        vec2 perp = vec2( -dir1.y, dir1.x );
        vec2 miter = vec2( -dir.y, dir.x );
    }
    vec4 normal = vec4( -dir.y, dir.x, 0., 1. );
    normal.xy *= .5 * w;
    normal *= greasedLineProjection;
    if( sizeAttenuation == 0. ) {
          normal.xy *= finalPosition.w;
        normal.xy /= ( vec4( resolution, 0., 1. ) * greasedLineProjection ).xy;
    }

    finalPosition.xy += normal.xy * side;

    gl_Position = finalPosition;

    vNormal= normal.xyz;
    vPositionW = vec3(finalPosition);

`,
      };
    }

    if (shaderType === 'fragment') {
      return {
        CUSTOM_FRAGMENT_DEFINITIONS: `

          varying vec3 vNormal;
          varying float vCounters;
          flat in int vColorPointers;
    `,

        CUSTOM_FRAGMENT_MAIN_BEGIN: `
        //  normalW = vNormalW;
        //  geometricNormalW = vNormalW;
        `,
        CUSTOM_FRAGMENT_MAIN_END: `

          if( useDash == 1. ){
            gl_FragColor.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));
          }
          gl_FragColor.a *= step(vCounters, greasedLineVisibility);

          // if( gl_FragColor.a < alphaTest ) discard;

          // if (useColors == 1.) {
          //   gl_FragColor *= texture2D(colors, vec2(float(vColorPointers-2)/float(colorsCount), 0.));
          // }

    `,
      };
    }

    return null;
  }

  private static _bton(bool?: boolean) {
    return bool ? 1 : 0;
  }
}
