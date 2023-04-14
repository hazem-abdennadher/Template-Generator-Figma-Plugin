figma.showUI(__html__);
// This shows the HTML page in "ui.html".

const GetDate = async (prompt: string) => {
  const result = await fetch(
    'https://60df-193-95-81-57.ngrok-free.app/imagine',
    {
      method: 'POST',
      body: JSON.stringify({
        prompt: prompt,
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
    // const data = await GetDate(msg.data.prompt);
    const data = obj;
    // current page
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

    Container.appendChild(PALETTES);
    Container.appendChild(FONTS);
    Container.appendChild(VARIATIONS);
    // await changeText();
    currentPage.appendChild(Container);
    figma.closePlugin();
  }

  if (msg.type === 'actionExit') {
    figma.closePlugin();
  }
};

const ComponentSelection: any = [];
const SelectTextNodes = (node: any, prev?: any) => {
  if (node.type === 'TEXT') {
    figma.currentPage.selection = [...prev, node];
  }
  // skip button and icon
  if (
    node.children &&
    node.children.length > 0 &&
    node.name !== 'Button' &&
    node.name !== 'Icon'
  ) {
    node.children.forEach((child: any) => {
      SelectTextNodes(child, figma.currentPage.selection);
    });
  }
};

const CreateFonts = async (fonts: string[][]) => {
  const FONTS = figma.createFrame();
  FONTS.name = 'Fonts';
  FONTS.layoutMode = 'VERTICAL';
  FONTS.counterAxisSizingMode = 'AUTO';
  FONTS.primaryAxisSizingMode = 'AUTO';
  FONTS.clipsContent = false;
  FONTS.itemSpacing = 100;
  FONTS.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
  for (let j = 0; j < fonts.length; j++) {
    const element = fonts[j];
    const frame = figma.createFrame();
    frame.name = 'Font ' + j;
    if (j === 0) frame.name = 'Primary';
    if (j === 1) frame.name = 'Secondary';
    if (j === 2) frame.name = 'Tertiary';
    frame.layoutMode = 'HORIZONTAL';
    frame.counterAxisSizingMode = 'AUTO';
    frame.primaryAxisSizingMode = 'AUTO';
    frame.clipsContent = false;
    frame.itemSpacing = 100;
    frame.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
    for (let i = 0; i < element.length; i++) {
      let el = element;
      const h1 = await createFont({
        font: el[i],
        name: el[i],
        text: el[i],
      });
      frame.appendChild(h1);
    }
    FONTS.appendChild(frame);
  }

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
    // SelectTextNodes(COMPONENT_INSTANCE_CLONE);
    // ComponentSelection.push({
    //   componentName: name,
    //   componentId: id,
    //   SelectedText: figma.currentPage.selection.map((node: any) => {
    //     return {
    //       parent: node.parent.name,
    //       name: node.name,
    //       id: node.id,
    //       characters: node.characters,
    //       style: TextStyles.find((style) => style.id === node.textStyleId),
    //     };
    //   }),
    // });
  });
  VARIATION.x = (100 + VARIATION.width) * index;
  return VARIATION;
};

const TextStyles: Array<{
  name: string;
  id: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  textCase: string;
}> = [];
const getTextStyleInfo = () => {
  figma.getLocalTextStyles().forEach((style) => {
    TextStyles.push({
      name: style.name,
      id: style.id,
      fontFamily: style.fontName.family,
      fontSize: style.fontSize,
      fontWeight: style.fontName.style,
      textCase: style.textCase,
    });
  });
};

getTextStyleInfo();
console.log(TextStyles);

const createComponent = (id: string) => {
  const COMPONENT = figma.getNodeById(id);
  const COMPONENT_INSTANCE = COMPONENT?.parent?.children?.find(
    (child) => child.id === id
  );
  if (!COMPONENT_INSTANCE) return;
  // create component instance
  // const COMPONENT_INSTANCE_CLONE = COMPONENT_INSTANCE as ComponentNode;
  // const COMPONENT_INSTANCE_CLONE_2 =
  //   COMPONENT_INSTANCE_CLONE.createInstance().detachInstance();
  // return COMPONENT_INSTANCE_CLONE_2;
  const COMPONENT_INSTANCE_CLONE = COMPONENT_INSTANCE.clone();
  return COMPONENT_INSTANCE_CLONE;
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
  // align
  fontText.textAlignHorizontal = 'CENTER';
  fontText.textAlignVertical = 'CENTER';

  fontText.fontSize = 128;
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

const changeText = async () => {
  const text = figma.getNodeById('3632:18319') as TextNode;
  if (!text) return;
  const textClone = text.clone() as TextNode;
  // detach from original
  const currentPage = figma.currentPage;
  let len = textClone.characters.length;
  for (let i = 0; i < len; i++) {
    await figma.loadFontAsync(textClone.getRangeAllFontNames(i, i + 1)[0]);
  }
  textClone.characters = 'Your Health is Our ramsis';
  textClone.fontSize = 128;
  currentPage.appendChild(textClone);

  // await figma.loadFontAsync({ family: 'Roboto', style: 'Bold' });

  // text.characters = 'Your Health is Our Priority';
  // // change color
  // text.fills = [{ type: 'SOLID', color: { r: 1, g: 0.0, b: 0.0 } }];
  // t
};

const copyWriting = [
  ['2110:41', '3632:18319', 'Your Health is Our Priority'],
  [
    '2110:41',
    '3632:18320',
    'At Cyber Medics, we are committed to providing you with the highest quality medical care. Our team of experienced professionals is dedicated to helping you stay healthy and happy.',
  ],
  ['578:28362', '3632:18319', 'About Us'],
  [
    '578:28362',
    '3632:18320',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],
  ['578:28362', '3632:18337', 'Our Services'],
  [
    '578:28362',
    '3632:18338',
    'We offer a wide range of medical services to meet your needs, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:217', '3632:18319', 'Our Team'],
  [
    '2110:217',
    '3632:18320',
    'Our team of medical professionals is highly trained and experienced, and is dedicated to providing you with the best possible care.',
  ],
  ['2110:217', '3632:18337', 'State-of-the-Art Facilities'],
  [
    '2110:217',
    '3632:18338',
    'Our facilities are equipped with the latest medical technology and equipment, ensuring that you receive the most advanced care available.',
  ],
  ['2110:217', '3632:18343', 'Personalized Care'],
  [
    '2110:217',
    '3632:18345',
    'We believe that every patient is unique, and we strive to provide personalized care that is tailored to your individual needs.',
  ],
  ['2110:217', '3632:18346', 'Comprehensive Services'],
  [
    '2110:217',
    '3632:18353',
    'From routine check-ups to specialized treatments and procedures, we offer a wide range of medical services to meet your needs.',
  ],
  ['2110:217', '3632:18357', 'Convenient Locations'],
  [
    '2110:217',
    '3632:18359',
    'We have multiple locations throughout the area, making it easy and convenient for you to access the medical care you need.',
  ],
  ['2110:229', '3632:18319', 'Our Facilities'],
  [
    '2110:229',
    '3632:18320',
    'Take a virtual tour of our state-of-the-art facilities and see for yourself why Cyber Medics is the best choice for your medical care.',
  ],
  ['2110:229', '3632:18337', 'Our Team'],
  [
    '2110:229',
    '3632:18338',
    'Meet our team of experienced medical professionals and learn more about their qualifications and expertise.',
  ],
  ['2110:229', '3632:18343', 'Patient Care'],
  [
    '2110:229',
    '3632:18345',
    'See what our patients have to say about their experiences at Cyber Medics and why they trust us with their medical care.',
  ],
  ['2110:229', '3632:18346', 'Medical Services'],
  [
    '2110:229',
    '3632:18353',
    'Learn more about the wide range of medical services we offer, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:229', '3632:18357', 'Health and Wellness'],
  [
    '2110:229',
    '3632:18359',
    'Get tips and advice on how to stay healthy and happy, from our team of medical experts.',
  ],
  ['2110:247', '3632:18319', 'Schedule an Appointment'],
  [
    '2110:247',
    '3632:18320',
    'Take the first step towards better health by scheduling an appointment with one of our experienced medical professionals today.',
  ],
  ['2110:247', '3632:18337', 'Contact Us'],
  [
    '2110:247',
    '3632:18338',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2110:247', '3632:18343', 'Insurance and Billing'],
  [
    '2110:247',
    '3632:18345',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2110:247', '3632:18346', 'Patient Resources'],
  [
    '2110:247',
    '3632:18353',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2110:247', '3632:18357', 'Careers'],
  [
    '2110:247',
    '3632:18359',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2021:395', '3632:18319', 'What Our Patients Say'],
  [
    '2021:395',
    '3632:18320',
    '"I\'ve been a patient at Cyber Medics for years, and I wouldn\'t trust my health to anyone else. The staff is friendly and professional, and the care I receive is top-notch."',
  ],
  [
    '2021:395',
    '3632:18337',
    '"I was nervous about my procedure, but the team at Cyber Medics put me at ease and made the whole process as easy as possible."',
  ],
  [
    '2021:395',
    '3632:18338',
    '"The facilities at Cyber Medics are state-of-the-art, and the staff is knowledgeable and caring. I wouldn\'t go anywhere else for my medical care."',
  ],
  [
    '2021:395',
    '3632:18343',
    '"I appreciate the personalized care I receive at Cyber Medics. The staff takes the time to listen to my concerns and provide me with the best possible care."',
  ],
  [
    '2021:395',
    '3632:18345',
    '"I\'ve recommended Cyber Medics to all of my friends and family. The care I receive here is second to none."',
  ],
  ['2025:799', '3632:18319', 'Contact Us'],
  [
    '2025:799',
    '3632:18320',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2025:799', '3632:18337', 'Insurance and Billing'],
  [
    '2025:799',
    '3632:18338',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2025:799', '3632:18343', 'Patient Resources'],
  [
    '2025:799',
    '3632:18345',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2025:799', '3632:18346', 'Careers'],
  [
    '2025:799',
    '3632:18353',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2025:799', '3632:18357', 'About Us'],
  [
    '2025:799',
    '3632:18359',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],

  ['2110:41', '3632:18319', 'Your Health is Our Priority'],
  [
    '2110:41',
    '3632:18320',
    'At Cyber Medics, we are committed to providing you with the highest quality medical care. Our team of experienced professionals is dedicated to helping you stay healthy and happy.',
  ],
  ['578:28362', '3632:18319', 'About Us'],
  [
    '578:28362',
    '3632:18320',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],
  ['578:28362', '3632:18337', 'Our Services'],
  [
    '578:28362',
    '3632:18338',
    'We offer a wide range of medical services to meet your needs, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:217', '3632:18319', 'Our Team'],
  [
    '2110:217',
    '3632:18320',
    'Our team of medical professionals is highly trained and experienced, and is dedicated to providing you with the best possible care.',
  ],
  ['2110:217', '3632:18337', 'State-of-the-Art Facilities'],
  [
    '2110:217',
    '3632:18338',
    'Our facilities are equipped with the latest medical technology and equipment, ensuring that you receive the most advanced care available.',
  ],
  ['2110:217', '3632:18343', 'Personalized Care'],
  [
    '2110:217',
    '3632:18345',
    'We believe that every patient is unique, and we strive to provide personalized care that is tailored to your individual needs.',
  ],
  ['2110:217', '3632:18346', 'Comprehensive Services'],
  [
    '2110:217',
    '3632:18353',
    'From routine check-ups to specialized treatments and procedures, we offer a wide range of medical services to meet your needs.',
  ],
  ['2110:217', '3632:18357', 'Convenient Locations'],
  [
    '2110:217',
    '3632:18359',
    'We have multiple locations throughout the area, making it easy and convenient for you to access the medical care you need.',
  ],
  ['2110:229', '3632:18319', 'Our Facilities'],
  [
    '2110:229',
    '3632:18320',
    'Take a virtual tour of our state-of-the-art facilities and see for yourself why Cyber Medics is the best choice for your medical care.',
  ],
  ['2110:229', '3632:18337', 'Our Team'],
  [
    '2110:229',
    '3632:18338',
    'Meet our team of experienced medical professionals and learn more about their qualifications and expertise.',
  ],
  ['2110:229', '3632:18343', 'Patient Care'],
  [
    '2110:229',
    '3632:18345',
    'See what our patients have to say about their experiences at Cyber Medics and why they trust us with their medical care.',
  ],
  ['2110:229', '3632:18346', 'Medical Services'],
  [
    '2110:229',
    '3632:18353',
    'Learn more about the wide range of medical services we offer, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:229', '3632:18357', 'Health and Wellness'],
  [
    '2110:229',
    '3632:18359',
    'Get tips and advice on how to stay healthy and happy, from our team of medical experts.',
  ],
  ['2110:247', '3632:18319', 'Schedule an Appointment'],
  [
    '2110:247',
    '3632:18320',
    'Take the first step towards better health by scheduling an appointment with one of our experienced medical professionals today.',
  ],
  ['2110:247', '3632:18337', 'Contact Us'],
  [
    '2110:247',
    '3632:18338',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2110:247', '3632:18343', 'Insurance and Billing'],
  [
    '2110:247',
    '3632:18345',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2110:247', '3632:18346', 'Patient Resources'],
  [
    '2110:247',
    '3632:18353',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2110:247', '3632:18357', 'Careers'],
  [
    '2110:247',
    '3632:18359',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2021:395', '3632:18319', 'What Our Patients Say'],
  [
    '2021:395',
    '3632:18320',
    '"I\'ve been a patient at Cyber Medics for years, and I wouldn\'t trust my health to anyone else. The staff is friendly and professional, and the care I receive is top-notch."',
  ],
  [
    '2021:395',
    '3632:18337',
    '"I was nervous about my procedure, but the team at Cyber Medics put me at ease and made the whole process as easy as possible."',
  ],
  [
    '2021:395',
    '3632:18338',
    '"The facilities at Cyber Medics are state-of-the-art, and the staff is knowledgeable and caring. I wouldn\'t go anywhere else for my medical care."',
  ],
  [
    '2021:395',
    '3632:18343',
    '"I appreciate the personalized care I receive at Cyber Medics. The staff takes the time to listen to my concerns and provide me with the best possible care."',
  ],
  [
    '2021:395',
    '3632:18345',
    '"I\'ve recommended Cyber Medics to all of my friends and family. The care I receive here is second to none."',
  ],
  ['2025:799', '3632:18319', 'Contact Us'],
  [
    '2025:799',
    '3632:18320',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2025:799', '3632:18337', 'Insurance and Billing'],
  [
    '2025:799',
    '3632:18338',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2025:799', '3632:18343', 'Patient Resources'],
  [
    '2025:799',
    '3632:18345',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2025:799', '3632:18346', 'Careers'],
  [
    '2025:799',
    '3632:18353',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2025:799', '3632:18357', 'About Us'],
  [
    '2025:799',
    '3632:18359',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],

  ['2110:41', '3632:18319', 'Your Health is Our Priority'],
  [
    '2110:41',
    '3632:18320',
    'At Cyber Medics, we are committed to providing you with the highest quality medical care. Our team of experienced professionals is dedicated to helping you stay healthy and happy.',
  ],
  ['578:28362', '3632:18319', 'About Us'],
  [
    '578:28362',
    '3632:18320',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],
  ['578:28362', '3632:18337', 'Our Services'],
  [
    '578:28362',
    '3632:18338',
    'We offer a wide range of medical services to meet your needs, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:217', '3632:18319', 'Our Team'],
  [
    '2110:217',
    '3632:18320',
    'Our team of medical professionals is highly trained and experienced, and is dedicated to providing you with the best possible care.',
  ],
  ['2110:217', '3632:18337', 'State-of-the-Art Facilities'],
  [
    '2110:217',
    '3632:18338',
    'Our facilities are equipped with the latest medical technology and equipment, ensuring that you receive the most advanced care available.',
  ],
  ['2110:217', '3632:18343', 'Personalized Care'],
  [
    '2110:217',
    '3632:18345',
    'We believe that every patient is unique, and we strive to provide personalized care that is tailored to your individual needs.',
  ],
  ['2110:217', '3632:18346', 'Comprehensive Services'],
  [
    '2110:217',
    '3632:18353',
    'From routine check-ups to specialized treatments and procedures, we offer a wide range of medical services to meet your needs.',
  ],
  ['2110:217', '3632:18357', 'Convenient Locations'],
  [
    '2110:217',
    '3632:18359',
    'We have multiple locations throughout the area, making it easy and convenient for you to access the medical care you need.',
  ],
  ['2110:229', '3632:18319', 'Our Facilities'],
  [
    '2110:229',
    '3632:18320',
    'Take a virtual tour of our state-of-the-art facilities and see for yourself why Cyber Medics is the best choice for your medical care.',
  ],
  ['2110:229', '3632:18337', 'Our Team'],
  [
    '2110:229',
    '3632:18338',
    'Meet our team of experienced medical professionals and learn more about their qualifications and expertise.',
  ],
  ['2110:229', '3632:18343', 'Patient Care'],
  [
    '2110:229',
    '3632:18345',
    'See what our patients have to say about their experiences at Cyber Medics and why they trust us with their medical care.',
  ],
  ['2110:229', '3632:18346', 'Medical Services'],
  [
    '2110:229',
    '3632:18353',
    'Learn more about the wide range of medical services we offer, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:229', '3632:18357', 'Health and Wellness'],
  [
    '2110:229',
    '3632:18359',
    'Get tips and advice on how to stay healthy and happy, from our team of medical experts.',
  ],
  ['2110:247', '3632:18319', 'Schedule an Appointment'],
  [
    '2110:247',
    '3632:18320',
    'Take the first step towards better health by scheduling an appointment with one of our experienced medical professionals today.',
  ],
  ['2110:247', '3632:18337', 'Contact Us'],
  [
    '2110:247',
    '3632:18338',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2110:247', '3632:18343', 'Insurance and Billing'],
  [
    '2110:247',
    '3632:18345',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2110:247', '3632:18346', 'Patient Resources'],
  [
    '2110:247',
    '3632:18353',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2110:247', '3632:18357', 'Careers'],
  [
    '2110:247',
    '3632:18359',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2021:395', '3632:18319', 'What Our Patients Say'],
  [
    '2021:395',
    '3632:18320',
    '"I\'ve been a patient at Cyber Medics for years, and I wouldn\'t trust my health to anyone else. The staff is friendly and professional, and the care I receive is top-notch."',
  ],
  [
    '2021:395',
    '3632:18337',
    '"I was nervous about my procedure, but the team at Cyber Medics put me at ease and made the whole process as easy as possible."',
  ],
  [
    '2021:395',
    '3632:18338',
    '"The facilities at Cyber Medics are state-of-the-art, and the staff is knowledgeable and caring. I wouldn\'t go anywhere else for my medical care."',
  ],
  [
    '2021:395',
    '3632:18343',
    '"I appreciate the personalized care I receive at Cyber Medics. The staff takes the time to listen to my concerns and provide me with the best possible care."',
  ],
  [
    '2021:395',
    '3632:18345',
    '"I\'ve recommended Cyber Medics to all of my friends and family. The care I receive here is second to none."',
  ],
  ['2025:799', '3632:18319', 'Contact Us'],
  [
    '2025:799',
    '3632:18320',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2025:799', '3632:18337', 'Insurance and Billing'],
  [
    '2025:799',
    '3632:18338',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2025:799', '3632:18343', 'Patient Resources'],
  [
    '2025:799',
    '3632:18345',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2025:799', '3632:18346', 'Careers'],
  [
    '2025:799',
    '3632:18353',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2025:799', '3632:18357', 'About Us'],
  [
    '2025:799',
    '3632:18359',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],

  ['2110:41', '3632:18319', 'Your Health is Our Priority'],
  [
    '2110:41',
    '3632:18320',
    'At Cyber Medics, we are committed to providing you with the highest quality medical care. Our team of experienced professionals is dedicated to helping you stay healthy and happy.',
  ],
  ['578:28362', '3632:18319', 'About Us'],
  [
    '578:28362',
    '3632:18320',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],
  ['578:28362', '3632:18337', 'Our Services'],
  [
    '578:28362',
    '3632:18338',
    'We offer a wide range of medical services to meet your needs, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:217', '3632:18319', 'Our Team'],
  [
    '2110:217',
    '3632:18320',
    'Our team of medical professionals is highly trained and experienced, and is dedicated to providing you with the best possible care.',
  ],
  ['2110:217', '3632:18337', 'State-of-the-Art Facilities'],
  [
    '2110:217',
    '3632:18338',
    'Our facilities are equipped with the latest medical technology and equipment, ensuring that you receive the most advanced care available.',
  ],
  ['2110:217', '3632:18343', 'Personalized Care'],
  [
    '2110:217',
    '3632:18345',
    'We believe that every patient is unique, and we strive to provide personalized care that is tailored to your individual needs.',
  ],
  ['2110:217', '3632:18346', 'Comprehensive Services'],
  [
    '2110:217',
    '3632:18353',
    'From routine check-ups to specialized treatments and procedures, we offer a wide range of medical services to meet your needs.',
  ],
  ['2110:217', '3632:18357', 'Convenient Locations'],
  [
    '2110:217',
    '3632:18359',
    'We have multiple locations throughout the area, making it easy and convenient for you to access the medical care you need.',
  ],
  ['2110:229', '3632:18319', 'Our Facilities'],
  [
    '2110:229',
    '3632:18320',
    'Take a virtual tour of our state-of-the-art facilities and see for yourself why Cyber Medics is the best choice for your medical care.',
  ],
  ['2110:229', '3632:18337', 'Our Team'],
  [
    '2110:229',
    '3632:18338',
    'Meet our team of experienced medical professionals and learn more about their qualifications and expertise.',
  ],
  ['2110:229', '3632:18343', 'Patient Care'],
  [
    '2110:229',
    '3632:18345',
    'See what our patients have to say about their experiences at Cyber Medics and why they trust us with their medical care.',
  ],
  ['2110:229', '3632:18346', 'Medical Services'],
  [
    '2110:229',
    '3632:18353',
    'Learn more about the wide range of medical services we offer, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:229', '3632:18357', 'Health and Wellness'],
  [
    '2110:229',
    '3632:18359',
    'Get tips and advice on how to stay healthy and happy, from our team of medical experts.',
  ],
  ['2110:247', '3632:18319', 'Schedule an Appointment'],
  [
    '2110:247',
    '3632:18320',
    'Take the first step towards better health by scheduling an appointment with one of our experienced medical professionals today.',
  ],
  ['2110:247', '3632:18337', 'Contact Us'],
  [
    '2110:247',
    '3632:18338',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2110:247', '3632:18343', 'Insurance and Billing'],
  [
    '2110:247',
    '3632:18345',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2110:247', '3632:18346', 'Patient Resources'],
  [
    '2110:247',
    '3632:18353',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2110:247', '3632:18357', 'Careers'],
  [
    '2110:247',
    '3632:18359',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2021:395', '3632:18319', 'What Our Patients Say'],
  [
    '2021:395',
    '3632:18320',
    '"I\'ve been a patient at Cyber Medics for years, and I wouldn\'t trust my health to anyone else. The staff is friendly and professional, and the care I receive is top-notch."',
  ],
  [
    '2021:395',
    '3632:18337',
    '"I was nervous about my procedure, but the team at Cyber Medics put me at ease and made the whole process as easy as possible."',
  ],
  [
    '2021:395',
    '3632:18338',
    '"The facilities at Cyber Medics are state-of-the-art, and the staff is knowledgeable and caring. I wouldn\'t go anywhere else for my medical care."',
  ],
  [
    '2021:395',
    '3632:18343',
    '"I appreciate the personalized care I receive at Cyber Medics. The staff takes the time to listen to my concerns and provide me with the best possible care."',
  ],
  [
    '2021:395',
    '3632:18345',
    '"I\'ve recommended Cyber Medics to all of my friends and family. The care I receive here is second to none."',
  ],
  ['2025:799', '3632:18319', 'Contact Us'],
  [
    '2025:799',
    '3632:18320',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2025:799', '3632:18337', 'Insurance and Billing'],
  [
    '2025:799',
    '3632:18338',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2025:799', '3632:18343', 'Patient Resources'],
  [
    '2025:799',
    '3632:18345',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2025:799', '3632:18346', 'Careers'],
  [
    '2025:799',
    '3632:18353',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2025:799', '3632:18357', 'About Us'],
  [
    '2025:799',
    '3632:18359',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],

  ['2110:41', '3632:18319', 'Your Health is Our Priority'],
  [
    '2110:41',
    '3632:18320',
    'At Cyber Medics, we are committed to providing you with the highest quality medical care. Our team of experienced professionals is dedicated to helping you stay healthy and happy.',
  ],
  ['578:28362', '3632:18319', 'About Us'],
  [
    '578:28362',
    '3632:18320',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],
  ['578:28362', '3632:18337', 'Our Services'],
  [
    '578:28362',
    '3632:18338',
    'We offer a wide range of medical services to meet your needs, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:217', '3632:18319', 'Our Team'],
  [
    '2110:217',
    '3632:18320',
    'Our team of medical professionals is highly trained and experienced, and is dedicated to providing you with the best possible care.',
  ],
  ['2110:217', '3632:18337', 'State-of-the-Art Facilities'],
  [
    '2110:217',
    '3632:18338',
    'Our facilities are equipped with the latest medical technology and equipment, ensuring that you receive the most advanced care available.',
  ],
  ['2110:217', '3632:18343', 'Personalized Care'],
  [
    '2110:217',
    '3632:18345',
    'We believe that every patient is unique, and we strive to provide personalized care that is tailored to your individual needs.',
  ],
  ['2110:217', '3632:18346', 'Comprehensive Services'],
  [
    '2110:217',
    '3632:18353',
    'From routine check-ups to specialized treatments and procedures, we offer a wide range of medical services to meet your needs.',
  ],
  ['2110:217', '3632:18357', 'Convenient Locations'],
  [
    '2110:217',
    '3632:18359',
    'We have multiple locations throughout the area, making it easy and convenient for you to access the medical care you need.',
  ],
  ['2110:229', '3632:18319', 'Our Facilities'],
  [
    '2110:229',
    '3632:18320',
    'Take a virtual tour of our state-of-the-art facilities and see for yourself why Cyber Medics is the best choice for your medical care.',
  ],
  ['2110:229', '3632:18337', 'Our Team'],
  [
    '2110:229',
    '3632:18338',
    'Meet our team of experienced medical professionals and learn more about their qualifications and expertise.',
  ],
  ['2110:229', '3632:18343', 'Patient Care'],
  [
    '2110:229',
    '3632:18345',
    'See what our patients have to say about their experiences at Cyber Medics and why they trust us with their medical care.',
  ],
  ['2110:229', '3632:18346', 'Medical Services'],
  [
    '2110:229',
    '3632:18353',
    'Learn more about the wide range of medical services we offer, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:229', '3632:18357', 'Health and Wellness'],
  [
    '2110:229',
    '3632:18359',
    'Get tips and advice on how to stay healthy and happy, from our team of medical experts.',
  ],
  ['2110:247', '3632:18319', 'Schedule an Appointment'],
  [
    '2110:247',
    '3632:18320',
    'Take the first step towards better health by scheduling an appointment with one of our experienced medical professionals today.',
  ],
  ['2110:247', '3632:18337', 'Contact Us'],
  [
    '2110:247',
    '3632:18338',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2110:247', '3632:18343', 'Insurance and Billing'],
  [
    '2110:247',
    '3632:18345',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2110:247', '3632:18346', 'Patient Resources'],
  [
    '2110:247',
    '3632:18353',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2110:247', '3632:18357', 'Careers'],
  [
    '2110:247',
    '3632:18359',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2021:395', '3632:18319', 'What Our Patients Say'],
  [
    '2021:395',
    '3632:18320',
    '"I\'ve been a patient at Cyber Medics for years, and I wouldn\'t trust my health to anyone else. The staff is friendly and professional, and the care I receive is top-notch."',
  ],
  [
    '2021:395',
    '3632:18337',
    '"I was nervous about my procedure, but the team at Cyber Medics put me at ease and made the whole process as easy as possible."',
  ],
  [
    '2021:395',
    '3632:18338',
    '"The facilities at Cyber Medics are state-of-the-art, and the staff is knowledgeable and caring. I wouldn\'t go anywhere else for my medical care."',
  ],
  [
    '2021:395',
    '3632:18343',
    '"I appreciate the personalized care I receive at Cyber Medics. The staff takes the time to listen to my concerns and provide me with the best possible care."',
  ],
  [
    '2021:395',
    '3632:18345',
    '"I\'ve recommended Cyber Medics to all of my friends and family. The care I receive here is second to none."',
  ],
  ['2025:799', '3632:18319', 'Contact Us'],
  [
    '2025:799',
    '3632:18320',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2025:799', '3632:18337', 'Insurance and Billing'],
  [
    '2025:799',
    '3632:18338',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2025:799', '3632:18343', 'Patient Resources'],
  [
    '2025:799',
    '3632:18345',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2025:799', '3632:18346', 'Careers'],
  [
    '2025:799',
    '3632:18353',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2025:799', '3632:18357', 'About Us'],
  [
    '2025:799',
    '3632:18359',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],

  ['2110:41', '3632:18319', 'Your Health is Our Priority'],
  [
    '2110:41',
    '3632:18320',
    'At Cyber Medics, we are committed to providing you with the highest quality medical care. Our team of experienced professionals is dedicated to helping you stay healthy and happy.',
  ],
  ['578:28362', '3632:18319', 'About Us'],
  [
    '578:28362',
    '3632:18320',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],
  ['578:28362', '3632:18337', 'Our Services'],
  [
    '578:28362',
    '3632:18338',
    'We offer a wide range of medical services to meet your needs, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:217', '3632:18319', 'Our Team'],
  [
    '2110:217',
    '3632:18320',
    'Our team of medical professionals is highly trained and experienced, and is dedicated to providing you with the best possible care.',
  ],
  ['2110:217', '3632:18337', 'State-of-the-Art Facilities'],
  [
    '2110:217',
    '3632:18338',
    'Our facilities are equipped with the latest medical technology and equipment, ensuring that you receive the most advanced care available.',
  ],
  ['2110:217', '3632:18343', 'Personalized Care'],
  [
    '2110:217',
    '3632:18345',
    'We believe that every patient is unique, and we strive to provide personalized care that is tailored to your individual needs.',
  ],
  ['2110:217', '3632:18346', 'Comprehensive Services'],
  [
    '2110:217',
    '3632:18353',
    'From routine check-ups to specialized treatments and procedures, we offer a wide range of medical services to meet your needs.',
  ],
  ['2110:217', '3632:18357', 'Convenient Locations'],
  [
    '2110:217',
    '3632:18359',
    'We have multiple locations throughout the area, making it easy and convenient for you to access the medical care you need.',
  ],
  ['2110:229', '3632:18319', 'Our Facilities'],
  [
    '2110:229',
    '3632:18320',
    'Take a virtual tour of our state-of-the-art facilities and see for yourself why Cyber Medics is the best choice for your medical care.',
  ],
  ['2110:229', '3632:18337', 'Our Team'],
  [
    '2110:229',
    '3632:18338',
    'Meet our team of experienced medical professionals and learn more about their qualifications and expertise.',
  ],
  ['2110:229', '3632:18343', 'Patient Care'],
  [
    '2110:229',
    '3632:18345',
    'See what our patients have to say about their experiences at Cyber Medics and why they trust us with their medical care.',
  ],
  ['2110:229', '3632:18346', 'Medical Services'],
  [
    '2110:229',
    '3632:18353',
    'Learn more about the wide range of medical services we offer, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:229', '3632:18357', 'Health and Wellness'],
  [
    '2110:229',
    '3632:18359',
    'Get tips and advice on how to stay healthy and happy, from our team of medical experts.',
  ],
  ['2110:247', '3632:18319', 'Schedule an Appointment'],
  [
    '2110:247',
    '3632:18320',
    'Take the first step towards better health by scheduling an appointment with one of our experienced medical professionals today.',
  ],
  ['2110:247', '3632:18337', 'Contact Us'],
  [
    '2110:247',
    '3632:18338',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2110:247', '3632:18343', 'Insurance and Billing'],
  [
    '2110:247',
    '3632:18345',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2110:247', '3632:18346', 'Patient Resources'],
  [
    '2110:247',
    '3632:18353',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2110:247', '3632:18357', 'Careers'],
  [
    '2110:247',
    '3632:18359',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2021:395', '3632:18319', 'What Our Patients Say'],
  [
    '2021:395',
    '3632:18320',
    '"I\'ve been a patient at Cyber Medics for years, and I wouldn\'t trust my health to anyone else. The staff is friendly and professional, and the care I receive is top-notch."',
  ],
  [
    '2021:395',
    '3632:18337',
    '"I was nervous about my procedure, but the team at Cyber Medics put me at ease and made the whole process as easy as possible."',
  ],
  [
    '2021:395',
    '3632:18338',
    '"The facilities at Cyber Medics are state-of-the-art, and the staff is knowledgeable and caring. I wouldn\'t go anywhere else for my medical care."',
  ],
  [
    '2021:395',
    '3632:18343',
    '"I appreciate the personalized care I receive at Cyber Medics. The staff takes the time to listen to my concerns and provide me with the best possible care."',
  ],
  [
    '2021:395',
    '3632:18345',
    '"I\'ve recommended Cyber Medics to all of my friends and family. The care I receive here is second to none."',
  ],
  ['2025:799', '3632:18319', 'Contact Us'],
  [
    '2025:799',
    '3632:18320',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2025:799', '3632:18337', 'Insurance and Billing'],
  [
    '2025:799',
    '3632:18338',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2025:799', '3632:18343', 'Patient Resources'],
  [
    '2025:799',
    '3632:18345',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2025:799', '3632:18346', 'Careers'],
  [
    '2025:799',
    '3632:18353',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2025:799', '3632:18357', 'About Us'],
  [
    '2025:799',
    '3632:18359',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],

  ['2110:41', '3632:18319', 'Your Health is Our Priority'],
  [
    '2110:41',
    '3632:18320',
    'At Cyber Medics, we are committed to providing you with the highest quality medical care. Our team of experienced professionals is dedicated to helping you stay healthy and happy.',
  ],
  ['578:28362', '3632:18319', 'About Us'],
  [
    '578:28362',
    '3632:18320',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],
  ['578:28362', '3632:18337', 'Our Services'],
  [
    '578:28362',
    '3632:18338',
    'We offer a wide range of medical services to meet your needs, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:217', '3632:18319', 'Our Team'],
  [
    '2110:217',
    '3632:18320',
    'Our team of medical professionals is highly trained and experienced, and is dedicated to providing you with the best possible care.',
  ],
  ['2110:217', '3632:18337', 'State-of-the-Art Facilities'],
  [
    '2110:217',
    '3632:18338',
    'Our facilities are equipped with the latest medical technology and equipment, ensuring that you receive the most advanced care available.',
  ],
  ['2110:217', '3632:18343', 'Personalized Care'],
  [
    '2110:217',
    '3632:18345',
    'We believe that every patient is unique, and we strive to provide personalized care that is tailored to your individual needs.',
  ],
  ['2110:217', '3632:18346', 'Comprehensive Services'],
  [
    '2110:217',
    '3632:18353',
    'From routine check-ups to specialized treatments and procedures, we offer a wide range of medical services to meet your needs.',
  ],
  ['2110:217', '3632:18357', 'Convenient Locations'],
  [
    '2110:217',
    '3632:18359',
    'We have multiple locations throughout the area, making it easy and convenient for you to access the medical care you need.',
  ],
  ['2110:229', '3632:18319', 'Our Facilities'],
  [
    '2110:229',
    '3632:18320',
    'Take a virtual tour of our state-of-the-art facilities and see for yourself why Cyber Medics is the best choice for your medical care.',
  ],
  ['2110:229', '3632:18337', 'Our Team'],
  [
    '2110:229',
    '3632:18338',
    'Meet our team of experienced medical professionals and learn more about their qualifications and expertise.',
  ],
  ['2110:229', '3632:18343', 'Patient Care'],
  [
    '2110:229',
    '3632:18345',
    'See what our patients have to say about their experiences at Cyber Medics and why they trust us with their medical care.',
  ],
  ['2110:229', '3632:18346', 'Medical Services'],
  [
    '2110:229',
    '3632:18353',
    'Learn more about the wide range of medical services we offer, from routine check-ups to specialized treatments and procedures.',
  ],
  ['2110:229', '3632:18357', 'Health and Wellness'],
  [
    '2110:229',
    '3632:18359',
    'Get tips and advice on how to stay healthy and happy, from our team of medical experts.',
  ],
  ['2110:247', '3632:18319', 'Schedule an Appointment'],
  [
    '2110:247',
    '3632:18320',
    'Take the first step towards better health by scheduling an appointment with one of our experienced medical professionals today.',
  ],
  ['2110:247', '3632:18337', 'Contact Us'],
  [
    '2110:247',
    '3632:18338',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2110:247', '3632:18343', 'Insurance and Billing'],
  [
    '2110:247',
    '3632:18345',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2110:247', '3632:18346', 'Patient Resources'],
  [
    '2110:247',
    '3632:18353',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2110:247', '3632:18357', 'Careers'],
  [
    '2110:247',
    '3632:18359',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2021:395', '3632:18319', 'What Our Patients Say'],
  [
    '2021:395',
    '3632:18320',
    '"I\'ve been a patient at Cyber Medics for years, and I wouldn\'t trust my health to anyone else. The staff is friendly and professional, and the care I receive is top-notch."',
  ],
  [
    '2021:395',
    '3632:18337',
    '"I was nervous about my procedure, but the team at Cyber Medics put me at ease and made the whole process as easy as possible."',
  ],
  [
    '2021:395',
    '3632:18338',
    '"The facilities at Cyber Medics are state-of-the-art, and the staff is knowledgeable and caring. I wouldn\'t go anywhere else for my medical care."',
  ],
  [
    '2021:395',
    '3632:18343',
    '"I appreciate the personalized care I receive at Cyber Medics. The staff takes the time to listen to my concerns and provide me with the best possible care."',
  ],
  [
    '2021:395',
    '3632:18345',
    '"I\'ve recommended Cyber Medics to all of my friends and family. The care I receive here is second to none."',
  ],
  ['2025:799', '3632:18319', 'Contact Us'],
  [
    '2025:799',
    '3632:18320',
    "Have a question or need more information? Contact us today and we'll be happy to help.",
  ],
  ['2025:799', '3632:18337', 'Insurance and Billing'],
  [
    '2025:799',
    '3632:18338',
    'Learn more about our insurance and billing policies, and find out how we can help you navigate the often confusing world of medical insurance.',
  ],
  ['2025:799', '3632:18343', 'Patient Resources'],
  [
    '2025:799',
    '3632:18345',
    'Access helpful resources and information to help you manage your health and stay informed about the latest medical news and developments.',
  ],
  ['2025:799', '3632:18346', 'Careers'],
  [
    '2025:799',
    '3632:18353',
    'Join our team of medical professionals and help us provide the best possible care to our patients.',
  ],
  ['2025:799', '3632:18357', 'About Us'],
  [
    '2025:799',
    '3632:18359',
    'Learn more about Cyber Medics and our mission to provide top-notch medical care to our patients.',
  ],
];
