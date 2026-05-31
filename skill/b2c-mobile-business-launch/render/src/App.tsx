import { useEffect, useMemo, useState } from "react";
import type { BusinessState, ThemeTokens } from "./types";

interface LoadState {
  business?: BusinessState;
  tokens?: ThemeTokens;
  error?: string;
}

export function App() {
  const [loadState, setLoadState] = useState<LoadState>({});

  useEffect(() => {
    Promise.all([
      fetch("./state/business.json").then((response) => response.json() as Promise<BusinessState>),
      fetch("./state/theme.tokens.json").then((response) => response.json() as Promise<ThemeTokens>),
    ])
      .then(([business, tokens]) => {
        setLoadState({ business, tokens });
        applyTokens(tokens);
      })
      .catch((error: unknown) => {
        setLoadState({ error: error instanceof Error ? error.message : String(error) });
      });
  }, []);

  if (loadState.error) {
    return <main className="shell">Design Room failed to load: {loadState.error}</main>;
  }
  if (!loadState.business || !loadState.tokens) {
    return <main className="shell">Loading Design Room...</main>;
  }

  return <DesignRoom business={loadState.business} tokens={loadState.tokens} />;
}

function DesignRoom({ business, tokens }: { business: BusinessState; tokens: ThemeTokens }) {
  const summaries = useMemo(() => {
    const appStore = business.surfaces.appStore;
    return [
      ["Web funnels", business.surfaces.webFunnels.length],
      ["Landing pages", business.surfaces.landingPages.length],
      ["Marketing assets", business.surfaces.marketingAssets.length],
      ["App screens", business.surfaces.mobileApp.screens.length],
      ["App flows", business.surfaces.mobileApp.flows.length],
      ["Custom product pages", appStore.customProductPages.length],
      ["PPO tests", appStore.productPageOptimizationTests.length],
      ["In-App Events", appStore.inAppEvents.length],
    ] as const;
  }, [business]);
  const latest = business.designRoom.versionLog.at(-1);

  return (
    <main className="shell">
      <header className="hero">
        <p className="eyebrow">Design Room</p>
        <h1>{business.business.name}</h1>
        <div className="pills">
          <span>Stage: {business.business.stage}</span>
          <span>Theme: {business.theme.status}</span>
          <span>Updated: {business.updatedAt}</span>
        </div>
      </header>

      <section className="grid two">
        <article className="panel">
          <p className="eyebrow">Positioning</p>
          <h2>{business.business.positioning || "Positioning not defined"}</h2>
        </article>
        <article className="panel">
          <p className="eyebrow">Audience</p>
          <h2>{business.business.targetAudience || "Audience not defined"}</h2>
        </article>
      </section>

      <section className="panel">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">Surface Model</p>
            <h2>Cross-surface state</h2>
          </div>
          <span className="stamp">{"STATE -> MUTATE -> VERSION -> RENDER"}</span>
        </div>
        <div className="metrics">
          {summaries.map(([label, count]) => (
            <article key={label} className="metric">
              <span>{label}</span>
              <strong>{count}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="grid three">
        <article className="panel">
          <p className="eyebrow">Custom Product Pages</p>
          <h2>{business.surfaces.appStore.customProductPages.length} / 70</h2>
          <p>Each page should carry audience, traffic source, media, keywords, URL, and measurement plan.</p>
        </article>
        <article className="panel">
          <p className="eyebrow">PPO Tests</p>
          <h2>{business.surfaces.appStore.productPageOptimizationTests.length}</h2>
          <p>Tests model alternate app icons, screenshots, and app previews only.</p>
        </article>
        <article className="panel">
          <p className="eyebrow">In-App Events</p>
          <h2>{business.surfaces.appStore.inAppEvents.length} / 15</h2>
          <p>Events must represent real time-bound in-app content with review-ready media.</p>
        </article>
      </section>

      <section className="grid two">
        <article className="panel">
          <p className="eyebrow">Latest Mutation</p>
          <h2>{latest?.summary ?? "No mutation recorded"}</h2>
          <p>{latest?.createdAt ?? ""}</p>
        </article>
        <article className="panel tokenPanel">
          <p className="eyebrow">Theme Tokens</p>
          {Object.entries(tokens.tokens.color).slice(0, 8).map(([name, value]) => (
            <span key={name} className="swatch" style={{ ["--swatch" as string]: value }}>
              {name}
            </span>
          ))}
        </article>
      </section>
    </main>
  );
}

function applyTokens(tokens: ThemeTokens) {
  const root = document.documentElement;
  for (const [name, value] of Object.entries(tokens.tokens.color)) {
    root.style.setProperty(`--color-${toKebab(name)}`, value);
  }
  for (const [name, value] of Object.entries(tokens.tokens.radius)) {
    root.style.setProperty(`--radius-${toKebab(name)}`, value);
  }
  for (const [name, value] of Object.entries(tokens.tokens.space)) {
    root.style.setProperty(`--space-${toKebab(name)}`, value);
  }
  root.style.setProperty("--font-display", tokens.tokens.font.display.family);
  root.style.setProperty("--font-body", tokens.tokens.font.body.family);
}

function toKebab(value: string) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}
