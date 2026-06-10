import { UserRole } from "@prisma/client";

export default function Tag({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  if (role === "GUEST") {
    return (
      <span
        className={`w-fit uppercase text-[11px] rounded-[100px] font-semibold py-1 px-3 bg-sky-100 text-sky-700`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`w-fit uppercase text-[11px] rounded-[100px] font-semibold py-1 px-3 bg-gray-200 text-gray-700`}
    >
      {children}
    </span>
  );
}
