export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-border py-20 text-center">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand">
          <Icon size={26} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
    </div>
  );
}
