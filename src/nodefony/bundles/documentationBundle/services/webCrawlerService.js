var fs = require('fs');
var url = require('url');


var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var _ = require('lodash');


nodefony.registerService("webCrawler", function(){


	var webCrawler = function(){
	
	}

	webCrawler.prototype.test = function(){
	
		var url = "http://nodefony.fr";

		request(url, function (error, response, body) {
			if (!error) {
				var $ = cheerio.load(body)
			                        
			        var title = $('title').text();
				var content = $('body').text();
				var freeArticles = $('.central-featured-lang.lang1 a small').text()

			        console.log('URL: ' + url);
				console.log('Title: ' + title);
				console.log('EN articles: ' + freeArticles);
			}else {
				console.log("We’ve encountered an error: " + error);
									                                }
		});

	
	}


	webCrawler.prototype.siteAll = function(){

		this.base = 'nodefony.com:5151';
		var firstLink = 'http://' + this.base + '/documentation/Beta';

		this.crawled = [];
		this.inboundLinks = [];
		myLoop.call(this, firstLink);
	}

	var makeRequest = function(crawlUrl, callback){
		var startTime = new Date().getTime();
		request(crawlUrl, function (error, response, body) {

			this.pageObject = {};
			this.pageObject.links = [];

			var endTime = new Date().getTime();
			var requestTime = endTime - startTime;
			this.pageObject.requestTime = requestTime;

			var $ = cheerio.load(body);
			this.pageObject.title = $('title').text();
			this.pageObject.url = crawlUrl;
			$('a').each(function(i, elem){
				/*
 				 *        insert some further checks if a link is:
 				 *               * valid
 				 *                      * relative or absolute
 				 *                             * check out the url module of node: https://nodejs.org/dist/latest-v5.x/docs/api/url.html
 				 *                                   */
				this.pageObject.links.push({linkText: $(elem).text(), linkUrl: elem.attribs.href})
			}.bind(this));
			callback(error,this.pageObject);
		}.bind(this));
	}

	var myLoop = function(link){
		makeRequest(link, function(error, pageObject){
			console.log(pageObject);
			this.crawled.push(pageObject.url);
			async.eachSeries(pageObject.links, function(item, cb){
				console.log(item);
				if (! item.linkUrl) return ;
				var parsedUrl = url.parse(item.linkUrl);
				// test if the url actually points to the same domain
				if(parsedUrl.hostname == this.base){
					/*
					   insert some further link error checking here
					   */
					this.inboundLinks.push(item.linkUrl);
				}
				cb();
			}.bind(this)
			,function(){
				var nextLink = _.difference(_.uniq(this.inboundLinks),this.crawled);
				if(nextLink.length > 0){
					myLoop.call(this, nextLink[0]);
				}
				else {
					console.log('done!');
				}
			}.bind(this));
		}.bind(this));
	}




	return webCrawler


});

