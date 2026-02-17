import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="flex-none py-16">
      <Container className="flex flex-col items-center justify-between md:flex-row">
        <Link to="/">
          <Logo />
        </Link>
        <div className="text-center md:text-left">
          <p className="mt-6 text-base text-slate-500 md:mt-0">
            Copyright &copy; {new Date().getFullYear()} One for the City.
          </p>
        </div>
      </Container>
    </footer>
  );
}
