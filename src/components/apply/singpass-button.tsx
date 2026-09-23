import Image from "next/image";
import { cn } from "@/lib/cn";

/** Singpass's official "Retrieve Myinfo with Singpass" artwork, shown at its own proportions. */
export function SingpassButton({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mx-auto block w-full max-w-[400px] rounded-[12px] transition-opacity duration-150 ease-out hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta",
        className,
      )}
    >
      <Image
        src="/images/singpass-myinfo.jpg"
        alt={label}
        width={1272}
        height={192}
        sizes="400px"
        className="block h-auto w-full"
      />
    </button>
  );
}
