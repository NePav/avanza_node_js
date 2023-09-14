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

document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    fetch('/get-geojson-data')
        .then(response => response.json())
        .then(geoJsonData => {
            L.geoJSON(geoJsonData, {
                pointToLayer: function (feature, latlng) {
                    // Define marker style based on the 'currentRate' property
                    const rate = feature.properties.currentRate;
                    const markerColor = rate > 5 ? 'red' : 'green'; // Example logic

                    return L.circleMarker(latlng, {
                        radius: 8,
                        fillColor: markerColor,
                        color: 'white',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                },
                onEachFeature: function (feature, layer) {
                    // Add pop-up information based on the 'country' and 'currentRate' properties
                    layer.bindPopup(`Country: ${feature.properties.country}<br>Current Rate: ${feature.properties.currentRate}`);
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error('Error fetching or visualizing data:', error);
        });
});


