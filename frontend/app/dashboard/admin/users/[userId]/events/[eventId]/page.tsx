import { notFound } from "next/navigation";
import { hostAccounts } from "@/components/features/admin/dashboard/data";
import EventDetails from "@/components/features/admin/users/EventDetails";
import { getUserEvent } from "@/components/features/admin/users/user-data";

export const instant = false;

export default async function EventDetailsPage({ params }: { params: Promise<{ userId: string; eventId: string }> }) {
  const { userId, eventId } = await params;
  const user = hostAccounts.find((host) => host.id === userId);
  if (!user) notFound();
  const event = getUserEvent(user, eventId);
  if (!event) notFound();
  return <EventDetails user={user} event={event} />;
}
