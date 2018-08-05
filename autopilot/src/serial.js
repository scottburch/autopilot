var values = require('./values');
var utils = require('./utils');
const {data} = require('./data');

var _ = require('lodash');

var port;
var SerialPort = require('serialport');


values.simulator || start();

function start() {
	var dev = '/dev/tty.usbserial-A4007c47'
//    var dev = '/dev/cu.usbmodem1421'
//    var dev = '/dev/ttyACM0';
//    var dev = '/dev/ttyUSB0';

    const parser = new SerialPort.parsers.Readline();
    port = new SerialPort(dev, {
        baudRate: 115200,
    });
	port.pipe(parser);


    port.on("open", function () {
        console.log('port open');

        parser.on('data', function (string) {
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



    const pong = data => {
        const [roll, pitch, yaw, time] = data.split(',');
        port.write(`P:${time}!`);
    };

    function compass(data) {
        const [roll, pitch, yaw] = data.split(',');
        const heading = parseFloat(yaw, 10) + 180;
        values.set({heading: utils.fixed(heading, 0)});
        values.set({roll: roll});
        values.set({pitch: pitch});
    }

}
