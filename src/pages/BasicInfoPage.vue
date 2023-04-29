<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <!-- <CodeSnippets :codeSnippets="codeSnippets" position="top-right" /> -->
  <!-- <CodeSnippets :codeSnippets="codeSnippetsRight" position="bottom-left" /> -->
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Material, MeshBuilder, PBRMaterial, Scene, StandardMaterial, Texture, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/GraesedLineBuilder';
import CodeSnippets from 'src/components/CodeSnippets.vue';



const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
  if (canvas.value) {
    const { scene, camera } = init(canvas.value, false, true);
    demo(scene, camera);
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  const points = [
    new Vector3(-3, 0, 0),
    new Vector3(3, 0, 0)
  ]

  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points,
      width: 0.3,
      color: Color3.Red(),
      useDash: true,
      sizeAttenuation: true,
      dashArray: 1 / (10 * 2), // 1 / (num of dashes * 2)
      dashRatio: 0.2, // dash length ratio 0..1 (0.5 = half empty, half drawn)
      // visibility: 0.25,
      pbr: true
    },
    scene
  )

  const material = line1.material as PBRMaterial
  if (material) {
    material.disableLighting = true;
    // material.emissiveColor = Color3.Blue()

    const texture1 = new Texture('textures/amiga.jpg', scene);
    material.albedoTexture = texture1
    material.emissiveTexture = texture1
    // material.ambientTexture = texture1
    material.emissiveIntensity = 0.4
    // material.diffuseTexture = texture1
    // material.alphaMode = Material.MATERIAL_ALPHATEST
    // material.alphaCutOff = 0.1
    // material.alpha = 0.999
    texture1.uScale = 5
    // material.metallic = 0.9
    material.roughness = 0.1
  }


  const points3 = []
  const colors3 = []
  for (let x = 0; x < 10; x += 0.25) {
    points3.push(new Vector3(x, Math.cos(x / 2) - 8, 0))
    colors3.push(Color3.Random())
  }
  const line3 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-3',
    {
      color: Color3.White(),
      colors: colors3,
      useColors: true,
      width: 0.2,
      sizeAttenuation: false,
      points: points3
    },
    scene
  )

  if (line3.material) {
    // (line3.material as StandardMaterial).disableLighting = true
  }


  const widths = [1, 1, 8, 8, 20, 20]
  const offsets = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 1, 0,
  ]
  const colors2 = [new Color3(0.5, 0.5, 0.5), new Color3(1, 1, 1)]
  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-2',
    {
      color: Color3.Blue(),
      colors: colors2,
      useColors: true,
      colorDistribution: GreasedLineBuilder.COLOR_DISTRIBUTION_EVEN,
      width: 0.1,
      sizeAttenuation: false,
      widths,
      widthsDistribution: GreasedLineBuilder.WIDTH_DISTRIBUTION_REPEAT,
      offsets,

      points: [
        new Vector3(0, -4, 0),
        new Vector3(5, -4, 0),
        new Vector3(10, -4, 0),
      ],
    },
    scene
  )


  if (line2.material) {
    (line2.material as StandardMaterial).disableLighting = true
  }


  camera.zoomOnFactor = 1.3;
  camera.zoomOn([line1, line2, line3]);
  // camera.zoomOn([line2]);

};
</script>

