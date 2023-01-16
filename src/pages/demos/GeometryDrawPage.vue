<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, GlowLayer, Scene, SceneLoader, Vector3, VertexBuffer } from '@babylonjs/core';
import { init } from 'src/babylon';
import { ColorDistribution, WidthsDistribution } from 'src/greased-line/GreasedLine';
import { meshesToLines } from 'src/greased-line/lineUtils';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../../greased-line/GraesedLineBuilder'

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(async () => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value, false, true)
    await demo(scene, camera)
  }
});

const demo = async (scene: Scene, camera: ArcRotateCamera) => {
  const loaded = await SceneLoader.AppendAsync('/models/', 'monkey.glb');
  const root = loaded.meshes[0];

  root.setEnabled(false);

  const meshes = root.getChildMeshes(false);
  const points = meshesToLines(meshes)

  const colors1 = [new Color3(1, 0, 0), new Color3(0, 0, 1), new Color3(0, 1, 0), new Color3(1, 1, 0)];
  const widths1 = [20, 0, 0, 2, 0, 10]; //.reverse()

  const mesh = GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      points,
      width: 1,
      widths: widths1,
      widthsDistribution: WidthsDistribution.Repeat,
      colors: colors1,
      useColors: true,
      color: Color3.White(),
      colorDistribution: ColorDistribution.Repeat,
    },
    scene
  );

  const glow = new GlowLayer('glow', scene, {
    blurKernelSize: 128,
  });
  glow.intensity = 1.2;

  glow.referenceMeshToUseItsOwnMaterial(mesh)

  camera.zoomOn([mesh]);
  camera.alpha = -Math.PI * 1.5
  camera.maxZ = 1000;
  camera.minZ = 0.1;
}

</script>
