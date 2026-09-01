type SectionHeadingProps = {
  index: string;
  title: string;
  description?: string;
  id: string;
  inverted?: boolean;
};

export function SectionHeading({
  index,
  title,
  description,
  id,
  inverted = false,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${inverted ? 'is-inverted' : ''}`}>
      <p className="section-index">{index}</p>
      <div>
        <h2 id={id}>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
    </div>
  );
}
