# Web Search Strategies

## URL Patterns for Documentation Fetching

Use `fetch_webpage` with these URL patterns, adapting `{name}` and `{owner}/{repo}` per package.

### Package Registries

| Ecosystem | Registry URL | Query |
|-----------|-------------|-------|
| npm | `https://www.npmjs.com/package/{name}` | "description version dependencies" |
| PyPI | `https://pypi.org/project/{name}/` | "description version requires" |
| NuGet | `https://www.nuget.org/packages/{name}` | "description version dependencies" |
| Packagist | `https://packagist.org/packages/{vendor}/{name}` | "description version" |
| Maven Central | `https://central.sonatype.com/artifact/{groupId}/{artifactId}` | "version dependencies" |
| crates.io | `https://crates.io/crates/{name}` | "description version" |
| pkg.go.dev | `https://pkg.go.dev/{module}` | "documentation overview" |
| RubyGems | `https://rubygems.org/gems/{name}` | "description version" |

### GitHub Repository Info

1. **Find repo URL**: Extract from `package.json` → `repository` field, or from registry page
2. **README**: `https://github.com/{owner}/{repo}` — query: "installation usage getting started"
3. **Releases**: `https://github.com/{owner}/{repo}/releases` — query: "breaking changes migration"
4. **Issues**: `https://github.com/{owner}/{repo}/issues?q=is:issue+is:open+label:bug` — for known issues

### Official Documentation Sites

Common patterns for popular frameworks:

| Library | Docs URL |
|---------|----------|
| Express | `https://expressjs.com/en/4x/api.html` |
| Next.js | `https://nextjs.org/docs` |
| React | `https://react.dev/reference/react` |
| Tailwind CSS | `https://tailwindcss.com/docs` |
| Socket.IO | `https://socket.io/docs/v4/` |
| Prisma | `https://www.prisma.io/docs` |
| better-sqlite3 | `https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md` |
| Axios | `https://axios-http.com/docs/intro` |
| Django | `https://docs.djangoproject.com/` |
| Flask | `https://flask.palletsprojects.com/` |
| FastAPI | `https://fastapi.tiangolo.com/` |
| Spring Boot | `https://docs.spring.io/spring-boot/docs/current/reference/html/` |
| ASP.NET Core | `https://learn.microsoft.com/en-us/aspnet/core/` |

### Security Databases

| Source | URL Pattern | Query |
|--------|-------------|-------|
| Snyk | `https://security.snyk.io/package/npm/{name}` | "vulnerabilities severity" |
| GitHub Advisories | `https://github.com/advisories?query={name}` | "severity affected versions" |
| npm audit | Run `npm audit --json` in terminal | Parse JSON output |
| pip audit | Run `pip-audit` in terminal | Parse output |

### Bundle Size (Frontend)

| Source | URL Pattern | Query |
|--------|-------------|-------|
| Bundlephobia | `https://bundlephobia.com/package/{name}@{version}` | "gzip size" |
| pkg-size | `https://pkg-size.dev/{name}` | "install size bundle size" |

---

## Search Strategy by Priority

### Tier 1 — Always fetch (production dependencies)
1. Registry page (npm/PyPI/etc.) — version, description, license
2. GitHub README — installation, usage, API overview
3. Official docs main page — configuration, API reference
4. Snyk security check — vulnerabilities

### Tier 2 — Fetch for key dependencies (frameworks, databases, auth)
5. Getting started / tutorial page
6. API reference page
7. Migration/changelog page
8. Bundle size (frontend only)

### Tier 3 — Fetch on request or for flagged items
9. GitHub issues for known bugs
10. Comparison articles (`{name} vs {alternative}`)
11. Community resources (dev.to, Stack Overflow tags)

---

## Batching Strategy

To avoid overloading, batch `fetch_webpage` calls:

```
Batch 1: All registry pages (npm, PyPI, etc.) — 5 at a time
Batch 2: GitHub READMEs for top 10 deps — 5 at a time
Batch 3: Security checks — 5 at a time
Batch 4: Official docs for frameworks — 3 at a time
Batch 5: Remaining docs — 3-5 at a time
```

### Fallback Order
If a URL fails:
1. Try the GitHub repository README instead
2. Try the registry page
3. Use internal knowledge and mark as "⚠️ docs not verified externally"

---

## Extracting Repo URLs from package.json

```javascript
// repository field can be:
"repository": "github:user/repo"
"repository": "https://github.com/user/repo"
"repository": { "type": "git", "url": "git+https://github.com/user/repo.git" }

// homepage field often has docs:
"homepage": "https://expressjs.com"

// bugs field has issue tracker:
"bugs": { "url": "https://github.com/user/repo/issues" }
```

For packages without explicit repo fields, construct GitHub URL:
- Most npm packages: `https://github.com/{npm-scope-or-author}/{package-name}`
- Check npmjs.com page for the actual repository link
