import Stats from "@/components/Stats";
import Charts from "@/components/Charts";
import type { ChartData } from "chart.js";
import NavLayout from "../NavLayout";

export default function Dashboard() {
    const lineData: ChartData<"line"> = {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
            {
                label: "# of Votes",
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1,
            },
        ],
    };

    const donutData: ChartData<"doughnut"> = {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
            {
                label: "# of Votes",
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1,
            },
        ],
    };

    return (
        <NavLayout>
            <div className="flex-col">
                <h1>Dữ liệu thống kê</h1>
                <div className="collapse collapse-arrow bg-white my-6">
                    <input type="radio" name="statsgroup" defaultChecked />
                    <div className="collapse-title text-xl font-medium">Trò chơi</div>
                    <div className="collapse-content">
                        <div className="flex-col">
                            <Stats />
                            <Charts lineData={lineData} donutData={donutData} />
                        </div>
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-white my-6">
                    <input type="radio" name="statsgroup" />
                    <div className="collapse-title text-xl font-medium">Người dùng</div>
                    <div className="collapse-content">
                        <div className="flex-col">
                            <Stats />
                            <Charts lineData={lineData} donutData={donutData} />
                        </div>
                    </div>
                </div>
                <div className="collapse collapse-arrow bg-white my-6">
                    <input type="radio" name="statsgroup" />
                    <div className="collapse-title text-xl font-medium">Thương hiệu</div>
                    <div className="collapse-content">
                        <Stats />
                        <Charts lineData={lineData} donutData={donutData} />
                    </div>
                </div>
            </div>
        </NavLayout>
    );
}
