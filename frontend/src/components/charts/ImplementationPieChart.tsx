import { VictoryPie, VictoryLegend, VictoryLabel } from 'victory';

// --- TypeScript Interfaces ---

interface FinalCalculation {
  final_calculation: object;
}

// Updated interface with specific properties to avoid using 'any'
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

interface PieChartProps {
  chartData: RawCompanyData;
  title: string;
}

// --- React Component (No other changes needed) ---

const ImplementationPieChart = ({ chartData, title }: PieChartProps) => {
  // --- Process Data ---
  const processDataForPieChart = (data: RawCompanyData) => {
    const counts = {
      Implemented: 0,
      Partial: 0,
      "Not Implemented": 0,
    };

    data.forEach(record => {
      if ("Control ID" in record) {
        switch (record["In Place?"]) {
          case "Y":
            counts.Implemented++;
            break;
          case "P":
            counts.Partial++;
            break;
          case "N":
            counts["Not Implemented"]++;
            break;
          default:
            break;
        }
      }
    });
    
    const total = counts.Implemented + counts.Partial + counts["Not Implemented"];
    if (total === 0) return [];

    return [
      { x: "Implemented", y: counts.Implemented, percentage: Math.round((counts.Implemented / total) * 100) },
      { x: "Partial", y: counts.Partial, percentage: Math.round((counts.Partial / total) * 100) },
      { x: "Not Implemented", y: counts["Not Implemented"], percentage: Math.round((counts["Not Implemented"] / total) * 100) },
    ].filter(item => item.y > 0);
  };

  const processedChartData = processDataForPieChart(chartData);
  const colorScale = ["#b39ddb", "#039be5", "#424242"];

  return (
    <div className="inline-block p-4">
      <h3 className="mb-6">{title}</h3>
      <div className="flex items-center w-full gap-x-8">
        {/* Chart Container - Increased size */}
        <div className="w-[250px] h-[250px]">
            <VictoryPie
                innerRadius={80}
                labelRadius={105}
                labels={({ datum }) => `${datum.percentage}%`}
                labelComponent={<VictoryLabel style={{ fill: 'white', fontSize: 18, fontWeight: 'bold' }} />}
                colorScale={colorScale}
                data={processedChartData}
                padding={10}
            />
        </div>
        
        {/* HTML Legend Container */}
        <div className="flex flex-col gap-2.5">
            {processedChartData.map((item, index) => (
                <div key={item.x} className="flex items-center text-sm">
                    <div
                        className="w-3 h-3 rounded-full mr-2 shrink-0"
                        style={{ backgroundColor: colorScale[index % colorScale.length] }}
                    ></div>
                    <span>{item.x}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ImplementationPieChart;