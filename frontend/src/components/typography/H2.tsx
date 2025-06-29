import { cn } from "@/lib/utils";

export const H2 = ({
  text,
  className="",
}: {
  text: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={cn(
        "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
    >
      {text}
    </h2>
  );
};
