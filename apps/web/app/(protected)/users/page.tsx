import { UsersTable } from "@repo/ui/users";
import type { User } from "@repo/ui/users";
import usersData from "@repo/ui/data/users.json";

export default function UsersPage() {
  return (
    <div className="p-8">
      <UsersTable users={usersData as User[]} />
    </div>
  );
}
