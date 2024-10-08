export default function Button({
  variation = "primary",
  size = "medium",
  disabled,
  onClick,
  children,
}: {
  size?: "small" | "medium" | "large";
  variation?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const sizes = {
    small: "text-xs py-1 px-2 uppercase font-semibold text-center",
    medium: "text-sm py-3 px-4 font-medium",
    large: "text-base py-3 px-6 font-medium",
  };

  const variations = {
    primary: "text-indigo-50 bg-indigo-600 hover:bg-indigo-700",
    secondary:
      "text-gray-600 bg-white border border-solid border-gray-200 hover:bg-gray-50",
    danger: "bg-red-700 text-red-100 hover:bg-red-800",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-[5px] shadow-sm disabled:cursor-not-allowed ${sizes[size]} ${variations[variation]}`}
    >
      {children}
    </button>
  );
}
