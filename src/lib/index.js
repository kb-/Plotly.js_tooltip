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

const toggleTooltipFunctionality = (plotId, userTemplate, customStyle) => {
    _.defaults(customStyle, DEFAULT_STYLE);
    const gd = document.getElementById(plotId);
    if (!tooltipsEnabled) {
        // Activate tooltips
        gd.on('plotly_click', function(data) {
            var pts = data.points[0];
            var existingAnnotations = (gd.layout.annotations || []).slice(); // Clone the array to avoid direct mutation
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

            existingAnnotations.push(newAnnotation);
            Plotly.relayout(gd, { annotations: existingAnnotations });
        });
        tooltipsEnabled = true;
    } else {
        // Deactivate tooltips
        gd.removeAllListeners('plotly_click');
        tooltipsEnabled = false;
    }
    
    document.getElementById(plotId).on('plotly_relayout', function(eventData){
        var gd = document.getElementById(plotId);
        var updatedAnnotations = gd.layout.annotations.filter((anno, index) => {
            const key = `annotations[${index}].text`;
            return eventData[key] !== ''; // Keep annotation if its text is not empty
        });

        if (gd.layout.annotations.length !== updatedAnnotations.length) { // Check if any annotations were removed
            Plotly.relayout(gd, {
                annotations: updatedAnnotations
            }).then(function() {
                console.log('Empty annotations removed');
            });
        }
    });
};

module.exports = {
  createTooltipToggleButton
};
