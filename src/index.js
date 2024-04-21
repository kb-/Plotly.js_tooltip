// src/index.js
const _ = require('lodash');
const Plotly = require('plotly.js-basic-dist');
console.log(Plotly); // Check if Plotly is defined
const {lib} = require('plotly.js/src/lib/index');
window.lib = lib;
console.log(lib);

const plotId = 'plot'; // This ID must match the ID of the div containing the Plotly plot

var userTemplate = "%{x|%H:%M:%S}<br>y: %{y}";//%{x|%Y-%m-%d %H:%M:%S}
var custom_style = {
  arrowsize: 1.2,
  font: {
    size: 10,
	color:'blue',
  },
};

const DEFAULT_TEMPLATE = "x: %{x},<br>y: %{y}";
const DEFAULT_STYLE = {
  align: "left",// horizontal alignment of the text (can be 'left', 'center', or 'right')
  arrowcolor: "black", // color of the annotation arrow
  arrowhead: 3,// type of arrowhead, for Plotly (an integer from 0 to 8)
  arrowsize: 1.8,// relative size of the arrowhead to the arrow stem, for Plotly
  arrowwidth: 1,// width of the annotation arrow in pixels, for Plotly
  font: {
    color: "black",// color of the annotation text
    family: "Arial",// font family of the annotation text, for Plotly
    size: 12,// size of the annotation text in points, for Plotly
  },
  showarrow: true,
  xanchor: "left",// horizontal alignment of the text (can be 'left', 'center', or 'right')
};

userTemplate = userTemplate?userTemplate:DEFAULT_TEMPLATE;
_.defaults(custom_style, DEFAULT_STYLE);

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

layout = {
  annotations: [] // Ensure annotations array is initialized
}

// Configuration for editable components
var config = {
  editable: true,
  // edits: {
  // annotationPosition: true,
  // annotationTail: true,
  // annotationText: true,
  // axisTitleText: true
  // }
};

Plotly.newPlot(plotId, data, layout, config);

document.getElementById(plotId).on('plotly_click',
function(data) {
  var pts = data.points[0];
  var gd = document.getElementById(plotId);
  var existingAnnotations = (gd.layout.annotations || []).slice(); // Clone the array to avoid direct mutation
  var text = lib.hovertemplateString(userTemplate, {},
  gd._fullLayout._d3locale, pts, {});

  var newAnnotation = {
    x: pts.x,
    y: pts.y,
    xref: 'x',
    yref: 'y',
    text: text,
    showarrow: true,
    ax: 5,
    ay: -20
  };
  
  _.defaults(newAnnotation, custom_style);

  existingAnnotations.push(newAnnotation); // Add new annotation to the array
  Plotly.relayout(gd, {
    annotations: existingAnnotations
  }); // Update the plot with the new annotations array
});

// Tooltip deletion
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