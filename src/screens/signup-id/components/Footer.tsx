import React from "react";
import { useSignupIdManager } from "../hooks/useSignupIdManager";
import { rebaseLinkToCurrentOrigin } from "@/utils/helpers/urlUtils";

const Footer: React.FC = () => {
  const { loginLink, texts } = useSignupIdManager();

  const localizedLoginLink = rebaseLinkToCurrentOrigin(loginLink);

  // Handle text fallbacks in component
  const footerText = texts?.footerText || "Don't have an account?";
  const footerLinkText = texts?.footerLinkText || "Sign up";

  return (
    <div className="mt-4 text-left">
      <span className="text-sm pr-1">{footerText}</span>
      {localizedLoginLink && (
        <a
          href={localizedLoginLink}
          className="text-sm font-bold text-link hover:text-link/80 focus:bg-link/15 focus:rounded"
        >
          {footerLinkText}
        </a>
      )}
    </div>
  );
};

export default Footer;
