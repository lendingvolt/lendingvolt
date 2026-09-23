import { testimonials } from "@/content/home";
import { Badge, Container, Eyebrow, Reveal, Section } from "@/components/ui/layout";

/** Typographic quotes on a dark band. No portraits, avatars or initials. */
export function Testimonials() {
  return (
    <Section ground="ink-900" aria-label="What borrowers say">
      <Container className="flex flex-col gap-20 md:gap-30">
        {testimonials.items.map((item) => (
          <Reveal key={item.quote}>
            <figure className="flex flex-col gap-6 md:gap-8">
              <div className="flex flex-wrap items-center gap-3">
                <Eyebrow>{item.tag}</Eyebrow>
                {testimonials.isPlaceholder && <Badge>Placeholder quote</Badge>}
              </div>
              <blockquote className="max-w-[28ch] text-display-md text-fg">
                <p>“{item.quote}”</p>
              </blockquote>
              <figcaption className="text-body-sm text-fg-muted">
                <span className="text-fg">{item.name}</span>
                <span aria-hidden> · </span>
                {item.role}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </Container>
    </Section>
  );
}
