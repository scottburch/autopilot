const listeners = {};
const _ = require('lodash');
let anyValueListeners = [];

const values = module.exports = {
    set: obj => {
        _.each(obj, (value, prop) => {
            if(values[prop] !== value) {
                values[prop] = value;
                _.each(listeners[prop], cb => cb(value));
            }
        });
        _.each(anyValueListeners, cb => cb(obj));
    },

    getAll: () => {
        return _.reduce(values, (memo, value, prop) => {
            _.isFunction(value) || (memo[prop] = value);
            return memo;
        },{});
    },

    onChangeValue: (prop, cb) => {
        const callbacks = listeners[prop] || [];
        listeners[prop] = _.uniq(callbacks.concat(cb));
    },

    onChangeAnyValue: cb => {
        anyValueListeners.includes(cb) || anyValueListeners.push(cb);
    },

    onChangeValues: (props, cb) => {
        _.each(props, prop => values.onChangeValue(prop, cb));
    }
};