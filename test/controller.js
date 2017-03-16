'use strict';

var ObjectManager = require('../index').ObjectManager,
    controller = ObjectManager.get('com://demo/demo.controller.demo');

require('should');

describe('Controller tests', function() {
    describe('Basic controller methods/ properties', function() {
        it('Should return a valid controller object', function() {
            return controller
                .then(function(controller) {
                    controller.getView.should.be.a.Function;
                    controller.getModel.should.be.a.Function;
                    controller.getPermissions.should.be.a.Function;
                    controller.execute.should.be.a.Function;
                });
        });
    });

    describe('Basic functionality tests', function() {
        it('Should return a correct model Object', function() {
            return controller
                .then(function(controller) {
                    return controller.getModel();
                })
                .then(function(model) {
                    model.getItem.should.be.a.Function;
                    model.state.should.be.a.Function;
                    model.getList.should.be.a.Function;
                    model.getTable.should.be.a.Function;
                });
        });

        it('Should return a correct view Object', function() {
            return controller
                .then(function(controller) {
                    return controller.getView();
                })
                .then(function(view) {
                    view._actionRender.should.be.a.Function;
                    view.execute.should.be.a.Function;
                });
        });

        it('Should return a correct prermissions Object', function() {
            return controller
                .then(function(controller) {
                    return controller.getPermissions()
                })
                .then(function(permissions) {
                    permissions.canGet.should.be.a.Function;
                    permissions.canPost.should.be.a.Function;
                    permissions.canDelete.should.be.a.Function;

                    permissions.canGet().should.be.true();
                    permissions.canPost().should.be.true();
                    permissions.canDelete().should.be.false();

                    permissions.canBrowse().should.be.true();
                    permissions.canRead().should.be.true();
                    permissions.canEdit().should.be.false();
                    permissions.canAdd().should.be.false();
                    permissions.canDelete().should.be.false();

                    var context = {
                        user: {
                            username: 'foo',
                            password: 'bar'
                        }
                    };
                    permissions.canEdit(context).should.be.true();
                    permissions.canAdd(context).should.be.true();
                    permissions.canDelete(context).should.be.true();
                });
        })
    });

    describe('Advanced functionality tests', function() {

    });
});