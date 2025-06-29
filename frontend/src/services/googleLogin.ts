import { type CodeResponse } from "@react-oauth/google";
import { handleLogin, handleSignup } from "./auth/auth.service";

export const handleSuccess = async (
  response: Omit<CodeResponse, "error" | "error_description" | "error_uri">,
  isLogin: boolean
) => {
  isLogin
    ? await handleLogin(response.code)
    : await handleSignup(response.code);
};

export const handleError = (
  res: Pick<CodeResponse, "error" | "error_description" | "error_uri">
) => {
  console.log(res.error);
};
