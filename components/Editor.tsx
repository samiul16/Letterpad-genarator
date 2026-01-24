"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor({
  content,
  onChange,
}: {
  content: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    // FIX: This prevents the hydration mismatch error in Next.js
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none max-w-none min-h-[300px] p-4",
      },
    },
  });

  // Since immediatelyRender is false, 'editor' will be null on the first render.
  // We return null or a placeholder to avoid hydration errors.
  if (!editor) {
    return (
      <div className="border rounded-md min-h-[300px] bg-slate-50 animate-pulse" />
    );
  }

  return (
    <div className="border rounded-md bg-black overflow-hidden">
      {/* Optional: Add a simple toolbar here */}
      <div className="bg-slate-50 border-b p-2 flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bold") ? "bg-slate-200" : ""
          }`}
        >
          <b>B</b>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("italic") ? "bg-slate-200" : ""
          }`}
        >
          <i>I</i>
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
