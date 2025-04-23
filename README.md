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

 5. Tambahan Library untuk Ubuntu 24.04 ke atas

```sh
sudo apt install -y \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libasound2t64 \
  libpangocairo-1.0-0 \
  libpango-1.0-0 \
  libgtk-3-0 \
  libnss3 \
  libxss1 \
  libxshmfence1 \
  libx11-xcb1 \
  libxinerama1 \
  libglu1-mesa
```
6. Jalankan program utama:
   ```sh
   node main.js
   ```

## Catatan
- Tambahkan file pdf anda ke folder pdfs.
- Model LLM dan ChromaDB berjalan di server lokal atau remote.
- Memerlukan dua akun WhatsApp, satu sebagai bot dan satu lagi sebagai user.
- Saat pertama kali menjalankan bot, lakukan scan QR Code pada akun WhatsApp bot untuk autentikasi.
- __Tidak perlu pakai .env__

