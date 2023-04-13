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
// import { GreasedLineMaterial } from 'src/greased-line/GreasedLineFastMaterialrial';

const codeSnippets = [
  `  const points1 = [new Vector3(0, 0, 0), new Vector3(10, 0, 0)]
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points: points1,
      width: 40,
      useDash: true,
      dashArray: 1 / (5 * 2), // 1 / (num of dashes * 2)
      dashRatio: 0.5, // dash length ratio 0..1 (0.5 = half empty, half drawn)
    },
    scene
  )`,
  `  // line2
  {
    useDash: true,
    dashArray: 1 / (5 * 2), // 1 / (num of dashes * 2)
    dashRatio: 0.1, // dash length ratio 0..1 (0.1 = 10% empty, 90% drawn)
  },

  // line3
  {
    useDash: true,
    dashArray: 1 / (50 * 2), // 1 / (num of dashes * 2)
    dashRatio: 0.5, // dash length ratio 0..1 (0.5 = 50% empty, 50% drawn)
  },`,
  `  let dashOffset = 0
  const material = line3.material as GreasedLineMaterial
  scene.onBeforeRenderObservable.add(() => {
    material.setDashOffset(dashOffset)
    dashOffset += 0.001
  })`
]

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value)
    demo(scene, camera)
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  const points1 = [new Vector3(0, 0, 0), new Vector3(10, 0, 0)]
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points: points1,
      width: 40,
      useDash: true,
      dashArray: 1 / (5 * 2), // 1 / (num of dashes * 2)
      dashRatio: 0.5, // dash length ratio 0..1 (0.5 = half empty, half drawn)
    },
    scene
  )

  //

  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-2',
    {
      points: points1.map(p => {
        return new Vector3(p.x, p.y - 2, p.z)
      }),
      width: 40,
      useDash: true,
      dashArray: 1 / (5 * 2), // 1 / (num of dashes * 2)
      dashRatio: 0.1, // dash length ratio 0..1 (0.1 = 10% empty, 90% drawn)
    },
    scene
  )

  //

  const line3 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-3',
    {
      points: points1.map(p => {
        return new Vector3(p.x, p.y - 4, p.z)
      }),
      width: 40,
      useDash: true,
      dashArray: 1 / (50 * 2), // 1 / (num of dashes * 2)
      dashRatio: 0.5, // dash length ratio 0..1 (0.5 = 50% empty, 50% drawn)
    },
    scene
  )

  //

  let dashOffset = 0
  // const material = line3.material as GreasedLineMaterial
  // scene.onBeforeRenderObservable.add(() => {
  //   material.setDashOffset(dashOffset)
  //   dashOffset += 0.001
  // })

  //

  camera.zoomOnFactor = 1.3
  camera.zoomOn([line1, line2, line3])

  camera.position.x -= 4
  camera.target.x -= 4
}
</script>

