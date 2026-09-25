import Link from "next/link";
import type { LegalBlock, LegalInline } from "@/content/legal";

const textLink = "text-link underline decoration-link/40 underline-offset-2 hover:decoration-link";

function Inline({ content }: { content: readonly LegalInline[] }) {
  return content.map((part, index) =>
    typeof part === "string" ? (
      part
    ) : (
      <Link key={index} href={part.href} className={textLink}>
        {part.label}
      </Link>
    ),
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === "ul") {
    return (
      <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-fg-muted">
        {block.items.map((item, index) => (
          <li key={index}>
            <Inline content={item} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p>
      <Inline content={block.content} />
    </p>
  );
}

/** Renders a legal page's body blocks (paragraphs and lists), shared by the full page and the notice dialog. */
export function LegalBlocks({ blocks }: { blocks: readonly LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </>
  );
}
