import { CityDjLanding } from "@/components/city-dj/CityDjLanding";
import { cityDjMetadata } from "@/lib/city-dj-pages/meta";

export const metadata = cityDjMetadata("ankara-dj");

export default function AnkaraDjLandingPage() {
  return <CityDjLanding routeSlug="ankara-dj" />;
}
