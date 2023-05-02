<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :code-snippets="info" :position="'top-right'" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../../greased-line/graesedLineBuilder';
import CodeSnippets from 'src/components/CodeSnippets.vue';

const info = [
  'Coming soon...'
]

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
  if (canvas.value) {
    const { scene, camera } = init(canvas.value);
    demo(scene, camera);
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  const points = [
    new Vector3(-1, 0, 0),
    new Vector3(1, 0, 0)
  ]

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points,
      width: 10,
      color: Color3.Red(),
    },
    scene
  )

  camera.zoomOnFactor = 1.3;
  camera.zoomOn([line1]);

};
</script>

