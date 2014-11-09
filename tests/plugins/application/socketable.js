function Socketable() {

}

Socketable.prototype.onBeforeRegister = function() {
    console.log('Socketable onBeforeRegister');

    return Promise.resolve();
}

module.exports = Socketable;