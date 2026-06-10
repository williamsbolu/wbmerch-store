import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

import Button from "@/components/admin/ui/Button";

export default function ConfirmDelete({
  type = "delete",
  resourceName,
  disabled,
  onConfirm,
  onCloseModal,
}: {
  type?: "delete" | "remove";
  resourceName: string;
  onConfirm: () => void;
  disabled: boolean;
  onCloseModal?: () => void;
}) {
  return (
    <div
      className={`${poppins.className} w-[480px] py-8 px-8 flex flex-col gap-3`}
    >
      <h3 className="text-xl font-medium text-gray-700">
        {type === "delete" ? "Delete" : "Remove"} {resourceName}
      </h3>
      <p className="text-gray-500 text-base mb-3">
        Are you sure you want to {type === "delete" ? "delete" : "remove"} this{" "}
        {resourceName} {type === "delete" && "permanently"}? This action cannot
        be undone.
      </p>

      <div className="flex gap-3 justify-end">
        <Button variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button variation="danger" disabled={disabled} onClick={onConfirm}>
          {type === "delete" ? "Delete" : "Remove"}
        </Button>
      </div>
    </div>
  );
}
