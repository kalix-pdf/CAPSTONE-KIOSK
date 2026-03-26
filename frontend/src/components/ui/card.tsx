import * as React from "react";
import { ComponentPropsWithoutRef } from "react";

type DivProps = ComponentPropsWithoutRef<"div">;
type H4Props = ComponentPropsWithoutRef<"h4">;
type PProps = ComponentPropsWithoutRef<"p">;


import { cn } from "./utils";

function Card({ className, padded, ...props }: DivProps & { padded?: boolean}) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card shadow-md text-card-foreground flex flex-col gap-2 rounded-xl border",
        padded && "py-4",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: H4Props) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}


function CardDescription({ className, ...props }: PProps) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm py-2 capitalize", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
} // [&:last-child]:pb-0

function CardFooter({ className, ...props }: DivProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6", className)}
      {...props}
    />
  );
} // [.border-t]:pt-0

const CardImage = React.forwardRef<HTMLImageElement, React.ComponentProps<"img">>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      data-slot="card-image"
      className={cn(
        "h-48 block mx-auto rounded-xl",
        className
      )}
      {...props}
    />
  )
);
CardImage.displayName = "CardImage";


export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardImage,
};
