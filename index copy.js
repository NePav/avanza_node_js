require('dotenv').config()                                                                             
                                                                                                         
  const Avanza = require('avanza')                                                                       
                                                                                                         
  const avanza = new Avanza()                                                                            
                                                                                                         
  console.log('Authenticating...')                                                                       
                                                                                                         
  avanza.authenticate({                                                                                  
    username: process.env.AVANZA_USERNAME,                                                               
    password: process.env.AVANZA_PASSWORD,                                                               
    totpSecret: process.env.AVANZA_TOTP                                                                        
  }).then(() => {                                                                                        
    console.log('Authenticated successfully.')                                                           
    console.log('Getting positions...')                                                                  
    avanza.getPositions().then(positions => {                                                            
      console.log('Positions:', positions)                                                               
    }).catch(error => {                                                                                  
      console.error('Error getting positions:', error)                                                   
    })                                                                                                   
  }).catch(error => {                                                                                    
    console.error('Error authenticating:', error)                                                        
  })
                             
  const express = require('express');                                                                   
  const app = express();                                                                                
  const port = 8080;                                                                                    
                                                                                                        
  app.get('/', async (req, res) => {                                                                    
    try {                                                                                               
      console.log('Authenticating...');                                                                 
      await avanza.authenticate({                                                                       
        username: process.env.AVANZA_USERNAME,                                                          
        password: process.env.AVANZA_PASSWORD,                                                          
        totpSecret: process.env.AVANZA_TOTP                                                             
      });                                                                                               
      console.log('Authenticated successfully.');                                                       
      console.log('Getting positions...');                                                              
      const positions = await avanza.getPositions();                                                    
      console.log('Positions:', positions);                                                             
                                                                                                        
      let html = '<table>';                                                                             
      for (let position of positions.instrumentPositions) {                                             
        html += `<tr><td>${position.name}</td><td>${position.value}</td></tr>`;                         
      }                                                                                                 
      html += '</table>';                                                                               
      res.send(html);                                                                                   
    } catch (error) {                                                                                   
      console.error('Error:', error);                                                                   
      res.status(500).send('An error occurred.');                                                       
    }                                                                                                   
  });                                                                                                   
                                                                                                        
  app.listen(port, () => {                                                                              
    console.log(`App listening at http://localhost:${port}`);                                           
  });                              