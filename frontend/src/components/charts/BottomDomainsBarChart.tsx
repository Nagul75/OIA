import {
    VictoryBar,
    VictoryChart,
    VictoryAxis,
    VictoryTheme,
    VictoryLabel,
} from "victory";
import { interpolateBlues } from "d3-scale-chromatic";

// --- TypeScript Interfaces ---

interface SpeSummaryItem {
    domain_average: number;
    subdomain_averages: {
        [key: string]: number;
    };
}

interface SpeDomainSummary {
    [key: string]: SpeSummaryItem;
}

interface FinalCalculation {
    final_calculation: {
        spe_domain_summary: SpeDomainSummary;
        overall_domain_score: number;
        maturity_percent: number;
    };
}

interface ControlRecord {
    SPE: string;
    "Sub Domain": string;
    "Control ID": string;
    "Control Name": string;
    "Control Name.1": string | null;
    "In Place?": "Y" | "P" | "N" | string | null;
    "CMMI Tier Target Rating": string;
    "CMMI Tier Observed Rating": string;
}

type RawCompanyData = Array<ControlRecord | FinalCalculation>;

interface BarChartProps {
    companyData: RawCompanyData;
    title: string;
}

// --- React Component ---

const BottomDomainsBarChart = ({ companyData, title }: BarChartProps) => {
    const processDataForBarChart = (data: RawCompanyData) => {
        const calculations = (
            data.find((item) => "final_calculation" in item) as
                | FinalCalculation
                | undefined
        )?.final_calculation;
        if (!calculations) return [];

        const { spe_domain_summary } = calculations;

        return Object.keys(spe_domain_summary)
            .map((speKey) => ({
                x: speKey.replace("SPE-Domain-", "SPE"),
                y: spe_domain_summary[speKey].domain_average,
            }))
            .sort((a, b) => a.y - b.y)
            .slice(0, 5);
    };

    const chartData = processDataForBarChart(companyData);

    const generateColorScale = (numColors: number) => {
        if (numColors === 1) return ["#1976d2"];
        const colorPoints = Array.from(
            { length: numColors },
            (_, i) => i / (numColors - 1)
        );
        const startPoint = 0.8;
        const range = 0.5;
        // Using a wider range of interpolation (0.9 instead of 0.7) for more distinct shades
        return colorPoints.map(t => interpolateBlues(startPoint - (t * range)));
    };

    const blueColorScale = generateColorScale(chartData.length);

    return (
        <div className="max-w-lg">
            <h3>{title}</h3>
            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={{ x: 30 }}
                height={250}
                width={400}
            >
                <VictoryAxis />
                <VictoryBar
                    data={chartData}
                    // The 'style' prop is removed, so it uses the theme's default colors
                    barWidth={25}
                    labels={({ datum }) => datum.y}
                    labelComponent={<VictoryLabel dy={-10} />}
                    style={{
                        data: {
                            fill: ({ index }) =>
                                blueColorScale[index as number],
                        },
                        labels: {
                            // Ensure labels are visible on a light background
                            fill: "black",
                        },
                    }}
                />
            </VictoryChart>
        </div>
    );
};

export default BottomDomainsBarChart;
