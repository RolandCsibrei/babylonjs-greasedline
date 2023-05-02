/**
 * @author roland@babylonjs.xyz
 */

import {
  Color3,
  Engine,
  EngineStore,
  Nullable,
  PBRMaterial,
  RawTexture,
  StandardMaterial,
  Scene,
  Texture,
  Vector2,
  Vector3,
} from '@babylonjs/core';

import { GreasedLinePluginMaterial } from './greasedLinePluginMaterial';
import {
  GreasedLineMesh,
  GreasedLineParameters,
  GreasedLinePoints,
} from './greasedLineMesh';

import { GreasedLineSimpleMaterial } from './greasedLineSimpleMaterial';

const COLOR_DISTRIBUTION_NONE = GreasedLineMesh.COLOR_DISTRIBUTION_NONE;
const COLOR_DISTRIBUTION_REPEAT = GreasedLineMesh.COLOR_DISTRIBUTION_REPEAT;
const COLOR_DISTRIBUTION_EVEN = GreasedLineMesh.COLOR_DISTRIBUTION_EVEN;
const COLOR_DISTRIBUTION_START = GreasedLineMesh.COLOR_DISTRIBUTION_START;
const COLOR_DISTRIBUTION_END = GreasedLineMesh.COLOR_DISTRIBUTION_END;
const COLOR_DISTRIBUTION_START_END =
  GreasedLineMesh.COLOR_DISTRIBUTION_START_END;

const WIDTH_DISTRIBUTION_NONE = GreasedLineMesh.WIDTH_DISTRIBUTION_NONE;
const WIDTH_DISTRIBUTION_REPEAT = GreasedLineMesh.WIDTH_DISTRIBUTION_REPEAT;
const WIDTH_DISTRIBUTION_EVEN = GreasedLineMesh.WIDTH_DISTRIBUTION_EVEN;
const WIDTH_DISTRIBUTION_START = GreasedLineMesh.WIDTH_DISTRIBUTION_START;
const WIDTH_DISTRIBUTION_END = GreasedLineMesh.WIDTH_DISTRIBUTION_END;
const WIDTH_DISTRIBUTION_START_END =
  GreasedLineMesh.WIDTH_DISTRIBUTION_START_END;

const MATERIAL_TYPE_SIMPLE = GreasedLineMesh.MATERIAL_TYPE_SIMPLE;
const MATERIAL_TYPE_STANDARD = GreasedLineMesh.MATERIAL_TYPE_STANDARD;
const MATERIAL_TYPE_PBR = GreasedLineMesh.MATERIAL_TYPE_PBR;

export interface GreasedLineMaterialParameters {
  lazy?: boolean;
  width?: number;

  color?: Color3;
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

export interface GreasedLineBuilderParameters {
  lazy?: boolean;

  points: GreasedLinePoints;
  widths?: number[];
  widthsDistribution?: number;
  offsets?: number[];
  instance?: GreasedLineMesh;
  updatable?: boolean;
  pbr?: boolean;

  unlit?: boolean;

  //

  color?: Color3;
  opacity?: number;
  width?: number;

  useColors?: boolean;
  colors?: Color3[];
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

export const GreasedLineBuilder = {
  CreateGreasedLine,
  Color3toUint8,
  ConvertPoints,
  NormalizeColorTable,
  NormalizeWidthTable,
  TextureFromColors,

  COLOR_DISTRIBUTION_NONE,
  COLOR_DISTRIBUTION_REPEAT,
  COLOR_DISTRIBUTION_EVEN,
  COLOR_DISTRIBUTION_START,
  COLOR_DISTRIBUTION_END,
  COLOR_DISTRIBUTION_START_END,

  WIDTH_DISTRIBUTION_NONE,
  WIDTH_DISTRIBUTION_REPEAT,
  WIDTH_DISTRIBUTION_EVEN,
  WIDTH_DISTRIBUTION_START,
  WIDTH_DISTRIBUTION_END,
  WIDTH_DISTRIBUTION_START_END,

  MATERIAL_TYPE_SIMPLE,
  MATERIAL_TYPE_STANDARD,
  MATERIAL_TYPE_PBR,
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
    parameters.widthsDistribution ?? WIDTH_DISTRIBUTION_START
  );

