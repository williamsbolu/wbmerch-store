import { auth } from "@/auth";
import UpdatePasswordForm from "@/components/admin/users/UpdatePasswordForm";
import UpdateUserForm from "@/components/admin/users/UpdateUserForm";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session || session.user.role === "USER") {
    return notFound();
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">Update your account</h1>
      <UpdateUserForm />

      <div>
        <h3 className="text-xl font-medium mb-3">Update password</h3>
        <UpdatePasswordForm />
      </div>
    </>
  );
}
