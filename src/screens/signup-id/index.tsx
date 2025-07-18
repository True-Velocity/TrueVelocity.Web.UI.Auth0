import React from "react";
import Card from "@/common/Card";
import { applyAuth0Theme } from "@/utils/theme";

import Header from "./components/Header";
import SignupForm from "./components/SignupForm";
import Footer from "./components/Footer";
import ULThemePageLayout from "@/components/ULThemePageLayout";
import { useSignupIdManager } from "./hooks/useSignupIdManager";

const SignupIdScreen: React.FC = () => {
  const { signupIdInstance, texts } = useSignupIdManager();

  document.title = texts?.pageTitle || "Login";

  // Apply theme from SDK instance when screen loads
  applyAuth0Theme(signupIdInstance);

  return (
    //Applying UDS theme overrides using the "theme-universal" class
    <ULThemePageLayout className="theme-universal">
      <Card className="w-full max-w-[400px]">
        <Header />
        <SignupForm />
        <Footer />
      </Card>
    </ULThemePageLayout>
  );
};

export default SignupIdScreen;
