"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react";

export default function Editor({
  content,
  onChange,
}: {
  content: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure paragraph to ensure it behaves normally
        paragraph: {
          HTMLAttributes: {
            class: "mb-2 last:mb-0",
          },
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Removed bg-black and improved prose styling
        class:
          "prose prose-zinc focus:outline-none max-w-none min-h-[300px] p-4 text-zinc-900 bg-white",
      },
    },
  });

  if (!editor) {
    return (
      <div className="border rounded-md min-h-[300px] bg-zinc-50 animate-pulse" />
    );
  }

  // Helper to style active buttons
  const btnClass = (active: boolean) =>
    `p-2 rounded transition-colors ${
      active
        ? "bg-blue-600 text-white"
        : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
    }`;

  return (
    <div className="border border-zinc-200 rounded-lg overflow-hidden flex flex-col">
      {/* Toolbar - Now highly visible */}
      <div className="bg-zinc-50 border-b p-2 flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive("bold"))}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive("italic"))}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btnClass(editor.isActive("heading", { level: 2 }))}
          title="Heading"
        >
          <Heading2 size={18} />
        </button>
        <div className="w-px h-6 bg-zinc-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive("bulletList"))}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive("orderedList"))}
        >
          <ListOrdered size={18} />
        </button>
      </div>

      {/* Editor Area */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Custom Styles to fix line breaks and visibility */}
      <style jsx global>{`
        .prose p {
          margin-bottom: 0.75rem !important;
          line-height: 1.5;
        }
        .prose h2 {
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          font-weight: bold;
          font-size: 1.25rem;
        }
        .prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .prose ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
      `}</style>
    </div>
  );
}
