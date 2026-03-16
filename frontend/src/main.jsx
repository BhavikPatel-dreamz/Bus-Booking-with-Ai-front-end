import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import UserProvider from "./context/UserContext.jsx";
import AuthAdminProvider from "./context/AuthAdminContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthAdminProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </AuthAdminProvider>,
);
