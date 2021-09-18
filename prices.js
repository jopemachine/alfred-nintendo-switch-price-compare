const alfy = require('alfy');
const cheerio = require('cheerio');
const got = require('got');

const priceAPI = `https://eshop-prices.com/{query}?currency=${process.env.currency}`;

got(priceAPI.replace('{query}', alfy.input), {
    headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Accept': '*/*',
        "Accept-Encoding": "gzip, deflate, br",
        'Connection': 'gzip, deflate, br',
        'Cache-Control': 'no-cache'
    }
}).then((html) => {
    const items = [];
    const $ = cheerio.load(html.body);
    const listElems = $('.pointer').children('.price-value');

    for (const elem of listElems) {
        const country = $(elem.parent.children[3]).text().trim();
        const price = $(elem).text().trim();

        if (price.includes(' ')) {
            const [originalPrice, ...others] = price.split(' ');
            const discountedPrice = others.join(' ');

            items.push({
                title: `[${country}] [🎉 On SALE] ${originalPrice} -> ${discountedPrice}`,
                arg: discountedPrice
            })
        } else {
            items.push({
                title: `[${country}] ${price}`,
                arg: price
            })
        }
    }

    alfy.output(items);
});
