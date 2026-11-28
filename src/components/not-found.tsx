import { BackgroundImage } from "@/components/background-image";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Layout } from "@/components/layout";

export function NotFound() {
  return (
    <Layout showFooter={false}>
      <div className="relative flex h-full items-center py-20 sm:py-36">
        <BackgroundImage className="-top-36 bottom-0" />
        <Container className="relative flex w-full flex-col items-center">
          <p className="font-display text-2xl tracking-tight text-blue-900">404</p>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tighter text-blue-600 sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-4 text-lg tracking-tight text-blue-900">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <Button to="/" className="mt-8">
            Go back home
          </Button>
        </Container>
      </div>
    </Layout>
  );
}
