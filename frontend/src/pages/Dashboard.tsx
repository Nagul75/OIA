// Your page file, e.g., src/app/page.tsx or src/app/dashboard/page.tsx

"use client";

import { useState, useMemo } from "react";
import data from "@/data/data";
import Header from "@/components/Header";
import SelectQuery from "@/components/SelectQuery";
import MaturityAreaChart from "@/components/charts/MaturityAreaChart";


type DataItem = {
  SPE?: string;
  "Sub Domain"?: string;
  "Control ID"?: string;
  sector?: string;
  final_calculation?: object;
};

// This type guard function remains the same and works correctly.
function isControl(item: DataItem): item is { SPE: string; "Sub Domain": string; "Control ID": string } {
    return typeof item.SPE === 'string' && typeof item["Sub Domain"] === 'string';
}


const Dashboard = () => {
  const organizationOptions = useMemo(() => {
    return Object.keys(data).sort();
  }, []);

  const getDomainOptions = (org: string): string[] => {
    if (!org || !data[org as keyof typeof data]) return [];
    
    const controls = data[org as keyof typeof data].filter(isControl);
    const domains = controls.map((item) => item.SPE);

    // FIX: Filter out 'undefined' values to guarantee a 'string[]' return type.
    const definedDomains = domains.filter((d): d is string => d !== undefined);

    return [...new Set(definedDomains)];
  };

  const getSubdomainOptions = (org: string, dom: string): string[] => {
    if (!org || !dom || !data[org as keyof typeof data]) return [];
    
    const controls = data[org as keyof typeof data]
      .filter(isControl)
      .filter((item) => item.SPE === dom);
    const subdomains = controls.map((item) => item["Sub Domain"]);

    // FIX: Filter out 'undefined' values here as well.
    const definedSubdomains = subdomains.filter((sd): sd is string => sd !== undefined);

    return [...new Set(definedSubdomains)];
  };

  // The rest of your component logic remains the same...
  const [organization, setOrganization] = useState<string>(
    organizationOptions[0] || ""
  );
  const [domain, setDomain] = useState<string>(
    () => getDomainOptions(organizationOptions[0] || "")[0] || ""
  );
  const [subdomain, setSubdomain] = useState<string>(
    () =>
      getSubdomainOptions(
        organizationOptions[0] || "",
        getDomainOptions(organizationOptions[0] || "")[0] || ""
      )[0] || ""
  );

  const domainOptions = useMemo(
    () => getDomainOptions(organization),
    [organization]
  );
  const subdomainOptions = useMemo(
    () => getSubdomainOptions(organization, domain),
    [organization, domain]
  );

  const handleOrganizationChange = (newOrg: string) => {
    setOrganization(newOrg);
    const newDomainOptions = getDomainOptions(newOrg);
    const newFirstDomain = newDomainOptions[0] || "";
    setDomain(newFirstDomain);
    const newSubdomainOptions = getSubdomainOptions(newOrg, newFirstDomain);
    setSubdomain(newSubdomainOptions[0] || "");
  };

  const handleDomainChange = (newDomain: string) => {
    setDomain(newDomain);
    const newSubdomainOptions = getSubdomainOptions(organization, newDomain);
    setSubdomain(newSubdomainOptions[0] || "");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="pt-20 p-8 flex flex-col gap-2">
        <div className="bg-gray-200 py-1 px-1 rounded-sm">
          <div className="w-full h-full flex flex-wrap justify-around items-center bg-white">
            <SelectQuery
              label="Select Organization"
              value={organization}
              onValueChange={handleOrganizationChange}
              options={organizationOptions}
              placeholder="Select an organization"
            />
            <SelectQuery
              label="Select Domain"
              value={domain}
              onValueChange={handleDomainChange}
              options={domainOptions}
              placeholder="Select a domain"
            />
            <SelectQuery
              label="Select Subdomain"
              value={subdomain}
              onValueChange={setSubdomain}
              options={subdomainOptions}
              placeholder="Select a subdomain"
            />
          </div>
        </div>

        <div className="bg-gray-200 py-1 px-1 rounded-sm">
            <div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;