<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/GraesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';

const codeSnippets = [
  `  // 3 points, 2 lines, 2 colors
  const colors1 = [Color3.Red(), Color3.Green()]
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      colors: colors1,
      useColors: true,
      width: 10,
      points: [
        new Vector3(0, 0, 0),
        new Vector3(5, 0, 0),
        new Vector3(10, 0, 0),
      ],
    },
    scene
  )`,
  `
  // line2
  // colors value is multiplied by color value
  // so this doesn't produce gray and white
  // but shades of blue (TODO: add parameter for this behaviour)
  const colors2 = [new Color3(0.5, 0.5, 0.5), new Color3(1, 1, 1)]
  {
    colors: colors2,
    useColors: true,
    color: Color3.Blue()
  }

  // line3
  const points3 = []
  const colors3 = []
  for (let x = 0; x < 10; x += 0.25) {
    points3.push(new Vector3(x, Math.cos(x / 2) - 8, 0))
    colors3.push(Color3.Random())
  }`
]

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value)
    demo(scene, camera)
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  const colors1 = [Color3.Red(), Color3.Green()]
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      colors: colors1,
      useColors: true,
      width: 10,
      points: [
        new Vector3(0, 0, 0),
        new Vector3(5, 0, 0),
        new Vector3(10, 0, 0),
      ],
    },
    scene
  )

  //

  const colors2 = [new Color3(0.5, 0.5, 0.5), new Color3(1, 1, 1)]
  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-2',
    {
      color: Color3.Blue(),
      colors: colors2,
      useColors: true,
      width: 10,
      points: [
        new Vector3(0, -4, 0),
        new Vector3(5, -4, 0),
        new Vector3(10, -4, 0),
      ],
    },
    scene
  )

  //
  const points3 = []
  const colors3 = []
  for (let x = 0; x < 10; x += 0.25) {
    points3.push(new Vector3(x, Math.cos(x / 2) - 8, 0))
    colors3.push(Color3.Random())
  }
  const line3 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-3',
    {
      colors: colors3,
      useColors: true,
      width: 10,
      points: points3
    },
    scene
  )

  //


  camera.zoomOnFactor = 1.3
  camera.zoomOn([line1, line2, line3])

  camera.position.x -= 5
  camera.target.x -= 5
}
</script>

