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

export class GreasedLinePBRPluginMaterial2 extends MaterialPluginBase {
  private _colorsTexture?: RawTexture;
  private _parameters: GreasedLinePBRMaterialParameters;
  private _engine: Engine;

  constructor(
    material: Material,
    private _scene: Scene,

    parameters: GreasedLinePBRMaterialParameters
  ) {
    super(material, 'GreasedLinePBRPluginMaterial2', 200);

    this._engine = this._scene.getEngine();

    this._parameters = {};

    this._enable(true);
  }

  getAttributes(attributes: string[]) {
    // attributes.push('offset');
    // attributes.push('previous');
    // attributes.push('next');
    // attributes.push('side');
    // attributes.push('widths');
    // attributes.push('counters');
  }

  getSamplers(samplers: string[]) {
    // samplers.push('colors');
  }

  getUniforms() {
    return {};

    return {
      ubo: [
        { name: 'colors', size: 3, type: 'vec3' },
        // { name: 'previous', size: 3, type: 'vec3' },
        // { name: 'next', size: 3, type: 'vec3' },
        // { name: 'side', size: 1, type: 'float' },
        // { name: 'counters', size: 1, type: 'float' },
        // { name: 'widths', size: 1, type: 'float' },
      ],
      vertex: `
      float lineWidth;
      vec2 resolution;
      float sizeAttenuation;
      mat4 worldViewProjection;
      mat4 greasedLineProjection;
      `,
      fragment: `
      float dashArray;
      float dashOffset;
      float dashRatio;
      float useDash;
      float greasedLineVisibility;
      float colorsCount;
      float useColors;
      `,
    };
  }

  bindForSubMesh(
    uniformBuffer: UniformBuffer,
    scene: Scene,
    engine: Engine,
    subMesh: SubMesh
  ) {
    return;
  }

  getClassName() {
    return 'GreasedLinePBRPluginMaterial2';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCustomCode(shaderType: string): any {
    if (shaderType === 'vertex') {
      return {
        CUSTOM_VERTEX_DEFINITIONS: `
        flat out int vColorPointers;

    `,
        CUSTOM_VERTEX_MAIN_END: `
        vColorPointers = gl_VertexID;

    // gl_Position = vec4(id,id,id,0.);

`,
      };
    }

    if (shaderType === 'fragment') {
      return {
        CUSTOM_FRAGMENT_DEFINITIONS: `
        flat in int vColorPointers;
  `,
        CUSTOM_FRAGMENT_MAIN_END: `

float c = float(vColorPointers)/2415.;
          gl_FragColor = vec4(c,c,c,1.);
    `,
      };
    }

    return null;
  }

  private static _bton(bool?: boolean) {
    return bool ? 1 : 0;
  }
}
