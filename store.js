const { initDB, addDocument, retrieveContext, clearCollection } = require("./db");

async function insertSampleData() {
  await initDB();
  await clearCollection();

  // Tambahkan teks biasa
  await addDocument("Slashgibson is a Mobile Legends player that achieved many trophies troughout his career.", "doc1");

  // Tambahkan PDF
  await addDocument("./tes.pdf", "pdf1", true, "./tes.pdf");
  await addDocument("./tes2.pdf", "pdf2", true, "./tes2.pdf");
  await addDocument("./tes3.pdf", "pdf3", true, "./tes3.pdf");

  console.log("📄 Sample data inserted.");

  // Cek hasil penyimpanan
  const testQuery = await retrieveContext("Mobile Legends");
  console.log("🔍 Cek hasil simpan:", testQuery);
}

insertSampleData();