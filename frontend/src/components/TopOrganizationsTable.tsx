import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- START: Improved Type Definitions ---

// Defines the structure of the final_calculation object
interface FinalCalculation {
  spe_domain_summary: {
    [domain: string]: {
      domain_average: number;
      subdomain_averages: {
        [subdomain: string]: number;
      };
    };
  };
  overall_domain_score: number;
  maturity_percent: number;
}

// Defines the three distinct object shapes found in your data arrays.
// Using these specific interfaces creates a stronger "discriminated union".
interface SectorItem {
  sector: string;
}

interface ControlItem {
  SPE: string;
  "Sub Domain": string;
  "Control ID": string;
  "Control Name": string;
  "Control Name.1": string | null;
  "In Place?": string | null;
  "CMMI Tier Target Rating": string;
  "CMMI Tier Observed Rating": string;
}

interface FinalCalculationItem {
  final_calculation: FinalCalculation;
}

// DataItem is now a union of the possible object shapes.
// An item in the array must be one of these types.
type DataItem = SectorItem | ControlItem | FinalCalculationItem;

// The main data prop type, mapping a company name to its array of data items.
interface DataProp {
  [companyName: string]: DataItem[];
}

// The processed and structured data for a single organization.
interface Organization {
  name: string;
  sector: string;
  targetedScore: number;
  observedScore: number;
  maturityPercent: number;
  topDomain: string;
}

// --- END: Improved Type Definitions ---


// Helper function to find the top-scoring domain
const getTopDomain = (summary: FinalCalculation['spe_domain_summary']): string => {
  return Object.entries(summary).reduce(
    (top, [domain, values]) => {
      return values.domain_average > top.maxScore
        ? { domainName: domain, maxScore: values.domain_average }
        : top;
    },
    { domainName: "N/A", maxScore: -Infinity }
  ).domainName;
};

// Type guards to help TypeScript identify object shapes
const isSectorItem = (item: DataItem): item is SectorItem => 'sector' in item;
const isFinalCalcItem = (item: DataItem): item is FinalCalculationItem => 'final_calculation' in item;


export function TopOrganizationsTable({ data }: { data: DataProp }) {
  // Process the raw data from the prop into a clean array for the table
  const organizations: Organization[] = Object.keys(data).map(companyName => {
    const companyData = data[companyName];

    // Find the relevant data points using the type guards
    const sectorItem = companyData.find(isSectorItem);
    const finalCalcItem = companyData.find(isFinalCalcItem);

    const finalCalc = finalCalcItem?.final_calculation;

    return {
      name: companyName,
      sector: sectorItem?.sector || "N/A",
      targetedScore: 5,
      observedScore: finalCalc?.overall_domain_score || 0,
      maturityPercent: finalCalc?.maturity_percent || 0,
      topDomain: finalCalc ? getTopDomain(finalCalc.spe_domain_summary) : "N/A",
    };
  });

  // Sort organizations by maturity and take the top 5
  const topOrganizations = organizations
    .sort((a, b) => b.maturityPercent - a.maturityPercent)
    .slice(0, 5);

  return (
    <Table>
      <TableCaption>Top 5 Organizations by Maturity</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Sector</TableHead>
          <TableHead>Targeted Score</TableHead>
          <TableHead>Observed Score</TableHead>
          <TableHead>Top Domain</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topOrganizations.map((org) => (
          <TableRow key={org.name}>
            <TableCell>{org.name}</TableCell>
            <TableCell>{org.sector}</TableCell>
            <TableCell>{org.targetedScore}</TableCell>
            <TableCell>{org.observedScore.toFixed(2)}</TableCell>
            <TableCell>{org.topDomain}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}