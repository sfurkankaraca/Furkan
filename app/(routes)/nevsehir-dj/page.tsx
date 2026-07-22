import { CityDjLanding } from "@/components/city-dj/CityDjLanding";
import { cityDjMetadata } from "@/lib/city-dj-pages/meta";

export const metadata = cityDjMetadata("nevsehir-dj");

export default function NevsehirDjLandingPage() {
  return <CityDjLanding routeSlug="nevsehir-dj" />;
}
