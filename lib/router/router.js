'use strict';

var url = require('url'),
    fs = require('fs'),
    formidable = require('formidable'),
    Application = require('../application/application'),
    mime = require('mime'),
    Route = require('./route/route');

/**
 * The main router class will route all the incoming requests.
 *
 * @class Router
 * @static
 */
class Router {
    /**
     * The router will parse the request and forward it to the needed component file.
     * This will also rely on the
     *
     * @constructor
     */
    constructor() {
        this.publicPath = '';
        this.routes = [];

        this.addRoute('/{application}/{component}/{view}');
        this.addRoute('/{application}/{component}');
        this.addRoute('/', {
            _redirect: '/index.html'
        });
    }


    addRoute(path, options) {
        this.routes.push(new Route(path, options));
    }

    /**
     * This method does some needed checks and routes the request.
     * After the route is done the component has taken over the responsibility of forwarding it to the correct dispatcher.
     *
     * @method route
     * @param {Request} request The nodejs Request object.
     * @param {Response} response The nodejs Response object.
     * @returns {Boolean} True when the route is successfull, false otherwise.
     */
    route(request, response) {
        // First we will always route it, not matter what.
        var route = this.match(request.url),
            self = this;

        if(!route) {
            // Check if the static file exists, else exit.
            fs.access(this.publicPath + uri.pathname, fs.R_OK, function(err) {
                if(err) {
                    response.statusCode = 404;
                    response.end('');
                }

                response.statusCode = 200;
                fs.createReadStream(this.publicPath + uri.pathname).pipe(response);
            }.bind(this));

            return;
        }

        return this.serveFile(request.path, response)
            .catch(function(err) {
                return route.execute(request)
            })
            .then(function(request) {
                self.routeRequest(request, response);
            })
            .catch(function(err) {
                response.statusCode = 500;
                sendError(err, response);
            });
    }

    match(uri) {
        var found = null;
        uri = url.parse(uri, true);

        for(var route of this.routes) {
            if(route.match(uri.pathname)) {
                found = route;
                break;
            }
        }

        return found;
    }

    /**
     * Route the request, to the reponse.
     *
     * @param request
     * @param response
     */
    routeRequest(request, response) {
        try {
            Application.findApplication(request.query.application)
                .executeComponent(request.query.component, request, response)
                .catch(function(error) {
                    sendError(error, response);
                    return false;
                });
        } catch(error) {
            sendError(error, response);
            return false;
        }
    }

    serveFile(path, response) {
        path = [this.publicPath, path].join('/');

        return new Promise(function(resolve, reject) {
            fs.stat(path, function(err, item) {
                if(err) {
                    return reject(err);
                }

                if(item.isDirectory()) {
                    return reject('File does not exist.');
                }

                return resolve(fs.createReadStream(path).pipe(response));
            })
        });
    }

    /**
     * This method will set a public path, it will check if the request is send to a file,
     * if so the requested file will be returned.
     *
     * @method setPublicPath
     * @param {String} path The path to the public directory.
     * @return {Router} Router object for chaining.
     */
    setPublicPath(path) {
        this.publicPath = path;

        return this;
    }
}

function sendError(error, response) {
    return response.end(JSON.stringify({
        message: error.message,
        stack: error.stack
    }));
}

module.exports = new Router();