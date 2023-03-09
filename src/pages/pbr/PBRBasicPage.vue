<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, CubeTexture, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../../greased-line/GraesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { GreasedLinePBRMaterial } from 'src/greased-line/GreasedLinePBRMaterial';

const codeSnippets = [
  `  const points = []
  const r = 4
  for (let i = 0; i < Math.PI * 2; i += 0.1) {
    const x = Math.cos(i) * r
    const z = Math.sin(i) * r
    points.push([new Vector3(x, 0, z), new Vector3(x, 4, z)])
  }

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points,
      width: 80,
      pbr: true
    },
    scene
  )

  const pbr = line1.material as GreasedLinePBRMaterial
  const hdrTexture = new CubeTexture('/environments/environment.dds', scene);
  pbr.reflectionTexture = hdrTexture
  `
]

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value, false, true)
    demo(scene, camera)
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  const points = []
  const r = 4
  for (let i = 0; i < Math.PI * 2; i += 0.1) {
    const x = Math.cos(i) * r
    const z = Math.sin(i) * r
    points.push([new Vector3(x, 0, z), new Vector3(x, 4, z)])
  }


  // points.length = 0
  // points.push([
  //   new Vector3(0, -1, 0),
  //   new Vector3(0, 1, 0),
  // ]
  // )
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points,
      width: 180,
      pbr: true,
    },
    scene
  )

  // scene.createDefaultEnvironment()

  const material = line1.material as GreasedLinePBRMaterial
  const hdrTexture = new CubeTexture('/environments/environment.dds', scene);
  material.reflectionTexture = hdrTexture


  // material.albedoColor = Color3.Random()
  // material.metallic = 0.8;
  // material.roughness = 0;


  camera.zoomOnFactor = 1.1
  camera.zoomOn([line1])

  camera.position.x -= 3.5
  camera.target.x -= 3.5
}
</script>

