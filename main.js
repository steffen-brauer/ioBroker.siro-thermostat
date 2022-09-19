'use strict';

/*
 * Created with @iobroker/create-adapter v2.2.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
const Device = require('./lib/thermostats')


var devices = [
    { id: 'bfd3bb77ddac9242d4zfnj', key: 'fc3523cab0822886', version: '3.3'} 
]

class SiroThermostat extends utils.Adapter {

    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: 'siro-thermostat',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));

        this.deviceList = {}
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // Initialize your adapter here

        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        
        let devices

        
        try{
            if(!this.config.devices) throw 'Initial instance';
            devices = JSON.parse(this.config.devices )
            if (devices.length == 0) throw 'No devices configured';

        }catch(err){
            devices = [] // create empty list.. there is no configuration yet
            this.log.info('Looks like no devices are configured.. check your instance configuration')
        }
        devices.forEach(d => {
            if (!d.id) return 
            this.deviceList[d.id] = new Device(this, d)
        })
        await this.subscribeStatesAsync('*');
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            this.deviceList.forEach(device => {
                device.device.disconnect()
            })

            callback();
        } catch (e) {
            callback();
        }
    }

    /**
     * Is called if a subscribed state changes
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    onStateChange(id, state) {
        if (state) {
            // The state was changed in ioBroker
            if(!state.ack){
                this.log.debug(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
                const parts = id.split('.')
                const deviceId = parts[3]
                const stateName = parts[4]
                // const dps = DPSMappingReverse[stateName]
                this.deviceList[deviceId].setState(stateName, state.val)
            }
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new SiroThermostat(options);
} else {
    // otherwise start the instance directly
    new SiroThermostat();
}