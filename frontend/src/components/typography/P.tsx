import { cn } from "@/lib/utils";

export const P = ({ text , className }: { text: React.ReactNode   , className?:string}) => {
  return <p className={cn(`leading-7 [&:not(:first-child)]:mt-6` , className)}>{text}</p>;
};
