/* eslint-disable @typescript-eslint/no-explicit-any */
// components/LetterheadPreview.tsx
import { Mail, Phone, Globe, MapPin } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function LetterheadPreview({ data }: { data: any }) {
  if (!data) return null;

  const viewUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/view/${data.id}`
      : `https://yourapp.com/view/${data.id}`;

  return (
    <div
      id="letterhead-paper"
      className="relative bg-white shadow-2xl overflow-hidden flex flex-col font-sans"
      style={{
        width: "210mm",
        height: "297mm",
        padding: "0",
        color: "#1f2937",
      }}
    >
      {/* 1. TOP DESIGN ELEMENT */}
      <div className="flex w-full h-6">
        <div className="w-1/3 h-full bg-blue-800" />
        <div className="w-2/3 h-full bg-zinc-900" />
      </div>

      <div className="p-[15mm] flex-grow flex flex-col">
        {/* 2. PREMIUM HEADER SECTION */}
        <header className="flex justify-between items-start mb-12">
          {/* Logo and Brand Vertical */}
          <div className="flex items-center gap-6">
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt="Logo"
                className="h-44 w-44 object-contain"
              />
            ) : (
              <div className="h-32 w-32 bg-zinc-100 flex items-center justify-center text-zinc-400 border border-dashed border-zinc-300">
                LOGO
              </div>
            )}
            <div className="h-24 w-[2px] bg-blue-800 hidden sm:block" />
          </div>

          {/* Company Details Column */}
          <div className="text-right max-w-[400px]">
            <h1 className="text-4xl font-black text-blue-900 tracking-tighter mb-4 leading-none">
              {data.name || "COMPANY NAME"}
            </h1>

            <div className="grid grid-cols-1 gap-y-1 text-[11px] font-bold text-zinc-500">
              <div className="flex items-center justify-end gap-2">
                <span>{data.phone || "+00 123 456 789"}</span>
                <Phone size={12} className="text-blue-800" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <span>{data.email || "contact@company.com"}</span>
                <Mail size={12} className="text-blue-800" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <span>{data.website || "www.company.com"}</span>
                <Globe size={12} className="text-blue-800" />
              </div>
              <div className="flex items-start justify-end gap-2 mt-1 italic text-zinc-400">
                <span className="max-w-[200px] leading-tight text-[10px]">
                  {data.address || "123 Business Street, City"}
                </span>
                <MapPin size={12} className="text-blue-800 mt-0.5" />
              </div>
            </div>
          </div>
        </header>

        {/* 3. WATERMARK */}
        {/* 3. WATERMARK (Larger & Diagonal) */}
        {data.logoUrl && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
            <img
              src={data.logoUrl}
              alt="watermark"
              className="w-[90%] max-h-[70%] opacity-[0.12] -rotate-[35deg] object-contain transition-transform"
              style={{
                // Force hardware acceleration for smoother rendering in some browsers
                transform: "rotate(-10deg) scale(1.1)",
              }}
            />
          </div>
        )}

        {/* 4. DYNAMIC CONTENT AREA */}
        <main className="relative z-10 flex-grow prose prose-zinc max-w-none prose-p:text-zinc-800 prose-headings:text-zinc-900">
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
        </main>

        {/* 5. SIGNATURE & QR SECTION */}
        <footer className="mt-12 flex justify-between items-end border-t border-zinc-100 pt-10">
          {/* QR Verification */}
          <div className="flex flex-col gap-3">
            <div className="p-1.5 bg-white border border-zinc-200 rounded-lg shadow-sm">
              <QRCodeSVG value={viewUrl} size={70} />
            </div>
            <div className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">
              Verify Integrity: {data.id}
            </div>
          </div>

          {/* Signature Area */}
          <div className="text-right">
            <div className="mb-14 h-12 flex items-end justify-center">
              <span className="text-[10px] text-zinc-200 italic uppercase">
                Stamp / Seal Here
              </span>
            </div>
            <div className="w-64 border-b-2 border-zinc-900 mb-2 ml-auto" />
            <p className="text-sm font-black text-zinc-900 uppercase">
              Authorized Signatory
            </p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
              Office of the Director
            </p>
          </div>
        </footer>
      </div>

      {/* 6. BOTTOM ACCENT */}
      <div className="w-full h-2 bg-blue-800" />
    </div>
  );
}
