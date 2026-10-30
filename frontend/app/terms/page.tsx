import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/landing/LegalPage";
import { SUPPORT_EMAIL } from "@/components/landing/contact-info";

export const metadata: Metadata = { title: "Terms of Service | RaiseFundz" };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="The rules for using RaiseFundz as an organiser, organisation or contributor. Last updated: October 2026."
    >
      <LegalSection heading="1. Acceptance">
        <p>By creating an account or using RaiseFundz you agree to these terms.</p>
      </LegalSection>
      <LegalSection heading="2. Accounts">
        <ul>
          <li>You must provide accurate information and keep your login details secure.</li>
          <li>You are responsible for activity under your account.</li>
          <li>Accounts that break these terms or put others at risk may be suspended.</li>
        </ul>
      </LegalSection>
      <LegalSection heading="3. Hosting campaigns">
        <ul>
          <li>Campaigns must be genuine, lawful and accurately described.</li>
          <li>Campaigns are reviewed by an administrator and may be declined, paused or removed.</li>
        </ul>
      </LegalSection>
      <LegalSection heading="4. Contributions and withdrawals">
        <ul>
          <li>Withdrawals are requested by the organiser and may be subject to review and approval.</li>
          <li>Fees, where they apply, are shown before you confirm a transaction.</li>
        </ul>
      </LegalSection>
      <LegalSection heading="5. Prohibited use">
        <ul>
          <li>Fraud, misleading campaigns or impersonation.</li>
          <li>Money laundering or any unlawful activity.</li>
          <li>Attempting to disrupt, probe or bypass the security of the platform.</li>
        </ul>
      </LegalSection>
      <LegalSection heading="6. Liability">
        <p>
          RaiseFundz provides the platform as is. To the extent the law allows, we are not liable for indirect
          losses, or for how organisers use the funds they collect.
        </p>
      </LegalSection>
      <LegalSection heading="7. Governing law">
        <p>These terms are governed by the laws of Ghana.</p>
      </LegalSection>
      <LegalSection heading="8. Contact">
        <p>Questions about these terms? Email {SUPPORT_EMAIL}.</p>
      </LegalSection>
    </LegalPage>
  );
}
