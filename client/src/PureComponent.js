module.exports = class PureComponent extends React.Component {
    shouldComponentUpdate(newProps, newState) {
        return _.isEqual(newProps, this.props) && _.isEqual(newState, this.state);
    }
};