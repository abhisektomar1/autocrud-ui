import * as React from "react";

export function HStack(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  const className = `flex flex-row ${props.className}`;
  return <div {...props} className={className}></div>;
}

export function VStack(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  const className = `flex flex-col ${props.className}`;
  return <div {...props} className={className}></div>;
}

export function Center(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  const className = `flex items-center justify-center ${props.className}`;
  return <div {...props} className={className}></div>;
}

export function Box(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  const className = `${props.className}`;
  return <div {...props} className={className}></div>;
}

export function Error({ text }: { text?: string }) {
  return <p className="text-[9px] text-red-500 my-0.5">{text}</p>;
}
