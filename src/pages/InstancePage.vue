<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Color4, Scalar, Scene, StandardMaterial, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/graesedLineBuilder';
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { GreasedLineMesh } from 'src/greased-line/greasedLineMesh';

const codeSnippets = [
  `  let instance: GreasedLine | undefined = undefined;
  for (let i = 0; i < 200; i++) {
    const points = [];
    const colors = [Color3.Random()]
    for (let j = 0; j < 2; j++) {
      const x = Scalar.RandomRange(-5, 5);
      const y = Scalar.RandomRange(-5, 5);
      const z = Scalar.RandomRange(-5, 5)
      points.push(new Vector3(x, y, z));
    }
    const line1 = GreasedLineBuilder.CreateGreasedLine(
      'instanced-lines',
      {
        instance,
        points,
        colors,
        useColors: true,
        width: 10
      },
      scene
    );

    if (!instance) {
      instance = line1;
    }`,
];

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
  if (canvas.value) {
    const { scene, camera } = init(canvas.value);
    demo(scene, camera);
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {
  let instance: GreasedLineMesh | undefined = undefined;
  for (let i = 0; i < 200; i++) {
    const points = [];
    const color = Color3.Random()
    const colors = [color, color]
    for (let j = 0; j < 2; j++) {
      const x = Scalar.RandomRange(-5, 5);
      const y = Scalar.RandomRange(-5, 5);
      const z = Scalar.RandomRange(-5, 5)
      points.push(new Vector3(x, y, z));
    }
    const line1 = GreasedLineBuilder.CreateGreasedLine(
      'instanced-lines',
      {
        instance,
        points,
        colors,
        useColors: true,
        width: 10
      },
      scene
    );

    if (!instance) {
      instance = line1;
    }
  }

  if (instance) {
    (instance.material as StandardMaterial).disableLighting = true
    camera.zoomOnFactor = 1.3;
    camera.zoomOn([instance]);
  }

  camera.position.x -= 5;
  camera.target.x -= 5;
};
</script>

