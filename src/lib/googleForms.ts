import type { TeamRegistrationData } from "./firebase";

const getEnvVar = (key: string): string => {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] || "";
  }
  try {
    return (import.meta as any).env?.[key] || "";
  } catch {
    return "";
  }
};

const GOOGLE_FORM_URL = getEnvVar("NEXT_PUBLIC_GOOGLE_FORM_URL") || getEnvVar("VITE_GOOGLE_FORM_URL") || "";


export const isGoogleFormConfigured = (): boolean => {
  return Boolean(
    GOOGLE_FORM_URL &&
      (GOOGLE_FORM_URL.includes("script.google.com") || GOOGLE_FORM_URL.includes("docs.google.com")) &&
      !GOOGLE_FORM_URL.includes("YOUR_")
  );
};

/**
 * Submit team registration entry to Google Sheet via Google Apps Script Web App (JSON)
 * or Google Forms (URL Encoded fallback).
 */
export async function submitTeamToGoogleForms(data: TeamRegistrationData): Promise<{ success: boolean; isMock?: boolean; error?: string }> {
  return { success: false, error: "Registrations are closed." };
}
