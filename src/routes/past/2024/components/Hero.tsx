import { BackgroundImage } from "@/components/BackgroundImage";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export function Hero() {
  return (
    <div className="relative py-20 sm:pt-36 sm:pb-24">
      <BackgroundImage className="-top-36 -bottom-14" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:max-w-4xl lg:px-12">
          <h1 className="font-display text-5xl font-semibold tracking-tighter text-blue-600 sm:text-6xl">
            <span className="sr-only">One for the City Vol. 4</span>One for the City{" "}
            <span className="whitespace-nowrap text-blue-900">Vol. 4</span>
          </h1>
          <div className="mt-6 space-y-6 font-display text-2xl tracking-tight text-blue-900">
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
            <p>
              As we reflect on the success of previous <abbr title="One for the City">OFTC</abbr>{" "}
              events and their positive impacts on the street dance community, we are thrilled to
              announce the fourth volume on June 29th and 30th, 2024 in Edmonton. With a two day
              event,{"  "}
              <abbr title="One for the City">OFTC</abbr> promises even more opportunities for
              artists to showcase their skills, connect with peers, and learn from industry
              professionals. This season, let's enhance the vibrant street dance culture in Alberta
              and beyond.
            </p>
          </div>
          <Button href="/tickets" className="mt-10 w-full sm:hidden">
            Tickets & Registration
          </Button>
          <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 sm:mt-16 sm:gap-x-16 sm:gap-y-10 sm:text-center lg:auto-cols-auto lg:grid-flow-col lg:grid-cols-none lg:justify-start lg:text-left">
            {[
              ["2 Day Event", "June 29-30"],
              ["Edmonton, Alberta", "St. Basil's Cultural Centre"],
              ["Breaking & Open Style", "Crew vs Crew Battle"],
            ].map(([name, value]) => (
              <div key={name}>
                <dt className="font-mono text-sm text-blue-600">{name}</dt>
                <dd className="mt-0.5 text-2xl font-semibold tracking-tight text-blue-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mx-auto flex max-w-2xl justify-center pt-12 lg:max-w-4xl lg:px-12">
          <iframe
            className="h-72 w-full rounded-xl shadow-sm lg:h-96"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d9491.3685338932!2d-113.5099987!3d53.5070154!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a021ffa16b56c5%3A0x78ca962164391760!2sSt%20Basil&#39;s%20Cultural%20Centre!5e0!3m2!1sen!2sca!4v1710199056276!5m2!1sen!2sca"
            width="600"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google map of St. Basil's Cultural Centre"
          />
        </div>
      </Container>
    </div>
  );
}
