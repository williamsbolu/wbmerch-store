import Filter from "@/components/admin/ui/Filter";
import SortBy from "@/components/admin/ui/SortBy";

export default function OrderTableOperations() {
  return (
    <div className="flex items-center gap-4">
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "unconfirmed", label: "Unconfirmed" },
          { value: "confirmed", label: "Confirmed" },
          { value: "delivered", label: "Delivered" },
          { value: "cancelled", label: "Cancelled" },
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
