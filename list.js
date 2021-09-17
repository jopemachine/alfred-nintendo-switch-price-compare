const alfy = require('alfy');
const cheerio = require('cheerio');
const got = require('got');

const listAPI = `https://eshop-prices.com/games?q={query}&currency=${process.env.currency}`;

got(listAPI.replace('{query}', alfy.input), {
    headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Accept': '*/*',
        "Accept-Encoding": "gzip, deflate, br",
        'Connection': 'gzip, deflate, br',
        'Cache-Control': 'no-cache'
    },
}).then((html) => {
    const $ = cheerio.load(html.body);
    const listElems = $('.games-list').children('.games-list-item');

    const items = [];
    for (const elem of listElems) {
        if (!elem.attribs.href) continue;
        const gameChilds = elem.children;

        let title;
        let subtitle;
        const arg = elem.attribs.href;

        for (const gameChild of gameChilds) {
            if (!gameChild.attribs) continue;
            if (gameChild.attribs.class === 'games-list-item-content') {
                subtitle = $(gameChild).children('.games-list-item-description').text();
                title = $($(gameChild).children('.games-list-item-title').children()[0]).text();
            }
        }

        items.push({
            title,
            subtitle,
            arg
        });
    }

    alfy.output(items);
});
