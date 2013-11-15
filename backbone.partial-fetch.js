/*
 * Backbone.partial-fetch - Allows you to do smart partial fetching
 * Copyright (c) 2012 Pau Ramon
 * MIT Licensed
 * @version 0.0.4
 */

(function () {

  function wrapError(model, options) {
    var error = options.error;
    options.error = function (resp) {
      if (error) {
        error(model, resp, options);
      }
      model.trigger('error', model, resp, options);
    };
  }

  /**
   * Partial fetch
   *
   * @param {Object} options
   * @return {jqXHR}
   */
  Backbone.Collection.prototype.partialFetch = function partialFetch(options) {
    var filtered_collection
      , success
      , collection = this;

    options = options ? _.clone(options) : {};
    success = options.success;

    if (options.parse === undefined) {
      options.parse = true;
    }

    if (options.filter === undefined) {
      options.filter = {};
    }

    if (_.isFunction(options.filter)) {
      filtered_collection = this.filter(options.filter);
    } else {
      filtered_collection = this.filter(function (item) {
        return _.all(_.keys(options.filter), function (key) {
          return item.get(key) === options.filter[key];
        });
      });
    }

    if (!options.url) {
      if (_.isFunction(this.url)) {
        options.url = this.url(options.filter);
      } else {
        throw Error('You must implement url as a function');
      }
    }

    options.success = function (resp) {
      var method = options.reset ? 'reset' : 'set'
        , resp_ids = _.isArray(resp) ? _.pluck(resp, 'id') : [resp.id]
        , to_remove = _.difference(_.pluck(filtered_collection, 'id'), resp_ids);

      if (to_remove.length) {
        collection.remove(to_remove, options);
      }
      delete options.url;
      collection[method](resp, _.extend(options, {remove: false}));
      if (success) {
        success(collection, resp, options);
      }
      collection.trigger('sync', collection, resp, options);
    };

    wrapError(this, options);

    return this.sync('read', this, options);
  };
}());
