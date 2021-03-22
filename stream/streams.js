const fs = require('fs')
const zlib = require('zlib');
const miss = require('mississippi');
const split = require('binary-split')
const axios = require('axios');

/*
  Reading Modes: flowing and paused
    - flowing: data automatically read and given to application
    - paused: stream.read() must be called to read chunks

  All streams begin in paused mode but can be switched to flowing by either:
    - adding 'data' event handler
    - call stream.resume()
    - call stream.pipe() to send data to a Writable

  Switch back to paused mode by either:
    - call stream.pause()
    - removing all pipe destinations with stream.unpipe()

  Key concept: a Readable will not generate data until a way for either consuming or ignoring that data is provided, this happens when readable.readableFlowing = null as apposed to true(flowing)/false(paused).  Thus even if a readable stream is paused, the generation of data is still happening in the writer (data is accumulating in the stream's buffer).
*/

///////////////////////////////////////////////////////////////////////////////
function copyFile() {
    // use miss.pipe instead of readStream.pipe(writeStream)
    const readStream = fs.createReadStream('./original.txt')
    const writeStream = fs.createWriteStream('./copy.txt')
    miss.pipe(readStream, writeStream, function (err) {
        if (err) return console.error('Copy error!', err)
        console.log('Copied successfully')
    })
}

// copyFile();


///////////////////////////////////////////////////////////////////////////////

function pipeSingleReadableToMultipleWritableStreams() {
    const r = fs.createReadStream('original.txt');
    const z = zlib.createGzip(); // a write stream (not a transform)
    const w = fs.createWriteStream('file.txt.gz');
    r.pipe(z).pipe(w);
}

// pipeSingleReadableToMultipleWritableStreams();


///////////////////////////////////////////////////////////////////////////////
function toUpperCase(chunk) {
    return chunk.toString().toUpperCase();
}

function onFlush() {
    return '\nTHIS APPENDED TO END OF FILE IF DESIRED, OTHERWISE REMOVE THIS CB';
}

function genericTransformer(fn) {
    const readStream = fs.createReadStream('./original.txt')
    const writeStream = fs.createWriteStream('./copy.txt')
    const uppercaseTransform = miss.through(
        (chunk, enc, cb) => {
            let error;
            let result;
            try {
                result = fn(chunk);
            } catch (e) {
                error = e;
            }
            cb(error, result);
        },
        (cb) => {
            cb(null, onFlush())
        }
    );
    miss.pipe(readStream, uppercaseTransform, writeStream, err => {
        console.log('file uppercased');
    });
}

// genericTransformer(toUpperCase, onFlush);


///////////////////////////////////////////////////////////////////////////////
const makeReadableStreamFromString = string => {
    return miss.from((size, next) => {
        if (string.length === 0) {
            return next(null, null)
        }
        const chunk = string.slice(0, size);
        string = string.slice(size);
        next(null, chunk);
    })
}
// makeReadableStreamFromString('my dog ate my homework yo').pipe(process.stdout);

///////////////////////////////////////////////////////////////////////////////
const makeReadableStreamFromArray = arr => {
    return miss.from((size, next) => {
        // size defaults to 16384 on my machine
        size = 100; // if set too low on large arrays, buffer will run out of memory
        console.log('++++++++++++++++++CHUNK BASED ON THIS SIZE++++++++++++++++++++++: ', size);
        if (arr.length === 0) {
            return next(null, null)
        }
        const chunk = arr.slice(0, size);
        arr = arr.slice(size);
        next(null, chunk.toString());
    })
}
const largeArr = new Array(100000).fill('_').map((n, i) => i);
// makeReadableStreamFromArray(largeArr).pipe(process.stdout);


///////////////////////////////////////////////////////////////////////////////

// export default function asyncConsumer(asyncFn, { objectMode = true, ...opts } = {}) {
//     return miss.to({ objectMode, ...opts }, (records, encoding, cb) => {
//         castPromise(() => asyncFn(records)).then(() => cb(), cb);
//     });
// }

const makeWritableStreamFromString = wordsToWrite => {
    const write = (data, enc, cb) => {
        data = data.toString().toUpperCase();  // can optionally transform data if desired
        console.log(data);
        cb()
    }
    const flush = cb => {
        // called before finish/end and allows for cleanup
        console.log('taking a second to clean up listeners, etc.')
        setTimeout(cb, 1000);
    }
    let ws = miss.to(write, flush);
    ws.on('finish', () => { console.log('finished')});
    ws.write(wordsToWrite[0])
    ws.write(wordsToWrite[1]);
    ws.end();
}
// makeWritableStreamFromString(['my very first stream sentence', 'and another one on a new line'])


///////////////////////////////////////////////////////////////////////////////
const createParallelStream = (concurrency=5, urls) => {
    const fromArray = arr => {
        let i = 0;
        return miss.from((size, next) => {
            const nextElement = i < arr.length ? arr[i++] : null;
            next(null, nextElement);
        });
    }

    const getResponse = async (url, cb) => {
        url = url.toString();
        const res = await axios.get(url);
        console.log(url, ' : ', res.status);
        cb(null, { url, date: new Date(), status: res.status });
    }

    miss.pipe(
        // fs.createReadStream('./urls.txt'), // can also do this instead of fromArray()
        // split(),
        fromArray(urls),
        miss.parallel(concurrency, getResponse),
    )
}

