import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

import Button from "@/components/admin/ui/Button";

export default function ConfirmOrder({
  type,
  heading,
  confirmationText,
  disabled = false,
  onConfirm,
  onCloseModal,
  variation,
}: {
  type: "Confirm" | "Cancel";
  heading: string;
  confirmationText: string;
  onConfirm: () => void;
  disabled: boolean;
  variation?: "primary" | "secondary" | "danger" | "success";
  onCloseModal?: () => void;
}) {
  return (
    <div
      className={`${poppins.className} w-[480px] py-8 px-8 flex flex-col gap-3`}
    >
      <h3 className="text-xl font-medium text-gray-700">{heading}</h3>
      <p className="text-gray-500 text-base mb-3">{confirmationText}</p>

      <div className="flex gap-3 justify-end">
        <Button variation="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button
          variation={variation}
          disabled={disabled}
          onClick={() => {
            onCloseModal?.();
            onConfirm();
          }}
        >
          {type}
        </Button>
      </div>
    </div>
  );
}
