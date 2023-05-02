import {
  Color3,
  Engine,
  Nullable,
  RawTexture,
  Scene,
  StandardMaterial,
} from '@babylonjs/core';
import { MaterialPluginBase, UniformBuffer } from '@babylonjs/core';
import { Material } from '@babylonjs/core/Materials/material';
import { Matrix } from '@babylonjs/core/Maths/math.vector';
import { GreasedLineMaterialParameters } from './graesedLineBuilder';

export class GreasedLinePluginMaterial extends MaterialPluginBase {
  private _colorsTexture?: RawTexture;
  private _parameters: GreasedLineMaterialParameters;
  private _engine: Engine;
  private _isEnabled = false;

  constructor(
    material: Material,
    private _scene: Scene,

    parameters: GreasedLineMaterialParameters
  ) {
    super(material, GreasedLinePluginMaterial.name, 200, {
      GLINE_HAS_COLOR: false,
      GLINE_HAS_COLORS: false,
    });

    this._engine = this._scene.getEngine();

    if (parameters.colors) {
      this._createColorsTexture(parameters.colors);
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
    samplers.push('colors');
  }

  getUniforms() {
    return {
      ubo: [
        { name: 'greasedLineProjection', size: 16, type: 'mat4' },
        { name: 'worldViewProjection', size: 16, type: 'mat4' },
        { name: 'lineWidth', size: 1, type: 'float' },
        { name: 'resolution', size: 2, type: 'vec2' },
        { name: 'singleColor', size: 3, type: 'vec3' },
        { name: 'sizeAttenuation', size: 1, type: 'float' },
        { name: 'dashArray', size: 1, type: 'float' },
        { name: 'dashOffset', size: 1, type: 'float' },
        { name: 'dashRatio', size: 1, type: 'float' },
        { name: 'useDash', size: 1, type: 'float' },
        { name: 'greasedLineVisibility', size: 1, type: 'float' },
        { name: 'colorsWidth', size: 1, type: 'float' },
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
      uniform float colorsWidth;
      uniform float useColors;
      uniform sampler2D colors;
      uniform vec3 singleColor;
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
    scene: Scene
    /*engine: Engine,
    subMesh: SubMesh*/
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
        GreasedLinePluginMaterial._bton(this._parameters.sizeAttenuation)
      );

      uniformBuffer.updateFloat('dashArray', this._parameters.dashArray ?? 0);
      uniformBuffer.updateFloat('dashOffset', this._parameters.dashOffset ?? 0);
      uniformBuffer.updateFloat('dashRatio', this._parameters.dashRatio ?? 0.5);
      uniformBuffer.updateFloat(
        'useDash',
        GreasedLinePluginMaterial._bton(this._parameters.useDash)
      );

      if (this._parameters.color) {
        uniformBuffer.updateColor3('singleColor', this._parameters.color);
      }

      if (this._colorsTexture) {
        uniformBuffer.updateFloat(
          'useColors',
          GreasedLinePluginMaterial._bton(this._parameters.useColors)
        );

        uniformBuffer.updateFloat(
          'colorsWidth',
          this._colorsTexture.getSize().width * 2
        );

        uniformBuffer.setTexture('colors', this._colorsTexture);
      }

      uniformBuffer.update();
    }
  }

  prepareDefines(
    defines: Record<string, unknown> /*, scene: Scene, mesh: AbstractMesh*/
  ) {
    const parameters = this._parameters;
    defines['GLINE_HAS_COLOR'] = !!parameters.color;
    // defines['GLINE_HAS_COLORS'] = !!parameters.colors;
  }

  getClassName() {
    return GreasedLinePluginMaterial.name;
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

    varying vec3 vNormal;
    varying vec4 vColor;
    varying float vCounters;
    flat out int vColorPointers;

    vec2 fix( vec4 i, float aspect ) {
      vec2 res = i.xy / i.w;
      res.x *= aspect;
      vCounters = counters;
      return res;
  }
`,
        CUSTOM_VERTEX_UPDATE_NORMAL: `
`,

        CUSTOM_VERTEX_UPDATE_POSITION: `
    vec3 positionOffset = offsets;
    positionUpdated += positionOffset;
        `,
        CUSTOM_VERTEX_MAIN_END: `
    // vCounters = counters;
    vColorPointers = gl_VertexID;
    float aspect = resolution.x / resolution.y;

    mat4 m = viewProjection * world;
    vec4 finalPosition = m * vec4( positionUpdated , 1.0 );
    vec4 prevPos = m * vec4( previous, 1.0 );
    vec4 nextPos = m * vec4( next, 1.0 );

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

      // vec2 perp = vec2( -dir1.y, dir1.x );
      // vec2 miter = vec2( -dir.y, dir.x );
      // w = clamp( w / dot( miter, perp ), 0., 4. * width * segmentWidth );
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
        '!gl_Position\\=viewProjection\\*worldPos;': '//', // remove
      };
    }

