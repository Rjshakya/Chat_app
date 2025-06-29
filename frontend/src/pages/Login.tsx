import { LoginForm } from "@/components/login-form";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const Login = () => {
  const { isAuthenticated } = useAuthStore((s) => s);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  return (
    <div className=" w-full px-4 md:px-0">
      <LoginForm className=" max-w-sm  mx-auto mt-40"></LoginForm>
    </div>
  );
};
