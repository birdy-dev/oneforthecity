import { Container } from "@/components/Container";
import Image from "next/image";
import instagramIcon from "@/images/icons/instagram.svg";
import lumaIcon from "@/images/icons/luma.png";
import { Banner } from "./components/Banner";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <Banner />

      <main className="flex-auto">
        <Container className="relative">
          <div className="py-12">
            <div className="rounded-xl flex justify-center py-8">
              <h1 className="inline-block bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-center font-display text-5xl font-semibold tracking-tighter text-transparent sm:text-7xl">
                One for the City
              </h1>
            </div>
          </div>

          <div className="w-full max-w-96 py-16 mx-auto space-y-6">
            <a
              className="inline-flex gap-4 px-8 py-4 w-full items-center rounded-full bg-indigo-50 hover:bg-indigo-100 shadow-xs font-medium bg-opacity-80"
              href="https://lu.ma/oneforthecity"
            >
              <Image
                className="inline size-6"
                src={lumaIcon}
                alt="Luma"
              />
              <span className="text-center">
                Events on Luma calendar
              </span>
            </a>

            <a
              className="inline-flex gap-4 px-8 py-4 w-full items-center rounded-full bg-indigo-50 hover:bg-indigo-100 shadow-xs font-medium bg-opacity-80"
              href="https://www.instagram.com/oneforthecity/"
            >
              <Image
                className="inline size-6"
                src={instagramIcon}
                alt="Instagram"
              />
              <span className="text-center">
                Follow on Instagram @oneforthecity
              </span>
            </a>
          </div>

          <div className="my-16">
            <iframe
              className="w-full aspect-video rounded-xl drop-shadow-lg"
              width="800px"
              height="100%"
              src="https://www.youtube.com/embed/kcZP775yDjU?si=s7b50zvyJF79_eBa&autoplay=1&modestbranding&rel=0"
              title="YouTube one for the city battle 2024"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen={false}
            />
          </div>

          <div className="py-16 space-y-6 font-display text-2xl tracking-tight text-blue-950">
            <h2 className="font-display text-4xl font-medium tracking-tighter text-blue-600 sm:text-5xl">
              About
            </h2>
            <p>
              One for the City was founded in 2021, with the aim of supporting
              the street dance community.{" "}
              <abbr title="One for the City">OFTC</abbr>{" "}
              exceeded expectations by providing opportunities to battle, learn
              and connect with local, national and international street dance
              educators. Battles are deeply rooted in Hip-Hop culture, and are
              central to{" "}
              <abbr title="One for the City">OFTC</abbr>, celebrating Hip-Hop
              values like Love, Peace, Unity, and Having Fun. Through
              collaborations and grassroots efforts,{" "}
              <abbr title="One for the City">OFTC</abbr>{" "}
              has facilitated city-cyphers, freestyle sessions and workshops to
              more than four cities in Canada over the past three years.
            </p>
          </div>
        </Container>

        <Container>
          <div className="border rounded-lg p-8">
            <h3 className="text-center text-xl">Tools</h3>
            <Link className="inline-block rounded p-4 bg-gray-300" href="/timer">Battle Timer</Link>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
