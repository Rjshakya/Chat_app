import { useEffect, useState } from "react";

const useDebounce = (value: string, delay: number) => {
  const [val, setVal] = useState("");

  useEffect(() => {
    const timerID = setTimeout(() => {
      setVal(value);
    }, delay);

    return () => {
      clearTimeout(timerID)
    }
  }, [value, delay]);

  return val
};

export default useDebounce;
