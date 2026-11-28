import { Hero } from "./components/hero";
import { Newsletter } from "./components/newsletter";
import { Schedule } from "./components/schedule";
import { People } from "./components/people";
import { Hotels } from "./components/hotels";
import { Sponsors } from "./components/sponsors";

export default function Page() {
  return (
    <>
      <Hero />
      <People />
      <Schedule />
      <Hotels />
      <Sponsors />
      <Newsletter />
    </>
  );
}
