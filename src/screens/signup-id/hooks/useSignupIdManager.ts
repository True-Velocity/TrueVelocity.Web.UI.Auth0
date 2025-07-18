import { useState } from "react";
import SignupIdInstance from "@auth0/auth0-acul-js/signup-id";
import { executeSafely } from "@/utils/helpers/executeSafely";
import { SignupOptions } from "@auth0/auth0-acul-js/signup";

export const useSignupIdManager = () => {
  const [signupIdInstance] = useState(() => new SignupIdInstance());

  const { transaction, screen } = signupIdInstance;
  const { optionalIdentifiers, requiredIdentifiers, isPasskeyEnabled } =
    transaction;

  // Extract links for consumption by UI components
  const { loginLink, texts, captchaImage } = screen;

  const handleSignupId: (args: SignupOptions) => Promise<void> = async (
    options,
  ): Promise<void> => {
    executeSafely(`SignupId with options: ${JSON.stringify(options)}`, () =>
      signupIdInstance.signup(options),
    );
  };

  const handleFederatedSignup = async (connectionName: string) => {
    executeSafely(`Federated signup with connection: ${connectionName}`, () =>
      signupIdInstance.federatedSignup({ connection: connectionName }),
    );
  };

  return {
    signupIdInstance,
    handleSignupId,
    handleFederatedSignup,
    // --- State & Data for UI ---
    // Raw texts object - let components handle their own fallbacks
    texts: texts || {},
    // Explicit state flags for conditional rendering
    isPasskeyEnabled: !!isPasskeyEnabled,
    isCaptchaAvailable: !!screen.isCaptchaAvailable,
    errors: signupIdInstance.getError(),
    captchaImage,
    // Direct links for UI
    loginLink,
    optionalIdentifiers,
    requiredIdentifiers,
  };
};
