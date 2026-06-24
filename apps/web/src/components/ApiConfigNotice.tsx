import { AlertTriangle } from "lucide-react";
import { isApiConfigured } from "../api/client";

export function ApiConfigNotice() {
  if (isApiConfigured) return null;
  return (
    <div className="apiNotice">
      <AlertTriangle size={18} />
      <span>Production API is not configured. Set <strong>VITE_API_URL</strong> to the hosted backend URL before deploying.</span>
    </div>
  );
}
