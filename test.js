function promiseOne() {
    return new Promise(function(resolve, reject) {
        return resolve(true);
    });
}

function promiseTwo() {
    return new Promise(function(resolve, reject) {
        return resolve(true);
    });
}

promiseOne()
    .then(function(result) {
        return promiseTwo()
            .then(function() {
                return 'Called';
            });
    })
    .then(function(result) {
        console.log(result);
    });
