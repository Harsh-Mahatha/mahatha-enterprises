import { redirect } from "next/navigation";

// Temporary entry point. Phase 3 replaces this with real auth-based routing
// (redirect to /login when signed out, /dashboard when signed in).
export default function RootPage() {
  redirect("/style-guide");
}
