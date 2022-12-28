<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { GreasedLinePBRMaterial } from 'src/greased-line/GreasedLinePBRMaterial';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../../greased-line/GraesedLineBuilder';

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
  if (canvas.value) {
    const { scene, camera } = init(canvas.value, false);
    demo(scene, camera);
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  // YOU CODE GOES HERE

  const points = [new Vector3(-1, 0, 0), new Vector3(1, 0, 0)]
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-line-1',
    {
      points,
      width: 10,
      pbr: true
    },
    scene
  )

  const pbr = line1.material as GreasedLinePBRMaterial
  pbr.emissiveColor = new Color3(1.0, 0.766, 0.336);

  camera.zoomOnFactor = 1.3;
  camera.zoomOn([line1]);

}


</script>

