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

3. Jalankan docker chromadb:
   ```sh
   docker compose up -d
   ```

4. Jalankan untuk memperbarui file ke ChromaDB dari folder pdfs:
   ```sh
   node insert_file.js
   ```

5. Jalankan program utama:
   ```sh
   node main.js
   ```

## Catatan
- Tambahkan file pdf anda ke folder pdfs.
- Model LLM dan ChromaDB berjalan di server lokal atau remote.
- Memerlukan dua akun WhatsApp, satu sebagai bot dan satu lagi sebagai user.
- Saat pertama kali menjalankan bot, lakukan scan QR Code pada akun WhatsApp bot untuk autentikasi.
- Tidak perlu pakai .env

