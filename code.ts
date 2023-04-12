figma.showUI(__html__);
// This shows the HTML page in "ui.html".

const GetDate = async () => {
  const result = await fetch(
    'https://60df-193-95-81-57.ngrok-free.app/imagine',
    {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'generate 3 home page designs for now',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const json = await result.json();
  return json.data;
};

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'actionGenerate') {
    // get data
    // const data = await GetDate();
    // current page
    const data = obj;
    const currentPage = figma.currentPage;
    const Container = figma.createFrame();
    Container.name = 'Container';
    Container.layoutMode = 'HORIZONTAL';
    Container.counterAxisSizingMode = 'AUTO';
    Container.primaryAxisSizingMode = 'AUTO';
    Container.clipsContent = false;
    Container.itemSpacing = 100;
    Container.fills = [
      { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 },
    ];

    const VARIATIONS = CreateVariations(data.variations);
    const PALETTES = CreatePalettes(data.colors);
    const FONTS = await CreateFonts(data.fonts);

    SelectTextNodes(VARIATIONS);

    Container.appendChild(PALETTES);
    Container.appendChild(FONTS);
    Container.appendChild(VARIATIONS);
    currentPage.appendChild(Container);

    figma.closePlugin();
  }

  if (msg.type === 'actionExit') {
    figma.closePlugin();
  }
};

const SelectTextNodes = (node: any) => {
  if (node.type === 'TEXT') {
    figma.currentPage.selection = [node];
  }
  if (node.children) {
    node.children.forEach((child: any) => {
      SelectTextNodes(child);
    });
  }
};

const CreateFonts = async (fonts: string[][]) => {
  const FONTS = figma.createFrame();
  FONTS.name = 'Fonts';
  FONTS.layoutMode = 'HORIZONTAL';
  FONTS.counterAxisSizingMode = 'AUTO';
  FONTS.primaryAxisSizingMode = 'AUTO';
  FONTS.clipsContent = false;
  FONTS.itemSpacing = 100;
  FONTS.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];

  await fonts.forEach(async (font: string[], index: number) => {
    const fontFrame = figma.createFrame();
    fontFrame.name = 'Font ' + index;
    if (index === 0) fontFrame.name = 'Primary';
    if (index === 1) fontFrame.name = 'Secondary';
    if (index === 2) fontFrame.name = 'Tertiary';
    fontFrame.layoutMode = 'VERTICAL';
    fontFrame.counterAxisSizingMode = 'AUTO';
    fontFrame.primaryAxisSizingMode = 'AUTO';
    fontFrame.clipsContent = false;
    fontFrame.itemSpacing = 32;
    fontFrame.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
    await font.forEach(async (font: string, index: number) => {
      let name = font;
      if (index === 0) name = 'Body';
      if (index === 1) name = 'Heading';
      const __font = await createFont({ font, name });
      console.log('font', __font);
      fontFrame.appendChild(__font);
    });
    FONTS.appendChild(fontFrame);
  });
  return FONTS;
};

const CreatePalettes = (palettes: string[][]) => {
  // create palette
  const PALETTES = figma.createFrame();
  PALETTES.name = 'Palettes';
  PALETTES.layoutMode = 'HORIZONTAL';
  PALETTES.counterAxisSizingMode = 'AUTO';
  PALETTES.primaryAxisSizingMode = 'AUTO';
  PALETTES.clipsContent = false;
  PALETTES.itemSpacing = 100;
  PALETTES.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];

  palettes.forEach((palette: string[], index: number) => {
    const pallettesFrame = figma.createFrame();
    pallettesFrame.name = 'Palette ' + index;
    if (index === 0) pallettesFrame.name = 'Primary';
    if (index === 1) pallettesFrame.name = 'Secondary';
    if (index === 2) pallettesFrame.name = 'Tertiary';

    pallettesFrame.layoutMode = 'HORIZONTAL';
    pallettesFrame.counterAxisSizingMode = 'AUTO';
    pallettesFrame.primaryAxisSizingMode = 'AUTO';
    pallettesFrame.clipsContent = false;
    pallettesFrame.itemSpacing = 32;
    palette.forEach((color: string) => {
      const __palette = createPalette(color);
      pallettesFrame.appendChild(__palette);
    });
    PALETTES.appendChild(pallettesFrame);
  });
  return PALETTES;
};

const CreateVariations = (variations: any) => {
  // create random design
  const VARIATIONS = figma.createFrame();
  VARIATIONS.name = 'Variations';
  VARIATIONS.layoutMode = 'HORIZONTAL';
  VARIATIONS.counterAxisSizingMode = 'AUTO';
  VARIATIONS.primaryAxisSizingMode = 'AUTO';
  VARIATIONS.clipsContent = false;
  VARIATIONS.itemSpacing = 100;
  VARIATIONS.fills = [
    { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 },
  ];
  variations.forEach((variation: any, index: number) => {
    const __variation = CreateVariation(variation, index + 1);
    VARIATIONS.appendChild(__variation);
  });
  return VARIATIONS;
};

