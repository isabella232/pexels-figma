import clone from "./clone";

// Function that creates a rectangle on canvas with an image fill from image data
function addImageToCanvas({ width, height, data }) {
  const imageHash = figma.createImage(data).hash;

  // If no selection
  // Get the width and height of the image
  // Create rectangle at 1/2 of that width/height
  // Apply the image as the fill
  // rect.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash }];
  if (figma.currentPage.selection.length === 0) {
    // figma.notify('Nothing selected.');
    const rect = figma.createRectangle();

    // Halfthe soze of the image so it looks good on retina
    rect.resizeWithoutConstraints(width / 2, height / 2);

    // Center the frame in our current viewport so we can see it.
    rect.x = figma.viewport.center.x - width / 2;
    rect.y = figma.viewport.center.y - height / 2;

    // Use FILL so it can be resized
    rect.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash }];

    // Add the image to the page
    figma.currentPage.appendChild(rect);

    // select the rectangle and focus the viewport
    figma.currentPage.selection = [rect];
    figma.viewport.scrollAndZoomIntoView([rect]);
  }

  // If current selection
  // Copy the selected node array
  // Apply the image as the fill
  for (const node of figma.currentPage.selection) {
    if ("fills" in node) {
      let fills = clone(node.fills);
      fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash }];
      node.fills = fills;
    }
  }
}

// Show the plugin UI
figma.showUI(__html__, { width: 400, height: 600 });

// Monitor messages from the UI
figma.ui.onmessage = (msg) => {
  if (msg.type === "insert") {
    addImageToCanvas(msg);
  }
};
