// This shows the HTML page in "ui.html".
figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
  if (msg.type === 'actionGenerate') {
    // current page
    const currentPage = figma.currentPage;
    // create random design
    data.forEach((variation) => {
      // create variation frame
      const VARIATION = figma.createFrame();
      VARIATION.name = variation.variation;
      VARIATION.layoutMode = 'VERTICAL';
      VARIATION.counterAxisSizingMode = 'AUTO';
      VARIATION.primaryAxisSizingMode = 'AUTO';
      VARIATION.clipsContent = false;
      VARIATION.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
      // select components
      variation.components.forEach((component) => {
        const COMPONENT = figma.getNodeById(component[2]);
        const COMPONENT_INSTANCE = COMPONENT?.parent?.children?.find(
          (child) => child.id === component[2]
        );
        if (!COMPONENT_INSTANCE) return;
        // create component instance
        console.log(COMPONENT_INSTANCE);
        const COMPONENT_INSTANCE_CLONE = COMPONENT_INSTANCE.clone();
        COMPONENT_INSTANCE_CLONE.name = component[0];
        VARIATION.appendChild(COMPONENT_INSTANCE_CLONE);
      });
    });
  }
  if (msg.type === 'actionExit') {
    figma.closePlugin();
  }
  figma.closePlugin();
};

const data = [
  {
    variation: 'Variation 1',
    components: [
      ['Navbar', '4', '405:9218'],
      ['Hero Header', '76', '2110:41'],
      ['Features', '353', '2021:53'],
      ['Testimonials', '32', '2021:395'],
      ['Pricing', '27', '712:23341'],
      ['CTA', '38', '2110:247'],
      ['Footer', '8', '2025:799'],
    ],
  },
];
