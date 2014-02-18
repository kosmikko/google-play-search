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
    callback(null, result);
  });
};