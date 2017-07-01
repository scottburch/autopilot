var values = require('./values');
var utils = require('./utils');

module.exports = class {
    constructor(smoothing) {
        this.smoothing = smoothing;
    }

    smooth(value) {
        this.smoothedSin !== undefined ? smoothThem.call(this, value) : init.call(this, value);
        this.lastUpdate = values.now();
        return this.radToDeg(Math.atan2(this.smoothedSin, this.smoothedCos));

        function init(value) {
            var r = this.degToRad(value);
            this.smoothedSin = Math.sin(r);
            this.smoothedCos = Math.cos(r);
        }

        function smoothThem(value) {
            // Smooth the sin and cos of the angle in radians.  To get degrees again, atan2 the smoothed sin/cos and convert from rads
            var r = this.degToRad(value);
            this.smoothedSin = smoothIt.call(this, this.smoothedSin, Math.sin(r));
            this.smoothedCos = smoothIt.call(this, this.smoothedCos, Math.cos(r));
        }

        function smoothIt(smoothed, value) {
            var elapsedTime = values.now() - this.lastUpdate;
            var smoothing = this.smoothing / elapsedTime;
            smoothing < 1 && (smoothing = 1);
            smoothed += (value - smoothed) / smoothing;
            return smoothed;
        }


    }
    degToRad(d) { return d * (Math.PI / 180)}
    radToDeg(r) {
        var d =  r * (180 / Math.PI);
        d < 0 && (d = 360 - Math.abs(d));
        return d;
    }

};

