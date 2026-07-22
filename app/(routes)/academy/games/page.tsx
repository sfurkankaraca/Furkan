import { permanentRedirect } from "next/navigation";

export default function AcademyGamesRedirectPage() {
  permanentRedirect("/games");
}
