const values = require('autopilot/values');
const ValueField = require('./ValueField');
const Color = require('./Color');
const utils = require('autopilot/utils');

module.exports = class ValuesBox extends React.Component {

    componentWillMount() {
        values.voltage || values.set({voltage: 1023});
        const self = this;

        (function resetMinHz() {
            self.setState({minHz: 999999});
            setTimeout(resetMinHz, 5000);
        }());

        this.setState({values: values.getAll()});
        values.onChangeValues(['yawSpeed', 'roll', 'pitch', 'hz', 'ruderState', 'prevBase', 'compassDelay', 'voltage'], () => {
            this.setState({
                values: values.getAll(),
                minHz: Math.min(values.hz, this.state.minHz),
                maxDly: isNaN(this.state.maxDly) ? 0 : Math.max(values.compassDelay, this.state.maxDly),
            });
        });
    }

    convertToVolts(num) {
        return utils.fixed((num * .0049)*(1000+220)/220);
    }

    render() {
        const values = this.state.values;
        return (
            <div>
                <ValueField label="Yaw"><Color>{values.yawSpeed}</Color></ValueField>
                <ValueField label="Roll"><Color>{values.roll}</Color></ValueField>
                <ValueField label="Pitch"><Color>{values.pitch}</Color> </ValueField>
                <ValueField label="HZ">{values.hz}</ValueField>
                <ValueField label="Min HZ">{this.state.minHz}</ValueField>
                <ValueField label="R State">{values.rudderState}</ValueField>
                <ValueField label="Base">{values.prevBase}</ValueField>
                <ValueField label="Tach">{values.prevTach}</ValueField>
                <ValueField label="Speed">{values.prevSpeed}</ValueField>
                <ValueField label="Cmps Dly">{values.compassDelay}</ValueField>
                <ValueField label="Max Dly">{this.state.maxDly}</ValueField>
                <ValueField label="Voltage">{this.convertToVolts(values.volts)} ({this.convertToVolts(values.minVolts)}-{this.convertToVolts(values.maxVolts)})</ValueField>
            </div>
        )
    }
};



