// src/lib/index.js
const _ = require('lodash');
const Plotly = require('plotly.js-basic-dist');
const { lib } = require('plotly.js/src/lib/index');

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

// State to keep track of whether tooltips are active
let tooltipsEnabled = false;

// Function to create a tooltip toggle button with the necessary scope
function createTooltipToggleButton(plotId, userTemplate, customStyle) {
  // Ensure defaults are applied to customStyle
  _.defaults(customStyle, DEFAULT_STYLE);

  return {
    name: 'toggleTooltip',
    title: 'Toggle tooltip',
    icon: Plotly.Icons.pencil, // Adjust the icon as needed
    click: function(gd) {
      toggleTooltipFunctionality(plotId, userTemplate, customStyle);
    }
  };
}

must_run = true;

const toggleTooltipFunctionality = (plotId, userTemplate, customStyle) => {
    _.defaults(customStyle, DEFAULT_STYLE);
    const gd = document.getElementById(plotId);
    if (!tooltipsEnabled) {
        // Activate tooltips
        gd.on('plotly_click', function(data) {
            var pts = data.points[0];
            var existingIndex = gd.layout.annotations.findIndex(ann => ann.x === pts.x && ann.y === pts.y);
            var text = lib.hovertemplateString(userTemplate, {}, gd._fullLayout._d3locale, pts, {});

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
        tooltipsEnabled = true;
    } else {
        // Deactivate tooltips
        gd.removeAllListeners('plotly_click');
        tooltipsEnabled = false;
    }
    
    if(must_run == true){//run once
        must_run = false;
        gd.on('plotly_relayout', function(eventData) {
            // Iterate over eventData to find which annotation's text was set to empty
            for (let key in eventData) {
                if (key.includes('annotations[') && key.includes('].text')) {
                    const index = key.match(/annotations\[(\d+)\]\.text/)[1];
                    if (eventData[key] === '') { // Check if the text is set to empty
                        var gd = document.getElementById(plotId);
                        var updatedAnnotations = (gd.layout.annotations || []).slice();
                        updatedAnnotations.splice(index, 1); // Remove the annotation at the specific index
                        Plotly.relayout(gd, { annotations: updatedAnnotations }).then(function() {
                            console.log('Annotation removed');
                        });
                        break; // Exit after handling the specific empty text case
                    }
                }
            }
        });
    }
};

module.exports = {
  createTooltipToggleButton
};
