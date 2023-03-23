const rp = require('request-promise');
const cheerio = require('cheerio');
const program = require('commander');
const fs = require('fs');

//This file is the excersice without the additinal 'MongoDB' and Server & Client code.
///to run this file: 'node crawlerSolely.js https://www.google.com 1'

program      
  .arguments('<url> <depth>')
  .action(async (url, depth) => {
    const results = await crawl(url, depth);
    // Save the results to a JSON file
    fs.writeFileSync('results.json', JSON.stringify({ results }, null, 2));
  })
  .parse(process.argv);

// Main crawling function
async function crawl(url, depth, currentDepth = 0) {
    console.log('entered crawling func')
  try {
    const html = await rp(url);
    const $ = cheerio.load(html);
    const links = $('a').map((i, el) => $(el).attr('href')).get();
    const images = $('img').map((i, el) => $(el).attr('src')).get();
    const results = images.map(link => {
      return {
        imageUrl: link,
        sourceUrl: url,
        depth: currentDepth
      }
    });
    if (currentDepth < depth) {
      for (const link of links) {
        console.log('entered for loop')
        if (link.startsWith('http')) {
          const subResults = await crawl(link, depth, currentDepth + 1);
          results.push(...subResults);
        }
      }
    }
    return results;
  } catch (err) {
    console.error(err);
    return [];
  }
}