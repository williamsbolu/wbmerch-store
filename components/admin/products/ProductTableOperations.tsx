import Filter from "@/components/admin/ui/Filter";
import SortBy from "../ui/SortBy";

export default function ProductTableOperations() {
  return (
    <div className="flex items-center gap-4">
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "low-stock", label: "low stock" },
          { value: "out-of-stock", label: "Out of stock" },
        ]}
      />

      <SortBy
        options={[
          { value: "createdAt-desc", label: "Sort by date (recent first)" },
          { value: "createdAt-asc", label: "Sort by date (oldest first)" },
          { value: "price-asc", label: "Sort by price (low first)" },
          { value: "price-desc", label: "Sort by price (high first)" },
          { value: "totalStock-asc", label: "Sort by stock (low first)" },
          { value: "totalStock-desc", label: "Sort by stock (high first)" },
        ]}
      />
    </div>
  );
}
