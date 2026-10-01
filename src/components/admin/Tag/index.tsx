import clsx from "clsx";
import React from "react";

import { TagVariantProps, tagVariant } from "./variant";

type TagIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface TagProps extends TagVariantProps {
  children: React.ReactNode;
  className?: string;
  icon?: TagIcon;
  iconClassName?: string;
  labelClassName?: string;
  title?: string;
}

export const Tag: React.FC<TagProps> = ({
  children,
  tone,
  size,
  withBorder,
  truncate,
  className,
  icon: Icon,
  iconClassName,
  labelClassName,
  title,
}) => {
  return (
    <div
      className={clsx(
        tagVariant({
          tone,
          size,
          withBorder,
          truncate,
        }),
        className
      )}
      title={title}
    >
      {Icon && (
        <Icon
          className={clsx("h-3.5 w-3.5 shrink-0", iconClassName)}
          aria-hidden={true}
        />
      )}
      <span
        className={clsx(
          truncate && "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap",
          labelClassName
        )}
      >
        {children}
      </span>
    </div>
  );
};
