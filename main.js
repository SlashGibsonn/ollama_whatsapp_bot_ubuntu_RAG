const { retrieveContext } = require("./db");

// URL API lokal Ollama
const url = process.env.OLLAMA_URL;

// Fungsi utama untuk mengirim pertanyaan dan mendapatkan jawaban dari Ollama
async function chatWithLLM(userQuery) {
    console.log("🛠️ Menjalankan chatWithLLM dengan query:", userQuery);

    // Ambil konteks dari ChromaDB berdasarkan query pengguna
    const context = await retrieveContext(userQuery);
    console.log("📚 Konteks dari ChromaDB:\n", context || "(Kosong)");

    // Buat payload dengan tambahan konteks dari database
    const payload = {
        model: process.env.MODEL_NAME,
        messages: [
            {
                role: "system",
                content: "Here is some information that may be useful to answer the question. If this information is relevant, use it. If there is no relevant information, still try to answer based on the knowledge you have. And answer it with consice output.\n\n" + context
            },
            { role: "user", content: userQuery }
        ],
        stream: false // Pastikan response tidak dalam format streaming
    };

    console.log("📤 Payload yang dikirim ke Ollama:", JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`❌ Error HTTP: ${response.status}`);
            console.error(await response.text());
            return "Maaf, terjadi kesalahan dalam mengambil data dari Ollama.";
        }

        // Parsing response sebagai JSON
        const jsonResponse = await response.json();
        console.log("📥 Response dari Ollama:", JSON.stringify(jsonResponse, null, 2));

        // Periksa apakah response memiliki format yang benar
        if (jsonResponse.message && jsonResponse.message.content) {
            console.log("✅ Jawaban dari Ollama:", jsonResponse.message.content);
            return jsonResponse.message.content;
        } else {
            console.error("❌ Format response tidak sesuai harapan:", jsonResponse);
            return "Maaf, format respons tidak sesuai.";
        }
    } catch (error) {
        console.error("❌ Fetch error:", error);
        return "Maaf, terjadi kesalahan dalam mengambil data dari Ollama.";
    }
}

// Ekspor fungsi untuk digunakan di index.js
module.exports = { chatWithLLM };