# Manifest Patterns Reference

## Node.js / JavaScript / TypeScript

### package.json
```json
{
  "dependencies": { "express": "^4.18.2" },
  "devDependencies": { "nodemon": "^3.0.0" },
  "peerDependencies": { "react": ">=17" },
  "optionalDependencies": { "fsevents": "^2.3.0" },
  "engines": { "node": ">=18" },
  "workspaces": ["packages/*"]
}
```
**Extract**: All 4 dependency types + engines + workspaces for monorepo detection.

### Version Constraint Meanings
| Syntax | Meaning |
|--------|---------|
| `1.2.3` | Exact version |
| `^1.2.3` | Compatible (>=1.2.3, <2.0.0) |
| `~1.2.3` | Patch-level (~>=1.2.3, <1.3.0) |
| `*` or `latest` | Any version (risky) |
| `>=1.0.0` | Range |
| `workspace:*` | Monorepo link (pnpm/yarn) |
| `file:../path` | Local file link |
| `git+https://...` | Git dependency |

---

## Python

### requirements.txt
```
flask==2.3.0
requests>=2.28,<3
numpy  # unpinned — flag as risk
-r requirements-base.txt  # includes another file
```

### pyproject.toml (PEP 621 / Poetry)
```toml
[project]
dependencies = ["fastapi>=0.100", "uvicorn[standard]"]

[project.optional-dependencies]
dev = ["pytest", "black"]

[tool.poetry.dependencies]
python = "^3.11"
django = "^4.2"

[tool.poetry.group.dev.dependencies]
pytest = "^7.0"
```

### setup.py / setup.cfg
```python
install_requires=["flask>=2.0", "sqlalchemy"]
extras_require={"dev": ["pytest"], "redis": ["redis>=4"]}
```

### Pipfile
```toml
[packages]
django = ">=4.0"

[dev-packages]
pytest = "*"
```

---

## .NET (C#, F#)

### *.csproj
```xml
<ItemGroup>
  <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
  <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
</ItemGroup>
```

### Directory.Packages.props (Central Package Management)
```xml
<ItemGroup>
  <PackageVersion Include="Newtonsoft.Json" Version="13.0.3" />
</ItemGroup>
```

### packages.config (legacy)
```xml
<packages>
  <package id="Newtonsoft.Json" version="13.0.3" targetFramework="net48" />
</packages>
```

---

## PHP

### composer.json
```json
{
  "require": { "laravel/framework": "^10.0" },
  "require-dev": { "phpunit/phpunit": "^10.0" }
}
```

---

## Java / Kotlin

### pom.xml (Maven)
```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.2.0</version>
  </dependency>
</dependencies>
```

### build.gradle / build.gradle.kts
```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web:3.2.0")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
}
```

---

## Go

### go.mod
```go
module github.com/user/project

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/lib/pq v1.10.9
)

require (
    // indirect dependencies listed here
    golang.org/x/crypto v0.14.0 // indirect
)
```

---

## Rust

### Cargo.toml
```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
reqwest = "0.11"

[dev-dependencies]
criterion = "0.5"
```

---

## Docker

### Dockerfile
Extract base images:
```dockerfile
FROM node:20-alpine AS build    # -> node v20
FROM nginx:1.25-alpine          # -> nginx v1.25
```

### docker-compose.yml
Extract service images and environment references:
```yaml
services:
  db:
    image: postgres:16           # -> PostgreSQL v16
  redis:
    image: redis:7-alpine        # -> Redis v7
```

---

## CI/CD Workflows

### GitHub Actions (.github/workflows/*.yml)
```yaml
- uses: actions/checkout@v4          # -> GitHub Action
- uses: actions/setup-node@v4        # -> GitHub Action
  with:
    node-version: '20'
- run: npm ci                        # -> implicit npm usage
```

### Other CI
- `.gitlab-ci.yml` — Look for `image:` and script commands
- `Jenkinsfile` — Look for tool installations and `sh` blocks
- `azure-pipelines.yml` — Look for `task:` references

---

## PWA-Specific

### manifest.json / manifest.webmanifest
Not a dependency file but indicates PWA usage. Check for:
- `start_url`, `display: standalone`, `icons`
- Related service worker files

### workbox-config.js
```javascript
module.exports = {
  globDirectory: 'build/',
  globPatterns: ['**/*.{html,js,css}'],
  swDest: 'build/sw.js',
};
```

---

## Config Files (Implicit Dependencies)

These files imply specific toolchain dependencies:

| Config File | Implies |
|-------------|---------|
| `tailwind.config.*` | tailwindcss, postcss, autoprefixer |
| `next.config.*` | next, react, react-dom |
| `vite.config.*` | vite |
| `webpack.config.*` | webpack, webpack-cli |
| `tsconfig.json` | typescript |
| `.eslintrc*` | eslint + plugins listed inside |
| `.prettierrc*` | prettier |
| `.babelrc` / `babel.config.*` | @babel/core + presets/plugins |
| `jest.config.*` | jest |
| `vitest.config.*` | vitest |
| `playwright.config.*` | @playwright/test |
| `.env*` | dotenv (if Node.js) |

---

## Source Code Scanning Patterns

Beyond manifest files, scan for implicit dependencies in source code:

```
# API clients / SDKs initialized in code
grep -rn "require\|import" --include="*.js" --include="*.ts" --include="*.py"

# Environment variables referencing services
grep -rn "process\.env\." --include="*.js" --include="*.ts"
grep -rn "os\.environ\|os\.getenv" --include="*.py"

# Direct HTTP calls to external APIs
grep -rn "https://api\." --include="*.js" --include="*.ts" --include="*.py"
grep -rn "fetch\|axios\|requests\.\(get\|post\)" --include="*.js" --include="*.ts" --include="*.py"
```
