const utils = require('autopilot/utils');

module.exports = ({children}) => {
    try {
        const value = utils.fixed(children, 3);
        let color = 'black';
        children > 0 && (color = 'green');
        children < 0 && (color = 'red');

        return <span style={{color: color}}>{value}</span>
    } catch(e) {
        return children;
    }
};