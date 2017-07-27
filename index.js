const url = require('url');
const axios = require('axios');
const cachios = require('cachios');

const DEFAULT_CACHE_OPTIONS = {
  stdTTL: (60 * 60 * 12), // 12 hours
};

class ShopStyle {

  /**
   * Class for accessing the ShopStyle API
   * @param {string} pid API key
   * @param {string} [locale] set the locale for the api.
   * @param {Object} [node-cache] configuration options.
   *   Defaults to 12 hour ttl.
   * @param {string} [version] the version of the api to use.
   *   Defaults to version 2.
   *
   * @see {@link https://www.shopstylecollective.com/api/overview|API Overview}
   *    to obtain an API key and for further information on use.
   * @see {@link https://github.com/mpneuried/nodecache#options|node-cache options}
   *    for cache options
   * @see {@link https://github.com/PopSugar/shopstyle-sdk-nodejs|shopstyle-sdk}
   *    for list of supported locales
   */
  constructor(pid, locale = 'US', cacheOptions = DEFAULT_CACHE_OPTIONS, version = 2) {
    this.pid = pid;
    this.version = version;
    this.locale = locale;

    // Turn off caching by passing in false for cacheOptions
    if (cacheOptions) {
      this.client = cachios.create(axios, cacheOptions);
    } else {
      this.client = axios;
    }

    switch (this.locale) {
      case 'UK':
        this.host = 'api.shopstyle.co.uk';
        break;
      case 'DE':
        this.host = 'api.shopstyle.de';
        break;
      case 'FR':
        this.host = 'api.shopstyle.fr';
        break;
      case 'JP':
        this.host = 'api.shopstyle.co.jp';
        break;
      case 'AU':
        this.host = 'api.shopstyle.com.au';
        break;
      case 'CA':
        this.host = 'api.shopstyle.ca';
        break;
      case 'US':
      default:
        this.host = 'api.shopstyle.com';
    }
  }

  brands(options = {}) {
    return this.call('brands', options);
  }

  categories(options = {}) {
    return this.call('categories', options);
  }

  colors(options = {}) {
    return this.call('colors', options);
  }

  product(id) {
    return this.call(`products/${id}`);
  }

  products(options = {}) {
    return this.call('products', options);
  }

  productsHistogram(options = {}) {
    return this.call('products/histogram', options);
  }

  retailers() {
    return this.call('retailers');
  }

  lists(options = {}) {
    return this.call('lists', options);
  }

  callUri(path, options) {
    const query = Object.assign({ pid: this.pid }, options);
    const urlObj = {
      protocol: 'http',
      hostname: this.host,
      pathname: `api/v${this.version}/${path}`,
      query,
    };

    return url.format(urlObj);
  }

  call(path, options = {}) {
    const uri = this.callUri(path, options);
    // pull this out into a function
    return this.client.get(uri).then(resp => resp.data);
  }
}

module.exports = ShopStyle;