  const colors = parameters.colors
    ? GreasedLineBuilder.NormalizeColorTable(
        length,
        parameters.colors,
        parameters.colorDistribution ?? COLOR_DISTRIBUTION_START,
        parameters.color
      )
    : undefined;

  if (!parameters.instance) {
    const initialGreasedLineParameters: GreasedLineParameters = {
      points: allPoints,
      offsets: parameters.offsets,
      pbr: parameters.pbr,
      updatable: parameters.updatable,
      widths,
      widthsDistribution: parameters.widthsDistribution,
    };

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
      color: parameters.color,
    };

    if (colors) {
      initialMaterialParameters.colors =
        GreasedLineBuilder.Color3toUint8(colors);
    }

    const material = parameters.pbr
      ? new PBRMaterial(name, scene)
      : new StandardMaterial(name, scene);

    if (parameters.unlit === true) {
      material.disableLighting = true;
      debugger;
    }

    const plugin = new GreasedLinePluginMaterial(
      material,
      scene,
      initialMaterialParameters
    );

    instance = new GreasedLineMesh(
      name,
      scene,
      initialGreasedLineParameters,
      plugin,
      parameters.updatable,
      parameters.lazy
    );
    instance.material = material;
  } else {
    instance = parameters.instance;
    _SetSegmentWidths(instance, widths);
    instance.addPoints(allPoints);
  }

