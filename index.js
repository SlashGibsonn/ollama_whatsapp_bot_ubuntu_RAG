const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { chatWithLLM } = require("./main");

const conversationHistory = {};

async function processMessage(text, userId) {             // Fungsi untuk memproses pesan dengan RAG (menggunakan ChromaDB)
  try {
    console.log(`Pesan diterima dari ${userId}: ${text}`);

    if (!conversationHistory[userId]) {
      conversationHistory[userId] = [];
    }

    conversationHistory[userId].push({ role: "user", content: text });

    if (conversationHistory[userId].length > 10) {
      conversationHistory[userId].shift();
    }

    const response = await chatWithLLM(text);
    console.log(`Jawaban untuk ${userId}: ${response}`);

    if (!response || response.trim() === "") {
      return "Maaf, saya tidak dapat menemukan jawaban yang sesuai.";
    }

    conversationHistory[userId].push({ role: "assistant", content: response });

    return response;
  } catch (error) {
    console.error("Error processing message:", error);
    return "Maaf, terjadi kesalahan dalam memproses pesan Anda.";
  }
}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],    // Mencegah error saat dijalankan sebagai root
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp Client siap!");
});

client.on("message", async (message) => {
  if (message.from.includes("status")) return;

  console.log(`Pesan diterima dari ${message.from}: ${message.body}`);

  const response = await processMessage(message.body, message.from);

  message.reply(response);
});

client.initialize();