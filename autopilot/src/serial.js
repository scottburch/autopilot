const values = require('./values');
const utils = require('./utils');

const _ = require('lodash');

const SerialPort = require('serialport');


values.simulator || start();

function start() {
	const dev = '/dev/tty.usbserial-A4007c47';
//    var dev = '/dev/cu.usbmodem1421'
//    var dev = '/dev/ttyACM0';
//    var dev = '/dev/ttyUSB0';

    const parser = new SerialPort.parsers.Readline();
    const port = new SerialPort(dev, {
        baudRate: 115200,
    });
	port.pipe(parser);


    port.on("open", function () {
        console.log('port open');

        parser.on('data', function (string) {
            string = _.trim(string);
            if (/[A-Z0-9]+\:/.test(string)) {
                const [prefix, data] = string.split(':');
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
        values.set({
            heading: utils.fixed(heading, 0),
            roll: roll,
            pitch: pitch
        });
    }

}
