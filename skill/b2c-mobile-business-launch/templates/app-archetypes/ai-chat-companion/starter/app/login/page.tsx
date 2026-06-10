"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { capture, EVENTS } from "@/lib/analytics/posthog-client";

// Minimal email magic-link sign-in (prompt 02 replaces this with the full
// auth system: OAuth providers, profile setup, username claims).
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn(formEvent: React.FormEvent) {
    formEvent.preventDefault();
    setError(null);
    capture(EVENTS.signup_started);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/confirm` },
    });
    if (signInError) {
      setError(signInError.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return <p>Check your email for the sign-in link.</p>;
  }

  return (
    <form onSubmit={signIn}>
      <label>
        Email
        <input type="email" value={email} onChange={(changeEvent) => setEmail(changeEvent.target.value)} required />
      </label>
      <button type="submit">Send sign-in link</button>
      {error ? <p role="alert">{error}</p> : null}
    </form>
  );
}
