import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

import Button from "@/components/admin/ui/Button";

export default function ConfirmProduct({
  resourceName,
  disabled,
  onConfirm,
  onCloseModal,
}: {
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
        Remove {resourceName}
      </h3>
      <p className="text-gray-500 text-base mb-3">
        Are you sure you want to remove this {resourceName} from your store?
      </p>

      <div className="flex gap-3 justify-end">
        <Button variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button
          variation="danger"
          disabled={disabled}
          onClick={() => {
            onCloseModal?.();
            onConfirm();
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
