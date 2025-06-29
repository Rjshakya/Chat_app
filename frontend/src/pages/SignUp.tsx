import { SignUpForm } from "@/components/signup-form";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const SignUp = () => {
  const { isAuthenticated } = useAuthStore((s) => s);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <div className=" w-full px-4 md:px-0">
      <SignUpForm className=" max-w-sm  mx-auto mt-40"></SignUpForm>
    </div>
  );
};
