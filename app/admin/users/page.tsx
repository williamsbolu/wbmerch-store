import { Suspense } from "react";
import CreateUsersForm from "@/components/admin/users/CreateUsersForm";
import UserSkeletonLoader from "@/components/admin/users/UserSkeletonLoader";
import UserTableContainer from "@/components/admin/users/UserTableContainer";

export default function Page() {
  return (
    <>
      <div className="grid gap-6">
        <h1 className="text-2xl font-semibold">Create a new user</h1>
        <CreateUsersForm />
      </div>

      <div>
        <h3 className="text-xl font-medium mb-4 px-1">All users</h3>
        <div
          className="border border-solid border-gray-200 text-sm bg-white rounded-[7px]"
          role="table"
        >
          <div
            className="grid grid-cols-[2fr_2fr_0.6fr_0.7fr_1fr_0.5fr] gap-6 items-center py-6 px-6 bg-gray-50 border-b border-solid border-gray-100 uppercase tracking-wide font-semibold text-gray-600"
            role="row"
          >
            <div className="">Display Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Role</div>
            <div className="">Created</div>
          </div>

          <Suspense fallback={<UserSkeletonLoader />}>
            <UserTableContainer />
          </Suspense>
        </div>
      </div>
    </>
  );
}
