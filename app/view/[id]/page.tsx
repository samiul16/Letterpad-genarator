// app/view/[id]/page.tsx
export default function ViewPad({ params }: { params: { id: string } }) {
  // Logic to fetch 'data' from database using params.id
  return (
    <div className="min-h-screen bg-zinc-200 p-10 flex justify-center">
      {/* <LetterheadPreview data={fetchedData} /> */}
      <h1 className="text-xl">Viewing Document: {params.id}</h1>
      <p className="text-zinc-500 italic">
        Connect a database to display the stored content here.
      </p>
    </div>
  );
}
