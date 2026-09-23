import type { Metadata } from "next";
import { stubPages } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, Section } from "@/components/ui/layout";

type StubKey = keyof typeof stubPages;

/** Metadata for a placeholder page; kept out of search until it has content. */
export function stubMetadata(key: StubKey): Metadata {
  return { title: stubPages[key].title, robots: { index: false } };
}

/** Placeholder for a route in the sitemap that has not been built yet. */
export function StubPage({ page }: { page: StubKey }) {
  const { title, group } = stubPages[page];
  return (
    <Section ground="surface-0" spacing="roomy" aria-labelledby="stub-title">
      <Container className="flex min-h-[40vh] flex-col items-start gap-4">
        <Eyebrow>{group}</Eyebrow>
        <h1 id="stub-title" className="text-display-md">
          {title}
        </h1>
        <p className="prose-width text-body-lg">This page is being written. The homepage has the essentials in the meantime.</p>
        <Button href="/" variant="text" className="mt-4">
          Back to the homepage
        </Button>
      </Container>
    </Section>
  );
}
