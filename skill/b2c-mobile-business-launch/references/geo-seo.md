# GEO And SEO Launch Visibility

Use this before publishing or auditing a launch site, waitlist, policy pages, docs, blog/content, `robots.txt`, `llms.txt`, sitemap, schema, metadata, or any public surface that should be discoverable by search engines and AI answer engines.

This reference incorporates the GEO-first workflow from `https://github.com/zubair-trabzada/geo-seo-claude`. Treat it as a routing layer: use installed GEO skills when available, then leave concrete artifacts and verification notes in the launch package.

## 1. Specialist Skill Delegation

If the GEO skills are installed, use them instead of recreating their full audit logic:

- `geo` - broad GEO-first SEO analysis for a URL or launch surface.
- `geo-audit` - full website GEO+SEO audit with a prioritized action plan.
- `geo-technical` - crawlability, SSR, performance, security, indexability, and AI-crawler access.
- `geo-crawlers` - robots, meta tags, headers, and AI crawler allow/block map.
- `geo-llmstxt` - analyze or generate `llms.txt`.
- `geo-schema` - detect, validate, or generate JSON-LD structured data.
- `geo-citability` - rewrite pages so AI systems can quote/cite self-contained answer passages.
- `geo-content` - E-E-A-T, proof, source quality, and content structure.
- `geo-brand-mentions` - brand/entity mention and authority scan.
- `geo-platform-optimizer` - platform-specific checks for ChatGPT, Perplexity, Gemini, Google AI Overviews, and Bing Copilot.
- `geo-compare` - monthly or pre/post-launch delta tracking.
- `geo-report` or `geo-report-pdf` - client/founder-ready reporting when needed.

If these skills are not visible in the current runtime, search local skill directories for the names above or inspect the linked GitHub repository. Do not assume Claude and Codex expose the same skill/plugin surface.

## 2. Required Launch Artifacts

For any public launch funnel, create or update:
- title, meta description, canonical URL, Open Graph, Twitter/X cards, favicon/app icons, and theme color
- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- JSON-LD schema for Organization, WebSite, SoftwareApplication/MobileApplication, FAQ, BreadcrumbList, and Article/BlogPosting where applicable
- founder/company/entity facts that are consistent across site, store, social, and press pages
- privacy, terms, account deletion/privacy choices, support, and contact pages that are crawlable but not over-indexed when sensitive
- readable answer-style sections for core questions users or AI systems will ask

Acceptance:
- Public pages can be fetched without auth, client-only rendering failures, geofencing, or blocked bots.
- The site explains who it is for, what it does, why it is credible, and where the app/store links live.

## 3. GEO Content Rules

Write content for both humans and AI answer engines:
- use clear question-answer sections for category, problem, pricing, privacy, support, and app availability
- make important passages self-contained; avoid copy that only works with surrounding hero context
- include concrete named entities, dates, product names, jurisdictions, app categories, and supported platforms where true
- cite or link evidence for claims; unsupported claims become risks in `LEGAL_REVIEW.md` or `LAUNCH.md`
- keep brand/entity names consistent across site, App Store metadata, schema, `llms.txt`, and social profiles
- avoid thin marketing pages that have no extractable factual answers

## 4. Technical GEO/SEO Gates

Before calling the funnel launch-ready:
- verify live HTTP 200 for homepage, `/privacy`, `/terms`, deletion/privacy choices, `robots.txt`, `sitemap.xml`, and `llms.txt`
- inspect rendered HTML for server-side or static title, description, canonical, OG tags, schema, and meaningful body copy
- confirm AI/search crawlers are not accidentally blocked in `robots.txt`, meta robots, headers, or CDN settings
- run schema validation or at least parse JSON-LD
- verify canonical domain, redirects, HTTPS, compression, cache headers, and security headers
- verify mobile readability and no text overlap
- check that analytics/session replay/cookies match privacy disclosures

Useful checks:
```bash
curl -I https://example.com
curl -s https://example.com/robots.txt
curl -s https://example.com/sitemap.xml
curl -s https://example.com/llms.txt
curl -s https://example.com | rg -i "<title|description|og:|application/ld\\+json|canonical"
```

## 5. AI Visibility Reporting

For launch handoff, record:
- GEO/SEO score or audit summary when a GEO skill produced one
- crawler access map
- `llms.txt` status
- schema types present and validation status
- citability gaps and rewritten sections
- brand/entity mention gaps
- platform-specific notes for ChatGPT, Perplexity, Gemini, Google AI Overviews, and Bing Copilot
- before/after changes and next monitoring date

Store this in `GEO_SEO.md` or in `AUDIT_PROMPT.md`/`LAUNCH.md` for smaller launches.

## 6. Monitoring Loop

After launch:
- rerun `geo-compare` or a manual delta check monthly
- refresh `llms.txt` and sitemap when pages change
- track brand/entity consistency across app store pages, landing pages, social profiles, press, and creator mentions
- add FAQ/content pages only when they answer real questions from reviews, support, social research, or keyword research
- verify policy/contact pages remain reachable after domain, DNS, or routing changes
