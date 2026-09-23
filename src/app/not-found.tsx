import type { Metadata } from "next";
import { routes } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, Section } from "@/components/ui/layout";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Section ground="surface-0" spacing="roomy" aria-labelledby="not-found-title">
      <Container className="flex min-h-[40vh] flex-col items-start gap-4">
        <Eyebrow>404</Eyebrow>
        <h1 id="not-found-title" className="text-display-md">
          This page isn&apos;t on the circuit.
        </h1>
        <p className="prose-width text-body-lg">
          The address may have changed, or the page may not exist yet.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <Button href="/">Back to the homepage</Button>
          <Button href={routes.faq} variant="text">
            Read the FAQ
          </Button>
        </div>
      </Container>
    </Section>
  );
}
