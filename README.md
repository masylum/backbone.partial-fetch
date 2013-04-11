# Backbone.partialFetch

Fetch partial data for a collection and does smart updates by:

  - Adding missing models
  - Updating existent models
  - Removing models not available anymore

## Why not use backbone `fetch`?

Backbone `fetch` works beautifully on fetching the whole resource representation but
you can't use it to do **smart updates** when fetching a partial part of that resource.

## How does it work

It works exactly like `fetch` but if you add a `filter` option:

  - It will be passed to the `url` so you can compose a url to fetch the subset
  - It will be used to determine wich elements have to be removed

Adding and updating existing models is done internally by backbone's `set`

```js
Collections.tasks.reset([
  {id: 1, name: 'Foo', project_id: 1}
, {id: 2, name: 'Bar', project_id: 2}
, {id: 3, name: 'Pole', project_id: 2}
]);

Collections.tasks.partialFetch({
  filter: {project_id: 1}
, success: function (collection, response) {
    // response is -> [
      {id: 2, name: 'Bar', project_id: 1}
    , {id: 4, name: 'Jambo', project_id: 1}
    ]

    // collection is -> [
      {id: 2, name: 'Bar', project_id: 1}
    , {id: 3, name: 'Pole', project_id: 2}
    , {id: 4, name: 'Jambo', project_id: 1}
    ]
  }
});
```

## Test

```
make test
```

## License

(The MIT License)

Copyright (c) 2013 Pau Ramon <masylum@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
