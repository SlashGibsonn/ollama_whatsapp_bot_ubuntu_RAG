require("dotenv").config();
const { ChromaClient } = require("chromadb");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { PDFDocument } = require("pdf-lib");
const { execSync } = require("child_process");

// Pastikan ChromaDB berjalan
const chroma = new ChromaClient({ path: process.env.CHROMADB_URL });
let collection = null;

async function initDB() {
  try {
    console.log("Connecting to ChromaDB...");
    collection = await chroma.getOrCreateCollection({ name: "knowledge_base" });
    console.log("Database initialized.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

async function clearCollection() {
  try {
    if (!collection) await initDB();
    const docs = await collection.get();
    if (!docs || !docs.ids || docs.ids.length === 0) {
      console.log("Tidak ada dokumen yang perlu dihapus.");
      return;
    }
    await collection.delete({ ids: docs.ids });
    console.log("Semua dokumen telah dihapus dari koleksi.");
  } catch (error) {
    console.error("Error deleting documents:", error);
  }
}

async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    if (pdfData.text.trim()) return pdfData.text.trim();
  } catch (error) {
    console.warn(`pdf-parse gagal membaca PDF (${filePath}):`, error.message);
  }

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(dataBuffer);
    let extractedText = "";
    pdfDoc.getPages().forEach(page => {
      extractedText += page.getTextContent().items.map(item => item.str).join(" ") + "\n";
    });
    if (extractedText.trim()) return extractedText.trim();
  } catch (error) {
    console.warn(`pdf-lib juga gagal membaca PDF (${filePath}):`, error.message);
  }

  try {
    const output = execSync(`pdftotext "${filePath}" -`, { encoding: "utf-8" });
    if (output.trim()) return output.trim();
  } catch (error) {
    console.warn(`pdftotext gagal membaca PDF (${filePath}):`, error.message);
  }

  console.error(`Gagal membaca teks dari PDF (${filePath}) dengan semua metode.`);
  return null;
}

async function addDocument(content, docId, isPDF = false, filePath = null) {
  try {
    if (!collection) await initDB();
    let textContent = content;

    if (isPDF) {
      textContent = await extractTextFromPDF(content);
      if (!textContent) return;
    }

    await collection.upsert({
      ids: [docId],
      documents: [textContent],
      metadatas: [{ isPDF, filePath }],
    });

    console.log(`Document ${docId} added. (PDF: ${isPDF})`);
  } catch (error) {
    console.error("Error adding document:", error);
  }
}

async function retrieveContext(query) {
  try {
    if (!collection) await initDB();
    const results = await collection.query({ queryTexts: [query], nResults: 3 });
    if (results.documents && results.documents.length > 0) {
      return results.documents.flat().join("\n");
    }
    return "Tidak ada hasil yang ditemukan.";
  } catch (error) {
    console.error("Error in retrieval:", error);
    return "";
  }
}

async function checkCollectionExists() {
  try {
    const collections = await chroma.listCollections();
    return collections.some(col => col.name === "knowledge_base");
  } catch (error) {
    console.error("Error checking collections:", error);
    return false;
  }
}

async function listDocuments() {
  try {
    if (!collection) await initDB();
    const docs = await collection.get();
    console.log("Semua Dokumen dalam Koleksi:", docs);
  } catch (error) {
    console.error("Error listing documents:", error);
  }
}

module.exports = { initDB, addDocument, retrieveContext, checkCollectionExists, listDocuments, clearCollection };