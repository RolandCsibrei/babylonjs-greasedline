import { GreasedLineMaterial } from './../GreasedLineMaterial';
import {
  ColorDistribution,
  ColorSamplingMode,
  GreasedLineBuilder,
} from './../GraesedLineBuilder';
import {
  ArcRotateCamera,
  Camera,
  Color3,
  Color4,
  CubeTexture,
  GlowLayer,
  KeyboardEventTypes,
  KeyboardInfo,
  MeshBuilder,
  Scalar,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
} from '@babylonjs/core';
import { GreasedLine, WidthsDistribution } from './../GreasedLine';
import { getCircleCap } from '../lineUtils';

interface Star {
  x: number;
  y: number;
  z: number;
  a: number;
  width: number;
  length: number;
  radius: number;
}

export function lightspeed(scene: Scene, camera: ArcRotateCamera) {
  createSkyBox();

  const count = 1500;

  const minRadius = 10;
  const maxRadius = 200;

  const minZ = 0;
  const maxZ = 100;

  const minLength = 20;
  const maxLength = 100;

  const stars: Star[] = [];

  const colorMap = GreasedLineBuilder.TextureFromColors(
    'star',
    [Color3.White(), Color3.Blue()],
    scene
  );

  // const line1 = []
  const ratio = 16 / 9;
  let mesh: GreasedLine | undefined = undefined;
  for (let i = 0; i < count; i++) {
    const radius = Scalar.RandomRange(minRadius, maxRadius);
    const a = Scalar.RandomRange(0, Math.PI * 2);
    const x = Math.cos(a) * radius;
    const y = (Math.sin(a) * radius) / ratio;
    const z = Scalar.RandomRange(minZ, maxZ);
    const length = Scalar.RandomRange(minLength, maxLength);

    const line = [new Vector3(x, y, z), new Vector3(x, y, z + length)];

    let width =
      Math.random() < 0.9
        ? Scalar.RandomRange(5, 16)
        : Scalar.RandomRange(36, 40);

    let color = Color3.White();
    if (Math.random() < 0.1) {
      color = new Color3(0.4, 0.4, 1);
      width = 2;
    }
    const colors = [color];
    const widths = [width * 0.2, width * 0.2, width, width]; //.reverse()

    stars.push({
      x,
      y,
      z,
      a,
      radius,
      width,
      length,
    });

    mesh = GreasedLineBuilder.CreateGreasedLine(
      'lines',
      {
        lazy: true,
        updatable: true,

        points: line,
        instance: mesh,

        width: 2,
        widths,

        useColors: true,
        colors,

        widthsDistribution: WidthsDistribution.Start,
        visibility: 0.04,
      },
      scene
    );

    // const cap1 = getCircleCap(line[0], Vector3.Normalize(line[1].subtract(line[0])) , 4, 4, 8)
    // const cap1 = getCircleCap(line[0], Vector3.Normalize(line[0].subtract(line[1])) , 4, 4, 8)
  }

  if (mesh) {
    mesh.alwaysSelectAsActiveMesh = true;
    const segmentWidths = mesh.getSegmentWidths();

    mesh.updateLazyLine();

    // mesh.scaling.z = 0.1

    const glow = new GlowLayer('glow', scene, {
      blurKernelSize: 64,
    });
    glow.intensity = 2;

    glow.referenceMeshToUseItsOwnMaterial(mesh!);

    scene.autoClear = false;
    const mat = mesh.material as GreasedLineMaterial;

    let visibility = 0.05;

    const scale = new Vector3(1, 1, 1);
    let play = false;
    scene.onKeyboardObservable.add((e) => {
      if (e.type === KeyboardEventTypes.KEYUP) {
        play = !play;
      }
    });

    scene.onBeforeRenderObservable.add(() => {
      if (!play) {
        return;
      }

      for (let i = 0; i < segmentWidths.length; i++) {
        segmentWidths[i] *= 1.004;
      }

      mesh!.setSegmentWidths(segmentWidths);

      glow.intensity *= 1.00005;

      // glow.intensity = 1 / (camera.radius / 80)
      mat.setVisibility(visibility);

      visibility += 0.001 * scene.getAnimationRatio();
      if (visibility > 1) {
        play = false;
      }

      mesh!.scaling = scale;

      // scale.x *= 1.002
      // scale.y *= 1.002
      scale.z *= 1.005;
      // if (camera.radius ===0) {
      //   scene.clearColor = new Color4(1,1,1,1 )
      // } {
      //   scene.clearColor = new Color4(0,0,0,1)
      // }
    });

    camera.zoomOn([mesh!]);
    camera.radius = 1000;
    camera.maxZ = 5000;
    camera.minZ = 0.1;
    camera.lowerRadiusLimit = 0;
    camera.fov = 0.2;
    // camera.fovMode = Camera.FOVMODE_HORIZONTAL_FIXED
  }

  function createSkyBox() {
    const skybox = MeshBuilder.CreateBox('universe', { size: 3000.0 }, scene);

    const skyboxMaterial = new StandardMaterial('universe', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture(
      'textures/universe/universe',
      scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    return skybox;
  }
}
