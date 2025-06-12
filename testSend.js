require('dotenv').config();
const { sendMessage } = require('./bot');

sendMessage("✅ Test notifikasi dari bot Telegram berhasil dikirim!")
  .then(() => console.log("Pesan dikirim!"))
  .catch(err => console.error("Gagal kirim pesan:", err));

