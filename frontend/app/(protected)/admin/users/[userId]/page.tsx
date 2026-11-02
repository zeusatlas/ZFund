import UserDetails from "@/components/features/admin/users/UserDetails";

export const dynamic = "force-dynamic";

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <UserDetails userId={userId} />;
}
