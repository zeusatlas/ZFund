import EventDetails from "@/components/features/admin/users/EventDetails";

export const instant = false;

export default async function EventDetailsPage({ params }: { params: Promise<{ userId: string; eventId: string }> }) {
  const { userId, eventId } = await params;
  return <EventDetails userId={userId} eventId={eventId} />;
}
