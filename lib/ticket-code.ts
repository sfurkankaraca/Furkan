import { randomBytes } from "node:crypto";

export function makeTicketCode(): string {
  return randomBytes(12).toString("base64url").toUpperCase().slice(0, 16);
}
