# Development Workflow

## 1. Branching Strategy
- `main`: Stable release branch.
- `dev` or `feature/*`: Active development branches.

## 2. Making Changes
- Pull the latest `main`.
- Create a new branch: `git checkout -b feature/my-cool-feature`
- Implement code changes, ensuring both Main and Renderer processes are updated securely.

## 3. Testing
- Run locally: `npm run dev`
- Run linting: `npm run lint`
- Run type checks: `npm run type-check`

## 4. Committing (Conventional Commits)
Follow the standard conventional commit format:
- `feat: Add dark mode toggle`
- `fix: Resolve IPC race condition on save`
- `docs: Update API documentation`
- `refactor: Streamline preload exposure`

## 5. Pull Requests
- Open a PR against `main`.
- Fill out the `.github/PULL_REQUEST_TEMPLATE.md`.
- Assign to `sanchez314c` for review.
