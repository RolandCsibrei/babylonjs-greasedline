import { GreasedLineMaterial } from './../GreasedLineMaterial';
import { GreasedLineBuilder } from './../GraesedLineBuilder';
import {
  ArcRotateCamera,
  Color3,
  Color4,
  CubeTexture,
  GlowLayer,
  MeshBuilder,
  Scalar,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
} from '@babylonjs/core';
import { GreasedLine, WidthsDistribution } from './../GreasedLine';

export function lightspeed(scene: Scene, camera: ArcRotateCamera) {
  createSkyBox();

  const count = 1000;

  const minRadius = 6;
  const maxRadius = 200;

  const minZ = 0;
  const maxZ = 100;

  const minLength = 2;
  const maxLength = 40;

  // const line1 = []
  let mesh: GreasedLine | undefined = undefined;
  for (let i = 0; i < count; i++) {
    const radius = Scalar.RandomRange(minRadius, maxRadius);
    const a = Scalar.RandomRange(0, Math.PI * 2);
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    const z = Scalar.RandomRange(minZ, maxZ);
    const length = Scalar.RandomRange(minLength, maxLength);

    const line = [new Vector3(x, y, z), new Vector3(x, y, z + length)];

    const width =
      Math.random() < 0.95
        ? Scalar.RandomRange(1, 6)
        : Scalar.RandomRange(36, 40);

    const color = Math.random() < 0.05 ? Color3.Blue() : Color3.White();
    const colors = [color];
    const widths = [width, width]; //.reverse()

    mesh = GreasedLineBuilder.CreateGreasedLine(
      'lines',
      {
        lazy: true,

        points: line,
        instance: mesh,

        width: 1,
        widths,

        useColors: true,
        colors,

        widthsDistribution: WidthsDistribution.Repeat,
        visibility: 0.03,
      },
      scene
    );
  }

  if (mesh) {
    mesh.updateLazyLine();

    // mesh.scaling.z = 0.1

    const glow = new GlowLayer('glow', scene, {
      blurKernelSize: 64,
    });
    glow.intensity = 6;

    glow.referenceMeshToUseItsOwnMaterial(mesh!);

    scene.autoClear = false;
    const mat = mesh.material as GreasedLineMaterial;

    let visibility = 0.05;

    const scale = new Vector3(1, 1, 1);
    scene.onKeyboardObservable.addOnce(() => {
      console.log('k');
      scene.onBeforeRenderObservable.add(() => {
        // glow.intensity = 1 / (camera.radius / 80)
        mat.setVisibility(visibility);

        visibility += 0.01 * scene.getAnimationRatio();

        mesh!.scaling = scale;

        scale.x *= 1.002;
        scale.y *= 1.002;
        scale.z *= 1.002;
        // if (camera.radius ===0) {
        //   scene.clearColor = new Color4(1,1,1,1 )
        // } {
        //   scene.clearColor = new Color4(0,0,0,1)
        // }
      });
    });

    camera.zoomOn([mesh!]);
    camera.radius = 240;
    camera.maxZ = 1500;
    camera.minZ = 0.1;
    camera.lowerRadiusLimit = 0;
  }

  function createSkyBox() {
    const skybox = MeshBuilder.CreateBox('universe', { size: 1000.0 }, scene);

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
