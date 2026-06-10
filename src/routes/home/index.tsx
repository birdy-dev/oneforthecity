import { buttonStyles } from "@/components/Button";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { cn } from "@/utils/cn";
import { getStoreEnabled } from "@/utils/store_enabled.functions";
import instagramIcon from "@/images/icons/instagram.svg";
import lumaIcon from "@/images/icons/luma.png";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { StoreIcon } from "lucide-react";
import { Banner } from "./-components/Banner";
import { Gallery } from "./-components/Gallery";

export const Route = createFileRoute("/home/")({
  loader: async () => getStoreEnabled(),
  component: Home,
});

function Home() {
  const { isStoreEnabled } = Route.useLoaderData();

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
            {isStoreEnabled ? (
              <Link
                className={cn(
                  buttonStyles,
                  "w-full gap-4 rounded-full px-8 py-4 font-medium shadow-xs",
                )}
                to="/store"
              >
                <StoreIcon className="size-6" aria-hidden="true" />
                <span className="text-center">Merch</span>
              </Link>
            ) : null}

            <a
              className={cn(
                buttonStyles,
                "w-full gap-4 rounded-full px-8 py-4 font-medium shadow-xs",
              )}
              href="https://lu.ma/oneforthecity"
            >
              <Image className="inline size-6" src={lumaIcon} alt="Luma" height={24} width={24} />
              <span className="text-center">Luma - Upcoming events</span>
            </a>

            <a
              className={cn(
                buttonStyles,
                "w-full gap-4 rounded-full px-8 py-4 font-medium shadow-xs",
              )}
              href="https://www.instagram.com/oneforthecity/"
            >
              <Image
                className="inline size-6"
                src={instagramIcon}
                alt="Instagram"
                height={24}
                width={24}
              />
              <span className="text-center">Instagram @oneforthecity</span>
            </a>
          </div>

          <div className="my-16">
            <iframe
              className="aspect-video w-full rounded-xl drop-shadow-lg"
              width="800px"
              height="100%"
              src="https://www.youtube.com/embed/GsqcvCIaflQ?si=0c98Mej6GSL8i4OQ&autoplay=1&modestbranding&rel=0"
              title="YouTube one for the city battle 2024"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen={false}
            />
          </div>

          <Gallery />
        </Container>

        <Container>
          <div className="rounded-lg border p-8">
            <h3 className="text-center text-xl">Tools</h3>
            <Link
              className={cn(buttonStyles, "inline-flex rounded-full px-5 py-3 text-sm")}
              to="/timer"
            >
              Battle Timer
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
