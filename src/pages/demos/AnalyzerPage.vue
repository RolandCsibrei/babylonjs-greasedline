<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { Analyser, ArcRotateCamera, Color3, Engine, RawTexture, Scene, Sound, Vector2, Vector3 } from '@babylonjs/core';
import { init } from 'src/babylon';
import { GreasedLineMaterial } from 'src/greased-line/GreasedLineFastMaterialrial';
import { onMounted, ref } from 'vue';
import { GreasedLineBuilder } from '../../greased-line/GraesedLineBuilder'

const canvas = ref<HTMLCanvasElement | null>(null);
onMounted(() => {

  if (canvas.value) {
    const { scene, camera } = init(canvas.value, false, true)
    demo(scene, camera)
  }
});

const demo = (scene: Scene, camera: ArcRotateCamera) => {
  const numOfBars = 256
  const barWidth = 3

  const analyzerPoints = []
  const offsets: number[] = []
  for (let i = 0; i < numOfBars; i++) {
    analyzerPoints.push(new Vector3(i * barWidth, 0, 0))
    offsets.push(0, 0, 0, 0, 0, 0)
  }
  const wavePoints = [...analyzerPoints]

  const textureColors = new Uint8Array([255, 0, 0, 255, 255, 0, 0, 255, 0])
  const texture = new RawTexture(
    textureColors,
    textureColors.length / 3,
    1,
    Engine.TEXTUREFORMAT_RGB,
    scene,
    false,
    true,
    Engine.TEXTURE_LINEAR_NEAREST
  )
  texture.wrapU = RawTexture.WRAP_ADDRESSMODE
  texture.name = 'analyzer-texture'

  const analyzerLine = GreasedLineBuilder.CreateGreasedLine(
    'analyzer-line',
    {
      points: analyzerPoints,
      useMap: true,
      map: texture,
      width: 14,
      updatable: true
    },
    scene,
  )

  const waveLine = GreasedLineBuilder.CreateGreasedLine(
    'wave-line',
    {
      points: wavePoints,
      offsets,
      color: Color3.Red(),
      sizeAttenuation: true,
      width: 24,
      dashArray: 1 / numOfBars,
      dashRatio: 0.4,
      useDash: true,
      updatable: true
    },
    scene,
  )
  waveLine.position = new Vector3(0, -30, 0)

  //

  camera.zoomOn([analyzerLine])
  camera.radius = 530
  camera.detachControl()

  _drawGrid()
  _startAudio()
  _createAnalyzer()

  function _startAudio() {
    const music = new Sound('Music', '/mp3/glitch-flight-track.mp3', scene, null, {
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
      analyser.SMOOTHING = 0.7

      const uvOffset = new Vector2(0, 0)

      const analyzerMaterial = analyzerLine.material as GreasedLineMaterial
      scene.onBeforeRenderObservable.add(() => {
        const frequencies = analyser.getByteFrequencyData()
        const widths = []
        const offsets = []
        for (let i = 0; i < numOfBars; i++) {
          const normalizedFrequency = frequencies[i]
          widths.push(normalizedFrequency, normalizedFrequency / 2)
          offsets.push(0, -normalizedFrequency, 0, 0, -normalizedFrequency, 0)
        }
        analyzerLine.setSegmentWidths(widths)
        waveLine.setOffsets(offsets)

        analyzerMaterial.setUvOffset(
          uvOffset,
        )
        uvOffset.x += 0.01 * scene.getAnimationRatio()
      })
    } else {
      console.error('No audio engine.')
    }
  }
}

</script>
