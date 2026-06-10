import Filter from "@/components/admin/ui/Filter";
import SortBy from "@/components/admin/ui/SortBy";

export default function OrderTableOperations() {
  return (
    <div className="flex items-center gap-4">
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "pending", label: "Pending" },
          { value: "confirmed", label: "Confirmed" },
          { value: "delivered", label: "Delivered" },
          { value: "cancelled", label: "Cancelled" },
        ]}
      />

      <SortBy
        options={[
          { value: "createdAt-desc", label: "Sort by date (recent first)" },
          { value: "createdAt-asc", label: "Sort by date (oldest first)" },
          { value: "totalAmount-asc", label: "Sort by amount (low first)" },
          { value: "totalAmount-desc", label: "Sort by amount (high first)" },
        ]}
      />
    </div>
  );
}