const urls = ['https://google.com', 'https://yahoo.com', 'https://microsoft.com', 'https://facebook.com', 'https://linkedin.com', 'https://instagram.com'];

// createParallelStream(2, urls);


///////////////////////////////////////////////////////////////////////////////
const simpleReadable = () => {
    const { Readable } = require('stream');
    const rs = new Readable
    rs.push('beep ');
    rs.push('boop\n');
    rs.push(null); // null signals to close stream
    rs.pipe(process.stdout);
}

// simpleReadable();


///////////////////////////////////////////////////////////////////////////////
const simpleWritable = () => {
    const { Writable } = require('stream');
    const ws = new Writable({
        write: (chunk, enc, next) => {
            console.log(chunk.toString());
            next();
        }
    });
    // can add method here or above
    // ws._write = (chunk, enc, next) => {
    //     console.log(chunk.toString().toUpperCase());
    //     next();
    // }
    process.stdin.pipe(ws);
}

// run program with (echo beep; sleep 1; echo boop) | node streams.js
// simpleWritable()


const writeToAWritableStream = () => {
    process.stdout.write('writing to writable stream');
}

// writeToAWritableStream();


///////////////////////////////////////////////////////////////////////////////
const readTransformWrite = () => {
    const { Readable, Writable, Transform } = require('stream');

    const clock = () => {
        const rs = new Readable({
            objectMode: true,
            read(size) {}
        });
        setInterval(() => {
            rs.push({ time: new Date() })
        }, 1000)
        return rs;
    }

    const transformer = () => {
        let count = 0;
        return new Transform({
            objectMode: true,
            transform: (data, _, done) => {
                done(null, { ...data, index: count++ })
            }
        })
    }

    const renderer = () => {
        return new Writable({
            objectMode: true,
            write: (data, _, done) => {
                console.log(data);
                done();
            }
        })
    }

    clock()
        .pipe(transformer())
        .pipe(renderer())
}

// readTransformWrite();


///////////////////////////////////////////////////////////////////////////////
function drainNeededWhenWriteOneMillionTimes() {
    const callback = () => { console.log('finished million writes')}
    const writer = fs.createWriteStream('./million.txt');
    const encoding = 'utf8';
    let i = 1000000;
    write();

    function write() {
        let bufferNotFull = true;
        do {
            i--;
            if (i === 0) { // Last time!
                writer.write(`${i}\n`, encoding, callback);
            } else {
                // See if we should continue, or wait.
                // Don't pass the callback, because we're not done yet.
                bufferNotFull = writer.write(`${i}\n`, encoding);
            }
        } while (i > 0 && bufferNotFull);
        if (i > 0) {
            console.log('draining b/c buffer full');
            // Had to stop early!  Write some more once it drains.
            writer.once('drain', write);
        }
    }
}

// drainNeededWhenWriteOneMillionTimes();

///////////////////////////////////////////////////////////////////////////////
const createStreamPipeline = () => {
    const { pipeline } = require('stream');
    pipeline(
        fs.createReadStream('./million.txt'),
        zlib.createGzip(),
        fs.createWriteStream('million-archive.text.gz'),
        err => {
            if (err) console.log('pipeline failed', err)
            else console.log('pipeline success')
        }
    )
}

// createStreamPipeline();

///////////////////////////////////////////////////////////////////////////////
const extendReadableClass = () => {
    const { Readable } = require('stream');

    class Counter extends Readable {
        constructor(options) {
            super(options);
            this._max = 1000000;
            this._index = 1;
            this.startTime = Date.now();
        }

        _read() {
            const i = this._index++;
            if (i > this._max) {
                this.push(null);
                const timeTook = (Date.now() - this.startTime) / 1000;
                console.log(`took ${timeTook} to process`);
            } else {
                const str = String(i) + '\n';
                const buf = Buffer.from(str, 'ascii');
                this.push(buf);
            }
        }
    }

    const counter = new Counter();
    counter.pipe(process.stdout);
}

// extendReadableClass();


///////////////////////////////////////////////////////////////////////////////
const extendWritableClass = () => {
    const { Writable } = require('stream');

    class CustomWritable extends Writable {
        constructor(options) {
            super(options);
        }

        _write(chunk, encoding, next) {
            const s = chunk.toString().toUpperCase();
            console.log(s);
            next(); // flushes buffer and emits 'drain' event
        }

        _writev(chunks, next) {
            console.log('using writev', chunks)
            next();
        }
    }

    const customWritable = new CustomWritable();
    process.stdin.pipe(customWritable);
}

// extendWritableClass(); // (echo custom writable; echo via command line ) | node streams.js


///////////////////////////////////////////////////////////////////////////////

















