const { lib } = require('plotly.js/src/lib/index'); // Assume Plotly's internal API is used for hovertemplate processing
const _ = require('lodash'); // Utility library for extending default settings
const DEFAULT_TEMPLATE = "x: %{x},<br>y: %{y}"; // Default tooltip template
const DEFAULT_STYLE = {
  align: "left",
  arrowcolor: "black",
  arrowhead: 3,
  arrowsize: 1.8,
  arrowwidth: 1,
  font: {
    color: "black",
    family: "Arial",
    size: 12,
  },
  showarrow: true,
  xanchor: "left",
};

// Function to apply tooltip functionality
function applyTooltipFunctionality(gd, userTemplate, customStyle) {
  const template = userTemplate || DEFAULT_TEMPLATE;
  gd.on('plotly_click', function(data) {
    var pts = data.points[0];
    
    // Initialize the annotations array if it doesn't exist
    if(gd.layout.annotations===undefined)gd.layout.annotations = [];
    
    var existingIndex = gd.layout.annotations.findIndex(ann => ann.x === pts.x && ann.y === pts.y);
    var text = lib.hovertemplateString(template, {}, gd._fullLayout._d3locale, pts, {});
    var newAnnotation = {
      x: pts.x,
      y: pts.y,
      xref: 'x',
      yref: 'y',
      text: text,
      showarrow: true,
      ax: 5,
      ay: -20,
    };
    _.defaults(newAnnotation, customStyle);
    if (existingIndex === -1) {
      gd.layout.annotations.push(newAnnotation);
      Plotly.relayout(gd, { annotations: gd.layout.annotations });
    }
  });

  // Set up to only run once
  if (!gd._hasTooltipHandler) {
    gd._hasTooltipHandler = true;

    // Delete annotation when editable annotation text gets deleted
    gd.on('plotly_relayout', function(eventData) {
      // Iterate over eventData to find which annotation's text was set to empty
      for (let key in eventData) {
          if (key.includes('annotations[') && key.includes('].text')) {
              const index = key.match(/annotations\[(\d+)\]\.text/)[1];
              if (eventData[key] === '') { // Check if the text is set to empty
                  var updatedAnnotations = gd.layout.annotations || [];
                  updatedAnnotations.splice(index, 1); // Remove the annotation at the specific index
                  Plotly.relayout(gd, { annotations: updatedAnnotations });
                  break; // Exit after handling the specific empty text case
              }
          }
      }
    });
  }
}

// Initialize tooltips or set up observer if element is not yet available
function Plotly_Tooltip(plotId, userTemplate, customStyle) {
  let gd = document.getElementById(plotId);
  if (gd) {
    applyTooltipFunctionality(gd, userTemplate, customStyle);
  } else {
    // Observer to handle dynamically added DOM elements
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.id === plotId && node.tagName === 'DIV') { // Ensure it matches the expected plot container
            applyTooltipFunctionality(node, userTemplate, customStyle);
            observer.disconnect(); // Disconnect after successful application to avoid unnecessary overhead
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

module.exports = {
  Plotly_Tooltip
};
