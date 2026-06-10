type StatusType = "yellow" | "sky" | "gray" | "green";

export default function OrderStatus({
  type,
  children,
}: {
  type: StatusType;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`uppercase text-[11px] rounded-[4px] py-1 px-2 font-medium bg-${type}-100 text-${type}-700`}
    >
      {children}
    </span>
  );
}
