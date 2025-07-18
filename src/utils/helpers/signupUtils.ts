import type { IdentifierType } from "@auth0/auth0-acul-js";

interface IdentifierDetails {
  label: string;
  type: string; // HTML input type
  autoComplete: IdentifierType | string; // Prefer IdentifierType when applicable
  formField: "email" | "phone_number" | "username";
}

// Specific keys for placeholder texts for better type safety in the config map
type PlaceholderKey =
  | "emailPlaceholder"
  | "phonePlaceholder"
  | "usernamePlaceholder"
  | "emailOptionalPlaceholder"
  | "phoneOptionalPlaceholder"
  | "usernameOptionalPlaceholder";

interface IdentifierConfig {
  labelKey: PlaceholderKey;
  labelFallback: string;
  type?: string; // HTML input type
  formField: "email" | "phone_number" | "username";
  autoComplete?: IdentifierType | string; // Prefer IdentifierType when applicable
}

/**
 * Helper function to create a descriptive key for identifier combinations
 */
const createIdentifierKey = (
  connectionAttribute: IdentifierType,
  isRequired: boolean,
): string => {
  const identifiers: string[] = [connectionAttribute];
  if (!isRequired) identifiers.push("-optional");
  return identifiers.join("-");
};

/**
 * Determines the appropriate label, input type, and autocomplete attribute
 * for an identifier field based on connection attribute and screen texts.
 *
 * @param connectionAttributes - The connection attributes from the transaction object.
 * @param screenTexts - The screen.texts object from Auth0 SDK instance.
 * @returns An object containing the label, type, and autoComplete string for the identifier field.
 */
export const getIdentifierDetails = (
  isRequired: boolean,
  connectionAttribute?: IdentifierType,
  screenTexts?: any, // Auth0 screen.texts object
): IdentifierDetails => {
  // Initialize with the most common / general defaults
  let finalLabel = screenTexts?.emailPlaceholder || "Email address";
  let finalType = "text";
  let finalAutoComplete: IdentifierType | string = "email";
  let finalFormField: "email" | "phone_number" | "username" = "email";

  if (connectionAttribute) {
    // Create a descriptive key based on active identifiers
    const identifierKey = createIdentifierKey(connectionAttribute, isRequired);

    const configMap: Record<string, IdentifierConfig> = {
      email: {
        labelKey: "emailPlaceholder",
        labelFallback: screenTexts?.emailPlaceholder || "Email address",
        type: "email",
        autoComplete: "email",
        formField: "email",
      },
      phone: {
        labelKey: "phonePlaceholder",
        labelFallback: screenTexts?.phonePlaceholder || "Phone number",
        type: "tel",
        autoComplete: "tel",
        formField: "phone_number",
      },
      username: {
        labelKey: "usernamePlaceholder",
        labelFallback: screenTexts?.usernamePlaceholder || "Username",
        autoComplete: "username",
        formField: "username",
      },
      ["email-optional"]: {
        labelKey: "emailOptionalPlaceholder",
        labelFallback:
          screenTexts?.emailOptionalPlaceholder || "Email address (Optional)",
        type: "email",
        autoComplete: "email",
        formField: "email",
      },
      ["phone-optional"]: {
        labelKey: "phoneOptionalPlaceholder",
        labelFallback:
          screenTexts?.phoneOptionalPlaceholder || "Phone number (Optional)",
        type: "tel",
        autoComplete: "tel",
        formField: "phone_number",
      },
      ["username-optional"]: {
        labelKey: "usernameOptionalPlaceholder",
        labelFallback:
          screenTexts?.usernameOptionalPlaceholder || "Username (Optional)",
        autoComplete: "username",
        formField: "username",
      },
    };

    const config = configMap[identifierKey];

    if (config) {
      finalLabel = config.labelFallback;
      if (config.type) {
        finalType = config.type;
      }
      if (config.autoComplete) {
        finalAutoComplete = config.autoComplete;
      }
    }

    finalFormField = config.formField;
  }

  if (isRequired) {
    finalLabel += "*";
  }

  return {
    label: finalLabel,
    type: finalType,
    autoComplete: finalAutoComplete,
    formField: finalFormField,
  };
};
