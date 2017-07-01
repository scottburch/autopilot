const values = require('autopilot/values');
const ValueField = require('./ValueField');
const Color = require('./Color');

module.exports = class ValuesBox extends React.Component {
    componentWillMount() {
        this.setState({values: values.getAll()});
        values.onChangeValues(['course', 'heading', 'error', 'rudder'], changedValues => {
            this.setState({values: values.getAll()});
        });
    }

    render() {
        const values = this.state.values;
        return (
            <div>
                <ValueField label="Course">{values.course}</ValueField>
                <ValueField label="Heading">{values.heading} (<Color>{values.heading - values.rawHeading}</Color>)</ValueField>

                <ValueField label="Error"><Color>{values.error}</Color> (<Color>{values.error - values.rawError}</Color>)</ValueField>
                <ValueField label="Rudder"><Color>{values.course === undefined ? 'N/A' : values.rudder}</Color> </ValueField>
            </div>
        )
    }
};