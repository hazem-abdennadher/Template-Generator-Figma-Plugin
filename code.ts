// This shows the HTML page in "ui.html".
figma.showUI(__html__);

const GetDate = async () => {
  const result = await fetch(
    'https://506d-196-232-98-29.ngrok-free.app/imagine',
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
    const data = await GetDate();
    console.log(data);
    // current page
    const currentPage = figma.currentPage;
    // create random design
    data.variations.forEach((variation: any, index: number) => {
      const VARIATION = CreateVariation(variation, index + 1);
      currentPage.appendChild(VARIATION);
    });
    // add variation to page
    // });
    figma.closePlugin();
  }

  if (msg.type === 'actionExit') {
    figma.closePlugin();
  }
  figma.closePlugin();
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
  console.log('variation', variation);
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
