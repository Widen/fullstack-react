var React = require('react'),
    model = require('./model.js'),
    NameItem = require('./name-item.jsx');

class NamesList extends React.Component {
    constructor() {
        super()
        this.state = {names: {}}
    }

    componentWillMount() {
        this.update()
    }

    render() {
        var names = Object.keys(this.state.names).map(idx => {
            return <NameItem key={idx} idx={idx} update={this.update.bind(this)} name={this.state.names[idx].name}/>
        })
        return (
            <ul>{names}</ul>
        )
    }

    update() {
        model.getValue(['names', 'length'])
            .then(length => model.get(['names', {from: 0, to: length-1}, 'name']))
            .then(response => this.setState({names: response.json.names}))
    }
}

module.exports = NamesList
