const TuyAPI = require('tuyapi');

const DPSMapping = {
    '1': 'power',
    '2': 'temperature_set',
    '3': 'temperature',
    '6': 'settings.childlock',
    '102': 'heating',
    '109': 'settings.compensation',
    '114': 'settings.desired_temp_max',
    '115': 'settings.desired_temp_min'
};

const dpsFactor = {
    '2': 10,
    '3': 10,
    '109': 10
};

const stateDefinitions = {
    connected: {
        name: 'connected',
        type: 'boolean',
        role: 'indicator.reachable',
        read: true,
        write: false
    },
    power: {
        name: 'power',
        type: 'boolean',
        role: 'indicator',
        read: true,
        write: true
    },
    temperature_set: {
        name: 'temperature_set',
        type: 'number',
        role: 'value',
        read: true,
        write: true
    },
    temperature: {
        name: 'temperature',
        type: 'number',
        role: 'value',
        read: true,
        write: false
    },
    heating: {
        name: 'heating',
        type: 'boolean',
        role: 'indicator',
        read: true,
        write: false
    },
    info: {
        name: 'info',
        type: 'string',
        role: 'value',
        read: true,
        write: false,
        def: ''
    },
    'settings.childlock': {
        name: 'child_lock',
        type: 'boolean',
        role: 'indicator',
        read: true,
        write: true
    },
    'settings.compensation': {
        name: 'temp_compensation',
        type: 'number',
        role: 'value',
        read: true,
        write: true
    },
    'settings.desired_temp_min': {
        name: 'desired_temp_min',
        type: 'number',
        role: 'value',
        read: true,
        write: true
    },
    'settings.desired_temp_max': {
        name: 'desired_temp_max',
        type: 'number',
        role: 'value',
        read: true,
        write: true
    },
};


class Device{
    constructor(adapter, params){
        // initialize device variables
        this.adapter = adapter;
        const { id, key, version, name, timeout } = params;
        this.id = id;
        this.key = key;
        this.version = version;
        this.name = name;
        this.reconnectTimeout = timeout;
        this.timeout = undefined;
        this.tryReconnect = true;
        this.initStates();
        this.device = this.createDevice();
        this.find();
    }

    async find(){
        this.adapter.log.info(`Trying to find device ${this.id}`);
        this.device.find().then(this.handleConnect.bind(this)).catch(this.handleConnectionError.bind(this));
    }

    async disconnect(){
        // this function is called when the instance unloads
        // need to make sure, that reconnection is prohibited
        this.tryReconnect = false;
        if (this.timeout) clearTimeout(this.timeout);
        this.device.disconnect();
    }

    async reconnect(){
        this.adapter.log.info(`Trying to reconnect device ${this.id}`);
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
        if (this.tryReconnect) this.find();
    }

    createDevice(){
        const device = new TuyAPI({
            id: this.id,
            key: this.key,
            version: this.version
        });

        device.on('connected', this.handleConnected.bind(this));
        device.on('disconnected', this.handleDisconnected.bind(this));
        device.on('dp-refresh', this.handleDataUpdate.bind(this));
        device.on('data', this.handleDataUpdate.bind(this));

        return device;
    }

    async initStates(){
        this.adapter.log.debug('init ' + this.id);
        this.adapter.setObject(this.id, {
            type: 'channel',
            common: {
                'name': this.name
            },
            native: {}
        });

        const states = ['connected', 'info'].concat(Object.values(DPSMapping));
        states.forEach(state => {
            this.adapter.setObjectNotExists(this.stateName(state), {
                type: 'state',
                common: stateDefinitions[state],
                native: {}
            });
        });
        this.adapter.setStateAsync(this.stateName('name'), { val: this.name, ack: true } );
    }

    handleDataUpdate(data){
        this.adapter.log.debug(`Data received: ${JSON.stringify(data)}`);
        for( const key in data['dps']){
            this.updateState(key, data['dps'][key]);
        }
    }

    updateState(key, value){
        const state = DPSMapping[key];
        const setValue = (key in dpsFactor) ? value / dpsFactor[key] : value;
        //this.adapter.log.debug(state);
        if(state){
            this.adapter.setStateAsync(this.stateName(state), { val: setValue , ack:true});
        }
    }

    handleDisconnected(){
        this.adapter.log.warn(`Disconnected from device: ${this.id} (${this.name})`);
        this.adapter.setStateAsync(this.stateName('connected'), {val: false, ack:true});
        if (!this.tryReconnect) return;
        if (!this.timeout) this.timeout = setTimeout(this.reconnect.bind(this), this.reconnectTimeout * 1000);
    }

    handleConnected(){
        this.adapter.log.debug(`Connected to device: ${this.id} (${this.name})`);
        this.adapter.setState(this.stateName('connected'), {val: true, ack: true});
        this.adapter.connectionStatus(true);
    }

    handleConnect(){
        this.device.connect();
        this.adapter.setStateAsync(['devices',this.id, 'info'].join('.'), { val: '', ack: true});
    }

    handleConnectionError(err){
        this.adapter.log.error(`Connection error for device ${this.id}: ${err.message}`);
        this.adapter.setStateAsync(this.stateName('info'), { val: err.message, ack:true});
        this.adapter.setStateAsync(this.stateName('connected'), { val: false, ack: true});
        // try to reconnect in defined timeout
        if (!this.timeout) this.timeout = setTimeout(this.reconnect.bind(this), this.reconnectTimeout * 1000);

    }

    async setState(statename, value){
        const dps = Object.keys(DPSMapping).find(key => DPSMapping[key] === statename);
        if(!dps) return;
        const setValue = ( dps in dpsFactor) ? value * dpsFactor[dps] : value;
        this.device.set({  dps: dps, set: setValue});
    }

    stateName(attr){ return [this.id, attr].join('.'); }

}

module.exports = Device;
