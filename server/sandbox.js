/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin.js')
var fs = require('fs')

async function sandbox () {
  try {
    //Scrap bib gourmand restaurants
    //Save the info in a json file called Bib.json
    const restaurants = await michelin.get() 
    let data = JSON.stringify(restaurants,null,'\t')
    fs.writeFileSync('Bib.json', data)
    
    console.log('done')
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  } 
}
sandbox()