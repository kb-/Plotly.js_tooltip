// src/example/app.js
const Plotly = require('plotly.js-basic-dist');
const { createTooltipToggleButton  } = require('../lib/index');

var userTemplate = "%{x|%H:%M:%S}<br>y: %{y}";
var customStyle = {
  arrowsize: 1.2,
  font: {
    size: 10,
    color: 'blue',
  },
};
var plotId = 'plot';

var trace1 = {
  x: ['2024-04-01T12:00:00', '2024-04-01T13:00:00', '2024-04-01T14:00:00', '2024-04-01T15:00:00'],
  y: [10, 15, 13, 17],
  type: 'scatter',
  hovertemplate: userTemplate,
};

var trace2 = {
  x: ['2024-04-01T12:00:00', '2024-04-01T13:00:00', '2024-04-01T14:00:00', '2024-04-01T15:00:00'],
  y: [16, 5, 11, 9],
  type: 'scatter',
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
  modeBarButtonsToAdd: [TooltipButton],
  responsive: true
};

Plotly.newPlot(plotId, data, layout, config);