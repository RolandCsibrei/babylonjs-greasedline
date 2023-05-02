<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Scene, Texture, Vector2, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/graesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';

const codeSnippets = [
  `  const points1 = segmentize(
    [new Vector3(1, 3, 0), new Vector3(10, 5, 0), new Vector3(0, 0, 0)]
    , 1)
  const texture1 = new Texture('textures/amiga.jpg', scene); // JPG
  const textureAlpha1 = new Texture('textures/star-alpha.png', scene);
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'textured-lines',
    {
      points: points1,
      width: 120,
      map: texture1,
      useMap: true,
      alphaMap: textureAlpha1,
      useAlphaMap: true,
      repeat: new Vector2(20, 1),
      alphaTest: 0.96, // discard pixels with the r channel value < 0.96
                       // of the alphaMap texture
    },
    scene
  );`,
  `  const points2 = [new Vector3(0, -2, 0), new Vector3(10, -2, 0)]
  const texture2 = new Texture('textures/amiga.jpg', scene); // JPG
  const textureAlpha2 = new Texture('textures/arrow-alpha.png', scene);
  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'textured-lines',
    {
      points: points2,
      width: 80,
      map: texture2,
      useMap: true,
      alphaMap: textureAlpha2,
      useAlphaMap: true,
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

  const points1 = [new Vector3(0, 0, 0), new Vector3(10, 0, 0)]

  const texture1 = new Texture('textures/amiga.jpg', scene);
  const textureAlpha1 = new Texture('textures/star-alpha.png', scene);
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'textured-lines',
    {
      points: points1,
      width: 120,
      map: texture1,
      useMap: true,
      alphaMap: textureAlpha1,
      useAlphaMap: true,
      repeat: new Vector2(20, 1),
      alphaTest: 0.96,
    },
    scene
  );

  //
  const points2 = [new Vector3(0, -2, 0), new Vector3(10, -2, 0)]
  const texture2 = new Texture('textures/amiga.jpg', scene);
  const textureAlpha2 = new Texture('textures/arrow-alpha.png', scene);
  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'textured-lines-2',
    {
      points: points2,
      width: 80,
      map: texture2,
      useMap: true,
      alphaMap: textureAlpha2,
      useAlphaMap: true,
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

