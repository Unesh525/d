import { useRouter } from "next/router";
import { useState } from "react";
import MarkdownEditor from 'react-markdown-editor-lite';
import ReactMarkdown from 'react-markdown';
import 'react-markdown-editor-lite/lib/index.css';
import axios from "axios";

export default function Blog({
    _id,
    title: existingTitle,
    slug: existingSlug,
    category: existingCategory,
    description: existingDescription,
    tags: existingTags,
    status: existingStatus,
}) {
    const router = useRouter();
    const [redirect, setRedirect] = useState(false);

    const [title, setTitle] = useState(existingTitle || '');
    const [slug, setSlug] = useState(existingSlug || '');
    const [category, setCategory] = useState(existingCategory || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [tags, setTags] = useState(existingTags || '');
    const [status, setStatus] = useState(existingStatus || '');
    const [file, setFile] = useState(null); // ✅ NEW: File state

    const handleSlugChange = (ev) => {
        const inputvalue = ev.target.value;
        const newSlug = inputvalue.replace(/\s+/g, '-');
        setSlug(newSlug);
    };

    async function createProduct(ev) {
        ev.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("slug", slug);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("tags", tags);
        formData.append("status", status);
        if (file) formData.append("image", file); // ✅ NEW: append file

        try {
            await axios.post("/api/blogapi", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setRedirect(true);
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Failed to upload blog.");
        }
    }

    if (redirect) {
        router.push('/');
        return null;
    }

    return (
        <>
            <form onSubmit={createProduct} className="addwebsiteform" encType="multipart/form-data">
                {/* Blog Title */}
                <div className="w-100 flex flex-col flex-left mb-2">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                {/* Slug */}
                <div className="w-100 flex flex-col flex-left mb-2">
                    <label htmlFor="slug">Slug</label>
                    <input type="text" id="slug" value={slug} onChange={handleSlugChange} required />
                </div>

                {/* Category */}
                <div className="w-100 flex flex-col flex-left mb-2">
                    <label htmlFor="category">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="" disabled>Select Category</option>
                        <option value="Stock Market">Stock Market</option>
                        <option value="Mutual Funds">Mutual Funds</option>
                        <option value="Cryptocurrency">Cryptocurrency</option>
                        <option value="Equity Analysis">Equity Analysis</option>
                        <option value="Investment Tips">Investment Tips</option>
                    </select>
                    <p className="existingcategory">Selected: <span>{category || 'None'}</span></p>
                </div>

                {/* Image Upload */}
                <div className="w-100 flex flex-col flex-left mb-2">
                    <label htmlFor="image">Upload Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                </div>

                {/* Description */}
                <div className="description w-100 flex flex-col flex-left mb-2">
                    <label>Blog Content</label>
                    <MarkdownEditor
                        value={description}
                        onChange={(e) => setDescription(e.text)}
                        style={{ width: '100%', height: '400px' }}
                        renderHTML={(text) => (
                            <ReactMarkdown components={{
                                code: ({ inline, className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return inline ? <code>{children}</code> : (
                                        <div style={{ position: 'relative' }}>
                                            <pre><code>{children}</code></pre>
                                            <button style={{ position: 'absolute', top: '0', right: '0' }}
                                                onClick={() => navigator.clipboard.writeText(children)}>
                                                Copy Code
                                            </button>
                                        </div>
                                    );
                                }
                            }}>
                                {text}
                            </ReactMarkdown>
                        )}
                    />
                </div>

                {/* Tags */}
                <div className="w-100 flex flex-col flex-left mb-2">
                    <label htmlFor="tags">Tags</label>
                    <select id="tags" value={tags} onChange={(e) => setTags(e.target.value)} required>
                        <option value="" disabled>Select Tag</option>
                        <option value="Stock Market">Stock Market</option>
                        <option value="Mutual Funds">Mutual Funds</option>
                        <option value="Cryptocurrency">Cryptocurrency</option>
                        <option value="Equity Analysis">Equity Analysis</option>
                        <option value="Investment Tips">Investment Tips</option>
                    </select>
                    <p className="existingcategory">Selected: <span>{tags || 'None'}</span></p>
                </div>

                {/* Status */}
                <div className="w-100 flex flex-col flex-left mb-2">
                    <label htmlFor="status">Status</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="" disabled>Select Status</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                    <p className="existingcategory">Selected: <span>{status || 'None'}</span></p>
                </div>

                {/* Submit */}
                <div className="w-100 mb-2">
                    <button type="submit" className="w-100 addwebbtn flex-center">SAVE BLOG</button>
                </div>
            </form>
        </>
    );
}
