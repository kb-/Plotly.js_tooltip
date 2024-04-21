// src/index.js
const Plotly = require('plotly.js-basic-dist');
console.log(Plotly); // Check if Plotly is defined
const { lib } = require('plotly.js/src/lib/index');
window.lib = lib;
console.log(lib);

const plotId = 'plot'; // This ID must match the ID of the div containing the Plotly plot

template = "y: %{y}"; //"%H~%M~%S.%2f"

var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: 'scatter',
  hovertemplate: template,
};

var trace2 = {
  x: [1, 2, 3, 4],
  y: [16, 5, 11, 9],
  type: 'scatter',
  hovertemplate: template,
};

var data = [trace1, trace2];

layout = {
	//hovertemplate:template
}

Plotly.newPlot(plotId, data, layout);
	
document.getElementById(plotId).on('plotly_click', function(data){
    var pts = data.points[0];
    var gd = document.getElementById(plotId);
    var existingAnnotations = (gd.layout.annotations || []).slice(); // Clone the array to avoid direct mutation
	var text = lib.hovertemplateString(template, {}, gd._fullLayout._d3locale, pts, {});

    var newAnnotation = {
        x: pts.x,
        y: pts.y,
        xref: 'x',
        yref: 'y',
        text: text,
        showarrow: true,
        arrowhead: 7,
        ax: 0,
        ay: -40
    };
    existingAnnotations.push(newAnnotation);  // Add new annotation to the array
    Plotly.relayout(gd, { annotations: existingAnnotations });  // Update the plot with the new annotations array
});