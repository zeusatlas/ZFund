import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/landing/LegalPage";
import { SUPPORT_EMAIL } from "@/components/landing/contact-info";

export const metadata: Metadata = { title: "Privacy Policy | RaiseFundz" };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="How RaiseFundz collects, uses and protects information when you host or give to a campaign. Last updated: October 2026."
    >
      <LegalSection heading="1. Information we collect">
        <p>We collect only what we need to run campaigns and process contributions:</p>
        <ul>
          <li>Host and admin details: name, email, phone number and organisation.</li>
          <li>Campaign details: title, description, target amount, duration and payout account.</li>
          <li>Donation records: amount, time, network and the donor&apos;s phone number (masked for hosts).</li>
          <li>Technical data: device, browser and log information used to keep the service secure.</li>
        </ul>
      </LegalSection>
      <LegalSection heading="2. How we use it">
        <ul>
          <li>To operate campaigns, record contributions and process withdrawals.</li>
          <li>To verify hosts and review campaigns before they go live.</li>
          <li>To detect fraud, abuse and security incidents.</li>
          <li>To send service notices and respond to support requests.</li>
        </ul>
      </LegalSection>
      <LegalSection heading="3. Who sees donor information">
        <p>
          Hosts see donations to their own campaigns with donor phone numbers masked. Authorised RaiseFundz
          administrators can see full records where needed for review, support and compliance.
        </p>
      </LegalSection>
      <LegalSection heading="4. Sharing">
        <p>
          We do not sell personal information. We share it only with payment and mobile network partners needed
          to complete a transaction, with service providers acting on our behalf, and with authorities where
          the law requires.
        </p>
      </LegalSection>
      <LegalSection heading="5. Retention and security">
        <p>
          We keep transaction records for as long as needed for accounting, audit and legal obligations. Data is
          protected with access controls, role-based permissions and encrypted connections.
        </p>
      </LegalSection>
      <LegalSection heading="6. Your rights">
        <p>
          Under Ghana&apos;s Data Protection Act, 2012 (Act 843), you may ask to access, correct or delete your
          personal information, or object to certain processing. Contact us at {SUPPORT_EMAIL} and we will
          respond within a reasonable time.
        </p>
      </LegalSection>
      <LegalSection heading="7. Changes">
        <p>We may update this policy and will post the new version here with a revised date.</p>
      </LegalSection>
    </LegalPage>
  );
}
