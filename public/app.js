document.getElementById("login").addEventListener("click", function() {
  fetch("/login", { method: "POST" })
      .then(response => {
          if (response.ok) {
              this.style.backgroundColor = "green";
              document.getElementById("get-positions").disabled = false;
          } else {
              this.style.backgroundColor = "red";
          }
      })
      .catch(error => console.error("Error:", error));
});

document.getElementById("get-positions").addEventListener("click", function() {
  fetch("/positions")
      .then(response => response.json())
      .then(data => {
          const table = $('#positions').DataTable();
          for (let instrument of data.instrumentPositions) {
              for (let position of instrument.positions) {
                  table.row.add({
                      accountName: position.accountName,
                      accountType: position.accountType,
                      depositable: position.depositable,
                      accountId: position.accountId,
                      volume: position.volume,
                      profit: position.profit,
                      profitPercent: position.profitPercent,
                      averageAcquiredPrice: position.averageAcquiredPrice,
                      acquiredValue: position.acquiredValue,
                      value: position.value,
                      currency: position.currency,
                      orderbookId: position.orderbookId,
                      lastPrice: position.lastPrice,
                      lastPriceUpdated: position.lastPriceUpdated,
                      change: position.change,
                      changePercent: position.changePercent,
                      tradable: position.tradable,
                      name: position.name,
                      timestamp: new Date().toLocaleString()
                  }).draw();
              }
          }
      })
      .catch(error => console.error("Error:", error));
});

document.getElementById('extractInterestRates').addEventListener('click', async () => {
    try {
        const response = await fetch('/extract-rates', { method: 'POST' });
        const result = await response.text();
        alert(result);
    } catch (error) {
        alert('Error extracting data.');
    }
});
