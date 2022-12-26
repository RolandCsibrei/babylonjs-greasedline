<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, CubeTexture, Scene, Texture, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../../greased-line/GraesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { GreasedLinePBRMaterial } from 'src/greased-line/GreasedLinePBRMaterial';
import { segmentize } from 'src/greased-line/lineUtils';

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
    const { scene, camera } = init(canvas.value, true)
    demo(scene, camera)
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  const points = segmentize([new Vector3(10, 0, -1), new Vector3(0, 0, -1)], 0.1)

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points,
      width: 100,
      pbr: true
    },
    scene
  )

  const pbr = line1.material as GreasedLinePBRMaterial




  // pbr.reflectivityColor = Color3.Black();
  // pbr.reflectionColor = Color3.Black();
  // pbr.emissiveColor = Color3.Red();

  // pbr.reflectionTexture = CubeTexture.CreateFromPrefilteredData('/environments/environment.dds', scene);

  const hdrTexture = new CubeTexture('/environments/environment.dds', scene);
  pbr.reflectionTexture = hdrTexture

  const albedoTexture = new Texture('/textures/moon.jpg', scene)
  albedoTexture.vScale = 0.08
  albedoTexture.uScale = 4
  pbr.albedoTexture = albedoTexture

  // const roughnessTexture = new Texture('/textures/moon_spec.jpg', scene)
  // roughnessTexture.vScale = 0.08
  // roughnessTexture.uScale = 4
  // pbr.metallicTexture = roughnessTexture

  // const bumpTexture = new Texture('/textures/moon_bump.jpg', scene)
  // bumpTexture.vScale = 0.08
  // bumpTexture.uScale = 4
  // pbr.bumpTexture = bumpTexture


  camera.zoomOnFactor = 1.3
  camera.zoomOn([line1])

  camera.position.x -= 5
  camera.target.x -= 5
}
</script>

