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
import { GreasedLine } from 'src/greased-line/GreasedLine';


const codeSnippets = [
  `  const points1 = []
  const widths = [1, 2, 4, 8]
  // width UP = 1, width DOWN = 1 at point index 0, 4 and 4 at the second point
  for (let x = 0; x < 10; x += 0.25) {
    points1.push(new Vector3(x, Math.cos(x / 2), 0))
  }
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points: points1,
      widths,
      width: 40, // resulting width = width * widths[index]
      widthDistribution: GreasedLine.WIDTH_DISTRIBUTION_START // Default
    },
    scene)  `,
  `  // line2
  {
    widthDistribution: GreasedLine.WIDTH_DISTRIBUTION_END
  }

  // line3
  {
    widthDistribution: GreasedLine.WIDTH_DISTRIBUTION_EVEN
  }

  // line4
  {
    widthDistribution: GreasedLine.WIDTH_DISTRIBUTION_START_END
  }

  // line5
  {
    widthDistribution: GreasedLine.WIDTH_DISTRIBUTION_REPEAT
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
  const widths = [1, 2, 4, 8]
  for (let x = 0; x < 10; x += 0.25) {
    points1.push(new Vector3(x, Math.cos(x / 2), 0))
  }
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points: points1,
      color: Color3.Red(),
      widths,
      width: 40
    },
    scene
  )

  //

  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-2',
    {
      points: points1.map(p => new Vector3(p.x, p.y - 2, p.z)),
      widths,
      width: 40,
      widthsDistribution: GreasedLine.WIDTH_DISTRIBUTION_END
    },
    scene
  )
  //

  const line3 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-3',
    {
      points: points1.map(p => new Vector3(p.x, p.y - 4, p.z)),
      widths,
      width: 40,
      widthsDistribution: GreasedLine.WIDTH_DISTRIBUTION_EVEN
    },
    scene
  )
  //
  const line4 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-4',
    {
      points: points1.map(p => new Vector3(p.x, p.y - 6, p.z)),
      widths,
      width: 40,
      widthsDistribution: GreasedLine.WIDTH_DISTRIBUTION_START_END
    },
    scene
  )
  //
  const line5 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-5',
    {
      points: points1.map(p => new Vector3(p.x, p.y - 8, p.z)),
      widths,
      width: 40,
      widthsDistribution: GreasedLine.WIDTH_DISTRIBUTION_REPEAT
    },
    scene
  )
  //




  camera.zoomOnFactor = 1.3
  camera.zoomOn([line1, line2, line3, line4, line5,])

  camera.position.x -= 5
  camera.target.x -= 5
}
</script>

