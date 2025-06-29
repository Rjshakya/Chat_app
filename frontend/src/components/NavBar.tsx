import { useAuthStore } from "@/store/authStore";
import { H2 } from "./typography/H2";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useNavigate } from "react-router";
import { useEffect } from "react";
// import { socket } from "@/lib/socket";

export const NavBar = () => {
  const { isAuthenticated, user, logout ,checkAuth } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    checkAuth()
  } , [isAuthenticated])

  return (
    <nav className="w-full  p-4">
      <div className="main flex justify-between max-w-4xl mx-auto">
        <div className="logo">
          <H2 text="Chat app" />
        </div>

        <div className="cta flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      referrerPolicy="no-referrer"
                      src={user?.picture}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="mt-4">
                  <DropdownMenuItem>{user?.name}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/login")} variant={"outline"}>
                Login
              </Button>
              <Button onClick={() => navigate("/signup")} variant={"default"}>
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
3;
