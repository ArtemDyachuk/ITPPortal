export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  avatar: string | null;
}

export type UserStatus = "All" | "Active" | "Inactive";
