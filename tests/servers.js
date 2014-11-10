require('./base');

describe('Serveral server tests', function() {
    it('Should start usually', function() {
        Raddish.start();
        Socket.start();
    });
});