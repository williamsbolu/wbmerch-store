import Image from "next/image";
import { currentUser } from "@/lib/auth";
import userIconImage from "@/public/default-user.jpg";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function UserAvatar() {
  const user = useCurrentUser();
  // TODO: Add the users name to the alt text when i implement the user profile image upload

  return (
    <div className="flex gap-3 items-center font-medium text-sm text-gray-600">
      <Image src={userIconImage} width={32} alt="user-icon" />
      <span>{user?.name}</span>
    </div>
  );
}
