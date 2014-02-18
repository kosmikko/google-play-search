module.exports = {
  url: 'https://play.google.com/store/apps/details?id=%s&hl=%s',
  mainSelector: '',
  selectors: [
    {
      selector: '.document-title[itemprop=name]',
      property: 'name'
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
    }
  ]
};