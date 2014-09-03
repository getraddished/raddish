function ComponentMenu(request, response) {
    ObjectManager.get('com://home/menu.dispatcher.http')
        .then(function(dispatcher) {
            dispatcher.dispatch(request, response);
        });
}

module.exports = ComponentMenu;