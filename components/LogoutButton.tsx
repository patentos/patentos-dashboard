"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-[rgba(20,87,184,0.14)] bg-white px-4 py-2 text-sm font-medium text-[#1457b8] transition hover:bg-[rgba(20,87,184,0.06)]"
    >
      Logout
    </button>
  );
}