import { redirect } from "next/navigation";

export const metadata = { title: "Academy | noqta" };

export default function WorkshopsPage() {
  redirect("/academy");
}
