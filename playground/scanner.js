const dgram = require('dgram');
const crypto = require('crypto');

class DeviceDiscovery {

    constructor(){
    // thx to tuya-convert. That's the passphrase to decrypt
    // the udp broadcats
        this.key = Buffer.from('yGAdlopoPVldABfn', 'utf-8');
        this.hash = crypto.createHash('md5').update(this.key).digest();

        this.server = undefined;
    }

    find(){
        this.server = dgram.createSocket('udp4');
        this.server.on('error', (err) => {
            console.log(`server error:\n${err.stack}`);
            if(this.server) this.server.close();
        });


        this.server.on('message', (msg, _rinfo) => {
            this.decrypt(msg.slice(20,-8));
        });


        this.server.on('listening', () => {
            if (!this.server) return;
            const address = this.server.address();
            console.log(`server listening ${address.address}:${address.port}`);
        });


        this.server.bind(6667);

        setTimeout(this.close, 10000, this.server);
    }

    close(server){
        console.log('closing server');
        server.close();
    }

    decrypt(data){
        const format = 'buffer';
        let result;

        const decipher = crypto.createDecipheriv('aes-128-ecb', this.hash, '');
        // @ts-ignore
        result = decipher.update(data, format, 'utf8');
        // @ts-ignore
        result += decipher.final('utf8');
        console.log(JSON.parse(result));

    }


}


const scanner = new DeviceDiscovery();
scanner.find();