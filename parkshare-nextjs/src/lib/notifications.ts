// Email notification stubs — wire up to Resend/Supabase Edge Functions when backend is ready

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export async function sendBookingConfirmationEmail(payload: {
  driverEmail: string;
  driverName: string;
  slotName: string;
  date: string;
  startTime: string;
  endTime: string;
  total: number;
}): Promise<void> {
  const email: EmailPayload = {
    to: payload.driverEmail,
    subject: `Booking Confirmed – ${payload.slotName}`,
    body: `Hi ${payload.driverName}, your booking at ${payload.slotName} on ${payload.date} from ${payload.startTime} to ${payload.endTime} is confirmed. Total: ₱${payload.total}.`,
  };
  console.log("[EMAIL STUB] Would send:", email);
  // TODO: Replace with: await resend.emails.send({ from: 'ParkShare <noreply@parkshare.ph>', ...email });
}

export async function sendNewBookingAlertToHost(payload: {
  hostEmail: string;
  hostName: string;
  driverName: string;
  slotName: string;
  date: string;
  startTime: string;
  endTime: string;
}): Promise<void> {
  const email: EmailPayload = {
    to: payload.hostEmail,
    subject: `New Booking for ${payload.slotName}`,
    body: `Hi ${payload.hostName}, ${payload.driverName} has booked your slot "${payload.slotName}" on ${payload.date} from ${payload.startTime} to ${payload.endTime}.`,
  };
  console.log("[EMAIL STUB] Would send:", email);
}

export async function sendNewMessageEmail(payload: {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  messagePreview: string;
}): Promise<void> {
  const email: EmailPayload = {
    to: payload.recipientEmail,
    subject: `New message from ${payload.senderName} on ParkShare`,
    body: `Hi ${payload.recipientName}, you have a new message from ${payload.senderName}: "${payload.messagePreview}". Log in to reply.`,
  };
  console.log("[EMAIL STUB] Would send:", email);
}
