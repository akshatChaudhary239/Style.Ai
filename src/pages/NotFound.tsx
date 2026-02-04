import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-5 text-4xl font-bold">HEY THERE </h1>
        <p className="mb-4 text-2xl text-muted-foreground">WELCOME TO STYLE.AI</p>
        <a href="/" className="text-primary  uppercase">
         click here to go to the DASHBOARD
        </a>
        <button className="text-primary underline hover:text-primary/90 " onClick={() => navigate("/buyer")}>Go to Dashboard</button>

      </div>
    </div>
  );
};

export default NotFound;
