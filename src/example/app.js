const Plotly = require('plotly.js-basic-dist');
const { createTooltipToggleButton  } = require('../lib/index');

// Template and custom style for the tooltips
var userTemplate = "%{x|%H:%M:%S}<br>y: %{y}";
var customStyle = {
  arrowsize: 1.2,
  font: {
    size: 10,
    color: '#0d6efd',
  },
};
var plotId = 'plot';

// Function to generate date and time in hourly intervals
function generateDateTime(start, count) {
  let result = [];
  let current = new Date(start);
  for (let i = 0; i < count; i++) {
    result.push(current.toISOString());
    current.setHours(current.getHours() + 10);
  }
  return result;
}

// Function to generate random y-values
function generateRandomYValues(count) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 20) + 1);
}

// Generating 10,000 x and y values for each trace
var xValues = generateDateTime('2024-04-01T12:00:00', 10);
var yValuesTrace1 = generateRandomYValues(10);
var yValuesTrace2 = generateRandomYValues(10);

var trace1 = {
  x: xValues,
  y: yValuesTrace1,
  type: 'lines+markers',
  marker: { size: 6 },
  hovertemplate: userTemplate,
};

var trace2 = {
  x: xValues,
  y: yValuesTrace2,
  type: 'lines+markers',
  marker: { size: 6 },
  line: { dash: 'dot' },
  hovertemplate: userTemplate,
};

var data = [trace1, trace2];

var layout = {
  annotations: [] // Ensure annotations array is initialized
};

const TooltipButton = createTooltipToggleButton(plotId, userTemplate, customStyle);

var config = {
  editable: true,
  displayModeBar: true,
  modeBarButtonsToAdd: [TooltipButton,"v1hovermode", "hoverclosest", "hovercompare", "togglehover", "togglespikelines", "drawline", "drawopenpath", "drawclosedpath", "drawcircle", "drawrect", "eraseshape"],
  responsive: true
};

Plotly.newPlot(plotId, data, layout, config);
