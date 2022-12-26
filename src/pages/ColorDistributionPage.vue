<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { ColorDistribution, GreasedLineBuilder } from '../greased-line/GraesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';

const codeSnippets = [
  `  const points1 = []
  const colors1 = [Color3.Red(), Color3.Green(), Color3.Blue()]
  for (let x = 0; x < 10; x += 0.25) {
    points1.push(new Vector3(x, Math.cos(x / 2), 0))
  }
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      colors: colors1,
      useColors: true,
      points: points1,
      width: 40,
      colorDistribution: ColorDistribution.Start // Default
    },
    scene
  )  `,
  `  // line2
  {
    colorDistribution: ColorDistribution.End
  }

  // line3
  {
    colorDistribution: ColorDistribution.Even
  }

  // line4
  {
    colorDistribution: ColorDistribution.StartEnd
  }

  // line5
  {
    colorDistribution: ColorDistribution.Repeat
  }

  // line6
  {
    colorDistribution: ColorDistribution.None
  }  `,
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
  const colors1 = [Color3.Red(), Color3.Green(), Color3.Blue()]
  for (let x = 0; x < 10; x += 0.25) {
    points1.push(new Vector3(x, Math.cos(x / 2), 0))
  }
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      colors: colors1,
      useColors: true,
      points: points1,
      width: 40,
      colorDistribution: ColorDistribution.Start // Default
    },
    scene
  )

  //

  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-2',
    {
      colors: colors1,
      useColors: true,
      points: points1.map(p => new Vector3(p.x, p.y - 2, p.z)),
      width: 40,
      colorDistribution: ColorDistribution.End
    },
    scene
  )
  //

  const line3 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-3',
    {
      colors: colors1,
      useColors: true,
      points: points1.map(p => new Vector3(p.x, p.y - 4, p.z)),
      width: 40,
      colorDistribution: ColorDistribution.Even
    },
    scene
  )
  //
  const line4 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-4',
    {
      colors: colors1,
      useColors: true,
      points: points1.map(p => new Vector3(p.x, p.y - 6, p.z)),
      width: 40,
      colorDistribution: ColorDistribution.StartEnd
    },
    scene
  )
  //
  const line5 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-5',
    {
      colors: colors1,
      useColors: true,
      points: points1.map(p => new Vector3(p.x, p.y - 8, p.z)),
      width: 40,
      colorDistribution: ColorDistribution.Repeat
    },
    scene
  )
  //
  const line6 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-6',
    {
      colors: colors1,
      useColors: true,
      points: points1.map(p => new Vector3(p.x, p.y - 10, p.z)),
      width: 40,
      colorDistribution: ColorDistribution.None
    },
    scene
  )
  //



  camera.zoomOnFactor = 1.3
  camera.zoomOn([line1, line2, line3, line4, line5, line6])

  camera.position.x -= 5
  camera.target.x -= 5
}
</script>

