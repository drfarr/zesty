"use server";
import { LoginForm } from "@/components/auth/login";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  if (session) {
    return redirect("/admin");
  }
  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white">
      <LoginForm />;
    </div>
  );
};

export default Page;
