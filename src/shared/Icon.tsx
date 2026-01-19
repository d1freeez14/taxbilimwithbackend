type IconProps = {
  name: string;
  size?: number | string;
  className?: string;
  title?: string;
};

export function Icon({ name, size = 20, className, title }: IconProps) {
  const ariaProps = title
    ? { role: "img", "aria-label": title }
    : { "aria-hidden": true as const };

  return (
    <svg
      width={size}
      height={size}
      className={className}
      /*{...ariaProps}*/
    >
      {/* important: path to sprite in /public */}
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
}
