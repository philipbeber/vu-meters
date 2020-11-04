import React from "react";

interface BarChartProps {
  samples: number[];
}

const BarChart: React.FC<BarChartProps> = (props) => {
  const { samples } = props;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
        return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
        return;
    }
    //Our first draw
    context.fillStyle = '#000000';
    samples.forEach((sample, index) => {
        const size = context.canvas.height * sample / 256;
        context.fillRect(index, (context.canvas.height - size) / 2, 1, size);
    })
  })

  return <canvas ref={canvasRef} style={{ width: "100%", height: 100 }} />;
};

export default BarChart;
