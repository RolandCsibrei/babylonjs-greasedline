<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Color4, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { ColorDistribution, GreasedLineBuilder } from '../greased-line/GraesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { WidthsDistribution } from 'src/greased-line/GreasedLine';
import { getArrowCap, getCircleCap } from 'src/greased-line/lineUtils';

const codeSnippets = [
  `It's already possible to create rounded or lines with various caps,
but the interface is about to change.`
]

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value)
    demo(scene, camera)
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  const points1 = [new Vector3(0, 0, 0), new Vector3(10, 0, 0)];
  const colors1 = [new Color3(1, 0, 0)];

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'lines1',
    {
      points: points1,
      width: 80,
      widthsDistribution: WidthsDistribution.Start,
      useColors: true,
      colors: colors1,
      colorDistribution: ColorDistribution.Repeat,
    },
    scene
  );

  const cap1a = getCircleCap(points1[0], Vector3.Left(), 1, 40, 8);
  const colorsCap1a = [new Color3(1, 0, 0)];
  GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      points: cap1a.points,
      widths: cap1a.widths,
      useColors: true,
      colors: colorsCap1a,
      widthsDistribution: WidthsDistribution.Start,
      colorDistribution: ColorDistribution.Repeat,
    },
    scene
  );

  const cap1b = getArrowCap(points1[1], Vector3.Right(), 1, 160, 160);
  const colorsCap1b = [new Color3(1, 0, 1)];
  GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      points: cap1b.points,
      widths: cap1b.widths,
      useColors: true,
      colors: colorsCap1b,
      widthsDistribution: WidthsDistribution.Start,
      colorDistribution: ColorDistribution.Repeat,
    },
    scene
  );


  //

  const points2 = [new Vector3(0, -2, 0), new Vector3(10, -2, 0)];
  const colors2 = [new Color3(0, 0, 1)];

  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'lines2',
    {
      points: points2,
      width: 80,
      widthsDistribution: WidthsDistribution.Start,
      useColors: true,
      colors: colors2,
      colorDistribution: ColorDistribution.Repeat,
    },
    scene
  );

  const cap2a = getCircleCap(points2[0], Vector3.Left(), 0.5, 80, 8);
  const colorsCap2a = [new Color3(1, 1, 0)];
  GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      points: cap2a.points,
      widths: cap2a.widths,
      useColors: true,
      colors: colorsCap2a,
      widthsDistribution: WidthsDistribution.Start,
      colorDistribution: ColorDistribution.Repeat,
    },
    scene
  );

  const cap2b = getArrowCap(points2[1], Vector3.Right(), 1, 160, 160, 160, 160);
  GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      points: cap2b.points,
      widths: cap2b.widths,
      useColors: true,
      colors: colorsCap2a,
      widthsDistribution: WidthsDistribution.Start,
      colorDistribution: ColorDistribution.Repeat,
    },
    scene
  );

  //

  camera.zoomOnFactor = 1.6
  camera.zoomOn([line1, line2])

  camera.position.x -= 5
  camera.target.x -= 5
}
</script>

