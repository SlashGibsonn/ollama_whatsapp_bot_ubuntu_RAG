const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { chatWithLLM } = require("./main");

// Objek untuk menyimpan riwayat percakapan pengguna
const conversationHistory = {};

// Fungsi untuk memproses pesan dengan RAG (menggunakan ChromaDB)
async function processMessage(text, userId) {
  try {
    console.log(`📩 Pesan diterima dari ${userId}: ${text}`);

    // Inisialisasi riwayat jika belum ada
    if (!conversationHistory[userId]) {
      conversationHistory[userId] = [];
    }

    // Tambahkan pesan pengguna ke dalam riwayat
    conversationHistory[userId].push({ role: "user", content: text });

    // Batasi riwayat hanya 10 interaksi terakhir
    if (conversationHistory[userId].length > 10) {
      conversationHistory[userId].shift();
    }

    // Gunakan LLM untuk menjawab
    const response = await chatWithLLM(text);
    console.log(`✅ Jawaban untuk ${userId}: ${response}`);

    // Cek apakah `response` kosong
    if (!response || response.trim() === "") {
      return "Maaf, saya tidak dapat menemukan jawaban yang sesuai.";
    }

    // Tambahkan respons AI ke dalam riwayat
    conversationHistory[userId].push({ role: "assistant", content: response });

    return response;
  } catch (error) {
    console.error("❌ Error processing message:", error);
    return "Maaf, terjadi kesalahan dalam memproses pesan Anda.";
  }
}

// Inisialisasi WhatsApp Client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Mencegah error saat dijalankan sebagai root
  },
});

// Generate QR Code di terminal
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// Tampilkan pesan saat client siap
client.on("ready", () => {
  console.log("✅ WhatsApp Client siap!");
});

// Tangani pesan yang diterima
client.on("message", async (message) => {
  // Abaikan pesan dari "status" update
  if (message.from.includes("status")) return;

  console.log(`📩 Pesan diterima dari ${message.from}: ${message.body}`);

  // Proses pesan dengan RAG
  const response = await processMessage(message.body, message.from);

  // Balas pesan dengan jawaban dari LLM
  message.reply(response);
});

// Mulai client
client.initialize();