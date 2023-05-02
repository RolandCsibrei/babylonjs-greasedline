import {
  ShaderMaterial,
  Scene,
  Color3,
  Vector2,
  Texture,
  RawTexture,
  Engine,
  Nullable,
} from '@babylonjs/core';

export interface GreasedLineSimpleMaterialParameters {
  color?: Color3;
  opacity?: number;
  width?: number;

  useColors?: boolean;
  colors?: Uint8Array;
  colorDistribution?: number;

  sizeAttenuation?: boolean;
  visibility?: number;

  useMap?: boolean;
  map?: Texture;

  alphaMap?: Texture;
  useAlphaMap?: boolean;

  resolution?: Vector2;
  dashArray?: number;
  dashOffset?: number;
  dashRatio?: number;
  useDash?: boolean;
  alphaTest?: number;
  repeat?: Vector2;

  uvOffset?: Vector2;
  uvRotation?: number;
  uvScale?: Vector2;
}

export class GreasedLineSimpleMaterial extends ShaderMaterial {
  private _parameters: GreasedLineSimpleMaterialParameters;
  private _engine: Engine;

  private _colorsTexture?: RawTexture;

  private static _bton(bool?: boolean) {
    return bool ? 1 : 0;
  }

  public static COLOR_DISTRIBUTION_NONE = 0;
  public static COLOR_DISTRIBUTION_REPEAT = 1;
  public static COLOR_DISTRIBUTION_EVEN = 2;
  public static COLOR_DISTRIBUTION_START = 3;
  public static COLOR_DISTRIBUTION_END = 4;
  public static COLOR_DISTRIBUTION_START_END = 5;

  public static WIDTH_DISTRIBUTION_NONE = 0;
  public static WIDTH_DISTRIBUTION_REPEAT = 1;
  public static WIDTH_DISTRIBUTION_EVEN = 2;
  public static WIDTH_DISTRIBUTION_START = 3;
  public static WIDTH_DISTRIBUTION_END = 4;
  public static WIDTH_DISTRIBUTION_START_END = 5;

  constructor(
    name: string,
    scene: Scene,
    parameters: GreasedLineSimpleMaterialParameters,
    private _lazy = false
  ) {
    super(
      name,
      scene,
      {
        vertex: '../shaders/greasedLine',
        fragment: '../shaders/greasedLine',
      },
      {
        attributes: [
          'uv',
          'position',
          'normal',
          'offsets',
          'previous',
          'next',
          'side',
          'widths',
          'counters',
        ],
        uniforms: [
          'worldViewProjection',
          'projection',
          'colorsWidth',
          'colorsHeight',
          'colors',
          'useColors',
          'width',
          'map',
          'useMap',
          'alphaMap',
          'useAlphaMap',
          'color',
          'opacity',
          'resolution',
          'sizeAttenuation',
          'dashArray',
          'dashOffset',
          'dashRatio',
          'useDash',
          'visibility',
          'alphaTest',
          'repeat',
          'uvOffset',
          'uvRotation',
          'uvScale',
        ],
      }
    );

    this._engine = scene.getEngine();

    this._parameters = {};
    this.setParameters(parameters);
  }

  public getParameters() {
    return { ...this._parameters };
  }

  public setParameters(parameters: GreasedLineSimpleMaterialParameters) {
    this.setWidth(parameters.width ?? 1);
    this.setColor(parameters.color ?? Color3.White());
    this.setOpacity(parameters.opacity ?? 1);
    this.setUseColors(parameters.useColors ?? false);
    this.setColors(parameters.colors ?? null, this._lazy);
    this.setUseMap(parameters.useMap ?? false);
    this.setUseAlphaMap(parameters.useAlphaMap ?? false);
    parameters.map && this.setMap(parameters.map);
    parameters.alphaMap && this.setAlphaMap(parameters.alphaMap);
    this.setResolution(
      parameters.resolution ??
        new Vector2(
          this._engine.getRenderWidth(),
          this._engine.getRenderHeight()
        )
    );
    this.setSizeAttenuation(parameters.sizeAttenuation ?? false);
    this.setDashArray(parameters.dashArray ?? 0);
    this.setDashOffset(parameters.dashOffset ?? 0);
    this.setDashRatio(parameters.dashRatio ?? 0.5);
    this.setUseDash(parameters.useDash ?? false);
    this.setVisibility(parameters.visibility ?? 1);
    this.setAlphaTest(parameters.alphaTest ?? 1);
    this.setRepeat(parameters.repeat ?? new Vector2(1, 1));
    this.setUvOffset(parameters.uvOffset ?? new Vector2(0, 0));
    this.setUvRotation(parameters.uvRotation ?? 0);
    this.setUvScale(parameters.uvScale ?? new Vector2(1, 1));
  }

