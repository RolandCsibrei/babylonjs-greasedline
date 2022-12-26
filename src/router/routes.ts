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
    path: '/',
    component: () => import('layouts/IntroLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/IntroPage.vue'),
      },
    ],
  },

  //
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
