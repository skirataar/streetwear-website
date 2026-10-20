"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountOrdersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account?tab=orders");
  }, [router]);

  return (
    <div className="font-mono text-center text-xs uppercase p-20 text-ink">
      REDIRECTING TO ORDER ARCHIVE...
    </div>
  );
}
