<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Color4, Scene, Texture, Vector2, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { ColorDistribution, ColorSamplingMode, GreasedLineBuilder } from '../greased-line/GraesedLineBuilder'
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { WidthsDistribution } from 'src/greased-line/GreasedLine';
import { GreasedLineMaterial } from 'src/greased-line/GreasedLineFastMaterialrial';
import { segmentize } from 'src/greased-line/lineUtils';

const codeSnippets = [
  `  const colorMap1 = GreasedLineBuilder.TextureFromColors(
    'star',
    GreasedLineBuilder.NormalizeColorTable(
      10,
      [Color3.Yellow(), Color3.Blue()],
      ColorDistribution.Repeat
    ),
    scene
  );
  colorMap1.wrapU = Texture.WRAP_ADDRESSMODE;
  colorMap1.wrapV = Texture.WRAP_ADDRESSMODE;

  const points1 = [new Vector3(0, 0, 0), new Vector3(10, 0, 0)]
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'uv-colors-line-1',
    {
      updatable: true,
      points: points1,
      width: 10,
      useMap: true,
      map: colorMap1,
    },
    scene);`,
  `  // line2
  const colorMap2 = GreasedLineBuilder.TextureFromColors(
    'star',
    [Color3.Yellow(), Color3.Blue()],
    scene
  );
  const points2 = [new Vector3(0, -2, 0), new Vector3(10, -2, 0)]
  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'uv-colors-line-2',
    {
      points: points2,
      width: 10,
      useMap: true,
      map: colorMap2,
    },
    scene);`
]

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value)
    demo(scene, camera)
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

  const colorMap1 = GreasedLineBuilder.TextureFromColors(
    'star',
    GreasedLineBuilder.NormalizeColorTable(
      10,
      [Color3.Yellow(), Color3.Blue()],
      ColorDistribution.Repeat
    ),
    scene
  );
  colorMap1.wrapU = Texture.WRAP_ADDRESSMODE;
  colorMap1.wrapV = Texture.WRAP_ADDRESSMODE;

  const points1 = [new Vector3(0, 0, 0), new Vector3(10, 0, 0)]
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'uv-colors-line-1',
    {
      updatable: true,
      points: points1,
      width: 10,
      useMap: true,
      map: colorMap1,
    },
    scene
  );

  //

  const colorMap2 = GreasedLineBuilder.TextureFromColors(
    'star',
    [Color3.Yellow(), Color3.Blue()],
    scene
  );
  colorMap1.wrapU = Texture.WRAP_ADDRESSMODE;
  colorMap1.wrapV = Texture.WRAP_ADDRESSMODE;
  const points2 = [new Vector3(0, -2, 0), new Vector3(10, -2, 0)]
  const line2 = GreasedLineBuilder.CreateGreasedLine(
    'uv-colors-line-2',
    {
      points: points2,
      width: 10,
      useMap: true,
      map: colorMap2,
    },
    scene
  );

  const uvOffset = new Vector2(0, 0);
  const mat = line1.material as GreasedLineMaterial;
  scene.onBeforeRenderObservable.add(() => {
    mat.setUvOffset(uvOffset);
    uvOffset.x += 0.001 * scene.getAnimationRatio();
  });


  camera.zoomOnFactor = 1.3
  camera.zoomOn([line1, line2])

  camera.position.x -= 4
  camera.target.x -= 4
}
</script>

