import { lazy } from "react";

const SCREEN_COMPONENTS: Record<string, any> = {
  "login-id": lazy(() => import("@/screens/login-id")),
  "signup-id": lazy(() => import("@/screens/signup-id")),
};

export const getScreenComponent = (screenName: string) => {
  return SCREEN_COMPONENTS[screenName] || null;
};
