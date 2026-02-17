"use client";

import { Tab } from "@headlessui/react";
import { Image } from "@unpic/react";
import clsx from "clsx";
import { useEffect, useId, useState } from "react";

import { Container } from "@/components/Container";
import { DiamondIcon } from "@/components/DiamondIcon";
import unknownImage from "@/images/avatars/unknown.png";

import curtisImage from "@/images/avatars/curtis.jpg";
import dizzylockImage from "@/images/avatars/dizzylock.jpg";
import djbennyImage from "@/images/avatars/djbenny.jpg";
import djroxswiftImage from "@/images/avatars/djroxswift.jpg";
import genieImage from "@/images/avatars/genie.png";
import jamalAliImage from "@/images/avatars/jamal-ali.png";
import jinImage from "@/images/avatars/jin.png";
import slimBoogieImage from "@/images/avatars/slim-boogie.jpg";
import ynotImage from "@/images/avatars/ynot.jpg";
import { Link } from "@tanstack/react-router";

type People = {
  name: string;
  people: Person[];
};

type Person = {
  name: string;
  role: string;
  image?: StaticImageData;
  instagram?: string;
};
const categories: People[] = [
  {
    name: "DJ MC & Judges",
    people: [
      {
        name: "Roxswift",
        role: "Dj (Los Angeles)",
        image: djroxswiftImage,
        instagram: "roxswift",
      },
      {
        name: "Benny Lava",
        role: "Dj (Montreal)",
        image: djbennyImage,
        instagram: "djbennylava",
      },
      {
        name: "Genie Baffoe",
        role: "Emcee (Winnipeg)",
        image: genieImage,
        instagram: "genieboss",
      },
      {
        name: "Curtis Siu",
        role: "Breaking Judge (Vancouver)",
        image: curtisImage,
        instagram: "straycurt",
      },
      {
        name: "YNOT",
        role: "Breaking Judge (New Jersey)",
        image: ynotImage,
        instagram: "ynotism",
      },
      {
        name: "Jin Lee",
        role: "Breaking Judge (Edmonton)",
        image: jinImage,
        instagram: "jinlehs",
      },
      {
        name: "Dizzylock",
        role: "Open Style Judge (Montreal)",
        image: dizzylockImage,
        instagram: "dizzylock",
      },
      {
        name: "Slim Boogie",
        role: "Open Style Judge (Los Angeles)",
        image: slimBoogieImage,
        instagram: "slimboogie777",
      },
      {
        name: "Jamal Ali",
        role: "Open Style Judge (Vancouver)",
        image: jamalAliImage,
        instagram: "jamal_ali2000",
      },
    ],
  },
  {
    name: "Breaking Crews",
    people: [
      {
        name: "Alpha Kids",
        role: "",
      },
      {
        name: "Raw Honey",
        role: "",
      },
      {
        name: "Team Mayhem",
        role: "",
      },
      {
        name: "TM",
        role: "",
      },
      {
        name: "Crazy Time",
        role: "",
      },
    ],
  },
  {
    name: "Open Styles Crews",
    people: [
      {
        name: "393 Dance Troupe",
        role: "",
      },
      {
        name: "Octagram",
        role: "",
      },
      {
        name: "Pound it",
        role: "",
      },
      {
        name: "Raw Honey",
        role: "",
      },
      {
        name: "Team Mayhem",
        role: "",
      },
      {
        name: "The Misfits",
        role: "",
      },

      {
        name: "Working title",
        role: "",
      },
    ],
  },
];

function InstagramLink({ username }: { username?: string }) {
  return (
    <Link href={`https://instagram.com/${username}`} target="_blank">
      @{username}
    </Link>
  );
}

