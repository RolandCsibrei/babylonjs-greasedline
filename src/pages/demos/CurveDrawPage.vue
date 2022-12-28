<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :code-snippets="credits" :position="'bottom-left'" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, GlowLayer, Scene, SceneLoader, Vector3, VertexBuffer } from '@babylonjs/core';
import { init } from 'src/babylon';
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { WidthsDistribution } from 'src/greased-line/GreasedLine';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../../greased-line/GraesedLineBuilder'

const credits = [
  `3D model by my friend Krystof Klestil
https://twitter.com/lentsius_bark`
]

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(async () => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value, false, true)
    await demo(scene, camera)
  }
});

const demo = async (scene: Scene, camera: ArcRotateCamera) => {

  const glow = new GlowLayer('glow', scene, {
    blurKernelSize: 128,
  });
  glow.intensity = 1.2;


  const loaded = await SceneLoader.AppendAsync(
    '/models/',
    'Fordt_GT_go_crazy-lines.glb'
  );
  const root = loaded.meshes[0];

  root.setEnabled(false);
  const yLimit = 1;

  const meshes = root.getChildMeshes(false);
  meshes.forEach((m) => {
    const points: Vector3[][] = [];
    console.log(m.name)
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
        // const s = p1.y + p2.y + p3.y
        // if (s >= 2 * 4) {
        //   continue
        // }

        const ss = [];
        if (p1.y < yLimit) {
          ss.push(p1);
        }

        if (p2.y < yLimit) {
          ss.push(p2);
        }

        if (p3.y < yLimit) {
          ss.push(p3);
        }

        points.push(ss);
      }
    }
    const widths1 = [1, 1]; //.reverse()


    const meshColorTable = [
      {
        name: 'Rim',
        color: Color3.Red(),
        width: 12,
      },
      {
        name: 'Circle.005',
        color: Color3.Red(),
      },
      {
        name: 'Circle.007',
        color: Color3.Red(),
      },
      {
        name: 'Cube.039',
        color: Color3.Red(),
        width: 12,
      },
      {
        name: 'Cube.045',
        color: Color3.Yellow(),
        glow: true,
        width: 12
      },
      {
        name: 'Cube.042',
        color: Color3.Green(),
        glow: true,
        width: 6
      },

    ]

    const ct = meshColorTable.find(ct => m.name.startsWith(ct.name))
    let color = ct?.color ?? Color3.Blue()
    let width = ct?.width ?? 4
    const mesh = GreasedLineBuilder.CreateGreasedLine(
      m.name,
      {
        points,
        width,
        widths: widths1,
        widthsDistribution: WidthsDistribution.Repeat,
        color
      },
      scene
    );
    mesh.id = 'curve'

    if (ct?.glow) {
      glow.referenceMeshToUseItsOwnMaterial(mesh)
    }
  });

  root.dispose()

  //

  camera.maxZ = 1000;
  camera.minZ = 0.1;
  camera.alpha = -3.95
  camera.beta = 1.16
  camera.radius = 3.123

  camera.target.x = -0.46
  camera.target.y = 0.18
  camera.target.z = 0.79

}

</script>
