type SectionHeadingProps = {
  title: string;
  description?: string;
  id: string;
  inverted?: boolean;
};

export function SectionHeading({
  title,
  description,
  id,
  inverted = false,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${inverted ? 'is-inverted' : ''}`}>
      <div>
        <h2 id={id}>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
    </div>
  );
}
