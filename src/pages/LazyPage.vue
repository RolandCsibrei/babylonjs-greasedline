<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Axis, Color3, Scalar, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../greased-line/GraesedLineBuilder';
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { GreasedLine } from 'src/greased-line/GreasedLine';

const codeSnippets = [
  `  let instance: GreasedLine | undefined = undefined;
  const numOfLines = 4096
  const frequency = 5 / numOfLines;
  for (let i = 0; i < numOfLines; i++) {
    const points = [];
    const widths = [];
    const r = Math.floor(Math.sin(frequency * i + 0) * (127) + 128);
    const g = Math.floor(Math.sin(frequency * i + 2) * (127) + 128);
    const b = Math.floor(Math.sin(frequency * i + 4) * (127) + 128);
    const colors = [new Color3(r, g, b)]
    for (let j = 0; j < 2; j++) {
      const x = Math.cos(i) * j
      const y = Math.sin(i) * j
      const z = i / (numOfLines / 4)
      points.push(new Vector3(x, y, z));
      widths.push(Scalar.RandomRange(1, 22), Scalar.RandomRange(1, 4))
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
    const { scene, camera } = init(canvas.value, false);
    demo(scene, camera);
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {
  let instance: GreasedLine | undefined = undefined;
  const numOfLines = 4096
  const frequency = 5 / numOfLines;
  for (let i = 0; i < numOfLines; i++) {
    const points = [];
    const widths = [];
    const r = Math.floor(Math.sin(frequency * i + 0) * (127) + 128);
    const g = Math.floor(Math.sin(frequency * i + 2) * (127) + 128);
    const b = Math.floor(Math.sin(frequency * i + 4) * (127) + 128);
    const colors = [new Color3(r, g, b)]
    for (let j = 0; j < 2; j++) {
      const x = Math.cos(i) * j
      const y = Math.sin(i) * j
      const z = i / (numOfLines / 4)
      points.push(new Vector3(x, y, z));
      widths.push(Scalar.RandomRange(1, 22), Scalar.RandomRange(1, 4))
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
    camera.alpha = -0.69;
    camera.beta = 1.16
    camera.radius = 3.9185
    camera.target.x = -0.36
    camera.target.y = -0.33
    camera.target.z = 1.35

    scene.onBeforeRenderObservable.add(() => {
      instance?.rotate(Axis.Z, -0.01 * scene.getAnimationRatio())
    })
  }

};
</script>

