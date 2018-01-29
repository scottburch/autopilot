const {observable, autorun} = require('mobx');

const data = observable({
    pitch: 0
});

module.exports = {
    data: data,
    onChangeValues: (keys, fn) => autorun(() => fn(copyValues(keys, data))),
    onChangeValue: (key, fn) => autorun(() => fn(data[key]))
};


setInterval(() => data.pitch = data.pitch + 10 ,2000);


const copyValues = (keys, obj) => keys.reduce((memo, key) => {
        memo[key] = obj[key];
    return memo;
    }, {}
);
