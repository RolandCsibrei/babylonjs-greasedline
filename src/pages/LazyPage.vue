<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Scalar, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/GraesedLineBuilder';
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { GreasedLine } from 'src/greased-line/GreasedLine';

const codeSnippets = [
  `  let instance: GreasedLine | undefined = undefined;
  for (let i = 0; i < 4096; i++) { // 4096 is the maximum number of lines
    const points = [];
    const widths = [];
    const colors = [Color3.Random()]
    for (let j = 0; j < 2; j++) {
      const x = Scalar.RandomRange(-5, 5);
      const y = Scalar.RandomRange(-5, 5);
      const z = Scalar.RandomRange(-5, 5)
      points.push(new Vector3(x, y, z));
      widths.push(Scalar.RandomRange(1, 18), Scalar.RandomRange(1, 8))
    }
    const line1 = GreasedLineBuilder.CreateGreasedLine(
      'instanced-lines',
      {
        instance,
        points,
        colors,
        widths,
        useColors: true,
        width: 2,
        lazy: true
      },
      scene
    );

    if (!instance) {
      instance = line1;
    }
  }

  if (instance) {
    instance.updateLazy()
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
  let instance: GreasedLine | undefined = undefined;
  for (let i = 0; i < 4096; i++) {
    const points = [];
    const widths = [];
    const colors = [Color3.Random()]
    for (let j = 0; j < 2; j++) {
      const x = Scalar.RandomRange(-5, 5);
      const y = Scalar.RandomRange(-5, 5);
      const z = Scalar.RandomRange(-5, 5)
      points.push(new Vector3(x, y, z));
      widths.push(Scalar.RandomRange(1, 18), Scalar.RandomRange(1, 8))
    }
    const line1 = GreasedLineBuilder.CreateGreasedLine(
      'instanced-lines',
      {
        instance,
        points,
        colors,
        widths,
        useColors: true,
        width: 2,
        lazy: true
      },
      scene
    );

    if (!instance) {
      instance = line1;
    }
  }

  if (instance) {
    instance.updateLazy()
    camera.zoomOnFactor = 0.8;
    camera.zoomOn([instance]);
  }

};
</script>

