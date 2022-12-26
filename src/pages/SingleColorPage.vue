<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Color4, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/GraesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';

const codeSnippets = [
  `   const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      color: Color3.Red(),
      width: 10,
      points: [
        new Vector3(0, 0, 0),
        new Vector3(10, 0, 0)
      ],
    },
    scene
  )`
  ,
  ` // line2
  {
    color: Color3.Green()
  }

  // line3
  {
    color: Color3.Blue()
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
  scene.clearColor = new Color4(0, 0, 0, 1
  )

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      color: Color3.Red(),
      width: 10,
      points: [
        new Vector3(0, 0, 0),
        new Vector3(10, 0, 0)
      ],
    },
    scene
  )

  //

  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-2',
    {
      color: Color3.Green(),
      width: 10,
      points: [
        new Vector3(0, -4, 0),
        new Vector3(10, -4, 0)
      ],
    },
    scene
  )

  //

  const line3 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-3',
    {
      color: Color3.Blue(),
      width: 10,
      points: [
        new Vector3(0, -8, 0),
        new Vector3(10, -8, 0)
      ],
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

