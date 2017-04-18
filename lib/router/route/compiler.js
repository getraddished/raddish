class RouteCompiler {
    constructor() {
        this.separators = '/,;.:-_~+*=@|';
        this.delimiter = '#';
    }

    compile(route) {
        var variables = [],
            regexp = '^';

        if(route.options['_redirect']) {
            regexp += route.path;
        } else {
            var pattern = route.path,
                matches = pattern.match(/\{\w+\}/g).map(function (value) {
                    return value.replace('{', '').replace('}', '');
                });

            for (var match of matches) {
                if (/^\d/.test(match)) {
                    throw new Error('Variable cannot start with a digit.');
                }
                if (variables.indexOf(match) > -1) {
                    throw new Error('Variable can only exist once in the route.');
                }

                var precedingChar = pattern.indexOf(match) >= 2 ? pattern[pattern.indexOf(match) - 2] : '',
                    isSeparator = '' !== precedingChar && this.separators.indexOf(precedingChar) > -1;

                variables.push(match);

                regexp += (isSeparator ? '\\' + precedingChar : '') + '(' + (route.options[match] ? route.options[match] : '.*') + ')';
            }
        }

        return {
            regex: new RegExp(regexp + '$'),
            variables: variables
        };
    }
}

module.exports = new RouteCompiler();