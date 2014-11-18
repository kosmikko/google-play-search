var util = require('util');
var _request = require('request');
var parser = require('whacko');
var config = require('./config');

exports.fetch = function(playId, lang, callback) {
  if(!callback) {
    callback = lang;
    lang = 'en';
  }
  var url = util.format(config.url, playId, lang);
  parse(playId, url, config, callback);
};

exports.request = function(url, callback) {
  _request(url, callback);
};

exports.search = function(query, callback){
    _search('q',function(){console.log('woo')})
}


var _search = function(q, callback){
    _request('http://play.google.com/store/search?q=' + q + '&hl=en',function(error, response, body){
        var results = [];
        var $ = parser.load(body);
        var cards = $('.card.apps').each(function(index,element){
            
            var $el = $(element);

            var id = $el.attr('data-docid');
            
            var title = $el.find('.title').text().trim();
            var author = $el.find('a.subtitle').text().trim();
            var image = $el.find('img.cover-image').attr('src');

            results.push({
                id: id,
                title: title,
                author: author,
                image:image
            });
        });

        return results;
        
    });
}

var parse = function(playId, url, config, callback) {
  var result = {
    webUrl: url,
    marketUrl: 'market://details?id=' + playId,
    id: playId
  };

  var mainSelector = config.mainSelector;
  var selectors = config.selectors;
  exports.request(url, function(error, response, body) {
    if(error) return callback(error);

    var $ = parser.load(body);
    selectors.forEach(function(selector) {
      var el = mainSelector + ' ' + selector.selector;
      var match = $(el);
      var val = selector.attr
        ? match.attr(selector.attr)
        : match.text().trim();
      result[selector.property] = val;
    });
    parseSimilarApps($, result);
    callback(null, result);
  });
};

var parseSimilarApps = function($, result) {
    var cards = $('.recommendation .rec-cluster');
    var similarApps = [];
    for (var i=0; i < cards.length; ++i) {
        if (cards.find('h1').first().text() === 'Similar') {
            cards.find('.card-content').each(function(i, elem){
                var docId = $(elem).attr('data-docid');
                if (docId && docId.length > 0) {
                    similarApps.push(docId);
                }
            });
        }
    }

    if (similarApps && similarApps.length > 0) {
        result['similarApps'] = similarApps;
    }
};

