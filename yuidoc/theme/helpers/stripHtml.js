module.exports = {
    stripHTML: function(html) {
        return html.replace(/<(?:.|\n)*?>/gm, '');
    }
}