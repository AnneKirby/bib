const axios = require('axios');
const cheerio = require('cheerio');
var fs = require('fs')

//scrape restaurants in a page
const scrapeLinks = async url => {
  const response = await axios(url);
  const {data, status} = response;
  if (status >= 200 && status < 300) {
    return parseLinks(data);
  }
  console.error(status);

  return null;
};

//scrape a restaurant given its url
const scrapeRestaurant = async url => {
  const response = await axios(url);
  const {data, status} = response;
  if (status >= 200 && status < 300) {
    return parse(data);
  }
  console.error(status);

  return null;
};

//parse restaurant links in a page
const parseLinks = data => {
  const $ = cheerio.load(data);
  const test = [];
  $('a.link').each( function(){
    var link = $(this).attr('href');
    test.push(link);
  } );
  return test;
};

//parse restaurant page
const parse = data => {
  const $ = cheerio.load(data);
  const name = $('.section-main h2.restaurant-details__heading--title').text();
  var tel = $('body > main > div.restaurant-details > div.container > div > div.col-xl-8.col-lg-7 > section:nth-child(4) > div.row > div:nth-child(1) > div > div:nth-child(1) > div > div > span.flex-fill').text().replace('+33 ', '0');  
  var address = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > ul > li:nth-child(1)').text();
  if (address.includes('Offre\n')||address.includes('Offres\n'))
  {
  	address = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > ul > li:nth-child(2)').text();
    tel = $('body > main > div.restaurant-details > div.container > div > div.col-xl-8.col-lg-7 > section:nth-child(5) > div.row > div:nth-child(1) > div > div:nth-child(1) > div > div > span.flex-fill').text().replace('+33 ', '0');
  }
  tel = tel.replace(/\s/g, '');
  var price_min = $('div.restaurant-details__heading.d-lg-none > ul > li.restaurant-details__heading-price').text().split('\n')[2];
  if (price_min != undefined)
  { 
    price_min = price_min.trim();
  }
  var price_max = $('div.restaurant-details__heading.d-lg-none > ul > li.restaurant-details__heading-price').text().split('\n')[5];

  if (price_max != undefined)
  {
   price_max = price_max.trim();
  } 
    var type = $('div.restaurant-details__heading.d-lg-none > ul > li.restaurant-details__heading-price').text().split('•')[1];
  
  if (type != undefined)
  {
    type = type.trim();
  }
  return {name, address, tel, price_max, price_min, type};
};

module.exports.get = async() => {
  var result = [];
  var results = [];
  const urls = [];
  const restaurants = [];
  let i=1;
  do{
    let url = 'https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/'+i;
    result = await scrapeLinks(url);
    result.forEach(function(i){
    urls.push(i);   
    });
    i+=1;
  } while(Array.isArray(result) && result.length ); 
  
  for(let j=0 ; j<urls.length ; j++){
    let url = "https://guide.michelin.com"+urls[j];
    results = await scrapeRestaurant(url);
    restaurants.push(results);
  };
  
  return restaurants;
};