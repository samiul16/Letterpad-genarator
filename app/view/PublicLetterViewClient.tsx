/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/lib/supabase";
import LetterheadPreview from "@/components/LetterPreview";

export default function PublicLetterViewClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [letter, setLetter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const fetchLetter = async () => {
      const { data, error } = await supabase
        .from("letterheads")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setLetter(data);
      }

      setLoading(false);
    };

    fetchLetter();
  }, [id]);

  if (loading) {
    return null; // Suspense fallback will show
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Invalid or expired verification link
      </div>
    );
  }

  const formattedData = {
    id: letter.id,
    name: letter.name,
    address: letter.address,
    email: letter.email,
    phone: letter.phone,
    website: letter.website,
    logoUrl: letter.logo_url,
    content: letter.content,
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-4 md:p-10 flex flex-col items-center">
      <div className="mb-6 bg-white p-4 rounded-lg shadow text-center max-w-[210mm] w-full border-l-4 border-green-500">
        <p className="text-green-700 font-bold">
          ✓ Verified Authentic Document
        </p>
        <p className="text-zinc-500 text-xs">
          Generated via MegaTecs Digital Verification
        </p>
      </div>

      <div className="shadow-2xl origin-top transform scale-90 md:scale-100">
        <LetterheadPreview data={formattedData} />
      </div>
    </div>
  );
}
