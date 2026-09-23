import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { estimateTextWidth, rectPath } from "./paths";
import { DRAWER_TRAVEL, PLACARD, RECEIPT, receiptHeight } from "./metrics";
import { Solid } from "./shapes";
import { styles } from "./classes";

/**
 * Type sizes in stage units, set for the nominal stage scale of 1.25px per
 * unit (a 60px figure): `caption` renders at 13px and `label` at 12px there.
 * The placard's `total` and `rate` are smaller (10px and 8.75px) because
 * that is the most a 40-unit board holds: "S$22,088" is 36 units wide at 8.
 */
export const TYPE = {
  caption: 10.4,
  label: 9.6,
  total: 8,
  rate: 7,
} as const;

/**
 * Every prop is drawn with its bottom centre at the origin, which is also
 * where a hand grips it. Pass `x`/`y` to place it on a stage instead.
 */
type Placement = { x?: number; y?: number };

function Place({ x = 0, y = 0, children }: Placement & { children: ReactNode }) {
  if (x === 0 && y === 0) return <>{children}</>;
  return <g transform={`translate(${x} ${y})`}>{children}</g>;
}

// ---- Carried props ------------------------------------------------------

/** Small portrait card with three ruled lines. */
export function ApplicationCard({ highlight = false, ...place }: Placement & { highlight?: boolean }) {
  return (
    <Place {...place}>
      <path d={rectPath(-6, -16, 12, 16, 1)} className={highlight ? styles.paperHighlight : styles.paper} />
      <path d="M-3 -12H3M-3 -8H3M-3 -4H1" className={highlight ? styles.ruleOnHighlight : styles.rule} />
    </Place>
  );
}

const POLE = PLACARD.pole;

type PlacardProps = Placement & {
  /** Total payable, e.g. "S$22,088". */
  total: string;
  /** Rate with its basis, e.g. "3.48% flat". */
  rate: string;
  /** The 1px highlight border for the offer the scene is about. */
  flagged?: boolean;
  /** Pill above the board, e.g. "Lowest total cost". */
  badge?: string;
  width?: number;
  height?: number;
  totalSize?: number;
  rateSize?: number;
};

/** A board on a short pole showing total payable and rate. */
export function Placard({
  total,
  rate,
  flagged = false,
  badge,
  width = PLACARD.width,
  height = PLACARD.height,
  totalSize = TYPE.total,
  rateSize = TYPE.rate,
  ...place
}: PlacardProps) {
  const top = -(POLE + height);
  return (
    <Place {...place}>
      <rect x={-1} y={-POLE} width={2} height={POLE} className={styles.muted} />
      <path d={rectPath(-width / 2, top, width, height, 2)} className={styles.paper} />
      {flagged && (
        <path data-part="flag" d={rectPath(-width / 2, top, width, height, 2)} className={styles.flag} />
      )}
      <text x={0} y={top + height * 0.47} fontSize={totalSize} textAnchor="middle" className={styles.text}>
        {total}
      </text>
      <text x={0} y={top + height * 0.8} fontSize={rateSize} textAnchor="middle" className={styles.textMuted}>
        {rate}
      </text>
      {badge && (
        <g data-part="badge">
          <Pill text={badge} y={top - 3} />
        </g>
      )}
    </Place>
  );
}

/** Envelope with its flap drawn as a single fold line. */
export function Envelope(place: Placement) {
  return (
    <Place {...place}>
      <path d={rectPath(-8, -11, 16, 11, 1)} className={styles.paper} />
      <path d="M-8 -11L0 -5L8 -11" className={styles.rule} />
    </Place>
  );
}

/** One 12 × 4 interest brick; highlight colour unless `neutral`. */
export function Brick({ neutral = false, ...place }: Placement & { neutral?: boolean }) {
  return (
    <Place {...place}>
      <Solid x={-6} y={-4} w={12} h={4} side={3} paint={neutral ? "furniture" : "highlight"} />
    </Place>
  );
}

type ReceiptLine = { label: string; value: string };

type ReceiptProps = Placement & {
  lines: readonly ReceiptLine[];
  total: ReceiptLine;
  width?: number;
};

const RECEIPT_ROW = RECEIPT.row;
const RECEIPT_TEETH = 8;

