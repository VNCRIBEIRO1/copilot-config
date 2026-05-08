---
name: dependency-docs-mapper
description: "Map ALL project dependencies, libraries, APIs, workflows, and external services — then fetch comprehensive documentation, usage patterns, security advisories, and alternatives for each one. Use when: audit dependencies, map libraries, document stack, list all packages, find docs for dependencies, dependency inventory, tech stack audit, dependency documentation, library usage guide, security audit deps, PWA dependencies, site stack map, what libraries does this project use, generate dependency report."
argument-hint: "Optional: specify a subfolder or ecosystem to focus on (e.g., 'backend only', 'python deps', 'frontend')"
---

# Dependency Documentation Mapper

## Purpose

Perform a complete audit of every dependency, library, API, external service, and workflow used in a project. For each one, gather comprehensive documentation through both internal knowledge and broad external web searches. Output a rich reference document that serves as the project's definitive technology map.

## When to Use

- Onboarding onto a new project — understand the full tech stack quickly
- Auditing dependencies for security, deprecation, or licensing risks
- Creating a technology reference for the team
- Evaluating alternatives or planning migrations
- PWA/site development — mapping frontend/backend/build tooling
- Before major upgrades — understanding what will be affected

## Procedure

### Phase 1 — Discovery (Scan All Manifests)

Scan the workspace for ALL dependency manifests. Use file_search and read_file to find and parse:

| Ecosystem | Files to Scan |
|-----------|---------------|
| **Node.js** | `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `.npmrc` |
| **Python** | `requirements.txt`, `requirements*.txt`, `pyproject.toml`, `setup.py`, `setup.cfg`, `Pipfile`, `poetry.lock` |
| **.NET** | `*.csproj`, `*.fsproj`, `packages.config`, `Directory.Packages.props`, `global.json` |
| **PHP** | `composer.json`, `composer.lock` |
| **Java/Kotlin** | `pom.xml`, `build.gradle`, `build.gradle.kts`, `gradle.properties` |
| **Go** | `go.mod`, `go.sum` |
| **Rust** | `Cargo.toml`, `Cargo.lock` |
| **Ruby** | `Gemfile`, `Gemfile.lock` |
| **Swift** | `Package.swift`, `Podfile` |
| **Docker** | `Dockerfile`, `docker-compose.yml`, `docker-compose*.yml` |
| **CI/CD** | `.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`, `azure-pipelines.yml` |
| **Config/Build** | `tailwind.config.*`, `postcss.config.*`, `next.config.*`, `vite.config.*`, `webpack.config.*`, `tsconfig.json`, `.babelrc`, `rollup.config.*`, `.eslintrc*`, `.prettierrc*` |
| **Infrastructure** | `*.bicep`, `*.tf`, `serverless.yml`, `cdk.json`, `SAM template` |
| **PWA** | `manifest.json`, `manifest.webmanifest`, `sw.js`, `service-worker.*`, `workbox-config.*` |

For EACH manifest found:
1. Read the full file
2. Extract every dependency (production + dev + peer + optional)
3. Note the exact version constraint (pinned, range, latest)
4. Identify any workspace/monorepo links

Also scan source code for:
- Direct API calls (`fetch`, `axios`, `http`, REST/GraphQL endpoints)
- SDK initializations (Firebase, Stripe, AWS SDK, Azure SDK, etc.)
- Environment variables that reference external services
- Import statements referencing non-standard modules

### Phase 2 — Classification

Organize all discovered items into categories:

| Category | Examples |
|----------|----------|
| **Runtime Framework** | Express, Next.js, Django, Spring Boot, ASP.NET |
| **UI/Frontend** | React, Vue, Svelte, Tailwind CSS, Bootstrap |
| **Database** | better-sqlite3, Prisma, TypeORM, Mongoose, Sequelize |
| **Authentication** | JWT, Passport, NextAuth, Firebase Auth, MSAL |
| **AI/ML** | OpenAI SDK, LangChain, Groq, Ollama, TensorFlow |
| **Real-time** | Socket.IO, WebSocket, Pusher, Ably |
| **Build/Bundler** | Webpack, Vite, esbuild, Turbopack, Rollup |
| **Testing** | Jest, Mocha, Vitest, Playwright, Cypress |
| **CI/CD** | GitHub Actions, GitLab CI, Jenkins |
| **External APIs** | WhatsApp API, Stripe, Twilio, SendGrid, Cloudinary |
| **Infrastructure** | Docker, Kubernetes, Terraform, Bicep |
| **PWA** | Workbox, next-pwa, service workers |
| **Utilities** | Lodash, date-fns, uuid, dotenv, zod |
| **Security** | Helmet, cors, rate-limiting, bcrypt |
| **Monitoring** | Application Insights, Sentry, Winston, Pino |

### Phase 3 — Deep Documentation Fetch

For EACH dependency (prioritize runtime/production deps, then dev deps):

#### 3a. Internal Knowledge
Write what you already know: purpose, common patterns, gotchas, version compatibility.

#### 3b. External Web Searches (CRITICAL — use fetch_webpage extensively)

For every dependency, fetch documentation from these sources:

1. **Official docs** — Fetch the library's main documentation page
   - npm: `https://www.npmjs.com/package/{name}`
   - PyPI: `https://pypi.org/project/{name}/`
   - GitHub: `https://github.com/{owner}/{repo}` (extract from package.json repository field)
   - Official website if different from GitHub

