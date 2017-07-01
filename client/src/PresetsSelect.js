const presets = require('autopilot/presets');
const _ = require('lodash');
const DropdownButton = require('react-bootstrap/lib/DropdownButton');
const MenuItem = require('react-bootstrap/lib/MenuItem');
const values = require('autopilot/values');

module.exports = class PresetsBox extends React.Component {

    componentWillMount() {
        this.setState({preset: values.preset});
        values.onChangeValue('preset', () => {
            this.setState({preset: values.preset});
        });
    }

    updatePresets(preset) {
        ipcRenderer.send('preset', preset);
    }

    render() {
        return (
            <DropdownButton onSelect={this.updatePresets.bind(this)} title={_.get(presets[this.state.preset], 'text')}>
                {_.map(presets, (v, k) => <MenuItem key={k} eventKey={k}>{v.text}</MenuItem>)}
            </DropdownButton>
        )
    }
};