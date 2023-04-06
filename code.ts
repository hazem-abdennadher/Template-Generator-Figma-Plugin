// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// const test = async () => {
//   const response = await fetch(
//     'https://rams901-poc-design.hf.space/run/predict',
//     {
//       method: 'POST',
//       body: JSON.stringify({ data: ['Generate 3 home page variations'] }),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }
//   );
//   const json = await response.json();
//   return json;
// };

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'actionGenerate') {
    // const response = await test();
    // console.log(response);
    // const textNode = figma.createText();
    // await figma.loadFontAsync(textNode.fontName as FontName);
    // textNode.characters = response.data[0];
    // textNode.x = 100;
    // textNode.y = 100;
    // figma.currentPage.appendChild(textNode);
    // figma.closePlugin('Template generated successfully!');
    const allNodes = figma.root.children.map((node) => {
      return {
        id: node.id,
        name: node.name,
        children: node.children.map((child) => {
          return { id: child.id, name: child.name };
        }),
      };
    });
    console.log(allNodes);

    // const { templateName, color } = msg.data;
    // console.log(msg.data);
    // console.log(msg.msg);
    // // create a frame
    // const parentFrame = figma.createFrame();
    // parentFrame.name = templateName;
    // // add layout
    // parentFrame.layoutMode = 'VERTICAL';
    // parentFrame.paddingLeft = 64;
    // parentFrame.paddingRight = 64;
    // parentFrame.paddingTop = 64;
    // parentFrame.paddingBottom = 64;
    // parentFrame.itemSpacing = 32;
    // parentFrame.counterAxisSizingMode = 'AUTO';
    // parentFrame.primaryAxisSizingMode = 'AUTO';
    // // Generate 10 tints
    // for (let i = 0; i < 10; i++) {
    //   const tint = figma.createEllipse();
    //   tint.name = 'Tint ' + (100 - i * 10);
    //   tint.resize(100, 100);
    //   function hexToRgb(hex: string) {
    //     var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    //     return result
    //       ? {
    //           r: parseInt(result[1], 16),
    //           g: parseInt(result[2], 16),
    //           b: parseInt(result[3], 16),
    //         }
    //       : null;
    //   }
    //   const rgb = hexToRgb(color) as { r: number; g: number; b: number };
    //   tint.fills = [
    //     {
    //       type: 'SOLID',
    //       color: {
    //         r: (rgb?.r / 255) as number,
    //         g: (rgb?.g / 255) as number,
    //         b: (rgb?.b / 255) as number,
    //       },
    //     },
    //   ];
    //   tint.opacity = (100 - i * 10) / 100;
    //   parentFrame.appendChild(tint);
    // }
    // figma.viewport.scrollAndZoomIntoView([parentFrame]);
    // figma.closePlugin('Template generated successfully!');
  }

  if (msg.type === 'actionExit') {
    figma.closePlugin();
  }
  // figma.closePlugin();
};