2. **API Reference** — Fetch the getting-started or API page
   - Look for `/docs`, `/api`, `/guide`, `/reference` paths on official sites

3. **Security** — Check for known vulnerabilities
   - Snyk: `https://security.snyk.io/package/npm/{name}`
   - GitHub Advisories: `https://github.com/advisories?query={name}`

4. **Changelog / Migration guides** — For major version changes
   - GitHub releases page: `https://github.com/{owner}/{repo}/releases`
   - CHANGELOG.md in the repo

5. **Bundle size** (for frontend deps)
   - Bundlephobia: `https://bundlephobia.com/package/{name}@{version}`

6. **Alternatives & comparisons** — Search for `"{name}" vs alternatives` patterns

#### 3c. Usage Pattern Extraction

For each dependency, document:
- **Installation**: exact command
- **Basic setup**: minimal working example
- **How THIS project uses it**: grep the codebase for imports/requires and show actual usage patterns
- **Configuration options**: relevant to this project's setup
- **Common pitfalls**: known issues, especially version-specific
- **Breaking changes**: if current version differs from latest

### Phase 4 — Report Generation

Generate TWO outputs:

#### Output A: Markdown Report (save in project)

Save as `docs/dependency-map.md` (or user-specified path) with this structure:

```markdown
# 📦 Dependency Map — {Project Name}
> Generated: {date} | Total dependencies: {count}

## Summary
| Category | Count | Notable |
|----------|-------|---------|
| ... | ... | ... |

## ⚠️ Alerts
- Security vulnerabilities found
- Deprecated packages
- Severely outdated versions (>2 major behind)
- Packages with no maintenance (>2 years no release)

## Detailed Inventory

### {Category Name}

#### {Package Name} `{version}`
- **Purpose**: One-line description
- **Docs**: [Official]({url}) | [npm/PyPI]({url}) | [GitHub]({url})
- **License**: MIT/Apache/etc.
- **Latest**: {latest version} {⚠️ if outdated}
- **Security**: ✅ Clean / ⚠️ {count} advisories
- **Bundle size**: {gzipped size} (frontend only)
- **Usage in project**:
  - `{file}`: {how it's used}
  - `{file}`: {how it's used}
- **Setup pattern**:
  ```{lang}
  // minimal example
  ```
- **Key config options**: ...
- **Pitfalls**: ...
- **Alternatives**: {lib1}, {lib2}
```

#### Output B: Memory File

Save a concise version to `/memories/repo/dependency-map.md` with:
- Package name, version, category, one-line purpose
- Link to full report
- Critical alerts only

### Phase 5 — Validation

After generating the report:
1. Verify all URLs are accessible (re-fetch any that failed)
2. Cross-check dependency counts against manifests
3. Flag any dependencies found in code but NOT in manifests (potential issues)
4. Flag any manifest dependencies NOT imported anywhere (dead dependencies)

## Configuration Notes

- **Rate limiting**: Space out web fetches to avoid being blocked. Batch fetch_webpage calls in groups of 3-5 URLs.
- **Large projects**: For projects with 100+ deps, ask the user if they want full audit or top-N most critical only.
- **Monorepos**: Process each workspace/package separately, then show a unified view.
- **Offline fallback**: If web fetches fail, document what's known from internal knowledge and mark items as "needs external verification".

## Quality Criteria

The report is complete when:
- [ ] Every manifest file has been scanned
- [ ] Every production dependency has official docs link
- [ ] Every dependency has at least one usage example from the codebase
- [ ] Security check attempted for all runtime deps
- [ ] Deprecated/unmaintained packages are flagged
- [ ] Dead dependencies (in manifest but unused) are identified
- [ ] Report is saved in both markdown and memory formats
