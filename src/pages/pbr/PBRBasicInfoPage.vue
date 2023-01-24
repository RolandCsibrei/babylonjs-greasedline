<template>
  <canvas ref="canvas" class="canvas"></canvas>
  <CodeSnippets :codeSnippets="codeSnippets" position="top-right" />
  <CodeSnippets :codeSnippets="codeSnippetsRight" position="left" />
</template>

<script setup lang="ts">
import { ArcRotateCamera, Color3, Scalar, Scene, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../../greased-line/GraesedLineBuilder';
import CodeSnippets from 'src/components/CodeSnippets.vue';
import { GreasedLinePBRMaterial } from 'src/greased-line/GreasedLinePBRMaterial';

const codeSnippets = [
  `  // all available parameters and commented out which are not supported with PBR
  // use PBRMaterial parameters instead

  export interface GreasedLineBuilderParameters {
    points: GreasedLinePoints;
    widths?: number[];
    widthsDistribution?: WidthsDistribution;
    offsets?: number[];
    lazy?: boolean;
    instance?: GreasedLine;
    updatable?: boolean;
    pbr?: boolean;
    color?: Color3;
    // opacity?: number;
    width?: number;
    useColors?: boolean;
    colors?: Color3[];
    colorsSamplingMode?: ColorSamplingMode;
    colorDistribution?: ColorDistribution;
    sizeAttenuation?: boolean;
    visibility?: number;
    // useMap?: boolean;
    // map?: Texture;
    // alphaMap?: Texture;
    // useAlphaMap?: boolean;
    resolution?: Vector2;
    dashArray?: number;
    dashOffset?: number;
    dashRatio?: number;
    useDash?: boolean;
    // alphaTest?: number;
    // repeat?: Vector2;
    // uvOffset?: Vector2;
    // uvRotation?: number;
    // uvScale?: Vector2;
}`,]

const codeSnippetsRight = [
  `  const points = [new Vector3(-1, 0, 0), new Vector3(1, 0, 0)]
  const line1 = GreasedLineBuilder.CreateGreasedLine(
    'basic-pbr-line-1',
    {
      points,
      width: 10,
      pbr: true // set to true
    },
    scene
  )

  // get the material
  const pbr = line1.material as GreasedLinePBRMaterial

  // set material properties as you do for any PBRMaterial
  pbr.emissiveColor = new Color3(1.0, 0.766, 0.336);

  `,
];

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
  if (canvas.value) {
    const { scene, camera } = init(canvas.value, false);
    demo(scene, camera);
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {

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

