<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
  <CodeSnippets :codeSnippets="codeSnippetsRight" position="right" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Color4, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/GraesedLineBuilder';
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { GreasedLine } from 'src/greased-line/GreasedLine';

const codeSnippets = [
  `export interface GreasedLineBuilderParameters {
  lazy?: boolean;

  points: GreasedLinePoints;
  widths?: number[];
  widthsDistribution?: WidthsDistribution;
  offsets?: number[];
  instance?: GreasedLine;
  updatable?: boolean;
  pbr?: boolean;
  color?: Color3;
  opacity?: number;
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


  `  Description of usage
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
    new Vector3(0, 0, 0),
    new Vector3(10, 0, 0)
  ]

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points,
      width: 10,
      color: Color3.Red(),
      opacity: 0.8,
      alphaTest: 0.8
    },
    scene
  )

  camera.zoomOnFactor = 1.3;
  camera.zoomOn([line1]);

  camera.position.x -= 5;
  camera.target.x -= 5;
};
</script>

