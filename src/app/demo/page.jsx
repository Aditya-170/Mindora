"use client";
import { useState } from "react";

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setUrl("");
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a PDF first");

        setLoading(true);
        try {
            const res = await fetch("/api/upload-pdf-s3", {
                method: "POST",
                headers: {
                    "Content-Type": file.type,
                    "x-filename": file.name, // send filename to backend
                },
                body: file,
            });

            const data = await res.json();
            console.log("Backend response:", JSON.stringify(data, null, 2));

            if (data.url) setUrl(data.url);
            else if (data.error) alert("Upload error: " + data.error);
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Upload PDF</h1>

            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="mb-4"
            />

            <button
                onClick={handleUpload}
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
            >
                {loading ? "Uploading..." : "Upload PDF"}
            </button>

            {url && (
                <div className="mt-6 p-4 bg-white rounded shadow">
                    <p className="font-semibold mb-2">Uploaded PDF URL:</p>
                    <a href={url} target="_blank" className="text-blue-600 underline">
                        {url}
                    </a>
                </div>
            )}
        </div>
    );
}
