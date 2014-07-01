require('./base');

describe('Controller Tests', function() {
    describe('#getModel()', function() {
        it('Should return a Model object', function(done) {
            Raddish.Service.get('home:menu.controller.item')
                .then(function(controller) {
                    controller.request = request;

                    return controller.getModel();
                })
                .then(function(model) {
                    model.should.be.an.instanceOf(Raddish.Model);

                    done();
                });
        });
    });

    describe('#getPermissions', function(done) {
        it('Should return an Permissions object', function(done) {
            Raddish.Service.get('home:menu.controller.item')
                .then(function(controller) {
                    controller.request = request

                    return controller.getPermissions();
                })
                .then(function(permissions) {
                    permissions.should.be.an.instanceOf(Raddish.Permission);

                    done();
                });
        });

        it('function canBrowse should return true', function(done) {
            Raddish.Service.get('home:menu.controller.item')
                .then(function(controller) {
                    controller.request = request;

                    return controller.getPermissions();
                })
                .then(function(permissions) {
                    return permissions.canBrowse({});
                })
                .then(function(can) {
                    can.should.equal(true);

                    done();
                });
        });

        it('function canAdd should return false', function(done) {
            Raddish.Service.get('home:menu.controller.item')
                .then(function(controller) {
                    controller.request = request;

                    return controller.getPermissions();
                })
                .then(function(permissions) {
                    return permissions.canAdd({});
                })
                .then(function(can) {
                    can.should.equal(false);

                    done();
                });
        });

        it('function canDelete should return false', function(done) {
            Raddish.Service.get('home:menu.controller.item')
                .then(function(controller) {
                    controller.request = request;

                    return controller.getPermissions();
                })
                .then(function(permissions) {
                    return permissions.canDelete({});
                })
                .then(function(can) {
                    can.should.equal(false);

                    done();
                });
        });
    });

    describe('#getCommandChain()', function() {
        it('Should return a commandChain object', function(done) {
            Raddish.Service.get('home:menu.controller.item')
                .then(function(controller) {
                    controller.request = request;

                    return controller.getCommandChain();
                })
                .then(function(chain) {
                    chain.should.be.an.Object;

                    done();
                });
        });
    });

    describe('constructor values', function() {
        it('Test various values', function(done) {
            Service.get('home:menu.controller.item')
                .then(function(controller) {
                    controller.request = request;

                    controller.getIdentifier().should.be.an.Object;
                    controller.getIdentifier().clone().should.be.an.Object;

                    done();
                });
        })
    });
})