  public setDashArray(dashArray: number): void {
    this._parameters.dashArray = dashArray;
    this.setFloat('dashArray', dashArray);
  }

  public setDashOffset(dashOffset: number): void {
    this._parameters.dashOffset = dashOffset;
    this.setFloat('dashOffset', dashOffset);
  }

  public setDashRatio(dashRatio: number): void {
    this._parameters.dashRatio = dashRatio;
    this.setFloat('dashRatio', dashRatio);
  }

  public setVisibility(visibility: number): void {
    this._parameters.visibility = visibility;
    this.setFloat('visibility', visibility);
  }

  public setAlphaTest(alphaTest: number): void {
    this._parameters.alphaTest = alphaTest;
    this.setFloat('alphaTest', alphaTest);
  }

  public setUvRotation(uvRotation: number): void {
    this._parameters.uvRotation = uvRotation;
    this.setFloat('uvRotation', uvRotation);
  }

  public setUseDash(useDash: boolean): void {
    this._parameters.useDash = useDash;
    this.setFloat('useDash', GreasedLineSimpleMaterial._bton(useDash));
  }

  public setRepeat(repeat: Vector2): void {
    this._parameters.repeat = repeat;
    this.setVector2('repeat', repeat);
  }

  public setUvOffset(uvOffset: Vector2): void {
    this._parameters.uvOffset = uvOffset;
    this.setVector2('uvOffset', uvOffset);
  }
  public setUvScale(uvScale: Vector2): void {
    this._parameters.uvScale = uvScale;
    this.setVector2('uvScale', uvScale);
  }

  public setResolution(resolution: Vector2): void {
    this._parameters.resolution = resolution;
    this.setVector2('resolution', resolution);
  }

  public setSizeAttenuation(sizeAttenuation: boolean): void {
    this._parameters.sizeAttenuation = sizeAttenuation;
    this.setFloat(
      'sizeAttenuation',
      GreasedLineSimpleMaterial._bton(sizeAttenuation)
    );
  }

  public setWidth(width: number): void {
    this._parameters.width = width;
    this.setFloat('width', width);
  }

  public setOpacity(opacity: number): void {
    this._parameters.opacity = opacity;
    this.setFloat('opacity', opacity);
  }

  public setColor(color: Color3): void {
    this._parameters.color = color;
    this.setColor3('color', color);
  }

  public setUseColors(useColors: boolean): void {
    this._parameters.useColors = useColors;
    this.setFloat('useColors', GreasedLineSimpleMaterial._bton(useColors));
  }

  public setUseMap(useMap: boolean): void {
    this._parameters.useMap = useMap;
    this.setFloat('useMap', GreasedLineSimpleMaterial._bton(useMap));
  }

  public setUseAlphaMap(useAlphaMap: boolean): void {
    this._parameters.useAlphaMap = useAlphaMap;
    this.setFloat('useAlphaMap', GreasedLineSimpleMaterial._bton(useAlphaMap));
  }

  public setMap(map: Texture): void {
    this.setTexture('map', map);
  }

  public setAlphaMap(alphaMap: Texture): void {
    this.setTexture('alphaMap', alphaMap);
  }

  public updateLazy() {
    if (this._parameters.colors) {
      this.setColors(this._parameters.colors, false);
    }
  }

  public setColors(colors: Nullable<Uint8Array>, lazy = false): void {
    if (colors === null || colors.length === 0) {
      this._colorsTexture?.dispose();
      return;
    }

    const origColorsCount = this._parameters.colors?.length ?? 0;

    this._parameters.colors = colors;

    if (lazy) {
      return;
    }

    if (this._colorsTexture && origColorsCount === colors.length) {
      this._colorsTexture.update(colors);
    } else {
      this._colorsTexture?.dispose();

      const colorsWidth = this._parameters.colors.length / 3;
      const colorsHeight = 1;
      this._colorsTexture = new RawTexture(
        colors,
        colorsWidth,
        colorsHeight,
        Engine.TEXTUREFORMAT_RGB,
        this.getScene(),
        false,
        true,
        RawTexture.NEAREST_NEAREST
      );
      this._colorsTexture.name = 'greased-line-colors';

      this.setFloat('colorsWidth', colorsWidth);
      this.setFloat('colorsHeight', colorsHeight);
      this.setTexture('colors', this._colorsTexture);
    }
  }
}
