<template>
  <canvas ref="canvas" class="canvas"></canvas>
<CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/GraesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';

const codeSnippets = [
  `  const points = [
    new Vector3(0, 0, 0),
    new Vector3(10, 0, 0)
  ]

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points,
      // default width 1
    },
    scene
  )
  `,
  `  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-2',
    {
      points: [new Vector3(0, 4, 0), new Vector3(10, 4, 0)],
      width: 100,
    },
    scene
  )`,
  `  const line3 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-3',
    {
      points: [new Vector3(0, 8, 0), new Vector3(5, 9, 0), new Vector3(10, 8, 0)],
      width: 10,
    },
    scene
  )`
]

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value)
    demo(scene, camera)
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
    },
    scene
  )

  //

  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-2',
    {
      points: [new Vector3(0, -4, 0), new Vector3(5, -5, 0), new Vector3(10, -4, 0)],
      width: 100,
    },
    scene
  )

  //


  const line3 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-3',
    {
      points: [new Vector3(0, -8, 0), new Vector3(1, -9, 0), new Vector3(2, -9, 0), new Vector3(2, -9, 5), new Vector3(3, -9, 5), new Vector3(3, -9, 0),
      new Vector3(8, -9, -5), new Vector3(8, -9, 0), new Vector3(9, -8, 5)
      ],
      width: 10,
    },
    scene
  )

  camera.zoomOnFactor = 1.3
  camera.zoomOn([line1, line2, line3])

  camera.position.x -= 5
  camera.target.x -= 5
}
</script>

