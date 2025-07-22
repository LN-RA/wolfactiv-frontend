import { useEffect, useRef } from "react";
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, ChartConfiguration } from "chart.js";
import { RadarData } from "@/types";

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  data: RadarData;
}

export function RadarChart({ data }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const config: ChartConfiguration<'radar'> = {
      type: 'radar',
      data: {
        labels: ['Floral', 'Boisé', 'Épicé', 'Frais', 'Oriental', 'Gourmand'],
        datasets: [{
          label: 'Votre profil',
          data: [
            data.floral,
            data.boisé,
            data.épicé,
            data.frais,
            data.oriental,
            data.gourmand
          ],
          backgroundColor: 'rgba(232, 159, 113, 0.2)',
          borderColor: 'rgb(232, 159, 113)',
          borderWidth: 2,
          pointBackgroundColor: 'rgb(232, 159, 113)',
          pointBorderColor: 'rgb(232, 159, 113)',
          pointRadius: 6,
          pointHoverRadius: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(27, 31, 35, 0.9)',
            titleColor: '#f6f5f3',
            bodyColor: '#f6f5f3',
            borderColor: '#e89f71',
            borderWidth: 1,
          }
        },
        scales: {
          r: {
            angleLines: {
              color: 'rgba(55, 65, 81, 0.3)'
            },
            grid: {
              color: 'rgba(55, 65, 81, 0.3)'
            },
            pointLabels: {
              color: '#f6f5f3',
              font: {
                size: 12
              }
            },
            ticks: {
              display: false,
              stepSize: 20,
              max: 100
            }
          }
        }
      }
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="max-w-md mx-auto">
      <canvas ref={canvasRef} width="400" height="400" />
    </div>
  );
}
