<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Color4, Scene, Texture, Vector2, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { ColorDistribution, GreasedLineBuilder } from '../greased-line/graesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { segmentize } from 'src/greased-line/greasedLineTools';

const codeSnippets = [
  `  const points1 = segmentize(
    [new Vector3(1, 3, 0), new Vector3(10, 5, 0), new Vector3(0, 0, 0)]
    , 1)
  const texture1 = new Texture('textures/stroke.png', scene);
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'textured-lines',
    {
      points: points1,
      width: 180,
      map: texture1,
      useMap: true,
      repeat: new Vector2(1, 1),
      alphaTest: 0.1,
    },
    scene
  );`,
  `  const points2 = [new Vector3(0, -2, 0), new Vector3(10, -2, 0)]
  const texture2 = new Texture('textures/arrow.png', scene);
  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'textured-lines',
    {
      points: points2,
      width: 80,
      map: texture2,
      useMap: true,
      repeat: new Vector2(20, 1),
      alphaTest: 0.1,
    },
    scene
  );`
]

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value)
    demo(scene, camera)
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  const points1 = segmentize(
    [new Vector3(1, 3, 0), new Vector3(10, 5, 0), new Vector3(0, 0, 0)]
    , 1)
  const texture1 = new Texture('textures/stroke.png', scene);
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'textured-lines',
    {
      points: points1,
      width: 180,
      map: texture1,
      useMap: true,
      repeat: new Vector2(1, 1),
      alphaTest: 0.1,
    },
    scene
  );

  //

  const points2 = [new Vector3(0, -2, 0), new Vector3(10, -2, 0)]
  const texture2 = new Texture('textures/arrow.png', scene);
  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'textured-lines',
    {
      points: points2,
      width: 80,
      map: texture2,
      useMap: true,
      repeat: new Vector2(20, 1),
      alphaTest: 0.1,
    },
    scene
  );


  camera.zoomOnFactor = 1.3
  camera.zoomOn([line1, line2])

  camera.position.x -= 4
  camera.target.x -= 4
}
</script>

