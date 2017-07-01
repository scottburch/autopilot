module.exports = {
    fixed: (n, places = 1) => parseFloat(parseFloat(n, 10).toFixed(places)),

    getDirectionalDiff(angle1, angle2) {
        var diff = angle2 - angle1;
        if (diff < -180) diff += 360;
        if (diff > 180) diff -= 360;
        return diff;
    }
};