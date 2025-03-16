const fs = require("fs");
const path = require("path");
const { initDB, addDocument, retrieveContext, clearCollection } = require("./config_chromedb");

const PDF_FOLDER = "./pdfs"; // Ganti dengan path folder tempat menyimpan PDF

async function insertSampleData() {
  await initDB();
  await clearCollection();

  fs.readdir(PDF_FOLDER, async (err, files) => {
    if (err) {
      console.error("Error membaca folder:", err);
      return;
    }

    const pdfFiles = files.filter(file => file.endsWith(".pdf"));

    if (pdfFiles.length === 0) {
      console.log("Tidak ada file PDF dalam folder.");
      return;
    }

    for (const file of pdfFiles) {
      const filePath = path.join(PDF_FOLDER, file);
      const docId = path.basename(file, ".pdf"); // Gunakan nama file sebagai docId
      await addDocument(filePath, docId, true, filePath);
    }

    console.log("Semua PDF dalam folder telah ditambahkan.");

    const testQuery = await retrieveContext("Mobile Legends"); // Bisa diisi apa saja
    console.log("Cek hasil simpan:", testQuery);
  });
}

insertSampleData();