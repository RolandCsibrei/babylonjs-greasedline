<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Axis, Color3, CubeTexture, Scalar, Scene, Texture, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../../greased-line/graesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { GreasedLinePBRMaterial } from 'src/greased-line/GreasedLinePBRMaterial';
import { segmentize } from 'src/greased-line/greasedLineTools';

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
  )`
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
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points,
      width: 80,
      pbr: true,
    },
    scene
  )


  const pbr = line1.material as GreasedLinePBRMaterial
  // pbr.alpha = 0.6

  // pbr.reflectivityColor = Color3.Black();
  // pbr.reflectionColor = Color3.Black();
  // pbr.emissiveColor = Color3.Red();

  // pbr.reflectionTexture = CubeTexture.CreateFromPrefilteredData('/environments/environment.dds', scene);

  const hdrTexture = new CubeTexture('/environments/environment.dds', scene);
  pbr.reflectionTexture = hdrTexture

  // const albedoTexture = new Texture('/textures/moon.jpg', scene)
  // albedoTexture.vScale = 0.08
  // albedoTexture.uScale = 4
  // pbr.albedoTexture = albedoTexture

  // const roughnessTexture = new Texture('/textures/moon_spec.jpg', scene)
  // roughnessTexture.vScale = 0.08
  // roughnessTexture.uScale = 4
  // pbr.metallicTexture = roughnessTexture

  // const bumpTexture = new Texture('/textures/moon_bump.jpg', scene)
  // bumpTexture.vScale = 0.08
  // bumpTexture.uScale = 4
  // pbr.bumpTexture = bumpTexture

  scene.onBeforeRenderObservable.add(() => {
    // line1.rotate(Axis.Y, 0.01 * scene.getAnimationRatio())
  })


  camera.zoomOnFactor = 1.1
  camera.zoomOn([line1])

  camera.position.x -= 2
  camera.target.x -= 2
}
</script>

