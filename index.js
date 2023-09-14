require('dotenv').config()                                                                             

  const Avanza = require('avanza')                                                                       
  const avanza = new Avanza()                                                                            
                             
  const express = require('express');                                                                   
  const app = express();                                                                                
  const port = 80;                                                                                    
                       
  app.get('/', function(req, res) { res.sendFile(__dirname + '/public/index.html'); });

  app.get('/', async (req, res) => {                                                                    
    try {                                                                                               
      console.log('Authenticating...');                                                                 
      await avanza.authenticate({                                                                       
        username: process.env.AVANZA_USERNAME,                                                          
        password: process.env.AVANZA_PASSWORD,                                                          
        totpSecret: process.env.AVANZA_TOTP_SECRET                                                             
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
  });                              app.use(express.static('public'));

app.post("/login", async (req, res) => {
  try {
    await avanza.authenticate({
      username: process.env.AVANZA_USERNAME,
      password: process.env.AVANZA_PASSWORD,
      totpSecret: process.env.AVANZA_TOTP_SECRET
    });
    res.sendStatus(200);
  } catch (error) {
    console.error("Error authenticating:", error);
    res.sendStatus(401);
  }
});

app.get("/positions", async (req, res) => {
  try {
    const positions = await avanza.getPositions();
    res.json(positions);
  } catch (error) {
    console.error("Error getting positions:", error);
    res.sendStatus(500);
  }
});

const extractInterestRates = require('./gir');

app.post('/extract-rates', async (req, res) => {
  try {
      await extractInterestRates();
      res.send('Data extraction successful and saved to CSV!');
  } catch (error) {
      res.status(500).send('Error extracting data.');
  }
});

const getLatestCSV = require('./gir');
const parseCSVData = require('./gir');
const convertToGeoJSON = require('./gir');

app.get('/get-geojson-data', (req, res) => {
  const latestCSV = getLatestCSV();
  if (latestCSV) {
      const data = parseCSVData(latestCSV);
      const geoJsonData = convertToGeoJSON(data);
      res.json(geoJsonData);
  } else {
      res.status(404).send('No CSV file found.');
  }
});
