export const BOOKING_EVENT_TYPES = [
  "booking.created.v1",
  "booking.handover.task_completed.v1",
  "booking.handover.completed.v1",
  "booking.cancelled.v1",
] as const;

export type BookingEventType = (typeof BOOKING_EVENT_TYPES)[number];
