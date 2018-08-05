const values = require('autopilot/values');
const ValueField = require('./ValueField');
const PureComponent = require('./PureComponent');
const _ = require('lodash');

const eventToString = require('key-event-to-string')({
    cmd: "cmd",
    ctrl: "ctrl",
    alt: "alt",
    shift: "shift",
    joinWith: "-"
});

const adjustableValues = [
    {key: 'rudderTime', text: 'RudderTime', inc: 10},
    {key: 'rudderWait', text: 'Rudder Wait', inc: 10},
    {key: 'kP', text: 'P', inc: 0.5},
    {key: 'kI', text: 'I', inc: 0.1},
    {key: 'kD', text: 'D', inc: 0.1},
];

values.simulator && (adjustableValues.push({key: 'heading', text: 'Heading(sim): ', inc: 0.1}));


module.exports = class AdjustableValuesBox extends React.Component {

    componentWillMount() {
        this.setState({adjustableValueIdx: 0, values: values.getAll()});
        values.onChangeValues(adjustableValues.map(i => i.key), () => {
            this.setState({values: values.getAll()});
        });
        this.keyUpListener = this.onKeyUp.bind(this);
        document.addEventListener('keyup', this.keyUpListener);
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.keyUpListener);
    }

    onKeyUp(ev) {
        const key = eventToString(ev);
        key === 'Down' && this.downArrow();
        key === 'Up' && this.upArrow();
        key === 'shift-Left' && this.shiftLeft();
        key === 'shift-Right' && this.shiftRight();
    }

    downArrow() {
        this.setState({adjustableValueIdx: this.state.adjustableValueIdx < adjustableValues.length - 1 ? this.state.adjustableValueIdx + 1 : 0});
    }

    upArrow() {
        this.setState({adjustableValueIdx: this.state.adjustableValueIdx === 0 ? Object.keys(adjustableValues).length - 1 : this.state.adjustableValueIdx - 1});
    }

    shiftLeft() {
        const item = adjustableValues[this.state.adjustableValueIdx];
        ipcRenderer.send('update-values', {[item.key]: this.state.values[item.key] - item.inc});
    }

    shiftRight() {
        const item = adjustableValues[this.state.adjustableValueIdx];
        ipcRenderer.send('update-values', {[item.key]: this.state.values[item.key] + item.inc});
    }

    render() {
        return (
            <div>
                {adjustableValues.map((v, idx) => {
                    return (
                        <ValueField key={v.key} label={v.text}>
                                                <span
                                                    key={v.key}
                                                    style={idx === this.state.adjustableValueIdx ? style.highlighted : {}}>
                            {this.state.values[v.key]}
                                                </span>
                        </ValueField>
                    )
                })}
            </div>
        )
    }
};

const style = {
    highlighted: {
        backgroundColor: 'black',
        color: 'white'
    }
};