/** A till receipt: line items, a rule, and the total in the highlight colour. */
export function Receipt({ lines, total, width = RECEIPT.width, ...place }: ReceiptProps) {
  const pad = RECEIPT.pad;
  const height = receiptHeight(lines.length);
  const half = width / 2;
  const tooth = width / RECEIPT_TEETH;
  const zigzag = Array.from({ length: RECEIPT_TEETH }, (_, i) => {
    const x = half - tooth * (i + 1);
    return `L${x + tooth / 2} 0L${x} -3`;
  }).join("");
  const rowY = (row: number) => -height + pad + RECEIPT_ROW * (row + 1) - 3;
  const ruleY = rowY(lines.length - 1) + 6;
  const totalY = ruleY + RECEIPT_ROW;

  return (
    <Place {...place}>
      <path d={`M${-half} ${-height}H${half}V-3${zigzag}Z`} className={styles.paper} />
      {lines.map((line, row) => (
        <g key={line.label}>
          <text x={-half + pad} y={rowY(row)} fontSize={TYPE.caption} className={styles.textMuted}>
            {line.label}
          </text>
          <text x={half - pad} y={rowY(row)} fontSize={TYPE.caption} textAnchor="end" className={styles.text}>
            {line.value}
          </text>
        </g>
      ))}
      <path d={`M${-half + pad} ${ruleY}H${half - pad}`} className={styles.rule} />
      <text x={-half + pad} y={totalY} fontSize={TYPE.caption} className={styles.text}>
        {total.label}
      </text>
      <text x={half - pad} y={totalY} fontSize={TYPE.caption} textAnchor="end" className={cn(styles.text, styles.textHighlight)}>
        {total.value}
      </text>
    </Place>
  );
}

/** Square-lensed magnifier, gripped at the end of its handle. */
export function Magnifier(place: Placement) {
  return (
    <Place {...place}>
      <path d={rectPath(5, -13, 8, 8, 2)} className={styles.tint} />
      <path
        d={`${rectPath(3, -15, 12, 12, 3)}${rectPath(5, -13, 8, 8, 2)}`}
        fillRule="evenodd"
        className={styles.ink}
      />
      <path d="M-0.7 -0.7L0.7 0.7L4.7 -3.3L3.3 -4.7Z" className={styles.ink} />
    </Place>
  );
}

/** A long plank; the highlight colour when it is the point of the scene. */
export function Plank({ width = 64, highlight = false, ...place }: Placement & { width?: number; highlight?: boolean }) {
  return (
    <Place {...place}>
      <Solid x={-width / 2} y={-4} w={width} h={4} side={8} paint={highlight ? "highlight" : "furniture"} />
    </Place>
  );
}

/** A taped carton, optionally labelled on its face (a due date, say). */
export function Box({
  width = 14,
  height = 12,
  highlight = false,
  label,
  ...place
}: Placement & { width?: number; height?: number; highlight?: boolean; label?: string }) {
  return (
    <Place {...place}>
      <Solid x={-width / 2} y={-height} w={width} h={height} side={Math.round(width / 4)} paint={highlight ? "highlight" : "furniture"} />
      <path
        d={`M${-width / 2} ${-height + 3}H${width / 2}`}
        className={highlight ? styles.ruleOnHighlight : styles.rule}
      />
      {label && (
        <text
          x={0}
          y={-(height - 3) / 2 + TYPE.caption * 0.36}
          fontSize={TYPE.caption}
          textAnchor="middle"
          className={cn(styles.text, highlight && styles.textOnHighlight)}
        >
          {label}
        </text>
      )}
    </Place>
  );
}

/** A rolled plan, seen side on. */
export function RolledPlan(place: Placement) {
  return (
    <Place {...place}>
      <path d={rectPath(-9, -4, 18, 4, 2)} className={styles.paper} />
      <path d="M6 -4V0" className={styles.rule} />
    </Place>
  );
}

/** A manila-style folder with a tab; `highlight` when it is the subject. */
export function Folder({ highlight = false, ...place }: Placement & { highlight?: boolean }) {
  return (
    <Place {...place}>
      <path d="M-7 -11H-2V-10H7V0H-7Z" className={highlight ? styles.paperHighlight : styles.paper} />
    </Place>
  );
}

/** A rubber stamp standing on its base. */
export function Stamp(place: Placement) {
  return (
    <Place {...place}>
      <path d="M-1 -7H1V-3H-1ZM-2.5 -9H2.5V-7H-2.5Z" className={styles.muted} />
      <Solid x={-4} y={-3} w={8} h={3} side={2} paint="ink" />
    </Place>
  );
}

// ---- Furniture ----------------------------------------------------------

/** A small desk: a slab on two legs, 44 × 20. */
export function Desk({ width = 44, ...place }: Placement & { width?: number }) {
  const legs = `${rectPath(-width / 2 + 2, -16, 3, 16)}${rectPath(width / 2 - 5, -16, 3, 16)}`;
  return (
    <Place {...place}>
      <path d={legs} className={styles.furnitureSide} />
      <path d={legs} className={styles.outline} />
      <Solid x={-width / 2} y={-20} w={width} h={4} side={6} paint="furniture" />
    </Place>
  );
}

/** An in-tray, drawn to sit on a desk top. */
export function Tray(place: Placement) {
  return (
    <Place {...place}>
      <path d="M-8 -4H-7V-1H7V-4H8V0H-8Z" className={styles.muted} />
    </Place>
  );
}

