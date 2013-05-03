/*global it, describe, before, beforeEach*/
var assert = require('assert')
  , gently = new (require('gently'))
  , Task
  , Tasks;

GLOBAL._ = require('underscore');
GLOBAL.Backbone = require('backbone');
require('../backbone.partial-fetch');

Task = Backbone.Model.extend({isArchived: function () {
  return !!this.get('archived');
}});
Tasks = Backbone.Collection.extend({
  model: Task
, url: function () {
    return 'api/tasks';
  }
});

describe('PartialFetch', function () {
  var tasks;

  beforeEach(function () {
    tasks = new Tasks();
    for (var i = 0; i < 3; i++) {
      tasks.add({id: i, archived: i % 2 === 0});
    }
  });

  describe('url', function () {
    it('throws if its not a function', function () {
      tasks.url = 'foo';
      assert.throws(function () {
        tasks.partialFetch();
      });
    });

    it('gets the filter to the url', function () {
      var filter = {archived: true};

      gently.expect(tasks, 'url', function (options) {
        assert.deepEqual(options, filter);
      });
      gently.expect(tasks, 'sync', function (method, context, options) {
        assert.equal(method, 'read');
        assert.equal(context, tasks);
        assert.deepEqual(options.filter, filter);
      });
      tasks.partialFetch({filter: filter});
    });
  });

  describe('filter', function () {
    it('defaults to no filtering', function () {
      gently.expect(tasks, 'url', function (options) {
        assert.deepEqual(options, {});
      });
      gently.expect(tasks, 'sync', function (method, context, options) {
        assert.equal(method, 'read');
        assert.equal(context, tasks);
        assert.deepEqual(options.filter, {});
      });
      tasks.partialFetch();
    });

    it('uses a custom filter function if given', function () {
      var filter = function (item) {
        return item.get('archived') === false;
      }
        , resp = [{id: 0, archived: false}];

      gently.expect(tasks, 'sync', function (method, context, options) {
        assert.equal(method, 'read');
        assert.equal(context, tasks);
        assert.deepEqual(options.filter, filter);
        options.success(resp);
      });
      gently.expect(tasks, 'remove', function (to_remove, options) {
        assert.deepEqual(to_remove, [1]);
      });
      gently.expect(tasks, 'set', function (resp, options) {
        assert.deepEqual(resp, resp);
        assert.equal(options.remove, false);
      });
      tasks.partialFetch({filter: filter});
    });
  });

  describe('smart updating', function () {
    it('uses Backbones `set` with `remove` set to false', function () {
      gently.expect(tasks, 'sync', function (method, context, options) {
        assert.equal(method, 'read');
        assert.equal(context, tasks);
        assert.deepEqual(options.filter, {});
        options.success(tasks.models);
      });
      gently.expect(tasks, 'set', function (resp, options) {
        assert.deepEqual(resp, tasks.models);
        assert.equal(options.remove, false);
      });
      tasks.partialFetch();
    });

    it('does not send the url all along', function () {
      gently.expect(tasks, 'sync', function (method, context, options) {
        options.success(tasks.models);
      });
      gently.expect(tasks, 'set', function (resp, options) {
        assert.equal(options.url, undefined);
      });
      tasks.partialFetch();
    });

    it('uses Backbones `reset` if option set', function () {
      gently.expect(tasks, 'sync', function (method, context, options) {
        assert.equal(method, 'read');
        assert.equal(context, tasks);
        assert.deepEqual(options.filter, {});
        options.success(tasks.models);
      });
      gently.expect(tasks, 'reset', function (resp, options) {
        assert.deepEqual(resp, tasks.models);
        assert.equal(options.remove, false);
      });
      tasks.partialFetch({reset: true});
    });

    it('calculates wich data has to be removed', function () {
      var filter = {archived: false}
        , resp = [{id: 0, archived: false}];

      gently.expect(tasks, 'sync', function (method, context, options) {
        assert.equal(method, 'read');
        assert.equal(context, tasks);
        assert.deepEqual(options.filter, filter);
        options.success(resp);
      });
      gently.expect(tasks, 'remove', function (to_remove, options) {
        assert.deepEqual(to_remove, [1]);
      });
      gently.expect(tasks, 'set', function (resp, options) {
        assert.deepEqual(resp, resp);
        assert.equal(options.remove, false);
      });
      tasks.partialFetch({filter: filter});
    });
  });
});

