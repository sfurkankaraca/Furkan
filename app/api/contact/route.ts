import { NextResponse } from "next/server";
import { sendContactMail } from "@/lib/mail/send";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, subject, message } = body || {};
  const res = await sendContactMail({ name, email, subject, message });
  return NextResponse.json(res);
}