/** A shop or service counter with a top ledge, 52 × 20; a figure behind shows from the waist up. */
export function Counter({ width = 48, ...place }: Placement & { width?: number }) {
  return (
    <Place {...place}>
      <Solid x={-width / 2} y={-16} w={width} h={16} side={10} paint="furniture" />
      <Solid x={-width / 2 - 2} y={-20} w={width + 4} h={4} side={10} paint="furniture" />
    </Place>
  );
}

const DRAWER_PITCH = 13;

/**
 * A three-drawer filing cabinet seen side on, 18 × 40. `open` slides one
 * drawer (0 is the top) out to the right; the slide animates.
 */
export function FilingCabinet({ open, ...place }: Placement & { open?: 0 | 1 | 2 }) {
  return (
    <Place {...place}>
      <Solid x={-9} y={-40} w={18} h={40} side={4} paint="furniture" />
      {[0, 1, 2].map((drawer) => (
        <g
          key={drawer}
          data-part={`drawer${drawer}`}
          className={styles.slide}
          style={{ transform: `translateX(${open === drawer ? DRAWER_TRAVEL : 0}px)` }}
        >
          <path d={rectPath(-7, -38 + drawer * DRAWER_PITCH, 14, 11, 1)} className={styles.drawer} />
          <rect x={-3} y={-34 + drawer * DRAWER_PITCH} width={6} height={2} className={styles.muted} />
        </g>
      ))}
    </Place>
  );
}

// ---- Scene labels and blocks -------------------------------------------

type LabelProps = Placement & { text: string; highlight?: boolean };

/** A small paper tag carrying one line of caption text. */
export function Tag({ text, highlight = false, ...place }: LabelProps) {
  const height = 16;
  const width = estimateTextWidth(text, TYPE.caption) + 12;
  return (
    <Place {...place}>
      <path
        d={rectPath(-width / 2, -height, width, height, 2)}
        className={highlight ? styles.paperHighlight : styles.paper}
      />
      <text
        x={0}
        y={-height / 2 + TYPE.caption * 0.36}
        fontSize={TYPE.caption}
        textAnchor="middle"
        className={cn(styles.text, highlight && styles.textOnHighlight)}
      >
        {text}
      </text>
    </Place>
  );
}

/** The site's accent pill, set in the label style. */
export function Pill({ text, ...place }: Placement & { text: string }) {
  const label = text.toUpperCase();
  const height = 16;
  const width = estimateTextWidth(label, TYPE.label, 0.08) + 14;
  return (
    <Place {...place}>
      <path d={rectPath(-width / 2, -height, width, height, height / 2)} className={styles.tint} />
      <text
        x={0}
        y={-height / 2 + TYPE.label * 0.36}
        fontSize={TYPE.label}
        textAnchor="middle"
        className={cn(styles.text, styles.textTint)}
      >
        {label}
      </text>
    </Place>
  );
}

type BlockProps = Placement & {
  width: number;
  height: number;
  label?: string;
  /** A second, muted line under the label; the block needs about 28 units of height for both. */
  sublabel?: string;
  tone?: "ink" | "furniture" | "highlight";
};

const LINE_GAP = 12;

/** A labelled block: principal, a lump sum, a platform, a month slot. */
export function Block({ width, height, label, sublabel, tone = "furniture", ...place }: BlockProps) {
  const textClass = {
    ink: styles.textOnInk,
    furniture: undefined,
    highlight: styles.textOnHighlight,
  }[tone];
  const baseline = -height / 2 + TYPE.caption * 0.36 - (sublabel ? LINE_GAP / 2 : 0);
  return (
    <Place {...place}>
      <Solid x={-width / 2} y={-height} w={width} h={height} side={Math.round(width / 6)} paint={tone} />
      {label && (
        <text x={0} y={baseline} fontSize={TYPE.caption} textAnchor="middle" className={cn(styles.text, textClass)}>
          {label}
        </text>
      )}
      {sublabel && (
        <text
          x={0}
          y={baseline + LINE_GAP}
          fontSize={TYPE.caption}
          textAnchor="middle"
          className={cn(styles.text, styles.textMuted, textClass)}
        >
          {sublabel}
        </text>
      )}
    </Place>
  );
}

type SlotsProps = Placement & { count: number; columns: number; size?: number; gap?: number };

/**
 * Empty outlined slots in a grid, filled from the bottom-left: month slots
 * for a repayment schedule. The origin is the bottom-left corner.
 */
export function Slots({ count, columns, size = 9, gap = 1, ...place }: SlotsProps) {
  const pitch = size + gap;
  const d = Array.from({ length: count }, (_, i) => {
    const column = i % columns;
    const row = Math.floor(i / columns);
    return rectPath(column * pitch, -(row + 1) * pitch + gap, size, size, 1);
  }).join("");
  return (
    <Place {...place}>
      <path d={d} className={styles.rule} />
    </Place>
  );
}

