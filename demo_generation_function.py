from pathlib import Path

import numpy as np
import plotly.graph_objects as go


def main() -> None:
    """Create a heatmap HTML file and inject only the JS tooltipfunction."""

    # Test data.
    x = np.linspace(0, 50, 501)
    y = np.linspace(0, 30, 301)
    xx, yy = np.meshgrid(x, y)

    rng = np.random.default_rng(0)

    z = (
        np.exp(-((xx - 18) ** 2 + (yy - 12) ** 2) / 12)
        + 1.5 * np.exp(-((xx - 32) ** 2 + (yy - 20) ** 2) / 8)
        + 0.05 * rng.normal(size=xx.shape)
    )

    fig = go.Figure(
        go.Heatmap(
            x=x,
            y=y,
            z=z,
            colorscale="Viridis",
            tooltiptemplate=(
                "Local max: %{z:.4f}<br>"
                "x: %{x:.3f}<br>"
                "y: %{y:.3f}<br>"
                "kernel: %{kernelSizeX} x %{kernelSizeY}"
            ),
            tooltip={
              "bgcolor":"rgba(255, 255, 255, 0.2)",
              "arrowcolor": 'white'
            }
        )
    )

    fig.update_layout(
        title="Tooltip function demo - Click on the modebar tooltip button then click on the data - find local maxima.",
        width=950,
        height=650,
    )

    tooltip_js = r"""
const gd = document.getElementById('graph');

const tooltipfunction = function(ctx) {
  // Kernel size in plot units, not pixels.
  const kernelSizeX = 10;
  const kernelSizeY = 10;

  console.log('tooltipfunction ctx:', ctx);

  // For heatmap-like traces, Plotly stores the plotted z matrix in calcdata.
  const z = ctx.fullTrace._z || ctx.calcdata[0].z;

  const xs = (ctx.fullTrace._x && ctx.fullTrace._x.length) ?
    ctx.fullTrace._x :
    ctx.calcdata[0].xRanges.map(r => (r[0] + r[1]) / 2);

  const ys = (ctx.fullTrace._y && ctx.fullTrace._y.length) ?
    ctx.fullTrace._y :
    ctx.calcdata[0].yRanges.map(r => (r[0] + r[1]) / 2);

  // Search bounds centered on the clicked point.
  const minX = ctx.point.x - kernelSizeX / 2;
  const maxX = ctx.point.x + kernelSizeX / 2;
  const minY = ctx.point.y - kernelSizeY / 2;
  const maxY = ctx.point.y + kernelSizeY / 2;

  let best = -Infinity;
  let bestX = ctx.point.x;
  let bestY = ctx.point.y;

  // Scan the bins whose centers fall inside the kernel rectangle.
  for(let iy = 0; iy < ys.length; iy++) {
    if(ys[iy] < minY || ys[iy] > maxY) continue;

    for(let ix = 0; ix < xs.length; ix++) {
      if(xs[ix] < minX || xs[ix] > maxX) continue;

      const value = z[iy][ix];

      if(value > best) {
        best = value;
        bestX = xs[ix];
        bestY = ys[iy];
      }
    }
  }

  console.log('tooltipfunction result:', {
    bestX,
    bestY,
    best,
    kernelSizeX,
    kernelSizeY
  });

  return {
    // These remapped point fields drive both template interpolation and
    // the default arrow anchor position.
    point: {
      x: bestX,
      y: bestY,
      z: best,
      kernelSizeX,
      kernelSizeY
    }
  };
};

// tooltiptemplate now comes directly from the Python Heatmap trace.
// Only inject the JS function, because functions cannot be serialized through Python JSON.
gd.data[0].tooltipfunction = tooltipfunction;

console.log('Trace tooltiptemplate from Python:', gd.data[0].tooltiptemplate);
console.log('Injected tooltipfunction:', gd.data[0].tooltipfunction);
console.log('Graph div:', gd);
"""

    output_file = Path("tooltip_function_test.html")

    fig.write_html(
        output_file,
        include_plotlyjs=True,
        div_id="graph",
        config={
            "editable": True,
            "modeBarButtonsToAdd": ["tooltip"],
        },
        post_script=tooltip_js,
    )

    print(f"Wrote: {output_file.resolve()}")


if __name__ == "__main__":
    main()