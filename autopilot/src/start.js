const values = require('./values');
const presets = require('./presets');
const {ipcMain} = require('electron');
values.set({preset: 'motor-light'});

ipcMain.on('update-values', (event, changedValues) => {
    values.set(changedValues);
});

ipcMain.on('preset', (ev, presetName) => {
   values.set({preset: presetName});
});


const setPresetValues = () => {
    values.set(presets[values.preset].values);
};

setPresetValues();
values.onChangeValue('preset', setPresetValues);

module.exports = (mainWindow) => {
    sendValues(mainWindow, values.getAll());

    values.onChangeAnyValue(changedValues => {
        sendValues(mainWindow, changedValues);
    });


//    require('./logger');
    process.argv.indexOf('--sim') !== -1 && values.set({simulator: true});

    require('./serial');
    require('./autopilot');

    // Key listeners
    listenForKey('c', () => values.set({course: values.course === undefined ? values.heading : undefined}));

    listenForKey('ArrowRight', () => values.course !== undefined && values.set({course: checkCourseBounds(++values.course)}));
    listenForKey('ArrowLeft', () => values.course !== undefined && values.set({course: checkCourseBounds(--values.course)}));
    listenForKey('alt-ArrowRight', () => values.course !== undefined && values.set({course: checkCourseBounds(values.course += 10)}));
    listenForKey('alt-ArrowLeft', () => values.course !== undefined && values.set({course: checkCourseBounds(values.course -= 10)}));
};

const checkCourseBounds = c => c < 0 ? 360 + c : c % 360;

const sendValues = (mainWindow, values) => {
    const jsonString = JSON.stringify(values, (k, v) => v === undefined ? '%undefined%' : v);
    mainWindow.webContents.send('values-updated', jsonString);
};

const listenForKey = (keyString, callback) => {
    mainWindow.webContents.on('before-input-event', (ev, input) => {
        if (input.type === 'keyUp') {
            let parts = [];
            input.control && parts.push('ctrl');
            input.alt && parts.push('alt');
            input.shift && parts.push('shift');
            parts.push(input.key);
            keyString === parts.join('-') && callback(ev, input);
        }
    });
};


