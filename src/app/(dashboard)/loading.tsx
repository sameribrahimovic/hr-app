export default function Loading() {
  return <div role="status" aria-label="Učitavanje podataka" className="space-y-6 motion-safe:animate-pulse"><span className="sr-only">Učitavanje podataka...</span><div className="h-8 w-2/3 max-w-sm rounded-lg bg-muted" /><div className="h-4 w-4/5 max-w-lg rounded bg-muted" /><div className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map(item => <div key={item} className="h-40 rounded-2xl border bg-card" />)}</div><div className="h-64 rounded-2xl border bg-card" /></div>;
}
