import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface StackedBarChartDataset {
    label: string;
    data: number[];
    backgroundColor: string;
}

interface StackedBarChartProps {
    labels: string[];
    datasets: StackedBarChartDataset[];
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({ labels, datasets }) => {
    const chartData = {
        labels,
        datasets
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y;
                        return `${label}: ${value === null ? '0' : value.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                stacked: true,
                beginAtZero: true,
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)'
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 11
                    },
                    callback: (value) => {
                        return Number(value).toLocaleString();
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    return (
        <div className="h-56 w-full">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default StackedBarChart;
