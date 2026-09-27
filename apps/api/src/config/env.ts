import path from "node:path";
import dotenv from "dotenv";

// apps/api is always run with its own directory as cwd (npm workspace scripts,
// or `cd apps/api && npm run dev`), so the repo-root .env is two levels up.
dotenv.config({ path: path.resolve(process.cwd(), "../../.env"), quiet: true });

function readEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(readEnv("PORT", "4000")),
  databaseUrl: readEnv("DATABASE_URL"),
  webOrigin: readEnv("WEB_ORIGIN", "http://localhost:3000"),
  // Number of reverse-proxy hops in front of the API (e.g. "1" behind a
  // single load balancer). Unset when the API is reached directly.
  trustProxy: process.env.TRUST_PROXY ? Number(process.env.TRUST_PROXY) : undefined,
};
