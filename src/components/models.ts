import { LinkProps } from 'src/components/NavLinks.vue';
export const basicLinks: LinkProps[] = [
  {
    title: 'Intro to GreasedLineSystem',
    caption: 'Basic information you need to know',
    link: 'Info',
  },
  {
    title: 'Basic Lines',
    caption: 'Drawing basic lines with various widths',
    link: 'Basic',
  },
  {
    title: 'Transformations',
    caption: 'Position, Rotation, Scale support',
    link: 'Transformations',
  },
  {
    title: 'Basic Colors',
    caption: 'Drawing lines in different colors',
    link: 'BasicColors',
  },
  {
    title: 'Segment Colors',
    caption: 'Drawing parts of a line in different colors',
    link: 'Colors',
  },
  {
    title: 'Color Distribution',
    caption: 'Automatic color distribution along the line',
    link: 'ColorDistribution',
  },
  {
    title: 'Width Distribution',
    caption: 'Automatic width distribution along the line',
    link: 'WidthDistribution',
  },
  {
    title: 'Color & Width Distribution',
    caption: 'Color & Width distribution',
    link: 'WidthColorDistribution',
  },
  {
    title: 'Dash',
    caption: 'Dashing',
    link: 'Dash',
  },
  {
    title: 'Instances',
    caption: 'Adding lines to existing line',
    link: 'Instance',
  },
  {
    title: 'Lazy',
    caption: 'Lazy initialization (takes a moment to render )',
    link: 'Lazy',
  },
  {
    title: 'Textured lines',
    caption: 'Using textures',
    link: 'Texture',
  },
  {
    title: 'Transparent background on textured lines',
    caption: 'Using alpha textures',
    link: 'Alpha',
  },
  {
    title: 'Offsets',
    caption: 'Moving line points',
    link: 'Offsets',
  },
  {
    title: 'UvColors',
    caption: 'Using UV to colorize the line',
    link: 'UvColors',
  },
  {
    title: 'Glow',
    caption: 'Glowing lines',
    link: 'Glow',
  },
  {
    title: 'Caps',
    caption: 'Create capped lines, arrows, ...',
    link: 'Caps',
  },
  {
    title: 'Blend mode',
    caption: 'Coming soon...',
    link: 'Blend',
  },
  {
    title: 'Custom UVs',
    caption: 'Coming soon...',
    link: 'CustomUV',
  },
  {
    title: 'Animated',
    caption: 'Coming soon...',
    link: 'Animated',
  },
];

//

export const pbrLinks: LinkProps[] = [
  {
    title: 'Intro to PBR',
    caption: 'Basic information you need to know',
    link: 'pbr/Info',
  },
  {
    title: 'PBR Line',
    caption: 'Simple PBR line',
    link: 'pbr/Basic',
  },
];

//

export const toolsLinks: LinkProps[] = [
  {
    title: 'Intro to Tools',
    caption: 'Basic information you need to know',
    link: 'tools/Try',
  },
];

//

export const demoLinks: LinkProps[] = [
  // {
  //   title: 'Intro to Demos',
  //   caption: 'Basic information you need to know',
  //   link: 'demos/Info',
  // },
  {
    title: 'Wave Analyzer',
    caption: 'Using line widths to create a wave analyzer',
    link: 'demos/WaveAnalyzer',
  },
  {
    title: 'Geometry Draw - Blender Monkey',
    caption: 'Draw wireframe of a mesh',
    link: 'demos/GeometryDrawBlenderMonkey',
  },
  {
    title: 'Curve Draw - Blender',
    caption: 'Draw curves from Blender',
    link: 'demos/CurveDraw',
  },
  {
    title: 'Star Wars light speed',
    caption: 'Light speed effect seen on Star Wars (kinda :D)',
    link: 'demos/StarWars',
  },
  {
    title: 'GitHub style Lines flying around Earth',
    caption: 'Lines flying from point to point around the globe',
    link: 'demos/FlyingLines',
  },
  {
    title: 'Beauty Charts - coming soon',
    caption: 'Animated cool charts',
    link: 'demos/BeautyCharts',
  },
  {
    title: 'Disco Lasers - coming soon',
    caption: 'D I S C O',
    link: 'demos/DiscoLasers',
  },
];
