var FalcorServer = require('falcor-express'),
    bodyParser = require('body-parser'),
    express = require('express'),
    Router = require('falcor-router'),
    app = express(),
    data = {
        names: [
            {id: 0},
            {id: 1},
            {id: 2}
        ],
        namesByIds: {
            "0": {name: 'a'},
            "1": {name: 'b'},
            "2": {name: 'c'}
        }
    },
    NamesRouter = Router.createClass([
        {
            route: 'names[{integers:nameIndexes}]',
            get: (pathSet) => {
                var results = [];
                pathSet.nameIndexes.forEach(nameIndex => {
                    if (data.names.length > nameIndex) {
                        results.push({
                            path: ['names', nameIndex],
                            value: {$type: 'ref', value: ['namesById', data.names[nameIndex].id]}
                        })
                    }
                })
                return results
            }
        },
        {
            route: 'namesById[{integers:nameIds}]["name"]',
            get: (pathSet) => {
                var results = [];
                pathSet.nameIds.forEach(nameId => {
                    results.push({
                        path: ['namesById', nameId, 'name'],
                        value: data.namesByIds[nameId].name
                    })
                })
                return results
            },
            set: (jsonGraphArg) => {
                var namesById = jsonGraphArg.namesById,
                    ids = Object.keys(namesById),
                    results = []
                ids.forEach(id => {
                    data.namesByIds[id].name = namesById[id].name
                    results.push({
                        path: ['namesById', id, 'name'],
                        value: namesById[id].name
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
                var newId = data.names.length,
                    newName = args[0];

                data.names.push({id:newId});
                data.namesByIds[newId] = {name: newName};

                return [
                    {
                        path: ['names', data.names.length-1],
                        value: {$type: 'ref', value: ['namesById', newId]}
                    },
                    {
                        path: ['namesById', newId, 'name'],
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
            route: 'names.up',
            call: (callPath, args) => {
                var currentIndex = args[0];
                if (currentIndex < data.names.length && currentIndex > 0) {
                    var upIndex = parseInt(currentIndex, 10) - 1,
                        idToUp = data.names[currentIndex].id,
                        idToDown = data.names[upIndex].id;

                    data.names[currentIndex].id = idToDown;
                    data.names[upIndex].id = idToUp;

                    return [
                        {
                            path: ['names', currentIndex],
                            value: {$type: 'ref', value: ['namesById', idToDown]}
                        },{
                            path: ['names', upIndex],
                            value: {$type: 'ref', value: ['namesById', idToUp]}
                        }
                    ]
                }
            }
        },
        {
            route: 'names.down',
            call: (callPath, args) => {
                var currentIndex = args[0];
                if (currentIndex < (data.names.length - 1) && currentIndex >= 0) {
                    var downIndex = parseInt(currentIndex, 10) + 1,
                        idToUp = data.names[downIndex].id,
                        idToDown = data.names[currentIndex].id;

                    data.names[currentIndex].id = idToUp;
                    data.names[downIndex].id = idToDown;

                    return [
                        {
                            path: ['names', currentIndex],
                            value: {$type: 'ref', value: ['namesById', idToUp]}
                        },{
                            path: ['names', downIndex],
                            value: {$type: 'ref', value: ['namesById', idToDown]}
                        }
                    ]
                }
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
