const { Readable } = require('stream');
const miss = require('mississippi');
const fs = require('fs');

class Mux extends Readable {
    constructor({ sources, ...streamOpts }) {
        super(streamOpts);
        this.sources = [...sources] || [];
        this.init = false;
        this.transform = miss.through({ objectMode: true },
            (data, enc, cb) => {
                cb(null, data);
            })
        this.onTransformData = this.onTransformData.bind(this);
        this.onSourceData = this.onSourceData.bind(this);
    }

    pauseSources() {
        this.sources.forEach(source => source.readable.pause());
    }

    onSourceData(source) {
        return (data, enc) => {
            console.log('*** data', data);
            if (!this.transform.write(data)) {
                console.log('*** no more source data');
                this.pauseSources();
            }
            // console.log('*** transform', this.transform);
        }
    }

    initStreams() {
        this.sources.forEach(source => {
            // console.log('** source', source);
            source.on('data', this.onSourceData(source));
        })
    }

    onTransformData(data) {
        // console.log('*** this', this);
        if (!this.push(data)) {
            console.log('*** no more transform data');
            this.transform.pause();
        }
    }

    _read() {
        if (!this.init) {
            this.initStreams();
            this.transform.on('data', this.onTransformData);
            ['end', 'close'].forEach(event =>
                this.transform.on(event, () => {
                    this.push(null);
                })
            );
            this.init = true;
        } else {
            this.transform.resume();
        }

    }
}

const makeReadableStreamFromString = (string, opts) => {
    return miss.from(opts, (size, next) => {
        if (string.length === 0) {
            return next(null, null)
        }
        const chunk = string.slice(0, size);
        string = string.slice(size);
        next(null, chunk);
    })
}
// // use createReadStream if want buffered stream b/c objectMode defaults to false
// const source1 = fs.createReadStream('./original.txt');
// const source2 = fs.createReadStream('./copy.txt');
const source1 = makeReadableStreamFromString('multiple streams', { objectMode: true });
const source2 = makeReadableStreamFromString(' multiplexing into one', { objectMode: true });
const fileMux = new Mux({
    sources: [source1, source2],
    streamOpts: { objectMode: true }
});
const write1 = fs.createWriteStream('./mux.txt');
fileMux.pipe(write1);