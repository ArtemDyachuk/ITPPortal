import usersData from '@repo/ui/data/users.json';
import type { User } from '@repo/ui/users';

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = (usersData as User[]).find((u) => u.id === id);

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          User Not Found
        </h1>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <p className="text-slate-600 dark:text-slate-300">
            No user found with ID: {id}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
        User Details
      </h1>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Role</p>
              <p className="text-slate-900 dark:text-white">{user.role}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</p>
              <span
                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  user.status === "Active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}