<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Axis, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/GraesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';

const codeSnippets = [
  `  const size = 1
  const points = [
    new Vector3(0, 0, 0),
    new Vector3(size, 0, 0),
    new Vector3(size, size, 0),
    new Vector3(0, size, 0),
    new Vector3(0, 0, 0),
  ]`,
  `  // line1
  {
    points,
    width: 10
  }

  // line2
    {
    points: points.map(p => {
        return new Vector3(p.x, p.y + 2, p.z)
    }),
    width: 40,
  }

  // line3
  {
    points: points.map(p => {
        return new Vector3(p.x, p.y + 4, p.z)
    }),
    width: 100,
  }`,
  `  let i = 0
  scene.onBeforeRenderObservable.add(() => {
    line1.position.x = Math.sin(i / 120)
    line2.rotate(Axis.Z, 0.02)
    line3.scaling.x = Math.sin(i / 40) + 1
    i++
  })`,
]

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value)
    demo(scene, camera)
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  const size = 1
  const points = [
    new Vector3(0, 0, 0),
    new Vector3(size, 0, 0),
    new Vector3(size, size, 0),
    new Vector3(0, size, 0),
    new Vector3(0, 0, 0),
  ]

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points,
      width: 10
    },
    scene
  )

  //

  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-2',
    {
      points: points.map(p => {
        return new Vector3(p.x, p.y + 2, p.z)
      }),
      width: 40,
    },
    scene
  )
  //

  const line3 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-3',
    {
      points: points.map(p => {
        return new Vector3(p.x, p.y + 4, p.z)
      }),
      width: 100,
    },
    scene
  )



  let i = 1
  scene.onBeforeRenderObservable.add(() => {
    const animRatio = scene.getAnimationRatio()
    line1.position.x = Math.sin(i / 120)
    line2.rotate(Axis.Z, 0.02 * animRatio)
    line3.scaling.x = Math.sin(i / 40) + 1
    i++
  })

  camera.zoomOnFactor = 1.3
  camera.zoomOn([line1, line2, line3])

  camera.position.x -= 2
  camera.target.x -= 2
}
</script>

