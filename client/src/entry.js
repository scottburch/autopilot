global.React = require('react');
const ReactDom = require('react-dom');
const App = require('./App');
const values = require('autopilot/values');
const keycode = require('keycode');

require('bootstrap/dist/css/bootstrap.css');

ReactDom.render(<App />, document.querySelector('#app'));

electron.ipcRenderer.on('values-updated', (event, valuesJson) => {
    let updatedValues = JSON.parse(valuesJson);
    updatedValues = Object.keys(updatedValues).reduce((memo, k) => {
        memo[k] = updatedValues[k] === '%undefined%' ? undefined : updatedValues[k];
        return memo;
    }, {});
    values.set(updatedValues);
});
