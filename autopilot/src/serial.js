var values = require('./values');
var utils = require('./utils');
var Smoother = require('./Smoother');

var _ = require('lodash');

var port;
var SerialPort = require('serialport');

values.set({
    smoothing: 100
});

values.simulator || start();

function start() {
	var dev = '/dev/tty.usbserial-A4007c47'
//    var dev = '/dev/cu.usbmodem1421'
//    var dev = '/dev/ttyACM0';
//    var dev = '/dev/ttyUSB0';
    port = new SerialPort(dev, {
        baudrate: 115200,
        parser: SerialPort.parsers.readline("\n")
    });


    port.on("open", function () {
        console.log('port open');

        port.on('data', function (string) {

            string = _.trim(string);
            if (/[A-Z0-9]+\:/.test(string)) {
                var parts = string.split(':');
                var prefix = parts[0];
                var data = parts[1];
                switch (prefix) {
                    case 'AHRS':
                        compass(data);
                        pong(data);
                        break;
                    case 'D':
                        values.set({compassDelay: data});
                        break;
                    case 'HZ':
                        values.set({hz: data});
                        break;
                    case 'B' :
                        values.set({prevBase: data});
                        break;
                    case 'T':
                        values.set({prevTach: data});
                        break;
                    case 'S':
                        values.set({prevSpeed: data});
                        break;
                    case 'V':
                        const [volts, min, max] = data.split(',');
                        values.set({volts: volts});
                        values.set({minVolts: min});
                        values.set({maxVolts: max});
                        break;
                    case 'L':
                        console.log('Log:', data);
                        break;
                    default:
                        console.log('UNKNOWN:', string);
                }
            } else {
                console.log('DATA:', string);
            }
        });


        values.onChangeValue('rudder', () => {
            port.write(`R:${values.rudder}!`);
        });
    });


    const headingSmoother = new Smoother(values.smoothing);
    values.onChangeValue('smoothing', () => {
        headingSmoother.smoothing = values.smoothing;
    });

    const pong = data => {
        const [roll, pitch, yaw, time] = data.split(',');
        port.write(`P:${time}!`);
    };

    function compass(data) {
        const [roll, pitch, yaw] = data.split(',');
        const heading = parseFloat(yaw, 10) + 180;
        values.set({rawHeading: heading});
        values.set({heading: utils.fixed(headingSmoother.smooth(heading), 0)});
        values.set({roll: roll});
        values.set({pitch: pitch});
    }

}
