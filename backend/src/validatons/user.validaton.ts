import { z } from "zod";
import { email } from "zod/v4";

interface Iuser {
  name: string;
  email: string;
  picture: string;
  oauth: string;
  role: string;
  isOnline: string;
  last_loggedIn: string | null;
}

export const userSchemeValidation = z.object({
  name: z.string({ message: "name is required" }).nonempty(),
  email: z.string().email({
    message: "email is required",
  }),
  picture: z.string({ message: "picture is required" }).nonempty(),
});



