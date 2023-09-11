const fs = require('fs');                                                                             
   const dotenv = require('dotenv');                                                                     
   const Avanza = require('avanza/dist/index.js');                                                       
                                                                                                         
   const avanza = new Avanza();                                                                          
                                                                                                         
   dotenv.config();                                                                                      
                                                                                                         
   avanza.authenticate({                                                                                 
     username: process.env.AVANZA_USERNAME,                                                              
     password: process.env.AVANZA_PASSWORD,                                                              
     totpSecret: process.env.AVANZA_TOTP                                                          
   }).then(() => {                                                                                       
     avanza.getPositions().then(positions => { 
       fs.writeFileSync('positions.json', JSON.stringify(positions, null, 2));                           
     });                                                                                                 
   });