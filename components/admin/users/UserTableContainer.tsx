import React from "react";
import UserRow from "@/components/admin/users/UserRow";
import { getApplicationUsers } from "@/data/user";

export default async function UserTableContainer() {
  const { data } = await getApplicationUsers();

  if (data.length === 0) {
    return (
      <p className="text-base text-center m-6">No data to show at the moment</p>
    );
  }

  return (
    <section className="my-2">
      {data.map((user) => (
        <UserRow key={user.id} user={user} />
      ))}
    </section>
  );
}
