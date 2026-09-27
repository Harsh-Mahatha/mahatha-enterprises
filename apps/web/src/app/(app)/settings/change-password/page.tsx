import { PageHeader } from "@/components/layout/PageHeader";
import { ChangePasswordForm } from "@/features/auth/components";

export default function ChangePasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Change password" description="Update the password used to sign in." />
      <ChangePasswordForm />
    </div>
  );
}
