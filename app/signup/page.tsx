import { SignUpForm } from "@/components/form/SignUpForm";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-start justify-center pt-12 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
