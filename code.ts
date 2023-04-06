// This shows the HTML page in "ui.html".
figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
  if (msg.type === 'actionGenerate') {
    // current page
    const currentPage = figma.currentPage;
    const DESIGN = figma.createFrame();

    DESIGN.name = 'my design';
    DESIGN.layoutMode = 'VERTICAL';
    DESIGN.counterAxisSizingMode = 'AUTO';
    DESIGN.primaryAxisSizingMode = 'AUTO';
    // create random design
    components.forEach((comp) => {
      // select random child and added to design
      const selectedComp = figma.root.children.find(
        (child) => child.id === comp.id
      );
      if (!selectedComp) return;
      const randomChild =
        selectedComp.children[
          Math.floor(Math.random() * selectedComp.children.length)
        ].clone();
      DESIGN.appendChild(randomChild);
    });

    currentPage.appendChild(DESIGN);
  }
  if (msg.type === 'actionExit') {
    figma.closePlugin();
  }
  figma.closePlugin();
};

const components = [
  {
    name: 'navbar',
    id: '129:13658',
  },
  {
    name: 'hero header',
    id: '519:5759',
  },
  {
    name: 'header',
    id: '519:5701',
  },
  {
    name: 'Features',
    id: '507:5360',
  },
  {
    name: 'Gallery',
    id: '1161:5816',
  },
  {
    name: 'footer',
    id: '136:5239',
  },
];
