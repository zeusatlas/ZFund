const SDK_URL = "https://js.paystack.co/v2/inline.js";

export type PaystackTransaction = { reference?: string; status?: string; trans?: string };

export type PaystackResumeCallbacks = {
  onSuccess?: (transaction: PaystackTransaction) => void;
  onCancel?: () => void;
  onError?: (error: { message?: string }) => void;
};

type PaystackPopInstance = {
  resumeTransaction: (accessCode: string, callbacks?: PaystackResumeCallbacks) => void;
};

type PaystackPopConstructor = new () => PaystackPopInstance;

declare global {
  interface Window {
    PaystackPop?: PaystackPopConstructor;
  }
}

let loading: Promise<PaystackPopConstructor> | null = null;

/**
 * Loads Paystack Inline on demand. The checkout opens on top of the current page, so card and wallet
 * details are entered on Paystack and never reach RaiseFundz. Rejects if the script cannot load.
 */
export function loadPaystackInline(): Promise<PaystackPopConstructor> {
  if (typeof window === "undefined") return Promise.reject(new Error("Not in a browser"));
  if (window.PaystackPop) return Promise.resolve(window.PaystackPop);
  if (loading) return loading;

  loading = new Promise<PaystackPopConstructor>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => {
      if (window.PaystackPop) resolve(window.PaystackPop);
      else reject(new Error("Paystack Inline did not initialise"));
    };
    script.onerror = () => reject(new Error("Paystack Inline failed to load"));
    document.head.appendChild(script);
  }).catch((err) => {
    loading = null;
    throw err;
  });
  return loading;
}

/**
 * Opens Paystack Inline for a transaction our backend already initialised. The access code carries the
 * amount, customer and the single payment channel chosen in our modal, so nothing is picked twice.
 */
export async function openPaystackInline(accessCode: string, callbacks: PaystackResumeCallbacks): Promise<void> {
  const PaystackPop = await loadPaystackInline();
  new PaystackPop().resumeTransaction(accessCode, callbacks);
}
