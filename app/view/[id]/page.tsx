// app/view/[id]/page.tsx
import { supabase } from "@/utils/lib/supabase";
import LetterheadPreview from "@/components/LetterPreview";
import { notFound } from "next/navigation";

export default async function PublicLetterView({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  // Fetch data from Supabase
  const { data: letter, error } = await supabase
    .from("letterheads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !letter) {
    notFound();
  }

  // Map database columns back to our component data structure
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

      {/* Reuse the preview component */}
      <div className="shadow-2xl origin-top transform scale-90 md:scale-100">
        <LetterheadPreview data={formattedData} />
      </div>
    </div>
  );
}
