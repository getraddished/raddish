/**
 * I really have to think abou this and think this over correctly or else this will go sideways again :S.
 * The router is responsible for routing the request to the correct dispatcher.
 *
 * Also it is reponsible to set the correct cors headers. or can I best do this in the dispatcher?
 * That is also a good thought of doint that there. It is more interesting to do it in the Dispatcher,
 * however the host is to be set as well, but this is more difficult, or could be received from the request.
 */

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
        });
    }

    setPublicPath(path) {
        this.publicPath = path;

        return this;
    }

    /**
     * This method parses all the routes which are registred.
     * After a match is found it will be used.
     *
     * @private
     * @param {request.url} url The url object from the request.
     */
    parseRoutes(url) {
        for(var index in this.routes) {
            if(this.routes.hasOwnProperty(index)) {
                var route = this.routes[index],
                    pathparts = url.pathname.split('/').filter(function(n){ return n != ''}),
                    indexparts = index.split('/').filter(function(n){ return n != ''});

                if(url.pathname === index) {
                    url.pathname = route;
                    return url;
                } else if(pathparts.length === indexparts.length) {
                    for(var idx in pathparts) {
                        if(pathparts.hasOwnProperty(idx)) {
                            var part = pathparts[idx],
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
        }

        return url;
    }

    addCustomRoute() {

    }

    addParseRule(callback) {

    }
}

module.exports = new Router();