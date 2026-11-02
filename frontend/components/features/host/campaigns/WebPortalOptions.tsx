"use client";

import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

type Props = {
  /** Unique prefix for element ids, so two forms never clash. */
  idPrefix: string;
  /** Image already saved on the campaign (absolute URL), shown until a new file is chosen. */
  currentImageUrl?: string | null;
  file: File | null;
  onFileChange: (file: File | null) => void;
  showPublicTransactions: boolean;
  onShowPublicTransactionsChange: (value: boolean) => void;
  disabled?: boolean;
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Extra options that only apply once the web donation portal is on: an optional cover image
 * and whether contributions are shown publicly. Shared by the create and edit forms.
 */
export default function WebPortalOptions({
  idPrefix,
  currentImageUrl,
  file,
  onFileChange,
  showPublicTransactions,
  onShowPublicTransactionsChange,
  disabled,
}: Readonly<Props>) {
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Preview URL for a newly chosen image; revoked when it changes so blobs are not leaked.
  useEffect(() => {
    if (!file) {
      setFilePreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const chosen = event.target.files?.[0];
    event.target.value = "";
    if (!chosen) return;
    if (!ACCEPTED_TYPES.includes(chosen.type)) {
      toast.error("Please choose a JPG, PNG or WebP image.");
      return;
    }
    if (chosen.size > MAX_BYTES) {
      toast.error("Image must be 5MB or smaller.");
      return;
    }
    onFileChange(chosen);
  }

  const previewSrc = filePreview ?? currentImageUrl ?? null;
  const inputId = `${idPrefix}-cover`;

  return (
    <div className="mt-4 space-y-4 border-t border-navy/10 pt-4">
      {/* Optional cover image */}
      <div>
        <p className="text-sm font-semibold text-navy">
          Campaign image <span className="font-normal text-steel">(optional)</span>
        </p>
        <p className="mt-0.5 text-xs text-steel">
          Shown at the top of the public campaign page. JPG, PNG or WebP, up to 5MB.
        </p>

        {previewSrc ? (
          <div className="relative mt-2 overflow-hidden rounded-xl border border-navy/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewSrc} alt="Campaign cover preview" className="h-40 w-full object-cover" />
            {file && (
              <button
                type="button"
                onClick={() => onFileChange(null)}
                disabled={disabled}
                aria-label="Discard the new image"
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-navy shadow hover:bg-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : null}

        <label
          htmlFor={inputId}
          className={`mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-navy/25 bg-stone-light px-4 text-xs text-steel hover:border-navy/40 ${
            previewSrc ? "py-2.5" : "flex-col py-6"
          }`}
        >
          <ImagePlus size={previewSrc ? 16 : 20} className="text-navy" />
          <span className="font-medium text-navy">
            {previewSrc ? "Change image" : "Choose an image"}
          </span>
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
        />
      </div>

      {/* Public transactions */}
      <label htmlFor={`${idPrefix}-public-transactions`} className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          id={`${idPrefix}-public-transactions`}
          checked={showPublicTransactions}
          onChange={(e) => onShowPublicTransactionsChange(e.target.checked)}
          disabled={disabled}
          className="mt-0.5 h-4 w-4 rounded accent-navy focus:ring-navy"
        />
        <div className="space-y-1">
          <span className="text-sm font-semibold text-navy">Show contributions publicly</span>
          <p className="text-xs text-steel leading-relaxed">
            Adds a Donors Wall and the amount raised to the public page. Donors who choose to stay anonymous are
            shown as &quot;Anonymous Supporter&quot;.
          </p>
        </div>
      </label>
    </div>
  );
}
