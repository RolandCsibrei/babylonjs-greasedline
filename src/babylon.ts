import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  CubeTexture,
  Color4,
  ImageProcessingConfiguration,
  AxesViewer,
  MeshBuilder,
  Mesh,
  HemisphericLight,
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import '@babylonjs/inspector';

export const init = (
  canvas: HTMLCanvasElement,
  createGrid = true,
  pbr = false
) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const engine = createEngine(canvas);
  const scene = createScene(engine);
  const camera = createArcRotateCamera(canvas, scene);

  // new AxesViewer(scene, 1);

  let grid;
  if (createGrid) {
    grid = createGridPlane(scene);
  }

  if (pbr) {
    // createPBRSkybox(scene);
    createHemisphericlight(scene);

    // const hdrTexture = new CubeTexture('/textures/environment.dds', scene);
    // scene.createDefaultSkybox(hdrTexture, true, 10000);
  }
  engine.runRenderLoop(() => {
    scene.render();
  });

  return { engine, scene, camera, grid };
};

export const createHemisphericlight = (scene: Scene) => {
  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
  return light;
};

export const createEngine = (canvas: HTMLCanvasElement) => {
  const engine = new Engine(canvas, true, {}, true);

  window.addEventListener('resize', () => {
    engine.resize();
  });

  return engine;
};

export const createScene = (engine: Engine) => {
  const scene = new Scene(engine);

  scene.clearColor = new Color4(0, 0, 0, 1);
  scene.autoClear = true;
  // scene.autoClearDepthAndStencil = true

  // optimize scene for opaque background

  // setup ACES tone mapping for more natural colors
  // scene.imageProcessingConfiguration.toneMappingEnabled = true
  // scene.imageProcessingConfiguration.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES

  // show the inspector when pressing shift + alt + I
  // let axesViewer: AxesViewer;
  scene.onKeyboardObservable.add(({ event }) => {
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyI') {
      if (scene.debugLayer.isVisible()) {
        scene.debugLayer.hide();
        // axesViewer?.dispose();
      } else {
        scene.debugLayer.show({
          // embedMode: true,
        });
        // axesViewer = new AxesViewer(scene, 2);

        const snippets = document.getElementsByClassName('language-typescript');
        for (let i = 0; i < snippets.length; i++) {
          const el = snippets.item(i) as any;
          if (el) {
            el.style.display = 'none';
          }
        }
      }
    }
  });

  return scene;
};

export const createArcRotateCamera = (
  canvas: HTMLCanvasElement,
  scene: Scene
) => {
  const startAlpha = -Math.PI / 2;
  const startBeta = Math.PI / 2;
  const startRadius = 100;
  const startPosition = new Vector3(0, 0, 0);
  const camera = new ArcRotateCamera(
    'camera',
    startAlpha,
    startBeta,
    startRadius,
    startPosition,
    scene,
    true
  );
  camera.attachControl(canvas, false);

  camera.lowerBetaLimit = -2 * Math.PI;
  camera.upperBetaLimit = 2 * Math.PI;

  camera.lowerRadiusLimit = 2;
  camera.upperRadiusLimit = 500;
  camera.minZ = 0.01;
  camera.maxZ = 20000;

  camera.panningSensibility = 1000;

  return camera;
};

export const createPBRSkybox = (scene: Scene) => {
  const environmentTexture = CubeTexture.CreateFromPrefilteredData(
    'environments/environment-specular.env',
    scene
  );

  const skyboxMesh = scene.createDefaultSkybox(
    environmentTexture,
    true,
    2000,
    0.5,
    true
  );

  return skyboxMesh;
};

export const createPBRSkybox2 = (scene: Scene) => {
  scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(
    '/environments/environment.dds',
    scene
  );

  const skyboxMesh = scene.createDefaultSkybox(scene.environmentTexture);

  return skyboxMesh;
};

export const createGridPlane = (scene: Scene) => {
  const grid = MeshBuilder.CreatePlane('grid', { size: 40 });
  const mat = new GridMaterial('grid', scene);
  grid.position.z = 0.01;
  grid.visibility = 0.4;
  grid.billboardMode = Mesh.BILLBOARDMODE_ALL;
  grid.material = mat;
};
