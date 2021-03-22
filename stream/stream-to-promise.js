var fs = require('fs');
var crypto = require('crypto');

var fd = fs.createReadStream('../files/original.txt');
var hash = crypto.createHash('sha1');

fd.on('data', (d) => hash.update(d));


///////////////////////////////////////////////////////////////////
// GENERIC VERSION THAT WORKS EVERYWHERE
///////////////////////////////////////////////////////////////////
const streamToPromise = stream => {
    return new Promise((resolve, reject) => {
        stream.on('end', () => resolve())
        stream.on('error', reject);
    })
}

streamToPromise(fd).then(res => {
    const digestedHash = hash.digest('hex');
    console.log('streamToPromise', digestedHash);
})

///////////////////////////////////////////////////////////////////
// GENERAL IDEA BUT NOT REUSABLE
///////////////////////////////////////////////////////////////////
// var streamToPromiseThatResolvesOnEnd = new Promise(function(resolve, reject) {
//     fd.on('end', () => resolve(hash.digest('hex')));
//     fd.on('error', reject);
// });

// streamToPromiseThatResolvesOnEnd.then(res => { console.log('sha1sum', res) });