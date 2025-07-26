import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- START: Type Definitions ---
// Reusing the robust types from the previous component for consistency.

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

type DataItem = SectorItem | ControlItem | FinalCalculationItem;

// --- END: Type Definitions ---


// Type guard to filter for only ControlItem objects
const isControlItem = (item: DataItem): item is ControlItem => 'SPE' in item;

interface CompanyDetailsTableProps {
  // The component expects the data array for one company and the company's name.
  companyName: string;
  companyData: DataItem[];
}

export function CompanyDetailsTable({ companyName, companyData }: CompanyDetailsTableProps) {
  // Filter out sector and final_calculation objects to get only the control data
  const controlItems = companyData.filter(isControlItem);

  return (
    <Table>
      <TableCaption>Detailed Control Assessment for {companyName}.</TableCaption>
      <TableHeader>
        <TableRow className="bg-gray-200">
          <TableHead>SPE</TableHead>
          <TableHead>Sub Domain</TableHead>
          <TableHead>Control ID</TableHead>
          <TableHead>Control Name</TableHead>
          <TableHead>In Place?</TableHead>
          <TableHead>Target Rating</TableHead>
          <TableHead>Observed Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {controlItems.map((item, index) => (
          <TableRow key={`${item["Control ID"]}-${index}`}>
            <TableCell>{item.SPE}</TableCell>
            <TableCell>{item["Sub Domain"]}</TableCell>
            <TableCell>{item["Control ID"]}</TableCell>
            <TableCell>{item["Control Name"]}</TableCell>
            <TableCell>{item["In Place?"] || 'N/A'}</TableCell>
            <TableCell>{item["CMMI Tier Target Rating"]}</TableCell>
            <TableCell>{item["CMMI Tier Observed Rating"]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}