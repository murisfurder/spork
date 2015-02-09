
exports.name = "dependencies";
exports.landscape = ""; // does nothing at that level
exports.transform = function (urlMap) {
    $("img[src], iframe[src], object[data]").each(function () {
        var field = this.localName.toLowerCase() === "object" ? "data" : "src";
        if (urlMap[this[field]]) {
            window.callPhantom({ info: "Mapping " + this[field] + " to " + urlMap[this[field]] });
            this[field] = urlMap[this[field]];
        }
    });
    window.callPhantom({ info: "done remapping dependencies" });
    return {};
};
exports.params = function (conf) {
    return [conf.downloads];
};
