require('./base');
var AddedID = 0;

describe('Controller Tests', function() {
    // We are going to work a little with the request.
    describe('#_actionBrowse()', function() {
        it('Should return a Rowset object', function(done) {
            ObjectManager.get('com://home/menu.controller.item')
                .then(function(controller) {
                    controller.request      = request.url.query;
                    controller.request.view = request.url.query.view || Inflector.pluralize(controller.getIdentifier().getName());
                    controller.format       = (request.url.query.format || Raddish.getConfig('format'));

                    return [controller, controller.getRequest()];
                })
                .spread(function(controller, request) {
                    var context         = controller.getContext();
                    context.auth        = {username: 'Demo User', password: 'Demo'};
                    context.request     = request;
                    context.data        = {};
                    
                    return controller.execute('GET', context);
                })
                .then(function(result) {
                    result.should.be.an.Object;
                    result.result.data.rows.should.be.an.Object;

                    return result.result.display();
                })
                .then(function(result) {
                    result.should.be.a.String;

                    done();
                });
        });
    });

    describe('#_actionRead()', function() {
        it('Should return a Row object', function(done) {
            ObjectManager.get('com://home/menu.controller.item')
                .then(function(controller) {
                    request.url.query.view = 'item';
                    request.url.query.id = '3';

                    controller.request      = request.url.query;
                    controller.request.view = request.url.query.view || Inflector.pluralize(controller.getIdentifier().getName());
                    controller.format       = (request.url.query.format || Raddish.getConfig('format'));

                    return [controller, controller.getRequest()];
                })
                .spread(function(controller, request) {
                    var context         = controller.getContext();
                    context.auth        = {username: 'Demo User', password: 'Demo'};
                    context.request     = request;
                    context.data        = {};

                    return controller.execute('GET', context);
                })
                .then(function(result) {
                    result.should.be.an.Object;

                    return result.result.display()
                })
                .then(function(result) {
                    result.should.be.a.String;

                    done();
                });
        });
    });

    describe('#_actionAdd()', function() {
        it('Should return a newly created object', function(done) {
            ObjectManager.get('com://home/menu.controller.item')
                .then(function(controller) {
                    request.url.query.view = 'item';
                    delete request.url.query.id;

                    controller.request      = request.url.query;
                    controller.request.view = request.url.query.view || Inflector.pluralize(controller.getIdentifier().getName());
                    controller.format       = (request.url.query.format || Raddish.getConfig('format'));

                    return [controller, controller.getRequest()];
                })
                .spread(function(controller, request) {
                    var context         = controller.getContext();
                    context.auth        = {username: 'Demo User', password: 'Demo'};
                    context.request     = request;
                    context.data        = {
                        fields: {
                            title: 'Demo_Test'
                        }
                    };

                    return controller.execute('POST', context);
                })
                .then(function(result) {
                    result.should.be.an.Object;
                    result.result.data.data.title.should.equal('Demo_Test');

                    AddedID = result.result.data.id;
                    done();
                });
        });
    });

    describe('#_actionUpdate()', function() {
        it('Should return a updated Row object', function(done) {
            ObjectManager.get('com://home/menu.controller.item')
                .then(function(controller) {
                    request.url.query.view = 'item';
                    request.url.query.id = AddedID;

                    controller.request      = request.url.query;
                    controller.request.view = request.url.query.view || Inflector.pluralize(controller.getIdentifier().getName());
                    controller.format       = (request.url.query.format || Raddish.getConfig('format'));

                    return [controller, controller.getRequest()];
                })
                .spread(function(controller, request) {
                    var context         = controller.getContext();
                    context.auth        = {username: 'Demo User', password: 'Demo'};
                    context.request     = request;
                    context.data        = {
                        fields: {
                            title: 'Demo_Test22'
                        }
                    };

                    return controller.execute('POST', context);
                })
                .then(function(result) {
                    result.should.be.an.Object;
                    result.result.data.data.title.should.equal('Demo_Test22');

                    done();
                });
        });
    });

    describe('#_actionDelete()', function() {
        it('Should return the removed object', function(done) {
            ObjectManager.get('com://home/menu.controller.item')
                .then(function(controller) {
                    request.url.query.view = 'item';
                    request.url.query.id = AddedID;

                    controller.request      = request.url.query;
                    controller.request.view = request.url.query.view || Inflector.pluralize(controller.getIdentifier().getName());
                    controller.format       = (request.url.query.format || Raddish.getConfig('format'));

                    return [controller, controller.getRequest()];
                })
                .spread(function(controller, request) {
                    var context         = controller.getContext();
                    context.auth        = {username: 'Demo User', password: 'Demo'};
                    context.request     = request;
                    context.data        = {
                        fields: {
                            title: 'Demo_Test22'
                        }
                    };

                    return controller.execute('DELETE', context);
                })
                .then(function(result) {
                    result.should.be.an.Object;

                    done();
                });
        });
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