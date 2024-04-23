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

// Define the custom SVG path
const customIconPath = "M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544s.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.87 1.87 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331M7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2z";

const customIcon = {
    width: 24,
    height: 24,
    path: customIconPath,
};

// State to keep track of whether tooltips are active
let tooltipsEnabled = false;

// Function to create a tooltip toggle button with the necessary scope
function createTooltipToggleButton(plotId, userTemplate, customStyle) {
  // Ensure defaults are applied to customStyle
  _.defaults(customStyle, DEFAULT_STYLE);

  return {
    name: 'toggleTooltip',
    title: 'Add tooltip',
    icon: customIcon,
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
