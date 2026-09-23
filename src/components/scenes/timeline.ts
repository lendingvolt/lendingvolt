/**
 * A scene timeline compiles to one Web Animations keyframe track per
 * element and property, spanning the whole story. The DOM always holds the
 * final pose; a track starts from the opening pose and ends on it exactly.
 */

/** Gestures and prop hand-offs. */
export const GESTURE = "cubic-bezier(0.2, 0, 0, 1)";
/** Walking and anything travelling at constant speed. */
export const LINEAR = "linear";
export const GESTURE_MS = 400;

export class TimelineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimelineError";
  }
}

type Property = "transform" | "opacity";
type Point = { t: number; value: string };
type Segment = { at: number; points: Point[]; easing: string };
type Channel = { selector: string; property: Property; initial: string; segments: Segment[]; end: number };

export type CompiledChannel = { selector: string; keyframes: Keyframe[] };
export type CompiledTimeline = { duration: number; channels: CompiledChannel[] };

const round = (value: number) => Math.round(value * 1e6) / 1e6;

function toKeyframes(channel: Channel, duration: number): Keyframe[] {
  const frames: Keyframe[] = [];
  const push = (t: number, value: string, easing = LINEAR) =>
    frames.push({ offset: round(t / duration), [channel.property]: value, easing });

  let current = channel.initial;
  push(0, current);
  for (const segment of channel.segments) {
    push(segment.at, current, segment.easing);
    for (const point of segment.points) push(point.t, point.value, segment.easing);
    current = segment.points[segment.points.length - 1].value;
  }
  push(duration, current);
  return frames;
}

export type Timeline = ReturnType<typeof createTimeline>;

export function createTimeline() {
  const channels = new Map<string, Channel>();
  const key = (selector: string, property: Property) => `${selector}::${property}`;

  const channelFor = (selector: string, property: Property) => {
    const channel = channels.get(key(selector, property));
    if (!channel) throw new TimelineError(`"${selector}" ${property} was moved before it was given a start value`);
    return channel;
  };

  const add = (selector: string, property: Property, at: number, points: Point[], easing: string) => {
    const channel = channelFor(selector, property);
    if (points.length === 0) return;
    if (at < channel.end - 0.5) {
      throw new TimelineError(`"${selector}" ${property} starts at ${at}ms while still moving until ${channel.end}ms`);
    }
    channel.segments.push({ at, points, easing });
    channel.end = points[points.length - 1].t;
  };

  return {
    /** Where a channel starts. Later calls for the same channel are ignored. */
    start(selector: string, property: Property, value: string) {
      if (!channels.has(key(selector, property))) {
        channels.set(key(selector, property), { selector, property, initial: value, segments: [], end: 0 });
      }
    },
    /** Move from the current value to `value` over `[at, at + dur]`. */
    to(selector: string, property: Property, value: string, at: number, dur: number, easing = GESTURE) {
      add(selector, property, at, [{ t: at + Math.max(dur, 1), value }], easing);
    },
    /** Pass through each point in turn, linearly, starting from the current value at `at`. */
    path(selector: string, property: Property, at: number, points: Point[]) {
      add(selector, property, at, points, LINEAR);
    },
    compile(): CompiledTimeline {
      const live = [...channels.values()].filter((channel) => channel.segments.length > 0);
      const duration = Math.max(1, ...live.map((channel) => channel.end));
      return {
        duration,
        channels: live.map((channel) => ({ selector: channel.selector, keyframes: toKeyframes(channel, duration) })),
      };
    },
  };
}
