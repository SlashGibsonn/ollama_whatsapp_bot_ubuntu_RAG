# Ollama Model WhatsApp Bot RAG (Ubuntu)

## Penggunaan

1. Masuk ke direktori proyek:
   ```sh
   cd ollama_whatsapp_bot_ubuntu_RAG
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Jalankan untuk memperbarui file ke ChromaDB:
   ```sh
   node store.js
   ```

4. Jalankan program utama:
   ```sh
   node index.js
   ```

## Catatan
- Model LLM dan ChromaDB berjalan di server lokal atau remote.
- Memerlukan dua akun WhatsApp, satu sebagai bot dan satu lagi sebagai user.
- Saat pertama kali menjalankan bot, lakukan scan QR Code pada akun WhatsApp bot untuk autentikasi.

