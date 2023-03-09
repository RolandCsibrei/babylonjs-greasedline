<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Color4, Scalar, Scene, Texture, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/GraesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { GreasedLine } from 'src/greased-line/GreasedLine';

const codeSnippets = [
  `  const points1 = []
  const colors1 = [Color3.Red(), Color3.Green(), Color3.Blue()]
  const offsets: number[] = []
  for (let x = 0; x < 10; x += 0.25) {
    points1.push([new Vector3(x, 0, 0), new Vector3(x, 1, 0)])
    offsets.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
  }

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'offsets-line-1',
    {
      colors: colors1,
      useColors: true,
      points: points1,
      width: 40,
      offsets, // must set a buffer at creation
      updatable: true, // must be true
      colorDistribution: GreasedLine.COLOR_DISTRIBUTION_REPEAT
    },
    scene
  )`,
  `  window.setInterval(() => {
    targetOffsetsY.length = 0
    for (let i = 0; i < 10; i += 0.25) {
      const y = Scalar.RandomRange(1, 4)
      targetOffsetsY.push(y)
    }
  }, 1000) // set new Y target values every 1000 ms

  scene.onBeforeRenderObservable.add(() => { // lerp the values every frame
    offsets.length = 0
    for (let i = 0, j = 0; i < 10; i += 0.25, j++) {
      const y = Scalar.Lerp(offsetsY[j], targetOffsetsY[j], 0.05)
      offsetsY[j] = y
      offsets.push(0, 0, 0, 0, 0, 0, 0, y, 0, 0, y, 0)
    }
    line1.setOffsets(offsets) // and set the offsets buffer
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

  const points1 = []
  const colors1 = [Color3.Red(), Color3.Green(), Color3.Blue()]
  const offsets: number[] = []
  const targetOffsetsY: number[] = []
  const offsetsY: number[] = []
  for (let x = 0; x < 10; x += 0.25) {
    points1.push([new Vector3(x, 0, 0), new Vector3(x, 1, 0)])
    offsets.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    targetOffsetsY.push(0)
    offsetsY.push(0)
  }

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'offsets-line-1',
    {
      colors: colors1,
      useColors: true,
      points: points1,
      width: 40,
      offsets,
      updatable: true,
      colorDistribution: GreasedLine.COLOR_DISTRIBUTION_REPEAT
    },
    scene
  )

  //

  window.setInterval(() => {
    targetOffsetsY.length = 0
    for (let i = 0; i < 10; i += 0.25) {
      const y = Scalar.RandomRange(1, 4)
      targetOffsetsY.push(y)
    }
  }, 1000)


  scene.onBeforeRenderObservable.add(() => {
    offsets.length = 0
    for (let i = 0, j = 0; i < 10; i += 0.25, j++) {
      const y = Scalar.Lerp(offsetsY[j], targetOffsetsY[j], 0.05)
      offsetsY[j] = y
      offsets.push(0, 0, 0, 0, 0, 0, 0, y, 0, 0, y, 0)
    }
    line1.setOffsets(offsets)
  })

  camera.zoomOnFactor = 1.3
  camera.zoomOn([line1])

  camera.target.x = 0.88
  camera.target.x = 0.5
  camera.target.x = 0


  camera.alpha = -0.33
  camera.beta = 1.39
}
</script>

