import { GreasedLinePBRMaterial } from './../GreasedLinePBRMaterial';
import { scene, camera } from './babylon';
import {
  ColorDistribution,
  ColorSamplingMode,
  GreasedLineBuilder,
} from './../GraesedLineBuilder';
import {
  ArcRotateCamera,
  Color3,
  CubeTexture,
  Engine,
  GlowLayer,
  Mesh,
  RawTexture,
  Scene,
  SceneLoader,
  Texture,
  Vector2,
  Vector3,
  VertexBuffer,
} from '@babylonjs/core';
import { GreasedLine, WidthsDistribution } from './../GreasedLine';
import { getArrowCap, getCircleCap, segmentize } from '../lineUtils';
import { GreasedLineMaterial } from '../GreasedLineMaterial';

function makeLine(
  scene: Scene,
  points: Float32Array | Vector3[] | Vector3[][],
  color: Color3
) {
  const engine = scene.getEngine();
  const mat = new GreasedLineMaterial('meshline', scene, {
    useMap: false,
    color,
    opacity: 1,
    resolution: new Vector2(engine.getRenderWidth(), engine.getRenderHeight()),
    sizeAttenuation: false,
    width: 10,
  });
  const ml = new GreasedLine('meshline', scene, {
    points,
    // widthCallback: (pw) => pw * 6,
  });
  ml.material = mat;
  return ml;
}

export function test(scene: Scene) {
  let line = new Float32Array(600);
  for (var j = 0; j < 200 * 3; j += 3) {
    line[j] = -30 + 0.1 * j;
    line[j + 1] = 5 * Math.sin(0.01 * j);
    line[j + 2] = -20;
  }
  makeLine(scene, line, new Color3(1, 0, 0));

  line = new Float32Array(600);
  for (var j = 0; j < 200 * 3; j += 3) {
    line[j] = -30 + 0.1 * j;
    line[j + 1] = 5 * Math.cos(0.02 * j);
    line[j + 2] = -10;
  }
  makeLine(scene, line, new Color3(0, 1, 0));

  line = new Float32Array(600);
  for (var j = 0; j < 200 * 3; j += 3) {
    line[j] = -30 + 0.1 * j;
    line[j + 1] = 5 * Math.sin(0.01 * j) * Math.cos(0.005 * j);
    line[j + 2] = 0;
  }
  makeLine(scene, line, new Color3(0, 0, 1));

  line = new Float32Array(600);
  for (var j = 0; j < 200 * 3; j += 3) {
    line[j] = -30 + 0.1 * j;
    line[j + 1] = 0.02 * j + 5 * Math.sin(0.01 * j) * Math.cos(0.005 * j);
    line[j + 2] = 10;
  }
  makeLine(scene, line, new Color3(1, 0, 1));

  line = new Float32Array(600);
  for (var j = 0; j < 200 * 3; j += 3) {
    line[j] = -30 + 0.1 * j;
    line[j + 1] = Math.exp(0.005 * j);
    line[j + 2] = 20;
  }
  const meshLine = makeLine(scene, line, new Color3(1, 1, 0));

  camera.zoomOn([meshLine]);
}