  if (colors) {
    _SetColors(instance, colors);
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

export function NormalizeWidthTableDistributionStartEnd(
  pointCount: number,
  widths: number[],
  defaultWidthUp = 1,
  defaultWidthDown = 1
) {
  // is the color table is shorter the the point table?
  const missingCount = pointCount - widths.length / 2;

  const widthsData: number[] = [];
  if (missingCount <= 0) {
    return widths.slice(0, pointCount * 2);
  }

  const halfCount = Math.floor(widths.length / 2);

  // start sector
  for (let i = 0, j = 0; i < halfCount - 1; i++) {
    widthsData.push(widths[j++]);
    widthsData.push(widths[j++]);
  }

  // middle sector
  // const widthL = widths[halfCount / 2];
  // const widthU = widths[halfCount / 2 + 1];
  for (let i = 0; i < missingCount; i++) {
    widthsData.push(defaultWidthUp);
    widthsData.push(defaultWidthDown);
  }

  // end sector
  for (let i = halfCount; i < widths.length; i += 2) {
    widthsData.push(widths[i]);
    widthsData.push(widths[i + 1]);
  }

  return widthsData;
}

export function NormalizeWidthTableDistributionStart(
  pointCount: number,
  widths: number[],
  defaultWidthUp = 1,
  defaultWidthDown = 1
) {
  // is the color table is shorter the the point table?
  const missingCount = pointCount - widths.length / 2;

  const widthsData: number[] = [];
  if (missingCount <= 0) {
    return widths.slice(0, pointCount * 2);
  }

  // start sector
  for (let i = 0; i < widths.length; i += 2) {
    widthsData.push(widths[i]);
    widthsData.push(widths[i + 1]);
  }

  // end sector
  for (let i = 0; i < missingCount; i++) {
    widthsData.push(defaultWidthUp);
    widthsData.push(defaultWidthDown);
  }

  return widthsData;
}

export function NormalizeWidthTableDistributionEnd(
  pointCount: number,
  widths: number[],
  defaultWidthUp = 1,
  defaultWidthDown = 1
) {
  // is the color table is shorter the the point table?
  const missingCount = pointCount - widths.length / 2;

  const widthsData: number[] = [];
  if (missingCount <= 0) {
    return widths.slice(0, pointCount * 2);
  }

  // start sector
  for (let i = 0; i < missingCount; i++) {
    widthsData.push(defaultWidthUp);
    widthsData.push(defaultWidthDown);
  }

  // end sector
  for (let i = 0; i < widths.length; i += 2) {
    widthsData.push(widths[i]);
    widthsData.push(widths[i + 1]);
  }

  return widthsData;
}

export function NormalizeWidthTableDistributionRepeat(
  pointCount: number,
  widths: number[]
) {
  // is the color table is shorter the the point table?
  const missingCount = pointCount - widths.length / 2;

  const widthsData: number[] = [];
  if (missingCount <= 0) {
    return widths.slice(0, pointCount * 2);
  }

  let i = 0;
  for (let x = 0; x < pointCount; x++) {
    widthsData.push(widths[i++]);
    widthsData.push(widths[i++]);

    // TODO: with %
    if (i === widths.length) {
      i = 0;
    }
  }
  return widthsData;
}

export function NormalizeWidthTableDistributionEven(
  pointCount: number,
  widths: number[]
) {
  // is the color table is shorter the the point table?
  const missingCount = pointCount - widths.length / 2;

  const widthsData: number[] = [];
  if (missingCount <= 0) {
    return widths.slice(0, pointCount * 2);
  }

  let j = 0;
  const widthsectorLength = widths.length / ((pointCount - 1) * 2);
  for (let x = 0; x < pointCount; x++) {
    const i = Math.floor(j);

    widthsData.push(widths[i]);
    widthsData.push(widths[i + 1]);

    j += widthsectorLength;
  }

  return widthsData;
}

export function NormalizeWidthTable(
  pointCount: number,
  widths: number[],
  widthsDistribution: number,
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
    if (widthsDistribution === WIDTH_DISTRIBUTION_START_END) {
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
    } else if (widthsDistribution === WIDTH_DISTRIBUTION_START) {
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
    } else if (widthsDistribution === WIDTH_DISTRIBUTION_END) {
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
    } else if (widthsDistribution === WIDTH_DISTRIBUTION_REPEAT) {
      let i = 0;
      for (let x = 0; x < pointCount; x++) {
        widthsData.push(widths[i++]);
        widthsData.push(widths[i++]);

        // TODO: with %
        if (i === widths.length) {
          i = 0;
        }
      }
    } else if (widthsDistribution === WIDTH_DISTRIBUTION_EVEN) {
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

export function NormalizeColorTableDistributionStartEnd(
  pointCount: number,
  colors: Color3[],
  defaultColor: Color3 = Color3.White()
) {
  // is the color table is shorter the the point table?
  const missingCount = pointCount - colors.length;

  if (missingCount < 0) {
    return colors.slice(0, pointCount);
  }

  const colorsData: Color3[] = [];

  if (missingCount === 0) {
    for (let i = 0; i < pointCount - 1; i++) {
      colorsData.push(colors[i]);
      colorsData.push(colors[i]);
    }
    return colorsData;
  }

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

  return colorsData;
}

export function NormalizeColorTableDistributionStart(
  pointCount: number,
  colors: Color3[],
  defaultColor: Color3 = Color3.White()
) {
  // is the color table is shorter the the point table?
  const missingCount = pointCount - colors.length;

  if (missingCount < 0) {
    return colors.slice(0, pointCount);
  }

  const colorsData: Color3[] = [];

  if (missingCount === 0) {
    for (let i = 0; i < pointCount - 1; i++) {
      colorsData.push(colors[i]);
      colorsData.push(colors[i]);
    }
    return colorsData;
  }
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

  return colorsData;
}

export function NormalizeColorTableDistributionEnd(
  pointCount: number,
  colors: Color3[],
  defaultColor: Color3 = Color3.White()
) {
  // is the color table is shorter the the point table?
  const missingCount = pointCount - colors.length;

  if (missingCount < 0) {
    return colors.slice(0, pointCount);
  }

  const colorsData: Color3[] = [];

  if (missingCount === 0) {
    for (let i = 0; i < pointCount - 1; i++) {
      colorsData.push(colors[i]);
      colorsData.push(colors[i]);
    }
    return colorsData;
  }

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

  return colorsData;
}

export function NormalizeColorTableDistributionRepeat(
  pointCount: number,
  colors: Color3[]
) {
  // is the color table is shorter the the point table?
  const missingCount = pointCount - colors.length;

  if (missingCount < 0) {
    return colors.slice(0, pointCount);
  }

  const colorsData: Color3[] = [];

  if (missingCount === 0) {
    for (let i = 0; i < pointCount - 1; i++) {
      colorsData.push(colors[i]);
      colorsData.push(colors[i]);
    }
    return colorsData;
  }

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

  return colorsData;
}

export function NormalizeColorTableDistributionEven(
  pointCount: number,
  colors: Color3[]
) {
  // is the color table is shorter the the point table?
  const missingCount = pointCount - colors.length;

  if (missingCount < 0) {
    return colors.slice(0, pointCount);
  }

  const colorsData: Color3[] = [];

  if (missingCount === 0) {
    for (let i = 0; i < pointCount - 1; i++) {
      colorsData.push(colors[i]);
      colorsData.push(colors[i]);
    }
    return colorsData;
  }

  let j = 0;
  const colorSectorLength = colors.length / (pointCount - 1);
  for (let x = 0; x < pointCount - 1; x++) {
    const i = Math.floor(j);

    colorsData.push(colors[i]);
    colorsData.push(colors[i]);

    j += colorSectorLength;
  }

  return colorsData;
}

export function NormalizeColorTableDistributionNone(
  pointCount: number,
  colors: Color3[]
) {
  // is the color table is shorter the the point table?
  const missingCount = pointCount - colors.length;

  if (missingCount < 0) {
    return colors.slice(0, pointCount);
  }

  const colorsData: Color3[] = [];

  for (let i = 0; i < colors.length; i++) {
    colorsData.push(colors[i]);
    colorsData.push(colors[i]);
  }

  return colorsData;
}

export function NormalizeColorTable(
  pointCount: number,
  colors: Color3[],
  colorDistribution: number,
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
    if (colorDistribution === COLOR_DISTRIBUTION_START_END) {
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
    } else if (colorDistribution === COLOR_DISTRIBUTION_START) {
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
    } else if (colorDistribution === COLOR_DISTRIBUTION_END) {
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
    } else if (colorDistribution === COLOR_DISTRIBUTION_REPEAT) {
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
    } else if (colorDistribution === COLOR_DISTRIBUTION_EVEN) {
      let j = 0;
      const colorSectorLength = colors.length / (pointCount - 1);
      for (let x = 0; x < pointCount - 1; x++) {
        const i = Math.floor(j);

        colorsData.push(colors[i]);
        colorsData.push(colors[i]);

        j += colorSectorLength;
      }
    } else if (colorDistribution === COLOR_DISTRIBUTION_NONE) {
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

function _SetColors(instance: GreasedLineMesh, colors: Color3[]) {
  if (
    instance.material instanceof StandardMaterial ||
    instance.material instanceof PBRMaterial
  ) {
    if (instance.greasedLineMaterial) {
      const currentColors = instance.greasedLineMaterial.getParameters().colors;
      if (currentColors) {
        const colorsUint8 = GreasedLineBuilder.Color3toUint8(colors);
        const newColors = _appendColorsToExistingColors(
          currentColors,
          colorsUint8
        );
        instance.greasedLineMaterial.setColors(newColors, instance.isLazy());
      }
    }
  } else if (instance.material instanceof GreasedLineSimpleMaterial) {
    const currentColors = instance.material.getParameters().colors;
    if (currentColors) {
      const colorsUint8 = GreasedLineBuilder.Color3toUint8(colors);
      const newColors = _appendColorsToExistingColors(
        currentColors,
        colorsUint8
      );
      instance.material.setColors(newColors, instance.isLazy());
    }
  }

  //   instance.material.setColors(newColors, instance.isLazy());
  // } else {
  //   instance.material.setColors(colorsUint8, instance.isLazy());
  // }
  // }
}

function _appendColorsToExistingColors(
  existingColors: Uint8Array,
  colorsToAppend: Uint8Array
) {
  const tmp = new Uint8Array(
    existingColors.byteLength + colorsToAppend.byteLength
  );
  tmp.set(new Uint8Array(existingColors), 0);
  tmp.set(new Uint8Array(colorsToAppend), existingColors.byteLength);
  return tmp;
}

function _SetSegmentWidths(instance: GreasedLineMesh, segmentWidths: number[]) {
  const currentWidths = instance.getSegmentWidths();

  if (currentWidths) {
    const newWidths = [...currentWidths];
    newWidths.push(...segmentWidths);
    instance.setSegmentWidths(newWidths);
  } else {
    instance.setSegmentWidths(segmentWidths);
  }
}
