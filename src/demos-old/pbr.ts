import {
  GreasedLine,
  GreasedLinePoints,
  WidthsDistribution,
} from './../GreasedLine';
import {
  ArcRotateCamera,
  Axis,
  BezierCurve,
  Color3,
  Color4,
  GlowLayer,
  Scene,
  Vector2,
  Vector3,
} from '@babylonjs/core';
import { ColorDistribution, GreasedLineBuilder } from './../GraesedLineBuilder';
import { bezier, circle, segmentize } from '../lineUtils';

export function pbrDemo(scene: Scene, camera: ArcRotateCamera) {
  const engine = scene.getEngine();

  camera.target = new Vector3(0, 0, 0);
  camera.alpha = -Math.PI / 2;
  camera.beta = Math.PI / 2;
  camera.radius = 58.85;
  camera.upperRadiusLimit = 300;
  camera.minZ = 0.01;

  scene.clearColor = new Color4(0, 0, 0, 1);
  scene.autoClear = true;

  // gl.onBeforeRenderMeshToEffect.add((mesh) => {
  //   if (mesh.name === 'line') {
  //     const mat = mesh.material as PBRCustomMaterial
  //     mat!.disableLighting = true
  //   }
  // })
  // gl.onAfterRenderMeshToEffect.add((mesh) => {
  //   if (mesh.name === 'line') {
  //     const mat = mesh.material as PBRCustomMaterial
  //     mat!.disableLighting = false
  //   }
  // })

  const line2 = [
    new Vector3(0, 0, 40),
    new Vector3(20, 0, 40),
    new Vector3(20, 0, 40),
  ];
  const segm = segmentize(
    [new Vector3(20, 0, 40), new Vector3(200, 0, 40)],
    4.1
  );
  const colors2 = [new Color3(0, 0, 1), new Color3(0, 1, 0)];
  const widths2 = [0, 0, 20, 20, 4, 4];

  const mesh = GreasedLineBuilder.CreateGreasedLine(
    'mesh',
    {
      points: line2.concat(segm),
      widths: widths2,
      widthsDistribution: WidthsDistribution.Start,
      colors: colors2,
      color: Color3.Black(),
      colorDistribution: ColorDistribution.Repeat,
      useColors: true,
      pbr: true,
    },
    scene
  );

  const gl = new GlowLayer('glow', scene, {
    camera,
    blurKernelSize: 128,
  });
  gl.intensity = 1;

  gl.referenceMeshToUseItsOwnMaterial(mesh);
}
