import { z } from "zod";

/** Optional single-line text: an empty string is treated as "not provided". */
export function optionalText(maxLength = 255) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined));
}

/** Optional email: empty string is "not provided"; a non-empty value must be a valid email. */
export function optionalEmail() {
  return z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value, ctx) => {
      if (!value) return undefined;
      if (!z.string().email().safeParse(value).success) {
        ctx.addIssue({ code: "custom", message: "Enter a valid email address." });
        return z.NEVER;
      }
      return value;
    });
}

/** Optional URL: empty string is "not provided"; a non-empty value must be a valid URL. */
export function optionalUrl() {
  return z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value, ctx) => {
      if (!value) return undefined;
      if (!z.string().url().safeParse(value).success) {
        ctx.addIssue({ code: "custom", message: "Enter a valid URL." });
        return z.NEVER;
      }
      return value;
    });
}
