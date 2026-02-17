import { Image } from "@unpic/react";
import { Container } from "@/components/Container";
import backgroundImage from "@/images/background-newsletter.jpg";
import instagramImage from "@/images/icons/instagram.svg";

export function Newsletter() {
  return (
    <section id="newsletter" aria-label="Newsletter">
      <Container>
        <div className="relative -mx-4 overflow-hidden bg-indigo-50 px-4 py-20 sm:-mx-6 sm:px-6 md:mx-0 md:rounded-5xl md:px-16 xl:px-24 xl:py-36">
          <Image
            className="absolute top-0 left-1/2 translate-x-[-10%] translate-y-[-45%] lg:translate-x-[-32%]"
            src={backgroundImage}
            alt=""
            width={919}
            height={1351}
            unoptimized
          />
          <div className="relative mx-auto grid max-w-2xl grid-cols-1 gap-x-32 gap-y-14 xl:max-w-none xl:grid-cols-2">
            <div>
              <p className="font-display text-4xl font-medium tracking-tighter text-blue-900 sm:text-5xl">
                Stay up to date
              </p>
              <p className="mt-4 text-lg tracking-tight text-blue-900">
                Be the first to get updates on One for the City.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-blue-900">
                Follow us{" "}
                <span className="inline-block animate-bounce" aria-hidden="true">
                  &darr;
                </span>
              </h3>
              <div className="py-10">
                <a
                  className="bg-opacity-80 inline-block rounded-lg bg-indigo-600 px-6 py-4 font-semibold text-white"
                  href="https://www.instagram.com/oneforthecity/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    className="inline w-6"
                    src={instagramImage}
                    alt="Instagram logo"
                    height={24}
                    width={24}
                  />{" "}
                  @oneforthecity
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
