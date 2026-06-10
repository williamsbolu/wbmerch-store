import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function UserAvatar() {
  const user = useCurrentUser();

  return (
    <div className="flex gap-3 items-center font-medium text-sm text-gray-600">
      <img
        src={user?.image || "/default-user.jpg"}
        className="rounded-full h-8 w-8"
        alt={user?.name || ""}
      />
      <span>{user?.name}</span>
    </div>
  );
}
