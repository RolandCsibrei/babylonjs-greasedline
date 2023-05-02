<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { Analyser, ArcRotateCamera, Axis, Color3, Engine, GlowLayer, MeshBuilder, MirrorTexture, Plane, RawTexture, Scene, Sound, StandardMaterial, Vector2, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../../greased-line/graesedLineBuilder'
import { circle } from 'src/greased-line/greasedLineTools';

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value, false, false)
    demo(scene, camera)
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {
  const barWidth = 3

  const numOfBars = 99
  const circularAnalyzerPoints = circle(140, numOfBars * 2);

  const offsets: number[] = []
  for (let i = 0; i < circularAnalyzerPoints.length; i++) {
    offsets.push(0, 0, 0, 0, 0, 0)
  }

  const circularAnalyzerLine = GreasedLineBuilder.CreateGreasedLine(
    'circular-analyzer-line',
    {
      points: circularAnalyzerPoints,
      offsets,
      width: 40,
      updatable: true,
      useDash: true,
      dashArray: 1 / (numOfBars * 2), // 1 / (num of dashes * 2)
      dashRatio: 0.4, // dash length ratio 0..1 (0.1 = 10% empty, 90% drawn),
    },
    scene,
  )
  // circularAnalyzerLine.position.x += 300

  const textureColors = new Uint8Array([
    0, 240, 232,
    236, 0, 242,
    0, 240, 232,
    0, 37, 245,
  ])
  const texture = new RawTexture(
    textureColors,
    textureColors.length / 3,
    1,
    Engine.TEXTUREFORMAT_RGB,
    scene,
    false,
    true,
    Engine.TEXTURE_LINEAR_LINEAR
  )
  texture.wrapU = RawTexture.WRAP_ADDRESSMODE
  texture.name = 'analyzer-texture'
  texture.uOffset = 1.4

  let material = circularAnalyzerLine.material as StandardMaterial
  material.emissiveTexture = texture



  //

  camera.zoomOn([circularAnalyzerLine])
  // camera.radius = 1530
  // camera.detachControl()



  const glow = new GlowLayer('glow', scene, {
  })
  glow.intensity = 0.8;
  glow.blurKernelSize = 128


  glow.referenceMeshToUseItsOwnMaterial(circularAnalyzerLine)
  glow.addIncludedOnlyMesh(circularAnalyzerLine)


  _startAudio()
  _createAnalyzer()

  function _startAudio() {
    const music = new Sound('Music', '/mp3/Alan_Walker_-_Faded.mp3', scene, null, {
      loop: true,
      autoplay: true,
    })
  }

  function _drawGrid() {
    const points: Vector3[][] = []
    for (let i = 0; i < numOfBars; i += 4) {
      points.push([new Vector3(i * barWidth, -200, 0), new Vector3(i * barWidth, 200, 0)])
    }
    for (let i = 0; i < numOfBars; i += 2) {
      points.push([new Vector3(0, i * barWidth - 200, 0), new Vector3(barWidth * numOfBars, i * barWidth - 200, 0)])
    }

    const grid = GreasedLineBuilder.CreateGreasedLine('grid', {
      points,
      color: new Color3(0, 0, 0.6),
    }, scene)

    return grid
  }

  function _createAnalyzer() {
    if (Engine.audioEngine) {
      const analyser = new Analyser(scene)
      Engine.audioEngine.connectToAnalyser(analyser)
      analyser.BARGRAPHAMPLITUDE = 256
      analyser.FFT_SIZE = 512
      analyser.SMOOTHING = 0.8

      const uvOffset = new Vector2(0, 0)
      scene.onBeforeRenderObservable.add(() => {
        const frequencies = analyser.getByteFrequencyData()
        const widths = []
        const offsets = []
        for (let i = 0; i < numOfBars; i++) {
          const f = frequencies[i]
          const normalizedFrequency = Math.pow(f / 20, 3) / 2
          widths.push(normalizedFrequency / 20, normalizedFrequency / 40)
          offsets.push(0, 0, -normalizedFrequency, 0, 0, -normalizedFrequency, 0)

        }

        for (let i = numOfBars; i >= 0; i--) {
          const f = frequencies[i]
          const normalizedFrequency = Math.pow(f / 20, 3) / 2
          widths.push(normalizedFrequency / 22, normalizedFrequency / 42)
          offsets.push(0, 0, -normalizedFrequency, 0, 0, -normalizedFrequency, 0)
        }

        circularAnalyzerLine.setSegmentWidths(widths)
        // circularAnalyzerLine.setOffsets(offsets)
        circularAnalyzerLine.rotate(Axis.Z, 0.01 * scene.getAnimationRatio())


        // texture.uOffset = uvOffset.x
        // uvOffset.x += 0.002 * scene.getAnimationRatio()
        // console.log(uvOffset.x)
      })
    } else {
      console.error('No audio engine.')
    }
  }
}

</script>
