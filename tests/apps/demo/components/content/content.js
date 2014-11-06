function ComponentMenu(request, response) {
    ObjectManager.get('com://home/content.dispatcher.http')
        .then(function(dispatcher) {
            dispatcher.dispatch(request, response);
        });
}

module.exports = ComponentMenu;