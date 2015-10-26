# fullstack-react
A simple, full-stack JavaScript single page app featuring [React](http://facebook.github.io/react/), 
[Webpack](https://webpack.github.io/), and [Falcor](http://netflix.github.io/falcor/). This is a fork of
[spring-react-demo](https://github.com/Widen/spring-react-demo) with a new backend (node) and a new API (via Falcor). All of this is explained in detail in [a Widen Engineering blog post](http://engineering.widen.com/blog/future-of-the-web-react-falcor/).

The app constructed here is simple - a list of names, maintained on the server, with the ability to display, add, and maniplate names in the list via the browser.

## Starting the app  

1. `npm install`
2. `npm run webpack`
3. `node --harmony server`
4. Navigate to http://localhost:9090


## TODO

- ~~ability to edit existing names~~
    - Completed by [Sam Kvale][skvale] in the [edit-names] branch.
- support for name re-ordering
- blog post explaining all parts of this demo


[edit-names]: https://github.com/Widen/fullstack-react/tree/edit-names
[skvale]: https://github.com/skvale