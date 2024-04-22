document.addEventListener('DOMContentLoaded', function () {
    const trace1 = {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        type: 'scatter'
    };

    const data = [trace1];
    const layout = {
        title: 'Plot with Custom Modebar Button'
    };

    // Define the custom SVG path
    const customIconPath = "M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544s.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.87 1.87 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331M7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2z";
    
    const customIcon = {
        width: 24,
        height: 24,
        path: customIconPath,
    };

    const myCustomButton = {
        name: 'toggleTooltip',
        title: 'Toggle Tooltip',
        icon: customIcon,
        click: function(gd) {
            console.log('Custom button was clicked!');
            alert('Tooltip functionality toggled!');
        }
    };

    const config1 = {
        displayModeBar: true,
    };

    Plotly.newPlot('myPlot', data, layout, config1);
    
    const config2 = {
        modeBarButtonsToAdd: [myCustomButton]
    };
    Plotly.relayout('myPlot', config2);
});
