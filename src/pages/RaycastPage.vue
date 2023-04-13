<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, MeshBuilder, Ray, RayHelper, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/GraesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { WidthsDistribution } from 'src/greased-line/GreasedLine';
import { segmentize } from 'src/greased-line/lineUtils';


const codeSnippets = [
  `
  const ray = new Ray(origin, direction, length)
  const treshold = 10
  const result = line1.raycast(ray, treshold)
  `,
]

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value, false)
    demo(scene, camera)
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  camera.alpha = 1.4
  camera.beta = 1.4
  camera.minZ = 0.01
  camera.maxZ = 1000

  const points = [
    new Vector3(0, 0, 0),
    new Vector3(0, 10, 0),
    new Vector3(3, 10, 0),
    new Vector3(3, 0, 0),
    new Vector3(3.2, 0, 0),
    new Vector3(5, 9, -0.4),
  ]
  const subLines1 = segmentize(points, 0.6)

  const allPoints = [subLines1, [new Vector3(1, 1, 0), new Vector3(1, 9, 0)]]
  const widths = []
  for (let i = 0; i < allPoints.length; i++) {
    widths.push(Math.sin(i) * 6 + 2)
    widths.push(Math.sin(i) * 6 + 2)
  }

  const line1 = GreasedLineBuilder.CreateGreasedLine('raycast', {
    points: allPoints,
    color: Color3.Red(),
    width: 10,
    widths,
    widthsDistribution: WidthsDistribution.Repeat
  }, scene)

  const origin = new Vector3(-3, 5, 1)
  const direction = new Vector3(1, 0.4, -0.17)

  const marker = MeshBuilder.CreateSphere('origin1', { diameter: 0.2, segments: 8 })
  marker.position = origin

  const material = new StandardMaterial('mat', scene)
  material.emissiveColor = Color3.Blue()
  material.disableLighting = true
  marker.material = material

  const length = undefined
  const ray = new Ray(origin, direction, length)
  RayHelper.CreateAndShow(ray, scene, Color3.White())
  const result = line1.raycast(ray, 10)

  result?.forEach((r) => {
    const marker = MeshBuilder.CreateSphere('marker', { diameter: 0.4, segments: 8 })
    marker.position = r.point
    marker.material = material
  })


  camera.target.x = 2.2
  camera.target.y = 5.19
  camera.target.z = 0.26

  camera.alpha = 2.59
  camera.beta = 0.41
  camera.radius = 13.89
}
</script>

