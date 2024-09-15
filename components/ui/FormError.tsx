import { BsExclamationTriangle } from "react-icons/bs";

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="bg-[#EF444426] p-3 rounded-md flex items-center gap-x-2 text-sm text-[#EF4444]">
      <BsExclamationTriangle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
}
