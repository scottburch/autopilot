var listeners = {};
var _ = require('lodash');
var anyValueListeners = [];

var values = module.exports = {
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
        var callbacks = listeners[prop] || [];
        listeners[prop] = _.uniq(callbacks.concat(cb));
    },

    onChangeAnyValue: cb => {
        anyValueListeners = _.uniq(anyValueListeners.concat([cb]));
    },

    offChangeAnyValue: cb => {
        anyValueListeners = _.pull(anyValueListeners, cb);
    },

    onChangeValues: (props, cb) => {
        _.each(props, prop => values.onChangeValue(prop, cb));
    },

    now: () => new Date().getTime(),

    reset: () => {
        listeners = {};
        _.each(values, (value, prop) => _.isFunction(value) || delete values[prop]);
    }
};