export function testLineBuilderColorDistribution(
  scene: Scene,
  camera: ArcRotateCamera
) {
  // const line1 = segmentize([new Vector3(-5,0,0), new Vector3(5,0,0)], 1)
  const line1 =
    // segmentize(
    // [
    [
      new Vector3(0, 0, 0),
      new Vector3(100, 0, 0),
      new Vector3(100, 100, 0),
      new Vector3(200, 100, 0),
      new Vector3(200, 200, 0),
    ];
  // [new Vector3(0,0,0), new Vector3(10,10,100)]
  // ]
  // ,10
  // )
  const colors1 = [
    new Color3(1, 0, 0),
    new Color3(0, 1, 0),
    new Color3(0, 0, 1),
    new Color3(1, 1, 1),
  ];
  const widths1 = [0, 0, 4, 4]; //.reverse()

  const mesh = GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      points: line1,
      widths: widths1,
      widthsDistribution: WidthsDistribution.Repeat,
      colors: colors1,
      useColors: true,
      colorsSamplingMode: ColorSamplingMode.Smooth,
      colorDistribution: ColorDistribution.Start,
    },
    scene
  );

  const line2 = [
    new Vector3(0, 0, 40),
    new Vector3(20, 0, 40),
    new Vector3(20, 0, 40),
  ];
  const segm = segmentize([new Vector3(20, 0, 40), new Vector3(200, 0, 40)], 4);
  const colors2 = [new Color3(0, 0, 1), new Color3(0, 1, 0)];
  const widths2 = [0, 0, 20, 20, 4, 4];

  GreasedLineBuilder.CreateGreasedLine(
    '',
    {
      points: line2.concat(segm),
      widths: widths2,
      instance: mesh,
      widthsDistribution: WidthsDistribution.Start,
      colors: colors2,
      color: Color3.Black(),
      colorDistribution: ColorDistribution.Repeat,
      useColors: true,
      // colorDistribution: ColorDistribution.None
    },
    scene
  );

  const line3 = [
    new Vector3(0, 0, 0),
    new Vector3(100, 100, 0),
    new Vector3(200, 0, 0),
  ];
  const colors3 = [new Color3(1, 0, 1), new Color3(1, 1, 0)];
  const widths3 = [0, 0, 20, 20];

  GreasedLineBuilder.CreateGreasedLine(
    '',
    {
      points: line3,
      widths: widths3,
      instance: mesh,
      widthsDistribution: WidthsDistribution.Start,
      colors: colors3,
      color: Color3.Black(),
      colorDistribution: ColorDistribution.Start,
      useColors: true,
    },
    scene
  );

  // const glow = new GlowLayer('glow', scene, {
  //   blurKernelSize: 64,
  // })
  // glow.intensity = 2

  // glow.referenceMeshToUseItsOwnMaterial(mesh)

  camera.zoomOn([mesh]);
  camera.radius += 10;
  camera.maxZ = 1000;
  camera.minZ = 0.1;
}

export function testLineBuilderColorDistribution2(
  scene: Scene,
  camera: ArcRotateCamera
) {
  const line1 = [
    new Vector3(0, 0, 0),
    new Vector3(50, 0, 0),
    new Vector3(100, 0, 0),
  ];
  const colors1 = [new Color3(1, 0, 0), new Color3(1, 0, 1)];
  const widths1 = [4, 4, 4, 4]; //.reverse()

  const mesh = GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      points: line1,
      widths: widths1,
      widthsDistribution: WidthsDistribution.Repeat,
      colors: colors1,
      useColors: true,
      colorsSamplingMode: ColorSamplingMode.Smooth,
      colorDistribution: ColorDistribution.Start,
    },
    scene
  );

  const line2 = [
    new Vector3(0, 40, 0),
    new Vector3(50, 40, 0),
    new Vector3(100, 40, 0),
  ];
  const colors2 = [new Color3(1, 1, 0), new Color3(0, 1, 0)];
  const widths2 = [8, 8, 4, 4];

  GreasedLineBuilder.CreateGreasedLine(
    '',
    {
      points: line2,
      widths: widths2,
      instance: mesh,
      widthsDistribution: WidthsDistribution.Start,
      colors: colors2,
      color: Color3.Black(),
      colorDistribution: ColorDistribution.Repeat,
      useColors: true,
    },
    scene
  );

  const line3 = [
    new Vector3(0, 80, 0),
    new Vector3(50, 80, 0),
    new Vector3(100, 80, 0),
  ];
  const colors3 = [new Color3(1, 0, 0), new Color3(0, 1, 0)];
  const widths3 = [0, 0, 20, 20];

  GreasedLineBuilder.CreateGreasedLine(
    '',
    {
      points: line3,
      widths: widths3,
      instance: mesh,
      widthsDistribution: WidthsDistribution.Start,
      colors: colors3,
      color: Color3.Black(),
      colorDistribution: ColorDistribution.Start,
      useColors: true,
    },
    scene
  );

  // const glow = new GlowLayer('glow', scene, {
  //   blurKernelSize: 64,
  // })
  // glow.intensity = 2

  // glow.referenceMeshToUseItsOwnMaterial(mesh)

  camera.zoomOn([mesh]);
  camera.radius += 10;
  camera.maxZ = 1000;
  camera.minZ = 0.1;
}

export async function testMultiArrayDraw(
  scene: Scene,
  camera: ArcRotateCamera
) {
  const line = [
    [new Vector3(0, 0, 0), new Vector3(10, 0, 0)],
    [new Vector3(0, 10, 0), new Vector3(10, 10, 0)],
  ];

  const l = GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      lazy: true,
      points: line,
      useColors: true,
      widths: [40, 40, 20, 20, 0, 0, 3, 3],
      colors: [new Color3(1, 0, 0), new Color3(1, 1, 1), new Color3(0, 1, 0)],
    },
    scene
  );

  const line2 = [
    [new Vector3(0, 3, 0), new Vector3(10, 3, 0)],
    [new Vector3(0, 5, 0), new Vector3(10, 5, 0)],
  ];

  GreasedLineBuilder.CreateGreasedLine(
    '',
    {
      lazy: true,
      instance: l,
      widths: [10, 10, 12, 12, 10, 10, 10, 10],
      points: line2,
      useColors: true,
      colors: [new Color3(0, 0, 1), new Color3(0, 1, 1), new Color3(1, 1, 0)],
    },
    scene
  );

  l.updateLazyLine();

  camera.zoomOn([l]);
  camera.radius += 10;
  camera.maxZ = 1000;
  camera.minZ = 0.1;
}

