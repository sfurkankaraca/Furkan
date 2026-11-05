"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { isClubRadioPath } from "@/components/club-radio/paths";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (isClubRadioPath(pathname)) return null;
  return <Footer />;
}
