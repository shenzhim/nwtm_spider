'use strict';

const cheerio = require('cheerio');
const nodeFetch = require('node-fetch');
const conn = require('./db');
const nwUrl = "http://nwtm.yohobuy.com/";

const request = function(url, options) {
	console.log("url: ", url);

	return nodeFetch(url).then(function(res) {
		return res.text();
	}).then(function(body) {
		return cheerio.load(body, options);
	});
};

const getTotalPage = function($) {
	var page = $('.pager a:nth-last-child(2)');
	return Number(page.text());
}

const getProductData = function($) {
	var goods = $('.good-thumb');
	for (var k in goods) {
		var item = goods[k];
		if (item.type === 'tag') {
			(function(href) {
				var sku = href.split('=')[1];
				request(nwUrl + href.substr(1)).then(function($) {
					var name = $('.infos .name').text();
					var mprice = $('.market-price .price').text().replace('¥', '');
					var sprice = $('.sale-price .price').text().replace('¥', '');
					var reason = $('#details-html > div:nth-of-type(1)').text().trim();
					var num = $('#sizes li').data('num') || 0;

					conn.insert({
						sku: sku,
						name: name,
						mprice: mprice,
						sprice: sprice,
						status: Number(num) ? 'sale' : 'soldout',
						reason: reason
					});
				}).catch(function(err) {
					console.error('Cannot fetch product data', err);
				})
			})(item.attribs.href);
		}
	}
}

request(nwUrl).then(function($) {
	var cIndex = 1;
	var total = getTotalPage($);
	if (isNaN(total)) {
		console.error("get total page fail");
		return;
	}

	var timer = setInterval(function() {
		if (cIndex > total) {
			console.log("clearInterval timer");
			clearInterval(timer);
			conn.end();
			return;
		}

		request(nwUrl + "?page=" + cIndex).then(function($) {
			getProductData($);
		}).catch(function(err) {
			console.error('Cannot fetch the contents', err);
		});

		cIndex++;
	}, 5000);
}).catch(function(err) {
	console.error('Cannot fetch the contents totalPage', err);
});