export async function testGeometryDraw(scene: Scene, camera: ArcRotateCamera) {
  const loaded = await SceneLoader.AppendAsync('/assets/', 'monkey.glb');
  // const loaded = await SceneLoader.AppendAsync('/assets/', 'cube.glb')
  const root = loaded.meshes[0];

  root.setEnabled(false);
  const yLimit = 1;

  const points: Vector3[][] = [];
  const instance: GreasedLine | undefined = undefined;
  const meshes = root.getChildMeshes(false);
  meshes.forEach((m) => {
    const vertices = m.getVerticesData(VertexBuffer.PositionKind);
    const indices = m.getIndices();
    if (vertices && indices) {
      for (let i = 0, ii = 0; i < indices.length; i++) {
        const vi1 = indices[ii++] * 3;
        const vi2 = indices[ii++] * 3;
        const vi3 = indices[ii++] * 3;

        const p1 = new Vector3(
          vertices[vi1],
          vertices[vi1 + 1],
          vertices[vi1 + 2]
        );
        const p2 = new Vector3(
          vertices[vi2],
          vertices[vi2 + 1],
          vertices[vi2 + 2]
        );
        const p3 = new Vector3(
          vertices[vi3],
          vertices[vi3 + 1],
          vertices[vi3 + 2]
        );

        if (p1.length() + p2.length() + p3.length() === 0) {
          continue;
        }
        points.push([p1, p2, p3, p1]);
      }
    }
  });

  const colors1 = [new Color3(1, 0, 0), new Color3(1, 0, 1)];
  const widths1 = [3, 3]; //.reverse()

  const mesh = GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      points,
      width: 4,
      widths: widths1,
      widthsDistribution: WidthsDistribution.Repeat,
      // colors: colors1,
      // useColors: true,
      color: Color3.Red(),
      colorsSamplingMode: ColorSamplingMode.Smooth,
      colorDistribution: ColorDistribution.Start,
    },
    scene
  );

  const glow = new GlowLayer('glow', scene, {
    blurKernelSize: 128,
  });
  glow.intensity = 1.2;

  // glow.referenceMeshToUseItsOwnMaterial(mesh)

  camera.zoomOn([root]);
  camera.radius += 10;
  camera.maxZ = 1000;
  camera.minZ = 0.1;
}

export async function testGeometryDrawCurves(
  scene: Scene,
  camera: ArcRotateCamera
) {
  const loaded = await SceneLoader.AppendAsync(
    '/assets/',
    'Fordt_GT_go_crazy-lines.glb'
  );
  // const loaded = await SceneLoader.AppendAsync('/assets/', 'curve-test.glb')
  const root = loaded.meshes[0];

  root.setEnabled(false);
  const yLimit = 1;

  const points: Vector3[][] = [];
  const instance: GreasedLine | undefined = undefined;
  const meshes = root.getChildMeshes(false);
  meshes.forEach((m) => {
    const vertices = m.getVerticesData(VertexBuffer.PositionKind);
    const indices = m.getIndices();
    if (vertices && indices) {
      for (let i = 0, ii = 0; i < indices.length; i++) {
        const vi1 = indices[ii++] * 3;
        const vi2 = indices[ii++] * 3;
        const vi3 = indices[ii++] * 3;

        const p1 = new Vector3(
          vertices[vi1],
          vertices[vi1 + 1],
          vertices[vi1 + 2]
        );
        const p2 = new Vector3(
          vertices[vi2],
          vertices[vi2 + 1],
          vertices[vi2 + 2]
        );
        const p3 = new Vector3(
          vertices[vi3],
          vertices[vi3 + 1],
          vertices[vi3 + 2]
        );

        if (p1.length() + p2.length() + p3.length() === 0) {
          continue;
        }
        // const s = p1.y + p2.y + p3.y
        // if (s >= 2 * 4) {
        //   continue
        // }

        const ss = [];
        if (p1.y < yLimit) {
          ss.push(p1);
        }

        if (p2.y < yLimit) {
          ss.push(p2);
        }

        if (p3.y < yLimit) {
          ss.push(p3);
        }

        if (ss.length > 2) {
          debugger;
        }

        console.log(ss);
        points.push(ss);
      }
    }
  });

  const colors1 = [new Color3(1, 0, 1), new Color3(1, 0, 1)];
  const widths1 = [1, 1]; //.reverse()

  const mesh = GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      points,
      width: 4,
      widths: widths1,
      widthsDistribution: WidthsDistribution.Repeat,
      color: Color3.Yellow(),
    },
    scene
  );

  let dashOffset = 0;
  const mat = mesh.material as GreasedLineMaterial;
  scene.onBeforeRenderObservable.add(() => {
    mat.setDashOffset(dashOffset);

    dashOffset += 0.005 * scene.getAnimationRatio();
  });

  const glow = new GlowLayer('glow', scene, {
    blurKernelSize: 128,
  });
  glow.intensity = 1.2;

  glow.referenceMeshToUseItsOwnMaterial(mesh);

  camera.zoomOn([root]);
  camera.radius += 10;
  camera.maxZ = 1000;
  camera.minZ = 0.1;
}