    if (shaderType === 'fragment') {
      return {
        CUSTOM_FRAGMENT_DEFINITIONS: `
          varying float vCounters;
          flat in int vColorPointers;
    `,

        CUSTOM_FRAGMENT_MAIN_BEGIN: `
        `,
        CUSTOM_FRAGMENT_MAIN_END: `
          gl_FragColor.a *= step(vCounters, greasedLineVisibility);
          if( gl_FragColor.a == 0. ) discard;

          if(useDash == 1.){
            gl_FragColor.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));
            if(gl_FragColor.a == 0.) discard;
          }

          #ifdef GLINE_HAS_COLOR
            gl_FragColor.rgb = singleColor;
          #else
            if (useColors == 1.) {
              gl_FragColor *= texture2D(colors, vec2(float(vColorPointers)/(colorsWidth), 0.));
            }
          #endif
      `,
      };
    }

    return null;
  }

  /*
              // float x = vColorPointers % colorsWidth;
              // float y = vColorPointers / colorsWidth;
              // c *= texture2D(colors, vec2(x, y));

              gl_FragColor ${
                (this._material as StandardMaterial).disableLighting ? '' : '*'
              }= texture2D(colors, vec2(float(vColorPointers)/(colorsWidth), 0.));
              //
*/

  private static _bton(bool?: boolean) {
    return bool ? 1 : 0;
  }

  private _createColorsTexture(colors: Uint8Array) {
    this._colorsTexture = new RawTexture(
      colors,
      colors.length / 3,
      1,
      Engine.TEXTUREFORMAT_RGB,
      this._scene,
      false,
      true,
      RawTexture.NEAREST_NEAREST
    );
    this._colorsTexture.name = 'greased-line-colors';
  }

  public setUseColors(value: boolean) {
    this._parameters.useColors = value;
  }

  public setColors(
    colors: Nullable<Uint8Array>,
    lazy = false,
    forceUpdate = false
  ): void {
    if (colors === null || colors.length === 0) {
      this._colorsTexture?.dispose();
      return;
    }

    const origColorsCount = this._parameters.colors?.length ?? 0;

    this._parameters.colors = colors;

    if (lazy && !forceUpdate) {
      return;
    }

    if (
      this._colorsTexture &&
      origColorsCount === colors.length &&
      !forceUpdate
    ) {
      this._colorsTexture.update(colors);
    } else {
      this._colorsTexture?.dispose();

      // const colorsWidth = colors.length / 3;
      // const colorsHeight = 1;

      this._createColorsTexture(colors);
    }
  }

  public updateLazy() {
    if (this._parameters.colors) {
      this.setColors(this._parameters.colors, false, true);
    }
  }

  public getParameters() {
    return { ...this._parameters };
  }

  public setVisibility(value: number) {
    this._parameters.visibility = value;
  }

  public setUseDash(value: boolean) {
    this._parameters.useDash = value;
  }

  public setDashArray(value: number) {
    this._parameters.dashArray = value;
  }

  public setDashRatio(value: number) {
    this._parameters.dashRatio = value;
  }

  public setDashOffset(value: number) {
    this._parameters.dashOffset = value;
  }

  public setSizeAttenuation(value: boolean) {
    this._parameters.sizeAttenuation = value;
  }

  public setWidth(value: number) {
    this._parameters.width = value;
  }

  public setColor(value: Color3 | undefined) {
    if (
      (this._parameters.color === undefined && value !== undefined) ||
      (this._parameters.color !== undefined && value === undefined)
    ) {
      this._parameters.color = value;
      this.markAllDefinesAsDirty();
    } else {
      this._parameters.color = value;
    }
  }
}
