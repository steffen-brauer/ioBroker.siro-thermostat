const TuyAPI = require('tuyapi');

const DPSMapping = {
    '1': 'power',
    '2': 'temperature_set',
    '3': 'temperature',
    '102': 'heating'
};

const stateDefinitions = {
    connected: {
        name: 'connected',
        type: 'boolean',
        role: 'indicator.connected',
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
        write: false

    },
    name: {
        name: 'info',
        type: 'string',
        role: 'value',
        read: true,
        write: false

    }

};

class Device{
    constructor(adapter, params){
        this.adapter = adapter;
        const { id, key, version, name } = params;
        this.id = id;
        this.key = key;
        this.version = version;
        this.name = name;
        this.initStates();
        this.device = this.createDevice();
        this.device.find().then(this.handleFind.bind(this)).catch(this.handleError.bind(this));
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
        const states = ['connected', 'info', 'name'].concat(Object.values(DPSMapping));

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
        for( const key in data['dps']){
            this.updateState(key, data['dps'][key]);
        }
    }

    updateState(key, value){
        const state = DPSMapping[key];
        if(state){
            this.adapter.setStateAsync(this.stateName(state), { val: value, ack:true});
        }
    }

    handleDisconnected(){
        this.adapter.log.warn(`Disconnected from device: ${this.id} (${this.name})`);
        this.adapter.setStateAsync(this.stateName('connected'), {val: false, ack:true});
    }

    handleConnected(){
        this.adapter.log.debug(`Connected to device: ${this.id} (${this.name})`);
        this.adapter.setState(this.stateName('connected'), {val: true, ack: true});
    }

    handleFind(){
        this.device.connect();
        this.adapter.setStateAsync(['devices',this.id, 'info'].join('.'), { val: '', ack: true});
    }

    handleError(err){
        this.adapter.log.error(`Device ${this.id}: ${err.message}`);
        this.adapter.setStateAsync(this.stateName('info'), { val: err.message, ack:true});
        this.adapter.setStateAsync(this.stateName('connected'), { val: false, ack: true});
    }

    async setState(statename, value){
        const dps = Object.keys(DPSMapping).find(key => DPSMapping[key] === statename);
        this.device.set({  dps: dps, set: value});
    }

    stateName(attr){ return ['devices', this.id, attr].join('.'); }

}

module.exports = Device;


