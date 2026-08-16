export default function SectionHeading({ tag, title, description, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left items-start' : 'text-center items-center';
  return (
    <div className={`flex flex-col gap-4 ${alignClass}`}>
      {tag && <span className="section-tag">{tag}</span>}
      <h2 className="font-title text-3xl text-ink sm:text-4xl">{title}</h2>
      {description && <p className={`max-w-2xl text-ink-muted ${align === 'center' ? 'mx-auto' : ''}`}>{description}</p>}
    </div>
  );
}
