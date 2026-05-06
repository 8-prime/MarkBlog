import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

export type EditorProps = {
  articleText: string;
  setArticleText: (text: string | undefined) => void;
};

export default function Editor({ articleText, setArticleText }: EditorProps) {
  const [cursor, setCursor] = useState<number>(0);

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);

        try {
          const response = await fetch("/api/images/", {
            method: "POST",
            body: formData,
          });
          const path = response.headers.get("Location");

          // Insert markdown image syntax at cursor position
          const imageMarkdown = `\n\n![Image](${path})\n\n`;

          setArticleText(
            articleText.slice(0, cursor) +
              imageMarkdown +
              articleText.slice(cursor),
          );
          // Insert into editor (method varies by library)
        } catch (error) {
          console.error("Upload failed:", error);
        }
      }
    }
  };

  return (
    <div className="w-full h-full">
      <MDEditor
        textareaProps={{
          onSelect: (e) => {
            setCursor(e.currentTarget.selectionStart);
          },
        }}
        height="100%"
        value={articleText}
        onChange={setArticleText}
        onPaste={(e) => handlePaste(e)}
      />
    </div>
  );
}
