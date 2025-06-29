import { cn } from "@/lib/utils";

const H1 = ({
  text,
  className,
}: {
  text: React.ReactNode;
  className: string;
}) => {
  return (
    <h1
      className={cn(
        `scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance`,
        className
      )}
    >
      {text}
    </h1>
  );
};

export default H1;
