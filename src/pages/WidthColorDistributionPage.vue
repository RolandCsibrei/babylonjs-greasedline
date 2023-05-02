<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Color4, Scalar, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/graesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { GreasedLineMesh } from 'src/greased-line/greasedLineMesh';

const codeSnippets = [
  `  const points1 = []
  const widths1 = []
  const colors1 = [Color3.Red(), Color3.Green(), Color3.Blue()]

  for (let x = 0; x < 10; x += 0.25) {
    points1.push(new Vector3(x, 0, 0))
    widths1.push(Math.cos(x) * 4 + 6, Math.cos(x) * 4 + Scalar.RandomRange(4, 6))
    // width up, width down
  }

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points: points1,
      colors: colors1,
      useColors: true,
      widths: widths1,
      width: 40,
      widthsDistribution: GreasedLine.WIDTH_DISTRIBUTION_Start,
      colorDistribution: ColorDistribution.Repeat
    },
    scene
  )`,
  `  // line2
  const points2 = []
  const widths2 = []
  const colors2 = []

  for (let x = 0; x < 10; x += 0.25) {
    points2.push(new Vector3(x, -6, 0))
    widths2.push(Scalar.RandomRange(2, 8), Scalar.RandomRange(2, 8))
    colors2.push(Color3.Random())
  }`,
]

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value)
    demo(scene, camera)
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  const points1 = []
  const widths1 = []
  const colors1 = [Color3.Red(), Color3.Green(), Color3.Blue()]

  for (let x = 0; x < 10; x += 0.25) {
    points1.push(new Vector3(x, 0, 0))
    widths1.push(Math.cos(x) * 4 + 6, Math.cos(x) * 4 + Scalar.RandomRange(4, 6))
  }

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points: points1,
      colors: colors1,
      useColors: true,
      widths: widths1,
      width: 40,
      widthsDistribution: GreasedLineMesh.WIDTH_DISTRIBUTION_START,
      colorDistribution: GreasedLineMesh.COLOR_DISTRIBUTION_REPEAT,
      unlit: true // TODO: this unlits all lines! WTF?
    },
    scene
  )

  //

  const points2 = []
  const widths2 = []
  const colors2 = []

  for (let x = 0; x < 10; x += 0.25) {
    points2.push(new Vector3(x, -6, 0))
    widths2.push(Scalar.RandomRange(2, 8), Scalar.RandomRange(2, 8))
    colors2.push(Color3.Random())
  }


  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-2',
    {
      points: points2,
      widths: widths2,
      colors: colors2,
      useColors: true,
      width: 40,
      widthsDistribution: GreasedLineMesh.WIDTH_DISTRIBUTION_END
    },
    scene
  )
  //

  camera.zoomOnFactor = 1.3
  camera.zoomOn([line1, line2])

  camera.position.x -= 5
  camera.target.x -= 5
}
</script>

