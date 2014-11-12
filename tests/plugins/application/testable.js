function Testable() {

}

Testable.prototype.onBeforeRegister = function() {
    console.log('Testable onBeforeRegister');

    return Promise.resolve();
}

module.exports = Testable;