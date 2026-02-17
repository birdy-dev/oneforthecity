import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import instagramIcon from "@/images/icons/instagram.svg";
import lumaIcon from "@/images/icons/luma.png";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Banner } from "./components/Banner";

export const Route = createFileRoute("/(index)/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Banner />

      <main className="flex-auto">
        <Container className="relative">
          <div className="py-12">
            <div className="flex justify-center rounded-xl py-8">
              <h1 className="inline-block bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-center font-display text-5xl font-semibold tracking-tighter text-transparent sm:text-7xl">
                One for the City
              </h1>
            </div>
          </div>

          <div className="mx-auto w-full max-w-96 space-y-6 py-16">
            <a
              className="bg-opacity-80 inline-flex w-full items-center gap-4 rounded-full bg-indigo-50 px-8 py-4 font-medium shadow-xs hover:bg-indigo-100"
              href="https://lu.ma/oneforthecity"
            >
              <Image className="inline size-6" src={lumaIcon} alt="Luma" height={24} width={24} />
              <span className="text-center">Events on Luma calendar</span>
            </a>

            <a
              className="bg-opacity-80 inline-flex w-full items-center gap-4 rounded-full bg-indigo-50 px-8 py-4 font-medium shadow-xs hover:bg-indigo-100"
              href="https://www.instagram.com/oneforthecity/"
            >
              <Image
                className="inline size-6"
                src={instagramIcon}
                alt="Instagram"
                height={24}
                width={24}
              />
              <span className="text-center">Follow on Instagram @oneforthecity</span>
            </a>
          </div>

          <div className="my-16">
            <iframe
              className="aspect-video w-full rounded-xl drop-shadow-lg"
              width="800px"
              height="100%"
              src="https://www.youtube.com/embed/kcZP775yDjU?si=s7b50zvyJF79_eBa&autoplay=1&modestbranding&rel=0"
              title="YouTube one for the city battle 2024"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen={false}
            />
          </div>

          <div className="space-y-6 py-16 font-display text-2xl tracking-tight text-blue-950">
            <h2 className="font-display text-4xl font-medium tracking-tighter text-blue-600 sm:text-5xl">
              About
            </h2>
            <p>
              One for the City was founded in 2021, with the aim of supporting the street dance
              community. <abbr title="One for the City">OFTC</abbr> exceeded expectations by
              providing opportunities to battle, learn and connect with local, national and
              international street dance educators. Battles are deeply rooted in Hip-Hop culture,
              and are central to <abbr title="One for the City">OFTC</abbr>, celebrating Hip-Hop
              values like Love, Peace, Unity, and Having Fun. Through collaborations and grassroots
              efforts, <abbr title="One for the City">OFTC</abbr> has facilitated city-cyphers,
              freestyle sessions and workshops to more than four cities in Canada over the past
              three years.
            </p>
          </div>
        </Container>

        <Container>
          <div className="rounded-lg border p-8">
            <h3 className="text-center text-xl">Tools</h3>
            <Link className="inline-block rounded bg-gray-300 p-4" to="/timer">
              Battle Timer
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
