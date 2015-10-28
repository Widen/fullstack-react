var FalcorServer = require('falcor-express'),
    bodyParser = require('body-parser'),
    express = require('express'),
    Router = require('falcor-router'),
    app = express(),
    data = {
        names: [
            {name: 'a'},
            {name: 'b'},
            {name: 'c'}
        ]
    },
    NamesRouter = Router.createClass([
        {
            route: 'names[{integers:nameIndexes}]["name"]',
            get: (pathSet) => {
                var results = [];
                pathSet.nameIndexes.forEach(nameIndex => {
                    if (data.names.length > nameIndex) {
                        results.push({
                            path: ['names', nameIndex, 'name'],
                            value: data.names[nameIndex].name
                        })
                    }
                })
                return results
            },
            set: (jsonGraphArg) => {
                var namesById = jsonGraphArg.names,
                    ids = Object.keys(namesById),
                    results = []
                ids.forEach(id => {
                    data.names[id].name = namesById[id].name
                    results.push({
                        path: ['names', id, 'name'],
                        value: namesById[id]
                    })
                })
                return results
            }
        },
        {
            route: 'names.length',
            get: () => {
                return {path: ['names', 'length'], value: data.names.length}
            }
        },
        {
            route: 'names.add',
            call: (callPath, args) => {
                var newName = args[0];

                data.names.push({name: newName})

                return [
                    {
                        path: ['names', data.names.length-1, 'name'],
                        value: newName
                    },
                    {
                        path: ['names', 'length'],
                        value: data.names.length
                    }
                ]
            }
        },
        {
            route: 'names.swap',
            call: (callPath, args) => {
                var idx1 = args[0];
                var idx2 = args[1];
                if(idx1 < 0 || idx1 >= data.names.length) {
                    return {path: ['names', 'length'], value: data.names.length}
                }
                if(idx2 < 0 || idx2 >= data.names.length) {
                    return {path: ['names', 'length'], value: data.names.length}
                }
                var tmpName = data.names[idx1].name;
                data.names[idx1].name = data.names[idx2].name
                data.names[idx2].name = tmpName
                return [
                    {
                        path: ['names', idx1, 'name'],
                        value: data.names[idx1].name
                    },
                    {
                        path: ['names', idx2, 'name'],
                        value: data.names[idx2].name
                    }
                ]
            }
        }
    ])

app.use(bodyParser.urlencoded({extended: false}));
app.use('/model.json', FalcorServer.dataSourceRoute(() => new NamesRouter()))
app.use(express.static('.'))
app.listen(9090, err => {
    if (err) {
        console.error(err)
        return
    }
    console.log('navigate to http://localhost:9090')
});
