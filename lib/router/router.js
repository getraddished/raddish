'use strict';

var url = require('url'),
    fs = require('fs'),
    formidable = require('formidable'),
    Application = require('../application/application'),
    mime = require('mime');

class Router {
    /**
     * The router will parse the request and forward it to the needed component file.
     * This will also rely on the
     *
     * @constructor
     */
    constructor() {
        this.rules = [];
        this.publicPath = '';
        this.routes = {
            '/:application/:component/:view': null,
            '/:application/:component': null,
            '/': '/index.html'
        };
    }

    /**
     * This method does some needed checks and routes the request.
     * After the route is done the component has taken over the responsibility of forwarding it to the correct dispatcher.
     *
     * @method route
     * @param request
     * @param response
     * @returns {*}
     */
    route(request, response) {
        function sendError(error, response) {
            return response.end(JSON.stringify({
                message: error.message,
                stack: error.stack
            }));
        }

        var route = url.parse(request.url, true);
        
        if (route.pathname !== null && route.pathname !== '/' && fs.existsSync(this.publicPath + route.pathname)) {
            response.statusCode = 200;
            response.setHeader('Content-Type', mime.lookup(this.publicPath + route.pathname));
            return fs.createReadStream(this.publicPath + route.pathname).pipe(response);
        }

        route = this.parseRoutes(route);

        if(this.publicPath !== '') {
            if (route.pathname !== null && fs.existsSync(this.publicPath + route.pathname)) {
                response.statusCode = 200;
                response.setHeader('Content-Type', mime.lookup(this.publicPath + route.pathname));
                return fs.createReadStream(this.publicPath + route.pathname).pipe(response);
            }
        }

        new formidable.IncomingForm().parse(request, function(err, fields, files) {
            if(err) {
                sendError(err, response);
                return false;
            }

            request.data = fields;
            request.files = files;
            request.query = route.query;

            try {
                Application.findApplication(route.query.application)
                    .executeComponent(route.query.component, request, response)
                    .catch(function(error) {
                        sendError(error, response);
                    });
            } catch(error) {
                sendError(error, response);
            }

            return true;
        });

        return true;
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

    /**
     * This method parses the received route and will match it against the predefined routes.
     * Also it will try to parse the requests to specific rules that can be added.
     *
     * @method parseRoutes
     * @param {String} url The requested url.
     * @return {Object} A parsed url object.
     */
    parseRoutes(url) {
        var pathparts = [],
            indexparts = [],
            part = '',
            idxpart = '',
            rulePromises = [];

        for(var route of Object.keys(this.routes)) {
            pathparts = url.pathname.split('/').filter(function(n){ return n != '';});
            indexparts = route.split('/').filter(function(n){ return n != '';});

            if(url.pathname === route) {
                url.pathname = this.routes[route];
                return url;
            } else if(pathparts.length === indexparts.length) {
                for(var idx in pathparts) {
                    if(pathparts.hasOwnProperty(idx)) {
                        part = pathparts[idx];
                        idxpart = indexparts[idx];

                        if(idxpart.indexOf(':') === -1) {
                            continue;
                        }

                        url.query[idxpart.replace(':', '')] = part;
                    }
                }

                url.pathname = route;
                return url;
            }
        }

        if(this.rules.length) {
            for(rule of this.rules) {
                rulePromises.push(rule(url));
            }
        }

        return Promise.all(rulePromises)
            .then(function() {
                return url;
            });
    }

    /**
     * This method adds a custom route.
     *
     * @method addCustomRoute
     * @param {String/ Array} source The request to match.
     * @param {String} destination The destination to which the matched request needs to go.
     * @return {Router} The current router object for chaining.
     */
    addCustomRoute(source, destination) {
        if(source.toString() === 'object Object') {
            for(var index in source) {
                if(source.hasOwnProperty(index)) {
                    this.addCustomRoute(index, source[index]);
                }
            }
        } else {
            this.routes[source] = destination;
        }

        return this;
    }

    /**
     * This method adds a custom ParseRule.
     * A parseRule is a function customly defined in which you can add your own functionality to match a route.
     *
     * @method addParseRule
     * @param {Function} funct The function for your custom parser.
     * @return {Router} The current Route object for chaining.
     */
    addParseRule(funct) {
        if(!typeof funct === 'function') {
            throw new Error('A parse rule must be a function!');
        }

        this.rules.push(funct);

        return this;
    }
}

module.exports = new Router();