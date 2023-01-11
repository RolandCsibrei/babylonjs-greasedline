/**
 * @author roland@babylonjs.xyz
 */

import {
  Color3,
  Engine,
  EngineStore,
  Nullable,
  RawTexture,
  Scene,
  Texture,
  Vector2,
  Vector3,
} from '@babylonjs/core';

import {
  GreasedLine,
  GreasedLineParameters,
  GreasedLinePoints,
  WidthsDistribution,
} from './GreasedLine';

import {
  GreasedLineMaterial,
  GreasedLineMaterialParameters,
} from './GreasedLineMaterial';

import {
  GreasedLinePBRMaterial,
  GreasedLinePBRMaterialParameters,
} from './GreasedLinePBRMaterial';

export enum ColorDistribution {
  Repeat,
  Even,
  Start,
  End,
  StartEnd,
  None,
}

export interface GreasedLineBuilderParameters {
  lazy?: boolean;

  points: GreasedLinePoints;
  widths?: number[];
  widthsDistribution?: WidthsDistribution;
  offsets?: number[];
  instance?: GreasedLine;
  updatable?: boolean;
  pbr?: boolean;

  //

  color?: Color3;
  opacity?: number;
  width?: number;

  useColors?: boolean;
  colors?: Color3[];
  colorDistribution?: ColorDistribution;

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

export const GreasedLineBuilder = {
  CreateGreasedLine,
  ConvertPoints,
  NormalizeWidthTable,
  NormalizeColorTable,
  Color3toUint8,
  TextureFromColors,
};

export function CreateGreasedLine(
  name: string,
  parameters: GreasedLineBuilderParameters,
  scene: Nullable<Scene>
) {
  scene = <Scene>(scene ?? EngineStore.LastCreatedScene);

  let instance;

  const allPoints = GreasedLineBuilder.ConvertPoints(parameters.points);
  let length = 0;
  if (Array.isArray(allPoints[0])) {
    allPoints.forEach((points) => {
      length += points.length / 3;
    });
  }
  const widths = GreasedLineBuilder.NormalizeWidthTable(
    length,
    parameters.widths ?? [],
    parameters.widthsDistribution ?? WidthsDistribution.Start
  );

  if (!parameters.instance) {
    const initialGreasedLineParameters: GreasedLineParameters = {
      points: allPoints,
      offsets: parameters.offsets,
      pbr: parameters.pbr,
      updatable: parameters.updatable,
      widths,
      widthsDistribution: parameters.widthsDistribution,
    };
    instance = new GreasedLine(
      name,
      scene,
      initialGreasedLineParameters,
      parameters.updatable,
      parameters.lazy
    );
  } else {
    instance = parameters.instance;
    _SetSegmentWidths(instance, widths);
    instance.addPoints(allPoints);
  }

  const colors = parameters.colors
    ? GreasedLineBuilder.NormalizeColorTable(
        length,
        parameters.colors,
        parameters.colorDistribution ?? ColorDistribution.Start,
        parameters.color
      )
    : undefined;

  if (!instance.material) {
    if (parameters.pbr) {
      const initialMaterialParameters: GreasedLinePBRMaterialParameters = {
        colorDistribution: parameters.colorDistribution,
        dashArray: parameters.dashArray,
        dashOffset: parameters.dashOffset,
        dashRatio: parameters.dashRatio,
        resolution: parameters.resolution,
        sizeAttenuation: parameters.sizeAttenuation,
        useColors: parameters.useColors,
        useDash: parameters.useDash,
        visibility: parameters.visibility,
        width: parameters.width,
      };
      if (colors) {
        initialMaterialParameters.colors =
          GreasedLineBuilder.Color3toUint8(colors);
      }
      instance.material = new GreasedLinePBRMaterial(
        name,
        scene,
        initialMaterialParameters
      );
    } else {
      const initialMaterialParameters: GreasedLineMaterialParameters = {
        colorDistribution: parameters.colorDistribution,
        dashArray: parameters.dashArray,
        dashOffset: parameters.dashOffset,
        dashRatio: parameters.dashRatio,
        resolution: parameters.resolution,
        sizeAttenuation: parameters.sizeAttenuation,
        useColors: parameters.useColors,
        useDash: parameters.useDash,
        visibility: parameters.visibility,
        width: parameters.width,
        alphaMap: parameters.alphaMap,
        alphaTest: parameters.alphaTest,
        color: parameters.color,
        map: parameters.map,
        opacity: parameters.opacity,
        repeat: parameters.repeat,
        useAlphaMap: parameters.useAlphaMap,
        useMap: parameters.useMap,
        uvOffset: parameters.uvOffset,
        uvRotation: parameters.uvRotation,
        uvScale: parameters.uvScale,
      };
      if (colors) {
        initialMaterialParameters.colors =
          GreasedLineBuilder.Color3toUint8(colors);
      }
      instance.material = new GreasedLineMaterial(
        name,
        scene,
        initialMaterialParameters,
        instance.isLazy()
      );
    }
  } else {
    if (colors) {
      _SetColors(instance, colors);
    }
  }

  return instance;
}

export function Color3toUint8(colors: Color3[]) {
  const colorTable: Uint8Array = new Uint8Array(colors.length * 3);
  for (let i = 0, j = 0; i < colors.length; i++) {
    colorTable[j++] = colors[i].r * 255;
    colorTable[j++] = colors[i].g * 255;
    colorTable[j++] = colors[i].b * 255;
  }

  return colorTable;
}

export function ConvertPoints(points: GreasedLinePoints): number[][] {
  if (
    points.length &&
    !Array.isArray(points[0]) &&
    points[0] instanceof Vector3
  ) {
    const positions: number[] = [];
    for (let j = 0; j < points.length; j++) {
      const p = points[j] as Vector3;
      positions.push(p.x, p.y, p.z);
    }
    return [positions];
  } else if (
    points.length > 0 &&
    Array.isArray(points[0]) &&
    points[0].length > 0 &&
    points[0][0] instanceof Vector3
  ) {
    const positions: number[][] = [];
    const vectorPoints = points as Vector3[][];
    vectorPoints.forEach((p) => {
      positions.push(p.flatMap((p2) => [p2.x, p2.y, p2.z]));
    });
    return positions;
  } else if (points instanceof Float32Array) {
    return [Array.from(points)];
  } else if (points.length && points[0] instanceof Float32Array) {
    const positions: number[][] = [];
    points.forEach((p) => {
      positions.push(Array.from(p as Float32Array));
    });
    return positions;
  }

  return [];
}

export function NormalizeWidthTable(
  pointCount: number,
  widths: number[],
  widthsDistribution: WidthsDistribution,
  defaultWidthU = 1,
  defaultWidthL = 1
) {
  // is the color table is shorter the the point table?
  const missingCount = pointCount - widths.length / 2;

  const widthsData: number[] = [];
  if (missingCount < 0) {
    return widths.slice(0, pointCount * 2);
  }

  if (missingCount > 0) {
    // it is, fill in the missing elements
    if (widthsDistribution === WidthsDistribution.StartEnd) {
      const halfCount = Math.floor(widths.length / 2);

      // start sector
      for (let i = 0, j = 0; i < halfCount - 1; i++) {
        widthsData.push(widths[j++]);
        widthsData.push(widths[j++]);
      }

      // middle sector
      const widthL = widths[halfCount / 2];
      const widthU = widths[halfCount / 2 + 1];
      for (let i = 0; i < missingCount; i++) {
        widthsData.push(widthU);
        widthsData.push(widthL);
      }

      // end sector
      for (let i = halfCount; i < widths.length; i += 2) {
        widthsData.push(widths[i]);
        widthsData.push(widths[i + 1]);
      }
    } else if (widthsDistribution === WidthsDistribution.Start) {
      // start sector
      for (let i = 0; i < widths.length; i += 2) {
        widthsData.push(widths[i]);
        widthsData.push(widths[i + 1]);
      }

      // end sector
      for (let i = 0; i < missingCount; i++) {
        widthsData.push(defaultWidthU);
        widthsData.push(defaultWidthL);
      }
    } else if (widthsDistribution === WidthsDistribution.End) {
      // start sector
      for (let i = 0; i < missingCount; i++) {
        widthsData.push(defaultWidthU);
        widthsData.push(defaultWidthL);
      }

      // end sector
      for (let i = 0; i < widths.length; i += 2) {
        widthsData.push(widths[i]);
        widthsData.push(widths[i + 1]);
      }
    } else if (widthsDistribution === WidthsDistribution.Repeat) {
      let i = 0;
      for (let x = 0; x < pointCount; x++) {
        widthsData.push(widths[i++]);
        widthsData.push(widths[i++]);

        // TODO: with %
        if (i === widths.length) {
          i = 0;
        }
      }
    } else if (widthsDistribution === WidthsDistribution.Even) {
      let j = 0;
      const widthsectorLength = widths.length / ((pointCount - 1) * 2);
      for (let x = 0; x < pointCount; x++) {
        const i = Math.floor(j);

        widthsData.push(widths[i]);
        widthsData.push(widths[i + 1]);

        j += widthsectorLength;
      }
    }
  } else {
    for (let i = 0; i < widths.length; i++) {
      widthsData.push(widths[i]);
    }
  }

  return widthsData;
}

export function NormalizeColorTable(
  pointCount: number,
  colors: Color3[],
  colorDistribution: ColorDistribution,
  defaultColor: Color3 = Color3.White()
) {
  // is the color table is shorter the the point table?
  const missingCount = pointCount - colors.length;
  if (missingCount < 0) {
    return colors.slice(0, pointCount);
  }

  const colorsData: Color3[] = [];
  if (missingCount > 0) {
    // it is, fill in the missing elements
    if (colorDistribution === ColorDistribution.StartEnd) {
      const halfCount = Math.floor(colors.length / 2);

      // start sector
      for (let i = 0; i < halfCount; i++) {
        colorsData.push(colors[i]);
        colorsData.push(colors[i]);
      }

      // middle sector
      for (let i = 0; i < missingCount - 1; i++) {
        colorsData.push(defaultColor);
        colorsData.push(defaultColor);
      }

      // end sector
      for (let i = halfCount; i < colors.length; i++) {
        colorsData.push(colors[i]);
        colorsData.push(colors[i]);
      }
    } else if (colorDistribution === ColorDistribution.Start) {
      // start sector
      for (let i = 0; i < colors.length; i++) {
        colorsData.push(colors[i]);
        colorsData.push(colors[i]);
      }

      // end sector
      for (let i = 0; i < missingCount; i++) {
        colorsData.push(defaultColor);
        colorsData.push(defaultColor);
      }
    } else if (colorDistribution === ColorDistribution.End) {
      // start sector
      for (let i = 0; i < missingCount - 1; i++) {
        colorsData.push(defaultColor);
        colorsData.push(defaultColor);
      }

      // end sector
      for (let i = 0; i < colors.length; i++) {
        colorsData.push(colors[i]);
        colorsData.push(colors[i]);
      }
    } else if (colorDistribution === ColorDistribution.Repeat) {
      let i = 0;
      for (let x = 0; x < pointCount; x++) {
        colorsData.push(colors[i]);
        colorsData.push(colors[i]);

        // TODO: with %
        i++;

        if (i === colors.length) {
          i = 0;
        }
      }
    } else if (colorDistribution === ColorDistribution.Even) {
      let j = 0;
      const colorSectorLength = colors.length / (pointCount - 1);
      for (let x = 0; x < pointCount - 1; x++) {
        const i = Math.floor(j);

        colorsData.push(colors[i]);
        colorsData.push(colors[i]);

        j += colorSectorLength;
      }
    } else if (colorDistribution === ColorDistribution.None) {
      for (let i = 0; i < colors.length; i++) {
        colorsData.push(colors[i]);
        colorsData.push(colors[i]);
      }
    }
  } else {
    for (let i = 0; i < pointCount - 1; i++) {
      colorsData.push(colors[i]);
      colorsData.push(colors[i]);
    }
  }

  return colorsData;
}

export function TextureFromColors(
  name: string,
  colors: Color3[],
  scene: Scene,
  samplingMode = RawTexture.LINEAR_LINEAR
) {
  const colorsRaw = GreasedLineBuilder.Color3toUint8(colors);
  const colorsTexture = new RawTexture(
    colorsRaw,
    colors.length,
    1,
    Engine.TEXTUREFORMAT_RGB,
    scene,
    false,
    true,
    samplingMode
  );
  colorsTexture.name = name;
  return colorsTexture;
}

function _SetColors(instance: GreasedLine, colors: Color3[]) {
  if (instance.material instanceof GreasedLineMaterial) {
    const currentColors = instance.material.getParameters().colors;
    const colorsUint8 = GreasedLineBuilder.Color3toUint8(colors);

    if (currentColors) {
      const tmp = new Uint8Array(
        currentColors.byteLength + colorsUint8.byteLength
      );
      tmp.set(new Uint8Array(currentColors), 0);
      tmp.set(new Uint8Array(colorsUint8), currentColors.byteLength);
      instance.material.setColors(tmp, instance.isLazy());
    } else {
      instance.material.setColors(colorsUint8, instance.isLazy());
    }
  }
}

function _SetSegmentWidths(instance: GreasedLine, segmentWidths: number[]) {
  const currentWidths = instance.getSegmentWidths();

  if (currentWidths) {
    const newWidths = [...currentWidths];
    newWidths.push(...segmentWidths);
    instance.setSegmentWidths(newWidths);
  } else {
    instance.setSegmentWidths(segmentWidths);
  }
}
