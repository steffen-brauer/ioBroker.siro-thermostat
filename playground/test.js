const TuyAPI = require('tuyapi');

/* gosund
const device = new TuyAPI({
  id: 'bf12d4834a5bd702b6nah4',
  key: 'd66c500e206da01c',
  ip: '192.168.178.106',
  version: '3.3'
});
*/

// @ts-ignore
const device = new TuyAPI({
    id: 'bfd3bb77ddac9242d4zfnj',
    key: 'fc3523cab0822886',
    //ip: '192.168.178.114',
    version: '3.3'
});



// Find device on network
device.find().then(() => {
    // Connect to device
    device.connect();
});

// Add event listeners
device.on('connected', () => {
    console.log('Connected to device!');
});

device.on('disconnected', () => {
    console.log('Disconnected from device.');
});

device.on('error', error => {
    console.log('Error!', error);
});

device.on('dp-refresh', data => {
    console.log('DP_REFRESH data from device: ', data);
});


device.on('data', data => {
    console.log('DATA from device: ', data);

});


// Solltemperatur

setTimeout(() => {
    const options = {
        schema: false,
        dps: 2,
        set: 151
    };
    device.set(options);
}, 5000);

/* Kindersicherung an
setTimeout(() => {
options = {
    schema: false,
    dps: 6,
    set: true
}
device.set(options)
}, 5000)
*/

/* ssetInterval(async () => {
    options = {
        schema: false,
        dps: 1
    }
    device.get(options).then(
        state => console.log(`Current status: ${state}`)

    );

}, 1000) */
