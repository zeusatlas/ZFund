import { notFound } from "next/navigation";
import UserDetails from "@/components/features/admin/users/UserDetails";
import { hostAccounts } from "@/components/features/admin/dashboard/data";

export const instant = false;

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = hostAccounts.find((host) => host.id === userId);

  if (!user) notFound();

  return <UserDetails userId={user.id} />;
}
