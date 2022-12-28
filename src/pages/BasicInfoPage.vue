<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" position="top-right" />
  <CodeSnippets :codeSnippets="codeSnippetsRight" position="bottom-left" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/GraesedLineBuilder';
import CodeSnippets from 'src/components/CodeSnippets.vue';

const codeSnippets = [
  `  // all available parameters

  export interface GreasedLineBuilderParameters {
    points: GreasedLinePoints;
    widths?: number[];
    widthsDistribution?: WidthsDistribution;
    offsets?: number[];
    lazy?: boolean;
    instance?: GreasedLine;
    updatable?: boolean;
    pbr?: boolean;
    color?: Color3;
    opacity?: number; // not supported yet
    width?: number;
    useColors?: boolean;
    colors?: Color3[];
    colorsSamplingMode?: ColorSamplingMode;
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
}`,]

const codeSnippetsRight = [
  `
  const points = [new Vector3(-1,0,0), new Vector3(1,0,0)]
  const params: GreasedLineBuilderParameters = {
    points,
    width: 10,
    color: Color3.Red(),
  }
  const line = GreasedLineBuilder.CreateGreasedLine('lonely-red-line', params);
  `,
];

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
  if (canvas.value) {
    const { scene, camera } = init(canvas.value);
    demo(scene, camera);
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  const points = [
    new Vector3(-1, 0, 0),
    new Vector3(1, 0, 0)
  ]

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points,
      width: 10,
      color: Color3.Red(),
    },
    scene
  )

  camera.zoomOnFactor = 1.3;
  camera.zoomOn([line1]);

};
</script>

