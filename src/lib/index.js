// src/lib/index.js

const Plotly_full = require('plotly.js');  // Use the full version of Plotly.js
const { lib } = require('plotly.js/src/lib');
const _ = require('lodash');

const DEFAULT_TEMPLATE = "x: %{x},<br>y: %{y}";
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

function applyTooltipFunctionality(gd, userTemplate, customStyle) {
  console.log("applyTooltipFunctionality called");
  const template = userTemplate || DEFAULT_TEMPLATE;

  function addAnnotation(data) {
    console.log("addAnnotation called with data:", data);
    const pts = data.points[0];

    if (gd.layout.annotations === undefined) gd.layout.annotations = [];

    const existingIndex = gd.layout.annotations.findIndex(ann => ann.x === pts.x && ann.y === pts.y);
    const text = lib.hovertemplateString(template, {}, gd._fullLayout._d3locale, pts, {});
    const newAnnotation = {
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
      console.log("Adding new annotation:", newAnnotation);
      gd.layout.annotations.push(newAnnotation);
      Plotly_full.relayout(gd, { annotations: gd.layout.annotations });
    }
  }

  function removeAnnotation(eventData) {
    console.log("removeAnnotation called with eventData:", eventData);
    for (let key in eventData) {
      if (key.includes('annotations[') && key.includes('].text')) {
        const index = key.match(/annotations\[(\d+)\]\.text/)[1];
        if (eventData[key] === '') {
          const updatedAnnotations = gd.layout.annotations || [];
          updatedAnnotations.splice(index, 1);
          Plotly_full.relayout(gd, { annotations: updatedAnnotations });
          break;
        }
      }
    }
  }

  gd.on('plotly_click', addAnnotation);
  console.log("Event listener for plotly_click added using gd.on");

  if (!gd._hasTooltipHandler) {
    gd._hasTooltipHandler = true;
    gd.on('plotly_relayout', removeAnnotation);
    console.log("Event listener for plotly_relayout added using gd.on");
  }
}

function Plotly_Tooltip(plotId, userTemplate, customStyle) {
  console.log("Plotly_Tooltip called");
  let gd = document.getElementById(plotId);
  if (gd) {
    applyTooltipFunctionality(gd, userTemplate, customStyle);
  } else {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.id === plotId && node.tagName === 'DIV') {
            applyTooltipFunctionality(node, userTemplate, customStyle);
            observer.disconnect();
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
