"use client";

import { Doughnut, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js/auto";
import type { ChartData, ChartOptions } from "chart.js/auto";

Chart.register(...registerables);

export type ChartProps = {
    lineData: ChartData<"line">;
    donutData: ChartData<"doughnut">;
    lineOpts?: ChartOptions<"line">;
    donutOpts?: ChartOptions<"doughnut">;
};

const defaultOpts = {
    responsive: true,
    maintainAspectRatio: false,
};

export default function Charts({ lineData, donutData, lineOpts, donutOpts }: ChartProps) {
    return (
        <div className="grid grid-cols-2 w-full gap-4 mt-4">
            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <Line data={lineData} options={lineOpts ? lineOpts : defaultOpts} />
                </div>
            </div>

            <div className="card bg-base-100 shadow">
                <div className="card-body">
                    <Doughnut data={donutData} options={donutOpts ? donutOpts : defaultOpts} />
                </div>
            </div>
        </div>
    );
}
