import { addDays, endOfDay, startOfDay } from "date-fns";
import { TZDate } from "@date-fns/tz";

export const getStartandEnd = () => {
  const start = startOfDay(new Date()) 
  const startTz = new TZDate(start , 'Asia/Kolkata')
  

  const end = addDays(start , 1)
  const endTZ = new TZDate(end ,  'Asia/Kolkata')

  
  return { startTz , endTZ}
  
};
