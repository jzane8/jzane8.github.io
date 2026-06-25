/**
 * Lightweight placeholder shown while a lazily-loaded route chunk downloads.
 * Reserves vertical space to avoid layout shift and announces loading to AT.
 */
export default function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite" aria-busy="true">
      <span className="route-spinner" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
