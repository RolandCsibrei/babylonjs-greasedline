import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/Info',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/BasicInfoPage.vue'),
      },
    ],
  },
  {
    path: '/Alpha',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/AlphaPage.vue'),
      },
    ],
  },
  {
    path: '/Basic',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/BasicPage.vue'),
      },
    ],
  },
  {
    path: '/BasicColors',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/SingleColorPage.vue'),
      },
    ],
  },
  {
    path: '/Caps',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/CapsPage.vue'),
      },
    ],
  },
  {
    path: '/ColorDistribution',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/ColorDistributionPage.vue'),
      },
    ],
  },
  {
    path: '/Colors',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/ColorsPage.vue'),
      },
    ],
  },
  {
    path: '/Dash',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/DashPage.vue'),
      },
    ],
  },
  {
    path: '/Glow',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/GlowPage.vue'),
      },
    ],
  },
  {
    path: '/Instance',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/InstancePage.vue'),
      },
    ],
  },
  {
    path: '/Lazy',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/LazyPage.vue'),
      },
    ],
  },
  {
    path: '/Offsets',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/OffsetsPage.vue'),
      },
    ],
  },
  {
    path: '/Texture',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/TexturePage.vue'),
      },
    ],
  },
  {
    path: '/Transformations',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/TransformationsPage.vue'),
      },
    ],
  },
  {
    path: '/UvColors',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/UvColorsPage.vue'),
      },
    ],
  },
  {
    path: '/WidthColorDistribution',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/WidthColorDistributionPage.vue'),
      },
    ],
  },
  {
    path: '/WidthDistribution',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/WidthDistributionPage.vue'),
      },
    ],
  },
  {
    path: '/Raycast',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/RaycastPage.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/IntroLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/IntroPage.vue'),
      },
    ],
  },

  {
    path: '/pbr/Info',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/pbr/PBRBasicInfoPage.vue'),
      },
    ],
  },
  {
    path: '/pbr/Basic',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/pbr/PBRBasicPage.vue'),
      },
    ],
  },

  //

  {
    path: '/demos/Info',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/demos/InfoPage.vue'),
      },
    ],
  },
  {
    path: '/demos/WaveAnalyzer',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/demos/AnalyzerPage.vue'),
      },
    ],
  },
  {
    path: '/demos/GeometryDrawBlenderMonkey',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/demos/GMP.vue'),
      },
    ],
  },
  {
    path: '/demos/CurveDraw',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/demos/CurveDrawPage.vue'),
      },
    ],
  },
  {
    path: '/demos/StarWars',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/demos/StarWarsPage.vue'),
      },
    ],
  },
  {
    path: '/demos/FlyingLines',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/demos/FlyingLinesPage.vue'),
      },
    ],
  },
  {
    path: '/demos/BeautyCharts',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/demos/BeautyChartsPage.vue'),
      },
    ],
  },
  {
    path: '/demos/DiscoLasers',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/demos/DiscoLasersPage.vue'),
      },
    ],
  },

  //

  {
    path: '/tools/Try',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/tools/TryPage.vue'),
      },
    ],
  },
];

routes.push(
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  }
);
export default routes;
