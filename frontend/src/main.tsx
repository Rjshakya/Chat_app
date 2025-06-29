import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "./components/ui/sonner.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Login } from "./pages/Login.tsx";
import { SignUp } from "./pages/SignUp.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import { Landing } from "./pages/Landing.tsx";
const googleClientID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={googleClientID}>
    <BrowserRouter>
      <Routes>
        <Route  path="/" element={<App />}>
            <Route path="/" element={<Landing/>}/>
        </Route>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>

      <Toaster />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
