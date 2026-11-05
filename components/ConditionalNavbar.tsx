"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { isClubRadioPath } from "@/components/club-radio/paths";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  if (isClubRadioPath(pathname)) return null;
  return <Navbar />;
}
