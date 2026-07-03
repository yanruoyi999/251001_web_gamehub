// During Next.js static generation on Vercel, database calls can slow down
// content-only deployments. Pages that have local fallback data can use this
// helper to skip remote reads during the build and keep runtime behavior intact.
export function isNextProductionBuild() {
  return (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.npm_lifecycle_event === 'build'
  );
}
