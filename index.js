var util = require('util');
var _request = require('request');
var parser = require('whacko');
var config = require('./config');
var constants = require('./constants');

exports.TopAppsCategories = constants.TopAppsCategories;
exports.TopAppsCollections = constants.TopAppsCollections;

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

exports.search = function(query, callback) {
    search(query, callback);
};

exports.topApps = function(category, collection, limit, callback) {

    if (!validateCategory(category)) {
        return callback("Invalid category: " + category);
    }

    if (!validateCollection(collection)) {
        return callback("Invalid collection: " + collection);
    }

    var maxNum = 60;
    var currentStart = 0;
    var cappedLimit = Math.min(500, limit);
    var url = constructTopAppsUrl(category, collection);
    var finalResults = [];

    function _resultsHandler(error, results) {
        if (error) {
            return callback(err, null);
        }

        finalResults = finalResults.concat(results);

        if (finalResults.length >= cappedLimit || results.length < maxNum) {
            if (finalResults.length > cappedLimit) {
                finalResults = finalResults.slice(0, cappedLimit);
            }
            return callback(null, finalResults);
        }

        currentStart += maxNum;

        var MAX_TIMEOUT = 2000;
        var MIN_TIMEOUT = 500;
        var randomTimeout = Math.random() * (MAX_TIMEOUT - MIN_TIMEOUT) + MIN_TIMEOUT;

        setTimeout(function() {
            chunkTopApps(currentStart, maxNum, url, _resultsHandler);
        }, randomTimeout);
    }

    chunkTopApps(currentStart, maxNum, url, _resultsHandler);
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

function chunkTopApps(start, num, url, callback) {
    var form = {
        start: start,
        num: num,
        numChildren: 0,
        ipf: 1,
        xhr: 1,
        hl: 'en'
    };

    _request.post(url, { form: form }, function(error, response, body) {

        if(error){
            return callback(err, null);
        }

        var results = parseSearchResults(body);
        return callback(null, results);
    });
}

function constructTopAppsUrl(category, collection) {
    var subPath = '';

    if (category && category !== constants.TopAppsCategories.ALL) {
        subPath += '/category/' + category;
    }

    if (collection) {
        subPath += '/collection/' + collection;
    }

    if (subPath.length === 0) {
        return null;
    }

    return util.format(config.topAppsUrl, subPath);
}

function parseSearchResults(html) {
    var results = [];
    var $ = parser.load(html);
    $('.card.apps').each(function(index,element) {

        var $el = $(element);

        var id = $el.attr('data-docid');

        var title = $el.find('.title').text().trim();
        var author = $el.find('a.subtitle').text().trim();
        var image = $el.find('img.cover-image').attr('src');
        var price = $el.find('.reason-set .display-price').text().trim();

        results.push({
            id: id,
            title: title,
            author: author,
            image: image,
            price: price
        });
    });

    return results;
}

function search(q, callback){
    var url = util.format(config.searchUrl, q);
    _request(url, function(error, response, body) {

        if (error) {
            return callback(err, null);
        }

        var results = parseSearchResults(body);
        return callback(error, results);
    });
}

function validateCategory(category) {
    return validateConstant(category, constants.TopAppsCategories);
}

function validateCollection(collection) {
    return validateConstant(collection, constants.TopAppsCollections);
}

function validateConstant(constant, constantCollection) {
    if (!constant) {
        return false;
    }

    var result = false;
    var keys = Object.keys(constantCollection);
    for (var i = 0; i < keys.length; ++i) {
        if (constantCollection[keys[i]] === constant) {
            result = true;
            break;
        }
    }

    return result;
}
