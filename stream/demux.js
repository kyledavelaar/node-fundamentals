const { Writable, Readable } = require('stream');
const fs = require('fs');


/////////////////////////////////////////////////////////////////////
//  SENDING TO ALL DESTINATIONS
////////////////////////////////////////////////////////////////////

class Demux extends Writable {
    constructor({ destinations, opts }) {
        super(opts);
        this.destinations = [...destinations];
    }

    _write(_chunk, enc, cb) {
        this.destinations.forEach(dest => {
            dest.write(_chunk);
        })
    }
}

// const source1 = fs.createReadStream('./mux.txt');
// const destination1 = fs.createWriteStream('./demux1.txt');
// const destination2 = fs.createWriteStream('./demux2.txt');

// const demux = new Demux({
//     destinations: [destination1, destination2],
//     opts: { objectMode: true }
// });

// source1.pipe(demux);


/////////////////////////////////////////////////////////////////////
//  SENDING ONLY TO TARGET DESTINATION(S)
////////////////////////////////////////////////////////////////////

class Multicast extends Writable {
    constructor({ destinations, opts }) {
        super(opts);
        this.destinations = [...destinations]
    }

    _write(chunk, enc, cb) {
        const targetedDestinations = this.destinations.filter(d => {
            return d.name === chunk.destination;
        });
        targetedDestinations.forEach(d => {
            d.stream.write(chunk.message);
        })
    }
}

class targetedReadable extends Readable {
    constructor({ message, destination }) {
        super({ objectMode: true });
        this.message = message;
        this.destination = destination;
    }

    _read() {
        this.push({
            message: this.message,
            destination: this.destination
        });
    }
}

const multicastSource = new targetedReadable({
    message: 'I want this to go only to destination stream two',
    destination: 'two'
})
const destination1Stream = fs.createWriteStream('./multicast1.txt');
const destination2Stream = fs.createWriteStream('./multicast2.txt');

const multicast = new Multicast({
    destinations: [
        { name: 'one', stream: destination1Stream },
        { name: 'two', stream: destination2Stream }
    ],
    opts: { objectMode: true }
});

multicastSource.pipe(multicast);

