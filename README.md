# Ollama Model WhatsApp Bot RAG (Ubuntu)

## Usage

1. Move to project directory:
   ```sh
   cd ollama_whatsapp_bot_ubuntu_RAG
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Run chromadb docker:
   ```sh
   docker compose up -d
   ```

4. Run to add certain files to pdfs folder:
   ```sh
   node insert_file.js
   ```

5. Library addition if you're using Ubuntu 24.04 or later:

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

6. Run the main program:
   ```sh
   node main.js
   ```

## Notes
- Add your pdf files to pdfs folder.
- LLM Model and ChromaDB can runs either on your local machine or remote server.
- Requiring two WhatsApp account, one as bot and one as user.
- When you running your bot for the first time, you'll be prompt a QR code to be scanned.
- __No need for .env__

