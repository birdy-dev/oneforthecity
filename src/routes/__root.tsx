import "@/tailwind.css";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

const meta = {
  title: "One for the City",
  url: "https://oneforthecity.com",
  description:
    "At One for the City we celebrate street dance culture and community. Join us this year June 26-28 in Edmonton, AB.",
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "title", content: meta.title },
      { name: "description", content: meta.description },
      {
        name: "keywords",
        content: "street dance, culture, community, Edmonton, AB",
      },
      { name: "robots", content: "index, follow" },
      { name: "language", content: "en" },
      { name: "og:type", content: "website" },
      { name: "og:url", content: meta.url },
      { name: "og:title", content: meta.title },
      { name: "og:description", content: meta.description },
      {
        name: "og:image",
        content: "https://oneforthecity.com/images/brand/logo.jpg",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: meta.title },
      { name: "twitter:description", content: meta.description },
      {
        name: "twitter:image",
        content: "https://oneforthecity.com/images/brand/logo.jpg",
      },
    ],
  }),
  component: RootLayout,
});

function RootLayout() {
  return (
    <html lang="en" className="h-full bg-white antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-full">
        <div className="flex w-full flex-col">
          <Outlet />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
