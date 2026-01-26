// app/view/page.tsx
import { Suspense } from "react";
import PublicLetterViewClient from "./PublicLetterViewClient";

export default function ViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading verification…
        </div>
      }
    >
      <PublicLetterViewClient />
    </Suspense>
  );
}
