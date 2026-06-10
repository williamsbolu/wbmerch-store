import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

import { CiCircleQuestion } from "react-icons/ci";
import Button from "@/components/ui/Button";

export default function ConfirmDelete({
  resourceName,
  onConfirm,
  disabled,
  onCloseModal,
}: {
  resourceName: string;
  onConfirm: () => void;
  disabled: boolean;
  onCloseModal?: () => void;
}) {
  return (
    <div
      className={`${inter.className} p-4 pt-10 text-center min-[440px]:w-[400px] md:pt-12`}
    >
      <span className="inline-block w-fit mx-auto">
        <CiCircleQuestion className="w-12 h-12 text-primary/80 md:w-14 md:h-14" />
      </span>
      <p className="mt-1">
        Are you sure you want to delete this {resourceName}?
      </p>
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button
          type="button"
          variation="transparent"
          classes={["h-[44px] flex items-center justify-center"]}
          ring={false}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variation="primary"
          classes={["h-[44px] flex items-center justify-center"]}
          ring={false}
          onClick={onConfirm}
          disabled={disabled}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
