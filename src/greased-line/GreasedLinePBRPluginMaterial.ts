import { Engine, RawTexture, Scene, SubMesh } from '@babylonjs/core';
/**
 * @author roland@babylonjs.xyz
 */

import { MaterialPluginBase, UniformBuffer } from '@babylonjs/core';
import { Material } from '@babylonjs/core/Materials/material';
import { Vector2 } from '@babylonjs/core/Maths/math.vector';

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

  constructor(
    material: Material,
    scene: Scene,

    parameters: GreasedLinePBRMaterialParameters
  ) {
    super(material, 'GreasedLinePBRPluginMaterial', 200);

    this._engine = scene.getEngine();

    if (parameters.colors) {
      this._colorsTexture = new RawTexture(
        new Uint8Array(parameters.colors),
        parameters.colors.length / 3,
        1,
        Engine.TEXTUREFORMAT_RGB,
        scene,
        false,
        true,
        RawTexture.NEAREST_NEAREST
      );
      this._colorsTexture.name = 'greased-line-colors';
    }

    this._parameters = {};
  }

  getAttributes(attributes: string[]) {
    attributes.push('offset');
    attributes.push('previous');
    attributes.push('next');
    attributes.push('side');
    attributes.push('widths');
    attributes.push('counters');
    attributes.push('offset');
  }

  getSamplers(samplers: string[]) {
    samplers.push('colors');
  }

  getUniforms() {
    return {
      ubo: [{ name: 'colors', size: 3, type: 'vec3' }],
      fragment: `
      float lineWidth;
      float resolution;
      float vec2;
      float sizeAttenuation;
      float dashArray;
      float dashOffset;
      float dashRatio;
      float useDash;
      float greasedLineVisibility;
      float colorsCount;
      `,
    };
  }

  bindForSubMesh(
    uniformBuffer: UniformBuffer,
    scene: Scene,
    engine: Engine,
    subMesh: SubMesh
  ) {
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
    // uniformBuffer.setTexture('colors', this._colorsTexture);
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

    varying vec3 vNormal;
    // varying vec2 vUV;
    varying vec4 vColor;
    varying float vCounters;
    flat out int vColorPointers;
`,
        CUSTOM_VERTEX_MAIN_BEGIN: `
    vec2 fix( vec4 i, float aspect ) {
        vec2 res = i.xy / i.w;
        res.x *= aspect;
        return res;
    }
`,
        CUSTOM_VERTEX_MAIN_END: `
    vCounters = counters;
    vColorPointers = gl_VertexID;
    float aspect = resolution.x / resolution.y;

    // vUV = uv;

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
        CUSTOM_FRAGMENT_MAIN_END: `
          if( useDash == 1. ){
            gl_FragColor.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));
          }
          gl_FragColor.a *= step(vCounters, greasedLineVisibility);

          // if( gl_FragColor.a < alphaTest ) discard;

          if (useColors == 1.) {
            gl_FragColor *= texture2D(colors, vec2(float(vColorPointers-2)/float(colorsCount), 0.));
          }

    `,
      };
    }

    return null;
  }

  private static _bton(bool?: boolean) {
    return bool ? 1 : 0;
  }
}
