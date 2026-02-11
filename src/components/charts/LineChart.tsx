import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    type ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface LineChartProps {
    data: number[];
    labels: string[];
    label: string;
    color?: string;
    gradientColor?: string;
}

const LineChart: React.FC<LineChartProps> = ({
    data,
    labels,
    label,
    color = 'rgba(79, 70, 229, 1)',
    gradientColor = 'rgba(79, 70, 229, 0.1)'
}) => {
    const chartData = {
        labels,
        datasets: [
            {
                label,
                data,
                borderColor: color,
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, gradientColor.replace('0.1', '0.25'));
                    gradient.addColorStop(1, gradientColor);
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: '#fff'
            }
        ]
    };

    const options: ChartOptions<'line'> = {
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
                displayColors: false,
                callbacks: {
                    label: (context) => {
                        const value = context.parsed.y;
                        if (value === null) return '0';
                        if (label.toLowerCase().includes('revenue')) {
                            return new Intl.NumberFormat('en-NG', {
                                style: 'currency',
                                currency: 'NGN',
                                maximumFractionDigits: 0
                            }).format(value);
                        }
                        return value.toLocaleString();
                    }
                }
            }
        },
        scales: {
            x: {
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
                        const num = Number(value);
                        if (label.toLowerCase().includes('revenue')) {
                            if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}M`;
                            if (num >= 1000) return `₦${(num / 1000).toFixed(0)}K`;
                            return `₦${num}`;
                        }
                        return num.toLocaleString();
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
            <Line data={chartData} options={options} />
        </div>
    );
};

export default LineChart;
