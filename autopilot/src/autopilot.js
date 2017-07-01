"use strict";
var PID = require('node-pid-controller');
const presets = require('./presets');

var values = require('./values');
var utils = require('./utils');
var pidController;
var kalmanFilter;

const KalmanFilter = require('kalmanjs').default;

values.set({
    heading: 180,
    rudder: 0,
    rudderState: undefined
});


values.onChangeValue('course', () => {
    if(values.course === undefined) {
        pidController = undefined;
        values.set({rudder: 0});
    }
    values.set({error: 0});
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
        lastCalcTime = lastCalcTime || values.now();
        values.set({yawSpeed: (values.error - lastError) * (1000 / (values.now() - lastCalcTime))});
        lastError = values.error;
        lastCalcTime = values.now();
    }
}());

function calcCourseError() {
    kalmanFilter = kalmanFilter || initKalmanFilter();
    var error = values.course === undefined ? undefined : utils.fixed(utils.getDirectionalDiff(values.course, values.heading));
    values.set({
        rawError: error,
        error: kalmanFilter.filter(error)
    });
}

values.onChangeValues(['kP', 'kI', 'kD'], () => {
    let pid = pidController;
    if(pid) {
        pid.k_p = values.kP;
        pid.k_i = values.kI;
        pid.k_d = values.kD;
    }
});

values.onChangeValues(['kfR', 'kfQ'], initKalmanFilter);

function initKalmanFilter() {
    return kalmanFilter = new KalmanFilter({R: values.kfR, Q: values.kfQ});
}


function createPIDController() {
    pidController = new PID({
        k_p: values.kP,
        k_i: values.kI,
        k_d: values.kD
    });
    pidController.setTarget(0);
    pidController.last = 0;
}

function calcRudder() {
    values.course === undefined ? noRudder() : handleError();

    function handleError() {
        pidController || createPIDController();
        let result = pidController.update(values.error);
        let newRudder = utils.fixed((result - pidController.last) * values.rudderMult, 0);
        values.set({rudder: newRudder < 0 ? Math.max(-1023, newRudder) : Math.min(1023, newRudder)});
        pidController.last = result;
    }

    function noRudder() {
        values.set({rudder: 0});
    }
}

