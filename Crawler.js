const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

                       


async function crawl(url, depth, db, currentDepth = 0) {
    const resultsJsonFile = { results: [] };
    try {
        const html = await rp(url);                            //using rp  to make an HTTP request  and retrieve the HTML data.
        const $ = cheerio.load(html);                          // loads the HTML content
        const links = $('a').map((i, el) => $(el).attr('href')).get();   // extract links and images 
        const images = $('img').map((i, el) => $(el).attr('src')).get();
        const results = images.map(link => {
            return {
                imageUrl: link,
                sourceUrl: url,
                depth: currentDepth
            }
        });

        if (currentDepth < depth) {                             //recursive calls -  crawl through the links at increasing depths
            for (const link of links) {
                //console.log("new link")
                if (link.startsWith('http')) {
                    const subResults = await crawl(link, depth, db, currentDepth + 1);
                    results.push(...subResults);
                }
            }
        }
        
        resultsJsonFile.results.push(...results);                // adding results for the JSON file

        if (currentDepth === 0) {                               // only write to file for depth 0
            fs.writeFileSync('results.json', JSON.stringify(resultsJsonFile, null, 2)); 
        }

        const collection = db.collection('images');
        await collection.insertMany(results);

        return results;
    } catch (err) {
        console.error(err);
        return [];
    }
}

module.exports = crawl;