function ImageClipPaths({ id, ...props }: React.ComponentPropsWithoutRef<"svg"> & { id: string }) {
  return (
    <svg aria-hidden="true" width={0} height={0} {...props}>
      <defs>
        <clipPath id={`${id}-0`} clipPathUnits="objectBoundingBox">
          <path d="M0,0 h0.729 v0.129 h0.121 l-0.016,0.032 C0.815,0.198,0.843,0.243,0.885,0.243 H1 v0.757 H0.271 v-0.086 l-0.121,0.057 v-0.214 c0,-0.032,-0.026,-0.057,-0.057,-0.057 H0 V0" />
        </clipPath>
        <clipPath id={`${id}-1`} clipPathUnits="objectBoundingBox">
          <path d="M1,1 H0.271 v-0.129 H0.15 l0.016,-0.032 C0.185,0.802,0.157,0.757,0.115,0.757 H0 V0 h0.729 v0.086 l0.121,-0.057 v0.214 c0,0.032,0.026,0.057,0.057,0.057 h0.093 v0.7" />
        </clipPath>
        <clipPath id={`${id}-2`} clipPathUnits="objectBoundingBox">
          <path d="M1,0 H0.271 v0.129 H0.15 l0.016,0.032 C0.185,0.198,0.157,0.243,0.115,0.243 H0 v0.757 h0.729 v-0.086 l0.121,0.057 v-0.214 c0,-0.032,0.026,-0.057,0.057,-0.057 h0.093 V0" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function People() {
  const id = useId();
  const [tabOrientation, setTabOrientation] = useState("horizontal");

  useEffect(() => {
    const lgMediaQuery = window.matchMedia("(min-width: 1024px)");

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? "vertical" : "horizontal");
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  return (
    <section id="people" aria-labelledby="people-title" className="py-20 sm:py-32">
      <ImageClipPaths id={id} />
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="people-title"
            className="font-display text-4xl font-medium tracking-tighter text-blue-600 sm:text-5xl"
          >
            Who's coming?
          </h2>
          <p className="mt-4 font-display text-2xl tracking-tight text-blue-900">
            We're excited to welcome special guests to be part of this year's One for the City.
            Registered crews will also be listed.
          </p>
        </div>
        <Tab.Group
          as="div"
          className="mt-14 grid grid-cols-1 items-start gap-x-8 gap-y-8 sm:mt-16 sm:gap-y-16 lg:mt-24 lg:grid-cols-4"
          vertical={tabOrientation === "vertical"}
        >
          <div className="relative -mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:block sm:overflow-visible sm:pb-0">
            <div className="absolute top-2 bottom-0 left-0.5 hidden w-px bg-slate-200 lg:block" />
            <Tab.List className="grid auto-cols-auto grid-flow-col justify-start gap-x-8 gap-y-10 px-4 whitespace-nowrap sm:mx-auto sm:max-w-2xl sm:grid-cols-3 sm:px-0 sm:text-center lg:grid-flow-row lg:grid-cols-1 lg:text-left">
              {({ selectedIndex }) => (
                <>
                  {categories.map((category, index) => (
                    <div key={category.name} className="relative lg:pl-8">
                      <DiamondIcon
                        className={clsx(
                          "absolute top-[0.5625rem] left-[-0.5px] hidden h-1.5 w-1.5 overflow-visible lg:block",
                          index === selectedIndex
                            ? "fill-blue-600 stroke-blue-600"
                            : "fill-transparent stroke-slate-400",
                        )}
                      />
                      <div className="relative">
                        <div
                          className={clsx(
                            "font-mono",
                            index === selectedIndex
                              ? "font-semibold text-blue-600"
                              : "text-slate-500",
                          )}
                        >
                          <Tab className="ui-not-focus-visible:outline-hidden">
                            <span className="absolute inset-0" />
                            {category.name}
                          </Tab>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </Tab.List>
          </div>
          <Tab.Panels className="lg:col-span-3">
            {categories.map((category) => (
              <Tab.Panel
                key={category.name}
                className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-y-16 md:grid-cols-3 ui-not-focus-visible:outline-hidden"
                unmount={false}
              >
                {category.people.map((person, index) => (
                  <div key={person.name}>
                    {person.image && (
                      <div className="group relative h-[17.5rem] transform overflow-hidden rounded-4xl">
                        <div
                          className={clsx(
                            "absolute top-0 right-4 bottom-6 left-0 rounded-4xl border transition duration-300 group-hover:scale-95 xl:right-6",
                            ["border-blue-300", "border-indigo-300", "border-sky-300"][index % 3],
                          )}
                        />
                        <div
                          className="absolute inset-0 bg-indigo-50"
                          style={{ clipPath: `url(#${id}-${index % 3})` }}
                        >
                          <Image
                            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-110"
                            src={person.image ?? unknownImage}
                            alt=""
                            priority
                            sizes="(min-width: 1280px) 17.5rem, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                        </div>
                      </div>
                    )}
                    <h3 className="mt-8 font-display text-xl font-bold tracking-tight text-slate-900">
                      {person.name}
                      {person.instagram && (
                        <span className="pl-3 text-lg font-normal text-slate-600">
                          <InstagramLink username={person.instagram} />
                        </span>
                      )}
                    </h3>
                    <p className="mt-1 text-base tracking-tight text-slate-500">{person.role}</p>
                  </div>
                ))}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </Container>
    </section>
  );
}
