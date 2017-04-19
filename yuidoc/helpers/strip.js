module.exports = {
    stripHtml: function(text) {
        return text.replace(/<\/?[^>]+(>|$)/g, "");
    }
}