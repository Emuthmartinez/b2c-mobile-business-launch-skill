import Link from "next/link";

// Landing stub. The real landing page is owned by the launch funnel lane
// (geo-seo.md + landing checks); this exists so the app boots end to end.
export default function Home() {
  return (
    <main>
      <h1>Habit Tracker Starter</h1>
      <p>Runnable archetype scaffold. Customize it with the prompt pack — see starter/README.md.</p>
      <p>
        <Link href="/login">Sign in</Link> · <Link href="/today">Today</Link>
      </p>
    </main>
  );
}
