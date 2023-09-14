const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function extractInterestRates() {
    const url = 'https://www.global-rates.com/en/interest-rates/central-banks/central-banks.aspx';
    
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        const selector = "#ctl00 > table.maintable > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(6)";
        const rows = $(selector).find('tr');

        let csvData = 'Name of interest rate\tCountry/Region\tCurrent Rate\tDirection\tPrevious Rate\tChange\n';

        rows.each((index, row) => {
            if (index !== 0) { // Skip header row
                const columns = $(row).find('td');
                const rowData = columns.map((_, col) => {
                    let text = $(col).text().trim();
                    // Ensure only numerical values for current and previous rate columns
                    if (_ === 2 || _ === 4) {
                        text = text.replace(/[^0-9.]/g, ''); // Remove all non-numeric characters except for the decimal point
                    }
                    // Extract direction based on the icon
                    if (_ === 3) {
                        const hasUpIcon = $(col).find('img[src*="up.gif"]').length > 0;
                        const hasDownIcon = $(col).find('img[src*="down.gif"]').length > 0;
                        text = hasUpIcon ? 'Up' : hasDownIcon ? 'Down' : 'Neutral';
                    }
                    // Reformat date in the "Change" column
                    if (_ === 5) {
                        const dateParts = text.split('-');
                        if (dateParts.length === 3) {
                            text = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
                        }
                    }
                    return text;
                }).get();
                csvData += rowData.join('\t') + '\n';
            }
        });

        // Generate filename based on current date and time
        const date = new Date();
        const filename = `Global_Inflation_Rates_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.csv`;

        // Write data to CSV file
        fs.writeFileSync(filename, csvData);
        console.log(csvData);
        console.log(`Data written to ${filename}`);
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
}

module.exports = extractInterestRates;

