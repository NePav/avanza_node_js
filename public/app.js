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
          table.row.add([                                                                                                                                                                       
            position.accountName,                                                                                                                                                               
            position.accountType,                                                                                                                                                               
            position.depositable,                                                                                                                                                               
            position.accountId,                                                                                                                                                                 
            position.volume,                                                                                                                                                                    
            position.profit,                                                                                                                                                                    
            position.profitPercent,                                                                                                                                                             
            position.averageAcquiredPrice,                                                                                                                                                      
            position.acquiredValue,                                                                                                                                                             
            position.value,                                                                                                                                                                     
            position.currency,                                                                                                                                                                  
            position.orderbookId,                                                                                                                                                               
            position.lastPrice,                                                                                                                                                                 
            position.lastPriceUpdated,                                                                                                                                                          
            position.change,                                                                                                                                                                    
            position.changePercent,                                                                                                                                                             
            position.tradable,                                                                                                                                                                  
            position.name,                                                                                                                                                                      
            new Date().toLocaleString()                                                                                                                                                         
          ]).draw();                                                                                                                                                                            
        }                                                                                                                                                                                       
      }                                                                                                                                                                                         
    })                                                                                                                                                                                          
    .catch(error => console.error("Error:", error));                                                                                                                                            
});