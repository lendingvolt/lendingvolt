import Link from "next/link";
import { GraphicSlot } from "@/components/graphics/graphic-slot";
import type { SceneId } from "@/components/graphics/scene-ids";
import { Container, Section } from "@/components/ui/layout";

type ToolHeroProps = {
  title: string;
  subhead: string;
  link: { label: string; href: string };
  scene: SceneId;
  /** Small disclosure line under the subhead. */
  note?: string;
};

/** Short dark band: what the page is for (named in the headline itself), one link onward, one render. */
export function ToolHero({ title, subhead, link, scene, note }: ToolHeroProps) {
  return (
    <Section ground="ink-900" spacing="none" aria-labelledby="tool-title" className="-mt-(--header-h) overflow-hidden">
      <Container className="grid items-center gap-12 pt-[calc(var(--header-h)+64px)] pb-16 md:pb-24 lg:grid-cols-12 lg:gap-6 lg:pt-[calc(var(--header-h)+80px)]">
        <div className="lg:col-span-6">
          <h1 id="tool-title" className="max-w-[16ch] text-display-lg">
            {title}
          </h1>
          <p className="mt-3 max-w-[52ch] text-body-lg text-fg-muted md:mt-4">{subhead}</p>
          {note && <p className="mt-4 max-w-[56ch] text-caption text-fg-muted">{note}</p>}
          <Link
            href={link.href}
            className="group mt-6 inline-flex min-h-11 items-center gap-2 text-body-md font-medium text-fg hover:text-link md:mt-8"
          >
            {link.label}
            <span aria-hidden className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
        <div className="hidden lg:col-span-5 lg:col-start-8 lg:block">
          <GraphicSlot
            scene={scene}
            ground="ink-900"
            className="aspect-[3/2] rounded-lg border border-[var(--border-dark)]"
          />
        </div>
      </Container>
    </Section>
  );
}
