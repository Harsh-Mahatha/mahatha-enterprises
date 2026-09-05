import { redirect } from "next/navigation";

// proxy.ts already sends signed-out requests to /login, so by the time this
// renders the visitor is authenticated.
export default function RootPage() {
  redirect("/dashboard");
}