export function testCustomColorMap(scene: Scene, camera: ArcRotateCamera) {
  const colorMap = GreasedLineBuilder.TextureFromColors(
    'star',
    GreasedLineBuilder.NormalizeColorTable(
      10,
      [Color3.Yellow(), Color3.Blue()],
      ColorDistribution.Repeat
    ),
    scene
    // Texture.NEAREST_LINEAR
  );
  colorMap.wrapU = Texture.WRAP_ADDRESSMODE;
  colorMap.wrapV = Texture.WRAP_ADDRESSMODE;
  const alphaMap = GreasedLineBuilder.TextureFromColors(
    'star',
    [Color3.Black(), Color3.White()],
    scene,
    ColorSamplingMode.Smooth
  );
  const line = segmentize(
    [new Vector3(0, 0, 0), new Vector3(100, 0, 0), new Vector3(100, 100, 0)],
    0.1
  );
  const mesh = GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      updatable: true,

      points: line,

      width: 40,
      // widths,

      useMap: true,
      map: colorMap,

      widthsDistribution: WidthsDistribution.Start,
    },
    scene
  );

  const uvOffset = new Vector2(0, 0);
  const mat = mesh.material as GreasedLineMaterial;
  scene.onBeforeRenderObservable.add(() => {
    mat.setUvOffset(uvOffset);
    uvOffset.x += 0.001 * scene.getAnimationRatio();
  });

  camera.zoomOn([mesh]);
  camera.maxZ = 5000;
  camera.minZ = 0.1;
  camera.lowerRadiusLimit = 0;
}

export function testLineCaps(scene: Scene, camera: ArcRotateCamera) {
  const line = [new Vector3(0, 0, 0), new Vector3(100, 0, 0)];
  const colors = [new Color3(1, 0, 0)];

  const mesh = GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      points: line,
      width: 80,
      widthsDistribution: WidthsDistribution.Start,
      useColors: true,
      colors,
      colorDistribution: ColorDistribution.Repeat,
    },
    scene
  );

  const cap1 = getCircleCap(new Vector3(0, 0, 0), Vector3.Left(), 4, 4, 8);
  const colorsCap = [new Color3(1, 0, 0)];
  GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      points: cap1.points,
      widths: cap1.widths,
      useColors: true,
      colors: colorsCap,
      widthsDistribution: WidthsDistribution.Start,
      colorDistribution: ColorDistribution.Repeat,
    },
    scene
  );

  const cap2 = getCircleCap(new Vector3(100, 0, 0), Vector3.Right(), 4, 4, 8);
  GreasedLineBuilder.CreateGreasedLine(
    'lines',
    {
      points: cap2.points,
      widths: cap2.widths,
      useColors: true,
      colors: colorsCap,
      widthsDistribution: WidthsDistribution.Start,
      colorDistribution: ColorDistribution.Repeat,
    },
    scene
  );

  // const { points, widths } = getArrowCap(new Vector3(-4,0,0), Vector3.Right(), 4, 8, 8)
  // GreasedLineBuilder.CreateGreasedLine(
  //   'lines',
  //   {
  //     points,
  //     widths,
  //     widthsDistribution: WidthsDistribution.Start,
  //   },
  //   scene,
  // )

  camera.zoomOn([mesh]);
  camera.radius += 50;
  camera.maxZ = 5000;
  camera.minZ = 0.1;
  camera.lowerRadiusLimit = 0;
}
