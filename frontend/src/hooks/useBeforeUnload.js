import { useEffect } from "react";

export function useBeforeUnload(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // required for Chrome, Firefox, Edge
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled]);
}
