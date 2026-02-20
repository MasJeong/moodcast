import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { z } from "zod";

export const energyOptions = ["high", "mid", "low"] as const;
export const socialOptions = ["open", "neutral", "off"] as const;
export const pressureOptions = ["calm", "normal", "overload"] as const;

export const inputSchema = z.object({
  energy: z.enum(energyOptions),
  social: z.enum(socialOptions),
  pressure: z.enum(pressureOptions),
});

export type InputState = z.infer<typeof inputSchema>;

export const cardSpecSchema = z.object({
  v: z.literal(1),
  energy: z.enum(energyOptions),
  social: z.enum(socialOptions),
  pressure: z.enum(pressureOptions),
  weather: z.enum(["clear", "cloudy", "rain", "storm", "typhoon"]),
  turbulence: z.number().int().min(0).max(100),
  headline: z.string().min(1).max(40),
  vibe: z.string().min(1).max(80),
  action: z.string().min(1).max(80),
  createdAt: z.string(),
});

export type CardSpec = z.infer<typeof cardSpecSchema>;

export function encodeCardSpec(spec: CardSpec): string {
  return compressToEncodedURIComponent(JSON.stringify(spec));
}

export function decodeCardSpec(value: string | null): CardSpec | null {
  if (!value) {
    return null;
  }

  const inflated = decompressFromEncodedURIComponent(value);

  if (!inflated) {
    return null;
  }

  try {
    const parsed = JSON.parse(inflated);
    const result = cardSpecSchema.safeParse(parsed);

    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
