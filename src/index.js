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