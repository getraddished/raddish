var Service = require('raddish').Service;

function ComponentMenu(request, response) {
    Service.get('home:menu.dispatcher')
        .then(function(dispatcher) {
            dispatcher.dispatch(request, response);
        });
}

module.exports = ComponentMenu;