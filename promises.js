////////////////////////////////////
// WAIT
////////////////////////////////////
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function log() {
  await wait(1000);
  console.log('hi')
}

function log2() {
  wait(1000).then(res => {
    console.log('2')
  });
}

// log2();



///////////////////////////////////////////////////////
// Promise.all without using Promise.all
///////////////////////////////////////////////////////

function createPromise(name, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(name);
    }, delay)
  })
}

function iterativeAll(promises) {
  return new Promise(resolve => {
    let results = [];
    promises.forEach(async promise => {
      Promise.resolve(promise).then(res => {
        results.push(res);
        if (promises.length === results.length) {
          resolve(results);
        }
      })
    })
  })
}

function recursiveAll(promises) {
  if (promises.length === 0) {
    return Promise.resolve([]);
  }
  const [ first, ...rest ] = promises;
  return Promise.resolve(first).then(async firstResult => {
    return recursiveAll(rest).then(restResults => {
      return [firstResult, ...restResults];
    })
    // return [firstResult, ...await recursiveAll(rest)]  // this also works in place of above 3 lines
  })
}

const promises = [createPromise('one', 1000), createPromise('two', 2000)];

// recursiveAll(promises).then(res => {
//   console.log('res', res);
// });
// iterativeAll(promises).then(res => {
//   console.log('res', res);
// });



//////////////////////////////////////////////////////////
//  Cancelable Promise
//////////////////////////////////////////////////////////


const makeCancelable = (promise) => {
  let cancelPromise = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => cancelPromise ? resolve({isCanceled: true}) : resolve(val),
      error => cancelPromise ? resolve({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      cancelPromise = true;
    },
  };
};


const cancelablePromise = makeCancelable(
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000)
  })
);

// cancelablePromise
//   .promise
//   .then((res) => console.log(res))
//   .catch((reason) => console.log('isCanceled', reason.isCanceled));

// cancelablePromise.cancel();



//////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////













