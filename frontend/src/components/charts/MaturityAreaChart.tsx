import {
    VictoryArea,
    VictoryChart,
    VictoryScatter,
    VictoryAxis,
    VictoryLegend,
    VictoryTheme,
} from "victory";

import { interpolateBlues } from "d3-scale-chromatic";

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
}

type RawCompanyData = Array<ControlRecord | FinalCalculation>;

interface ChartPoint {
    x: string;
    y: number;
}

export interface ChartDataForComponent {
    name: string;
    rawData: RawCompanyData;
}

interface MaturityAreaChartProps {
    chartData: ChartDataForComponent[];
    title: string;
}

// --- Helper Function (remains the same) ---

const formatDataForAreaChart = (companyData: RawCompanyData): ChartPoint[] => {
    const calculations = (
        companyData.find((item) => "final_calculation" in item) as
            | FinalCalculation
            | undefined
    )?.final_calculation;
    if (!calculations) return [];
    const { spe_domain_summary } = calculations;
    return Object.keys(spe_domain_summary).map((speKey) => ({
        x: speKey.replace("SPE-Domain-", "SPE"),
        y: spe_domain_summary[speKey].domain_average,
    }));
};

// --- React Component ---

const MaturityAreaChart = ({ chartData, title }: MaturityAreaChartProps) => {
    // Data processing is simple again, no need for nested names
    const processedChartData = chartData.map((company) => ({
        name: company.name,
        data: formatDataForAreaChart(company.rawData),
    }));

    const generateColorScale = (numColors: number) => {
        if (numColors === 1) return ["#1976d2"]; // Return a single color if only one item
        // interpolateBlues takes a value from 0 to 1.
        // We create 'numColors' evenly spaced points in that range.
        const colorPoints = Array.from({ length: numColors }, (_, i) => i / (numColors - 1));
        return colorPoints.map(t => interpolateBlues(1 - t * 0.7)); // Use 0.7 to avoid very light colors
    };

    const blueColorScale = generateColorScale(processedChartData.length);

    return (
        <div>
            <h3>{title}</h3>
            <VictoryChart
                theme={VictoryTheme.material}
                width={800}
                height={400}
                padding={{ top: 30, bottom: 85, left: 50, right: 50 }}
                domainPadding={{ x: 25 }}
            >
                <VictoryAxis dependentAxis domain={[0, 5]} />
                <VictoryAxis />

                {/* Render the Area charts */}
                {processedChartData.map((company, index) => (
                    <VictoryArea
                        key={`${company.name}-area`}
                        data={company.data}
                        interpolation="natural"
                        style={{
                            data: {
                                fill: blueColorScale[index],
                                stroke: blueColorScale[index],
                                strokeWidth: 2,
                                fillOpacity: 0.4
                            }
                        }}
                    />
                ))}

                {/* Render the Scatter points on top */}
                {processedChartData.map((company, index) => (
                    <VictoryScatter
                        key={`${company.name}-scatter`}
                        data={company.data}
                        size={4} // You can adjust the size of the dots
                        style={{
                            data: {
                                fill: blueColorScale[index]
                            }
                        }}
                    />
                ))}

                <VictoryLegend
                    x={275}
                    y={350}
                    orientation="horizontal"
                    gutter={25}
                    colorScale={blueColorScale}
                    data={processedChartData.map((company) => ({
                        name: company.name,
                    }))}
                />
            </VictoryChart>
        </div>
    );
};

export default MaturityAreaChart;