const CreateVariation = (variation: any, index: number) => {
  const VARIATION = figma.createFrame();
  VARIATION.name = 'Variation ' + index;
  VARIATION.layoutMode = 'VERTICAL';
  VARIATION.counterAxisSizingMode = 'AUTO';
  VARIATION.primaryAxisSizingMode = 'AUTO';
  VARIATION.clipsContent = false;
  VARIATION.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
  // position

  // size
  variation.forEach((component: string[]) => {
    const id = component[2];
    const name = component[0];
    const COMPONENT_INSTANCE_CLONE = createComponent(id);
    if (!COMPONENT_INSTANCE_CLONE) return;
    COMPONENT_INSTANCE_CLONE.name = name;
    VARIATION.appendChild(COMPONENT_INSTANCE_CLONE);
  });
  VARIATION.x = (100 + VARIATION.width) * index;
  return VARIATION;
};

const createComponent = (id: string) => {
  const COMPONENT = figma.getNodeById(id);
  const COMPONENT_INSTANCE = COMPONENT?.parent?.children?.find(
    (child) => child.id === id
  );
  if (!COMPONENT_INSTANCE) return;
  // create component instance
  const COMPONENT_INSTANCE_CLONE = COMPONENT_INSTANCE.clone();

  return COMPONENT_INSTANCE_CLONE as SceneNode;
};

const createPalette = (palette: string) => {
  const paletteFrame = figma.createFrame();
  // add layout
  paletteFrame.layoutMode = 'VERTICAL';
  paletteFrame.paddingLeft = 64;
  paletteFrame.paddingRight = 64;
  paletteFrame.paddingTop = 64;
  paletteFrame.paddingBottom = 64;

  paletteFrame.itemSpacing = 32;
  paletteFrame.counterAxisSizingMode = 'AUTO';
  paletteFrame.primaryAxisSizingMode = 'AUTO';

  // Generate 10 tints
  for (let i = 0; i < 10; i++) {
    const tint = figma.createEllipse();
    tint.name = 'Tint ' + (100 - i * 10);
    tint.resize(100, 100);

    const rgb = hexToRgb(palette) as { r: number; g: number; b: number };
    tint.fills = [
      {
        type: 'SOLID',
        color: {
          r: (rgb?.r / 255) as number,
          g: (rgb?.g / 255) as number,
          b: (rgb?.b / 255) as number,
        },
      },
    ];
    tint.opacity = (100 - i * 10) / 100;
    paletteFrame.appendChild(tint);
  }
  return paletteFrame;
};

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

const createFont = async ({
  font,
  name,
  text,
}: {
  font: string;
  name: string;
  text?: string;
}) => {
  const fontText = figma.createText();
  fontText.name = name;
  await figma.loadFontAsync({ family: font, style: 'Regular' });
  fontText.fontName = { family: font, style: 'Regular' };
  fontText.characters = text || 'lorem ipsum dolor sit amet';
  fontText.resize(300, 100);
  fontText.fontSize = 24;
  return fontText;
};

const obj = {
  colors: [
    ['#0072c6', '#ffffff', '#f2f2f2'],
    ['#1d3557', '#f1faee', '#a8dadc'],
    ['#6b5b95', '#f7cac9', '#f5f5f5'],
  ],
  fonts: [
    ['Open Sans', 'Roboto'],
    ['Lato', 'Montserrat'],
    ['Raleway', 'Playfair Display'],
  ],
  variations: [
    [
      ['Hero Headers', '76', '2110:41'],
      ['Headers', '70', '578:28362'],
      ['Features', '357', '2110:217'],
      ['Gallery', '24', '2110:229'],
      ['CTA', '38', '2110:247'],
      ['Testimonials', '32', '2021:395'],
      ['Footers', '8', '2025:799'],
    ],
    [
      ['Hero Headers', '75', '2110:40'],
      ['Headers', '69', '578:28345'],
      ['Features', '354', '2021:22'],
      ['Gallery', '23', '1201:1732'],
      ['CTA', '37', '2021:464'],
      ['Testimonials', '31', '711:30104'],
      ['Footers', '7', '2025:830'],
    ],
    [
      ['Hero Headers', '74', '578:32933'],
      ['Headers', '68', '578:28349'],
      ['Features', '353', '2021:53'],
      ['Gallery', '22', '1201:1738'],
      ['CTA', '36', '712:29687'],
      ['Testimonials', '30', '712:27312'],
      ['Footers', '6', '2025:852'],
    ],
  ],
};
