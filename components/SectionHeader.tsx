export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9a5b48]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="professional-heading mt-3 text-4xl tracking-normal text-stone-950 sm:text-5xl">
        {title}
      </h2>
      <span className="accent-divider mx-auto mt-5" />
      {description ? <p className="mt-4 text-base leading-7 text-stone-600">{description}</p> : null}
    </div>
  );
}
