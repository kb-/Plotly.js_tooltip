
// src/lib/index.js
const _ = require('lodash');
const { lib } = require('plotly.js/src/lib/index'); //edited Plotly source with added lib export

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

// State variable to keep track of tooltips activation status
let tooltipsEnabled = true; // Tooltips are always enabled

/**
 * Initialize tooltip functionality for Plotly charts.
 * @param {string} plotId - The ID of the DOM element containing the plot.
 * @param {string} userTemplate - Custom HTML template for tooltip content.
 * @param {Object} customStyle - Custom style settings for tooltip appearance.
 */
function initializeTooltips(plotId, userTemplate, customStyle) {
  // Merge custom styles with default styles
  _.defaults(customStyle, DEFAULT_STYLE);

  // Automatically enable tooltip functionality
  enableTooltipFunctionality(plotId, userTemplate, customStyle);
}

// Expose the initialize function
module.exports = {
  initializeTooltips
};
