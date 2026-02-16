# React Frontend - Virtual Systems Explorer

## File Scope - What Claude Should Care About

### ✅ INCLUDE (Always read/modify these)
- `src/**/*.{js,jsx,ts,tsx}` - All source files
- `public/**/*` (except Unity builds) - Static assets
- `index.html` - Entry point
- `vite.config.js` - Vite configuration
- `package.json` - Dependencies
- `.env*` files - Environment variables

### ❌ EXCLUDE (Never read these)
- `node_modules/**/*` - Dependencies (massive token waste)
- `dist/**/*` - Build output
- `public/unity/**/*` - Unity WebGL builds (generated from Unity repo)
- `.vite/**/*` - Vite cache

### 🔍 Search Patterns
**React components:**
```
Pattern: **/*.{jsx,tsx}
Path: C:\Repos\VSE\virtual-systems-explorer-frontend\src
```

**All source code:**
```
Pattern: **/*.{js,jsx,ts,tsx}
Path: C:\Repos\VSE\virtual-systems-explorer-frontend\src
```

## Tech Stack
- **React 19.2** with hooks
- **Vite** for dev server and bundling
- **react-unity-webgl** for Unity integration
- No state management library yet (using React state)
- No routing yet (single page app)

## Code Organization (Current)
```
src/
├── main.jsx          # Entry point
├── App.jsx           # Main component (Unity + UI)
└── (future components here)
```

## Unity Integration Notes
- Unity builds expected in `/public/unity/Builds.*`
- Current build name configured in `App.jsx` (const `buildName`)
- Communication with Unity via `react-unity-webgl` events
- Event: `OnPartClicked` - Unity → React (already wired)

## Development Workflow
- `npm run dev` - Start Vite dev server
- Unity builds must be manually placed in `public/unity/` before testing
- Hot reload works for React code, Unity requires rebuild

## Token-Saving Tips for Claude
- **Never** search or read `node_modules/`
- When asked about "components", only look in `src/`
- If Unity build files are mentioned, they're in `public/unity/` but don't read them (binary/compiled)
- Use specific file patterns - avoid globbing the entire project root

## Documentation Policy
- **NEVER** create README.md or other documentation files unless explicitly requested by the user
- Focus on code implementation, not documentation generation
