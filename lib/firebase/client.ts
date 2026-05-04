import { initializeApp, getApps, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

function readFirebaseOptions(): FirebaseOptions | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !storageBucket ||
    !messagingSenderId ||
    !appId
  ) {
    return null;
  }

  const options: FirebaseOptions = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
  if (measurementId) options.measurementId = measurementId;
  return options;
}

let app: FirebaseApp | undefined;

/** Browser-only. Returns null on the server or if env is incomplete. */
export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  const options = readFirebaseOptions();
  if (!options) return null;
  if (!app) {
    app = getApps().length > 0 ? getApps()[0]! : initializeApp(options);
  }
  return app;
}

let analytics: Analytics | null | undefined;

/**
 * Safe to call from a client effect. No-ops on the server, without config, or if Analytics is unsupported.
 */
export async function initFirebaseAnalytics(): Promise<void> {
  if (typeof window === "undefined") return;
  const options = readFirebaseOptions();
  if (!options?.measurementId) return;

  const supported = await isSupported().catch(() => false);
  if (!supported) return;

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return;

  if (analytics === undefined) {
    analytics = getAnalytics(firebaseApp);
  }
}
