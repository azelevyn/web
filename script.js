const tg = window.Telegram.WebApp;
tg.expand();

document.getElementById("submitBtn").addEventListener("click", () => {
  const currency = document.getElementById("currency").value;
  const network = document.getElementById("network").value;
  const method = document.getElementById("method").value;

  tg.sendData(JSON.stringify({ currency, network, method }));
  tg.close();
});
