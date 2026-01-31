/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/lib/supabase";
import LetterheadPreview from "@/components/LetterPreview";
import { exportToPDF } from "@/utils/exportToPDF";
import { Download, CheckCircle, FileWarning } from "lucide-react";

export default function PublicLetterViewClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [letter, setLetter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Data
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

  // 2. Dynamic Scaling Logic for Mobile
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const screenWidth = window.innerWidth;
        const padding = 32; // px
        const targetWidth = 800; // This should match the width of your LetterheadPreview paper

        if (screenWidth < targetWidth + padding) {
          const newScale = (screenWidth - padding) / targetWidth;
          setScale(newScale);
        } else {
          setScale(1);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-6 text-center">
        <FileWarning className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-xl font-bold text-zinc-800">Invalid Document</h1>
        <p className="text-zinc-500 max-w-xs mt-2">
          This verification link is invalid or the document has been removed.
        </p>
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
    <div className="min-h-screen bg-zinc-200 flex flex-col items-center pb-20">
      {/* Header Info */}
      <div className="w-full bg-white border-b border-zinc-300 p-4 sticky top-0 z-20 shadow-sm flex items-center justify-between max-w-4xl">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-600 w-5 h-5" />
          <div>
            <p className="text-green-700 font-bold text-sm leading-none">
              Verified Authentic
            </p>
            <p className="text-zinc-400 text-[10px] uppercase tracking-wider mt-1">
              ID: {letter.id.substring(0, 8)}...
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            exportToPDF("letterhead-paper", `${letter.name || "Document"}.pdf`)
          }
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Download size={16} />
          Save PDF
        </button>
      </div>

      {/* The Letterhead Container */}
      <div
        className="mt-8 flex flex-col items-center w-full overflow-x-hidden"
        style={{ perspective: "1000px" }}
      >
        <div
          id="letterhead-paper"
          className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] origin-top transition-transform duration-300"
          style={{
            transform: `scale(${scale})`,
            // This ensures the page height adjusts based on the scaled content
            marginBottom: `calc(-${800 * (1 - scale)}px)`,
          }}
        >
          <LetterheadPreview data={formattedData} />
        </div>
      </div>

      <p className="mt-10 text-zinc-500 text-xs text-center px-6">
        This document was digitally generated and verified via MegaTecs Secure
        Systems.
      </p>
    </div>
  );
}
