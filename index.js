const express = require('express');
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Multi-Token Bot Render üzerinde aktif!");
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda dinleniyor.`);
});

// --- AYARLAR (Environment Variables) ---
// Render panelinden gelen virgüllü metni diziye çeviriyoruz
const rawTokens = process.env.TOKENS ? process.env.TOKENS.split(",") : [];
const message = process.env.MESSAGE;
const channels = [
  "1467580268075421789",
  "1465058037088784447",
  "1465052769743405128"
];

let currentIndex = 0;
let tokenIndex = 0;

if (rawTokens.length === 0 || !message) {
    console.error("HATA: Render panelinde TOKENS veya MESSAGE bulunamadı!");
} else {
    console.log(`${rawTokens.length} adet token yüklendi. İşlem başlıyor...`);
    // Belirlediğin 700ms hızında döngü
    setInterval(handleCycle, 700);
}

async function handleCycle() {
  const currentChannelId = channels[currentIndex];
  const currentToken = rawTokens[tokenIndex].trim(); // Boşlukları temizler

  try {
    // Mesaj Gönderme (Hız yüksek olduğu için direkt mesaj fonksiyonunu çağırıyoruz)
    await axios.post(`https://discord.com/api/v9/channels/${currentChannelId}/messages`, {
      content: message
    }, {
      headers: {
        "Authorization": currentToken,
        "Content-Type": "application/json"
      }
    });
    
    console.log(`✅ Başarılı: Kanal ${currentChannelId} | Token Sonu: ...${currentToken.slice(-4)}`);
  } catch (err) {
    console.error(`❌ Hata: ${err.response?.status || "Bağlantı Hatası"} (Token Index: ${tokenIndex})`);
  }

  // Her seferinde hem kanalı hem tokeni değiştir
  currentIndex = (currentIndex + 1) % channels.length;
  tokenIndex = (tokenIndex + 1) % rawTokens.length;
}
