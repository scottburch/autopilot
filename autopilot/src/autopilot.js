"use strict";
const PID = require('node-pid-controller');

const values = require('./values');
const utils = require('./utils');
let pidController;

values.set({
    heading: 180,
    rudder: 0,
    rudderState: undefined
});


values.onChangeValue('course', () => {
    if (values.course === undefined) {
        pidController = undefined;
        values.set({rudder: 0});
    }

    // I think this will cause problems so I am removing
    //    values.set({error: 0});
});

const stateIdle = {
    name: 'IDLE',
    execute() {
//        calcYawSpeed();
        if (values.course) {
            calcCourseError();
            calcRudder();
            changeState(stateTurning);
        } else {
            setTimeout(stateIdle.execute, 50);
        }
    }
};

const stateTurning = {
    name: 'TURNING',
    execute() {
        setTimeout(() => changeState(stateWaiting), values.rudderTime);
    }
};

const stateWaiting = {
    name: 'WAITING',
    execute() {
        values.set({rudder: 0});
        setTimeout(() => changeState(stateIdle), values.rudderWait);
    }
};

setTimeout(() => changeState(stateIdle), 0);

function changeState(state) {
    values.set({rudderState: state.name});
    state.execute();
}

const calcYawSpeed = (function () {
    var lastError = 0;
    var lastCalcTime;

    return function () {
        lastCalcTime = lastCalcTime || utils.now();
        values.set({yawSpeed: (values.error - lastError) * (1000 / (utils.now() - lastCalcTime))});
        lastError = values.error;
        lastCalcTime = utils.now();
    }
}());

function calcCourseError() {
    values.set({
        error: values.course === undefined ? undefined : utils.fixed(utils.getDirectionalDiff(values.course, values.heading))
    });
}

values.onChangeValues(['kP', 'kI', 'kD'], () => pidController = undefined);

function createPIDController() {
    pidController = new PID({
        k_p: values.kP,
        k_i: values.kI,
        k_d: values.kD
    });
    pidController.setTarget(0);
}

const calcRudder = (function () {
    let last = 0;
    return () => {
        values.course === undefined ? noRudder() : handleError();

        function handleError() {
            pidController || createPIDController();
            let result = pidController.update(values.error);
            let newRudder = utils.fixed(result - last, 0);
            values.set({rudder: newRudder < 0 ? Math.max(-1023, newRudder) : Math.min(1023, newRudder)});
            last = result;
        }

        function noRudder() {
            last = 0;
            values.set({rudder: 0});
        }
    }
}());

