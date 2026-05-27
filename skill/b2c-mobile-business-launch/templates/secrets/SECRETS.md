# {{APP_NAME}} Secrets

No raw secrets: raw secret values must not be committed, pasted into docs, or included in screenshots/logs. Record names, locations, owners, and verification only.

## Provider

- Selected provider: Doppler
- Provider docs checked:
  - date: Pending
  - URLs: `https://docs.doppler.com/docs/install-cli`, `https://docs.doppler.com/docs/cli`, `https://docs.doppler.com/docs/secrets-setup-guide`, `https://docs.doppler.com/docs/service-tokens`, `https://docs.doppler.com/llms.txt`
  - install route / CLI version: Pending
  - docs-vs-local mismatch: Pending
- Doppler project/config map:
  - local: `{{DOPPLER_PROJECT}}` / `dev_personal`
  - staging: `{{DOPPLER_PROJECT}}` / `stg`
  - production: `{{DOPPLER_PROJECT}}` / `prd`
- Approved fallback provider, if any: none

## Inventory

| Name | Service | Class | Environments | Runtime surface | Public/server-only | Location | Owner | Rotation | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `EXAMPLE_API_KEY` | Example | server_secret | local/staging/prod | backend | server-only | Doppler project/config | founder | before public launch | blocked |

## Command Map

| Purpose | Command | Required secrets | Proof |
| --- | --- | --- | --- |
| Local dev | `doppler run -- {{DEV_COMMAND}}` | Pending | Pending |
| Tests | `doppler run -- {{TEST_COMMAND}}` | Pending | Pending |
| Build | `doppler run -- {{BUILD_COMMAND}}` | Pending | Pending |
| Deploy | `doppler run -- {{DEPLOY_COMMAND}}` | Pending | Pending |

## CI And Deploy

| Surface | Provider | Secret injection path | Config | Status |
| --- | --- | --- | --- | --- |
| CI | Pending | `DOPPLER_TOKEN` or provider integration | staging | blocked |
| Production runtime | Pending | service token/provider integration/OIDC | production | blocked |

## New-Secret Routing Log

| Date | Trigger | Secret name | Routed to | Docs/tests updated | Status |
| --- | --- | --- | --- | --- | --- |
| Pending | Pending | Pending | Pending | Pending | Pending |

## Founder Actions

- Create or confirm Doppler project/configs.
- Add initial secret values directly in Doppler or approved provider.
- Approve any fallback to local `.env.local`, Apple Keychain, platform secrets, or manual export.
- Approve production service-token/provider-integration setup.

## Verification

- Secret scan:
- Doppler setup:
- Local command:
- CI/deploy injection:
- Bundle check:
- Rotation/revocation notes:
