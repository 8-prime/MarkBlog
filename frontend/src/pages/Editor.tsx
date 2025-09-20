import { useState } from "react";
import MDEditor from '@uiw/react-md-editor';


export default function Editor() {

    const [articleText, setArticleText] = useState<string | undefined>('');

    const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let item of items) {
            if (item.type.startsWith('image/')) {
                e.preventDefault();
                const file = item.getAsFile();
                if (!file) return;
                const formData = new FormData();
                formData.append('image', file);

                try {
                    const response = await fetch('/api/images/', {
                        method: 'POST',
                        body: formData,
                    });
                    const { path } = await response.json();

                    // Insert markdown image syntax at cursor position
                    const imageMarkdown = `\n![Image](${path})\n`;
                    setArticleText(articleText + imageMarkdown);
                    // Insert into editor (method varies by library)
                } catch (error) {
                    console.error('Upload failed:', error);
                }
            }
        }
    };


    return (
        <div>
            <div className="container">
                <MDEditor
                    value={articleText}
                    onChange={setArticleText}
                    onPaste={(e) => handlePaste(e)}
                />
                <MDEditor.Markdown source={articleText} style={{ whiteSpace: 'pre-wrap' }} />
            </div>
        </div>
    );
}