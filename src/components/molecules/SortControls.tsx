import { Button } from "@/components/atoms";
import type { SortConfig, SortField } from "@/types";

interface SortControlsProps {
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
}

export const SortControls = ({ sortConfig, onSortChange }: SortControlsProps) => {
  const fields: { field: SortField; label: string }[] = [
    { field: "name", label: "Name" },
    { field: "email", label: "Email" },
    { field: "company", label: "Company" },
  ];

  const handleFieldChange = (field: SortField) => {
    if (sortConfig.field === field) {
      onSortChange({ field, order: sortConfig.order === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({ field, order: "asc" });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-neutral-700 leading-none">Sort by:</span>
      {fields.map(({ field, label }) => {
        const isActive = sortConfig.field === field;
        const arrow = isActive ? (sortConfig.order === "asc" ? " ↑" : " ↓") : "";

        return (
          <Button
            key={field}
            variant={isActive ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleFieldChange(field)}
            aria-label={`Sort by ${label} ${isActive ? (sortConfig.order === "asc" ? "ascending" : "descending") : ""}`}
          >
            {label}
            {arrow}
          </Button>
        );
      })}
    </div>
  );
};
