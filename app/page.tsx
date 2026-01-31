/* eslint-disable react-hooks/set-state-in-effect */
// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Editor from "@/components/Editor";
import LetterheadPreview from "@/components/LetterPreview";
import { exportToPDF } from "@/utils/exportToPDF";
import {
  Download,
  Building2,
  MapPin,
  ImageIcon,
  Mail,
  Phone,
  Globe,
  FileText,
} from "lucide-react";
import { supabase } from "@/utils/lib/supabase";

export default function LetterheadGenerator() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    id: "", // Document ID
    name: "",
    address: "",
    email: "",
    phone: "",
    website: "",
    logoUrl: null as string | null,
    content: "<h2>Subject: Official Statement</h2><p>Content goes here...</p>",
  });

  // Initialize a unique ID on load
  useEffect(() => {
    setData((prev) => ({ ...prev, id: nanoid(10) }));
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result will be a base64 string
        setData({ ...data, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToSupabase = async () => {
    setLoading(true);
    const { data: savedData, error } = await supabase
      .from("letterheads")
      .insert([
        {
          name: data.name,
          address: data.address,
          email: data.email,
          phone: data.phone,
          website: data.website,
          logo_url: data.logoUrl,
          content: data.content,
        },
      ])
      .select()
      .single();

    setLoading(false);
    if (error) {
      alert("Error saving: " + error.message);
      return null;
    }

    console.log("savedData from supabase ", savedData);

    // Update local state with the new ID from Supabase
    setData((prev) => ({ ...prev, id: savedData.id }));
    return savedData.id;
  };

  const handleDownload = async () => {
    // 1. Save to database first to get a permanent ID
    const dbId = await saveToSupabase();

    if (dbId) {
      // 2. Wait a split second for React to render the QR with the new ID
      setTimeout(() => {
        exportToPDF("letterhead-paper", `${data.name || "Letter"}.pdf`);
      }, 500);
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-100 overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="w-[450px] bg-white border-r border-zinc-300 flex flex-col shadow-2xl z-10">
        {/* Sidebar Header - FIXED CONTRAST (White text on Blue) */}
        <div className="p-6 border-b bg-blue-700 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-white" /> Pad Designer
          </h2>
          <p className="text-blue-100 text-xs mt-1 font-medium">
            Create professional company letterheads
          </p>
        </div>

        {/* Scrollable Input Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Section: Company Identity */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
              <FileText size={14} /> Basic Info
            </h3>

            <div>
              <label className="block text-sm font-bold text-zinc-800 mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                className="w-full p-3 border-2 border-zinc-200 rounded-lg text-zinc-900 text-base font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-zinc-400"
                placeholder="e.g. Acme Corporation"
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-800 mb-1.5">
                Logo
              </label>
              <div className="border-2 border-dashed border-zinc-300 rounded-lg p-6 hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center text-zinc-500 group-hover:text-blue-600">
                  <ImageIcon size={28} />
                  <span className="text-sm mt-2 font-semibold">
                    {data.logoUrl ? "Change Logo" : "Upload Logo"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Contact Details */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
              <MapPin size={14} /> Contact Details
            </h3>

            <div>
              <label className="block text-sm font-bold text-zinc-800 mb-1.5">
                Address
              </label>
              <textarea
                className="w-full p-3 border-2 border-zinc-200 rounded-lg h-24 text-zinc-900 text-base font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                placeholder="Full Office Address..."
                onChange={(e) => setData({ ...data, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-zinc-800 mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3 top-4 text-zinc-500"
                  />
                  <input
                    type="text"
                    className="w-full p-3 pl-10 border-2 border-zinc-200 rounded-lg text-zinc-900 text-base font-medium focus:border-blue-500 outline-none"
                    placeholder="+1 234..."
                    onChange={(e) =>
                      setData({ ...data, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-800 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-4 text-zinc-500"
                  />
                  <input
                    type="email"
                    className="w-full p-3 pl-10 border-2 border-zinc-200 rounded-lg text-zinc-900 text-base font-medium focus:border-blue-500 outline-none"
                    placeholder="info@..."
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-800 mb-1.5">
                Website
              </label>
              <div className="relative">
                <Globe
                  size={16}
                  className="absolute left-3 top-4 text-zinc-500"
                />
                <input
                  type="text"
                  className="w-full p-3 pl-10 border-2 border-zinc-200 rounded-lg text-zinc-900 text-base font-medium focus:border-blue-500 outline-none"
                  placeholder="www.company.com"
                  onChange={(e) =>
                    setData({ ...data, website: e.target.value })
                  }
                />
              </div>
            </div>
          </section>

          {/* Section: Document Content */}
          <section className="space-y-4 pb-10">
            <h3 className="text-xs font-black uppercase text-zinc-900 tracking-widest flex items-center gap-2">
              <FileText size={14} /> Letter Content
            </h3>
            {/* Removed 'overflow-hidden' and 'border' here because the Editor component handles it better now */}
            <div className="focus-within:ring-2 focus-within:ring-blue-500 rounded-lg transition-all">
              <Editor
                content={data.content}
                onChange={(html) => setData({ ...data, content: html })}
              />
            </div>
          </section>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t bg-zinc-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button
            disabled={loading}
            onClick={handleDownload}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold"
          >
            {loading ? "Saving to Cloud..." : "Download & Save PDF"}
          </button>
        </div>
      </aside>

      {/* RIGHT PREVIEW */}
      <main className="flex-1 overflow-y-auto p-12 flex justify-center scroll-smooth bg-zinc-300">
        <div className="transform scale-[0.85] xl:scale-100 transition-transform origin-top drop-shadow-2xl">
          <LetterheadPreview data={data} />
        </div>
      </main>
    </div>
  );
}
