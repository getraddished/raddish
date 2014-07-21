require('./base');

describe('Controller Tests', function() {
    // We are going to work a little with the request.
    describe('#_actionBrowse()', function() {
        it('Should return an object', function(done) {
            ObjectManager.get('com://home/menu.controller.item')
                .then(function(controller) {  
                    controller.request      = request.url.query;
                    controller.request.view = request.url.query.view || Inflector.pluralize(controller.getIdentifier().getName());
                    controller.format       = (request.url.query.format || Raddish.getConfig('format'));

                    return controller;
                })
                .then(function(controller) {                    
                    var context         = controller.getContext();
                    context.auth        = {username: 'Demo User', password: 'Demo'};
                    context.request     = controller.getRequest();
                    context.data        = {};
                    
                    return controller.execute('GET', context);
                })
                .then(function(result) {
                    result.should.be.an.Object;
                    
                    done();
                });
        });
    });
    
    describe('#_actionRead()', function() {
        it('Should return an object', function(done) {
            ObjectManager.get('com://home/menu.controller.item')
                .then(function(controller) {
                    request.url.query.view = 'item';
                    request.url.query.id = '3';
                    
                    controller.request      = request.url.query;
                    controller.request.view = request.url.query.view || Inflector.pluralize(controller.getIdentifier().getName());
                    controller.format       = (request.url.query.format || Raddish.getConfig('format'));

                    return controller;
                })
                .then(function(controller) {
                    var context         = controller.getContext();
                    context.auth        = {username: 'Demo User', password: 'Demo'};
                    context.request     = controller.getRequest();
                    context.data        = {};

                    return controller.execute('GET', context);
                })
                .then(function(result) {
                    result.should.be.an.Object;

                    done();
                });
        });
    });
    
    describe('#_actionAdd()', function() {
        
    });

    describe('#_actionUpdate()', function() {

    });

    describe('#_actionDelete()', function() {
        
    });
    
    describe('#getModel()', function() {
        it('Should return a Model object', function(done) {
            ObjectManager.get('com://home/menu.controller.item')
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
            ObjectManager.get('com://home/menu.controller.item')
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
            ObjectManager.get('com://home/menu.controller.item')
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
            ObjectManager.get('com://home/menu.controller.item')
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
            ObjectManager.get('com://home/menu.controller.item')
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
            ObjectManager.get('com://home/menu.controller.item')
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
            ObjectManager.get('com://home/menu.controller.item')
                .then(function(controller) {
                    controller.request = request;

                    controller.getIdentifier().should.be.an.Object;
                    controller.getIdentifier().clone().should.be.an.Object;

                    done();
                });
        })
    });
})