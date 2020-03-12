/* eslint-disable no-console, no-process-exit */
const maitre = require('./maitrerestaurateur.js');
var fs = require('fs')
async function sandbox () {
  try {
    //Scrap maitres restaurateurs
    //Save the info in a json file called Maitre.json
    const maitres = await maitretestaurateur.get();
    let data = JSON.stringify(maitres,null,'\t');
    fs.writeFileSync('Maitre.json', data);
    
    console.log('done')
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  } 
}
sandbox()