import { CityDjLanding } from "@/components/city-dj/CityDjLanding";
import { cityDjMetadata } from "@/lib/city-dj-pages/meta";

export const metadata = cityDjMetadata("kayseri-dj");

export default function KayseriDjLandingPage() {
  return <CityDjLanding routeSlug="kayseri-dj" />;
}
