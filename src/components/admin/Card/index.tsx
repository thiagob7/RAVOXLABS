import Link from "next/link";
import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type BaseProps = PropsWithChildren<{
  className?: string;
}>;

type LinkCardProps = BaseProps & {
  to: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

type ButtonCardProps = BaseProps & {
  onClick: React.MouseEventHandler<HTMLElement>;
  to?: never;
};

type StaticCardProps = BaseProps & {
  to?: undefined;
  onClick?: undefined;
};

type CardProps = LinkCardProps | ButtonCardProps | StaticCardProps;

export const Card: React.FC<CardProps> = ({
  children,
  className,
  to,
  onClick,
}) => {
  const isInteractive = Boolean(to || onClick);
  const style = twMerge(
    "flex w-full rounded-lg border border-gray-700 bg-gray-850 overflow-hidden p-4 duration-300",
    className,
    isInteractive && "hover:bg-gray-800 cursor-pointer"
  );

  if (to) {
    return (
      <Link href={to} className={style} onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={style}>
        {children}
      </button>
    );
  }

  return <div className={style}>{children}</div>;
};
