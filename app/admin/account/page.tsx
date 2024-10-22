import UpdatePasswordForm from "@/components/admin/users/UpdatePasswordForm";
import UpdateUserForm from "@/components/admin/users/UpdateUserForm";

export default function Page() {
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
