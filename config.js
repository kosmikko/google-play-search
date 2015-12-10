module.exports = {
  url: 'https://play.google.com/store/apps/details?id=%s&hl=%s',
  topAppsUrl: 'https://play.google.com/store/apps%s?authuser=0',
  searchUrl: 'http://play.google.com/store/search?q=%s&hl=en',
  mainSelector: '',
  selectors: [
    {
      selector: '.document-title[itemprop=name]',
      property: 'name'
    },
    {
      selector: '.document-subtitle.primary span[itemprop=name]',
      property: 'developer'
    },
    {
      selector: '.cover-image[itemprop=image]',
      attr: 'src',
      property: 'icon'
    },
    {
      selector: '.document-subtitle.category',
      property: 'categories'
    },
    {
      selector: 'meta[itemprop=ratingValue]',
      attr: 'content',
      property: 'rating'
    },
    {
      selector: 'meta[itemprop=ratingCount]',
      attr: 'content',
      property: 'ratingCount'
    },
    {
      selector: '.meta-info .content[itemprop=operatingSystems]',
      property: 'requiredOS'
    },
    {
      selector: '.meta-info .content[itemprop=softwareVersion]',
      property: 'softwareVersion'
    },
    {
      selector: '.meta-info .content[itemprop=contentRating]',
      property: 'contentRating'
    },
    {
      selector: 'span[itemprop=offers] meta[itemprop=price]',
      attr: 'content',
      property: 'price'
    }
  ]
};
