<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, GlowLayer, Scene, SceneLoader, Vector3, VertexBuffer } from '@babylonjs/core';
import { init } from 'src/babylon';
import { GreasedLine, WidthsDistribution } from 'src/greased-line/GreasedLine';
import { onMounted, ref } from 'vue';
import { ColorDistribution, ColorSamplingMode, GreasedLineBuilder } from '../../greased-line/GraesedLineBuilder'

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

  const points: Vector3[][] = [];
  const meshes = root.getChildMeshes(false);
  meshes.forEach((m) => {
    const vertices = m.getVerticesData(VertexBuffer.PositionKind);
    const indices = m.getIndices();
    if (vertices && indices) {
      for (let i = 0, ii = 0; i < indices.length; i++) {
        const vi1 = indices[ii++] * 3;
        const vi2 = indices[ii++] * 3;
        const vi3 = indices[ii++] * 3;

        const p1 = new Vector3(
          vertices[vi1],
          vertices[vi1 + 1],
          vertices[vi1 + 2]
        );
        const p2 = new Vector3(
          vertices[vi2],
          vertices[vi2 + 1],
          vertices[vi2 + 2]
        );
        const p3 = new Vector3(
          vertices[vi3],
          vertices[vi3 + 1],
          vertices[vi3 + 2]
        );

        if (p1.length() + p2.length() + p3.length() === 0) {
          continue;
        }
        points.push([p1, p2, p3, p1]);
      }
    }
  });

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
      colorsSamplingMode: ColorSamplingMode.Smooth,
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
