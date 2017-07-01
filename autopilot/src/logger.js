const values = require('./values');
const fields = new Set();
const fs = require('fs');
const _ = require('lodash');

const log = fs.createWriteStream('/home/scott/temp/autopilot.log.csv');
const exceptions = ['adjustableValueIdx', 'log'];

var lastValues;

values.onChangeAnyValue(() => {
    const newValues = getValues();
    values.course && !_.isEqual(lastValues, newValues) && setTimeout(() => log.write(newValues));
    lastValues = newValues;
});

function getValues() {
    const vls = values.getAll();
    return Object.keys(vls).reduce((memo, key) =>  {
        exceptions.includes(key) || (memo[getIdx(key)] = `"${vls[key]}"`);
        return memo;
    }, []).join(',') + '\n';
}

function getIdx(key) {
    const idx = [...fields.values()].indexOf(key);
    if(idx === -1) {
        fields.add(key);
        fs.writeFile('/home/scott/temp/autopilot.hdrs.csv', [...fields.values()].join(',') + '\n');
        return getIdx(key);
    }
    return idx;
}
