module.exports = {
    "motor-light": {
        text: 'Motor - light conditions',
        values: {
            rudderTime: 200,
            rudderWait: 200,
            smoothing: 0,
            kP: 0.25,
            kI: 0.01,
            kD: 0.01,

            kfR: 1,
            kfQ: 3,
            rudderMult: 65
        }
    },
    'sail-light': {
        text: 'Sailing - light conditions',
        values: {
            rudderTime: 200,
            rudderWait: 200,
            smoothing: 0,
            kP: 0.6,
            kI: 0.06,
            kD: 0.02,

            kfR: 1,
            kfQ: 1,
            rudderMult: 65
        }
    },
    'sail-light-med-downhill': {
        text: 'Sailing - light/med downhill',
        values: {
            rudderTime: 200,
            rudderWait: 200,
            smoothing: 0,
            kP: 1,
            kI: 0.04,
            kD: 0.02,

            kfR: 1,
            kfQ: 3,
            rudderMult: 100
        }
    },
    'sail-med-heavy-downhill': {
        text: 'Sailing - med/heavy downhill',
        values: {
            rudderTime: 300,
            rudderWait: 1300,
            rudderMult: 100,
            smoothing: 10,
            kP: .6,
            kI: .06,
            kD: .02,
            kfR: 1,
            kfQ: 1 
        }
    }
};


