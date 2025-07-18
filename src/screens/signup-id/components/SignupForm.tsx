import React from "react";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { ULThemePrimaryButton } from "@/components/ULThemePrimaryButton";
import Alert from "@/common/Alert";
import CaptchaBox from "@/common/CaptchaBox";
import FormField from "@/common/FormField";
import { getFieldError } from "@/utils/helpers/errorUtils";
import { getIdentifierDetails } from "@/utils/helpers/signupUtils";
import { useSignupIdManager } from "../hooks/useSignupIdManager";
import type { Error, IdentifierType } from "@auth0/auth0-acul-js";
import { SignupOptions } from "@auth0/auth0-acul-js/signup";

interface SignupIdFormData {
  email?: string;
  phone_number?: string;
  username?: string;
  captcha?: string;
}

// No props needed as it uses hooks internally for data and actions
const SignupForm: React.FC = () => {
  const {
    handleSignupId,
    texts,
    isCaptchaAvailable,
    errors,
    captchaImage,
    optionalIdentifiers,
    requiredIdentifiers,
  } = useSignupIdManager();

  // Handle text fallbacks in component
  const buttonText = texts?.buttonText || "Continue";

  const captchaLabel = texts?.captchaCodePlaceholder?.concat("*") || "CAPTCHA*";
  const captchaImageAlt = "CAPTCHA challenge"; // Default fallback

  // Get general errors (not field-specific)
  const generalErrors =
    errors?.filter((error: Error) => !error.field || error.field === null) ||
    [];

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<SignupIdFormData>();

  // Proper submit handler with form data
  const onSubmit = async (data: SignupIdFormData) => {
    const signupOptions: SignupOptions = {
      captcha: isCaptchaAvailable ? data.captcha?.trim() : undefined,
      email: data.email?.trim(),
      phone_number: data.phone_number?.trim(),
      username: data.username?.trim(),
    };
    await handleSignupId(signupOptions);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* General alerts at the top */}
      {generalErrors.length > 0 && (
        <div className="space-y-3 mb-4">
          {generalErrors.map((error: Error, index: number) => (
            <Alert key={index} type="error" message={error.message} />
          ))}
        </div>
      )}

      {requiredIdentifiers?.map((requiredIdentifier) => (
        <IdentifierFormField
          key={requiredIdentifier}
          type={requiredIdentifier}
          isRequired={true}
          texts={texts}
          formErrors={formErrors}
          errors={errors}
          register={register}
        />
      ))}

      {optionalIdentifiers?.map((optionalIdentifier) => (
        <IdentifierFormField
          key={optionalIdentifier}
          type={optionalIdentifier}
          isRequired={false}
          texts={texts}
          formErrors={formErrors}
          errors={errors}
          register={register}
        />
      ))}

      {isCaptchaAvailable && (
        <CaptchaBox
          className="mb-4"
          id="captcha-input-signup-id"
          name="captcha"
          label={captchaLabel}
          imageUrl={captchaImage || ""}
          imageAltText={captchaImageAlt}
          inputProps={{
            ...register("captcha", {
              required: "Please complete the CAPTCHA",
              maxLength: {
                value: 15,
                message: "CAPTCHA too long",
              },
            }),
          }}
          error={
            formErrors.captcha?.message || getFieldError("captcha", errors)
          }
        />
      )}

      <ULThemePrimaryButton
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {buttonText}
      </ULThemePrimaryButton>
    </form>
  );
};

const IdentifierFormField: React.FC<{
  type: IdentifierType;
  isRequired: boolean;
  texts: Record<string, string>;
  formErrors: FieldErrors<SignupIdFormData>;
  errors: Error[];
  register: UseFormRegister<SignupIdFormData>;
}> = ({ type, texts, isRequired, formErrors, register, errors }) => {
  const {
    label: identifierLabel,
    type: identifierType,
    autoComplete: identifierAutoComplete,
    formField: identifierFormField,
  } = getIdentifierDetails(isRequired, type, texts);

  return (
    <FormField
      className="mb-4 rounded-none"
      labelProps={{
        children: identifierLabel,
        htmlFor: `identifier-signup-id-${type}`,
      }}
      inputProps={{
        ...register(identifierFormField, {
          required: "This field is required",
          maxLength: {
            value: 100,
            message: "Maximum 100 characters allowed",
          },
        }),
        id: `identifier-signup-id-${type}`,
        type: identifierType,
        autoComplete: identifierAutoComplete,
        autoFocus: true,
      }}
      error={
        formErrors[identifierFormField]?.message ||
        getFieldError("email", errors) ||
        getFieldError("phone_number", errors) ||
        getFieldError("username", errors)
      }
    />
  );
};

export default SignupForm;
