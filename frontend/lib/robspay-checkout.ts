const SDK_URL = "https://robspay.robsamtechnologies.com/apis/v1/assets/robspay-checkout.js";

export type RobsPayCheckoutOptions = {
  /** modal_url returned when the checkout session was created. */
  url: string;
  onSuccess?: (response: { transaction_id?: string }) => void;
  onClose?: () => void;
};

type RobsPayCheckoutApi = { open: (options: RobsPayCheckoutOptions) => void };

declare global {
  interface Window {
    RobsPayCheckout?: RobsPayCheckoutApi;
  }
}

let loading: Promise<RobsPayCheckoutApi> | null = null;

/**
 * Loads RobsPay's checkout script on demand. It opens the hosted card form in a pop-up on our page,
 * so card details are entered on RobsPay and never reach RaiseFundz. Rejects if the script cannot load,
 * so callers can fall back to a full-page redirect.
 */
export function loadRobsPayCheckout(): Promise<RobsPayCheckoutApi> {
  if (typeof window === "undefined") return Promise.reject(new Error("Not in a browser"));
  if (window.RobsPayCheckout) return Promise.resolve(window.RobsPayCheckout);
  if (loading) return loading;

  loading = new Promise<RobsPayCheckoutApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => {
      if (window.RobsPayCheckout) resolve(window.RobsPayCheckout);
      else reject(new Error("RobsPay checkout script did not initialise"));
    };
    script.onerror = () => reject(new Error("RobsPay checkout script failed to load"));
    document.head.appendChild(script);
  }).catch((err) => {
    loading = null;
    throw err;
  });
  return loading;
}
