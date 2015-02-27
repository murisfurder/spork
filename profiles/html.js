
var u = require("url")
,   sua = require("superagent")
,   libxml = require("libxmljs")
;

// Mainline HTML
exports.name = "HTML";
exports.url = "https://html.spec.whatwg.org/";
// exports.url = "http://multifarious.dev/empty-html/"; // local emptied version for optimal dev

exports.configuration = {
    boilerplate:    "res/boilerplate/html-headers.html"
,   abstract:       "res/boilerplate/html-abstract.html"
,   sotd:           "res/boilerplate/html-ed-sotd.html"
,   style:          "res/boilerplate/html.css"
,   title:          "HTML 5.1 Nightly"
,   specStatus:     "ED"
,   downloads:      {}
};

var seen = {};
exports.resources = function (res) {
    var url = u.parse(res.url)
    ,   dl = exports.configuration.downloads
    ;
    if (seen[url.href]) return;
    seen[url.href] = true;
    if (url.protocol === "data:") return;
    if (url.hostname === "resources.whatwg.org") return;
    if (url.hostname === "code.jquery.com") return;
    if (url.hostname === "html.spec.whatwg.org") {
        if (url.pathname === "/") return;
        if (/\.js/i.test(url.pathname)) return;
        dl[url.href] = url.pathname;
    }
    if (url.hostname === "images.whatwg.org") {
        dl[url.href] = "/img" + url.pathname;
    }
    if (url.hostname === "whatwg.org" && /^\/demos/i.test(url.pathname)) {
        dl[url.href] = url.pathname;
    }
};

exports.setup = function (cb) {
    sua.get("http://www.w3.org/2002/01/tr-automation/tr.rdf")
        .buffer(true)
        .end(function (res) {
            if (!res.ok) return cb("Failed to load tr.rdf");
            var prev = libxml.parseXml(res.text)
                            .get(
                                "//x:WD[./doc:versionOf[@rdf:ressource='http://www.w3.org/TR/html51/']]"
                            ,   {
                                    x:      "http://www.w3.org/2001/02pd/rec54#"
                                ,   doc:    "http://www.w3.org/2000/10/swap/pim/doc#"
                                ,   rdf:    "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                                }
                            )
                            .attr("rdf:about")
            ;
            exports.configuration.previousYear = prev.replace(/.*(\d{4}).*/, "$1");
            exports.configuration.previousDate = prev.replace(/.*(\d{8}).*/, "$1");
            cb();
        })
    ;
};

exports.rules = [
    // basic processing
    require("../rules/strip-script")
,   require("../rules/outlinify")
,   require("../rules/id-cache")

    // mostly removing stuff
,   require("../rules/drop-sections")
,   require("../rules/fork-link-types")
,   require("../rules/fork-datetime-local")
,   require("../rules/fork-obsolete-hgroup")
,   require("../rules/fork-no-ping")
,   require("../rules/fork-longdesc")

    // actual changes - ideally this is the list that most needs to be reduced
,   require("../rules/fork-history")
,   require("../rules/fork-outline")
,   require("../rules/fork-article")
,   require("../rules/fork-common-idioms")
,   require("../rules/fork-link-rel-url")
,   require("../rules/fork-metaextensions")
,   require("../rules/fork-aria")
,   require("../rules/fork-ruby")
,   require("../rules/fork-table-layout")
,   require("../rules/fork-table-border")
,   require("../rules/fork-main-element")
,   require("../rules/fork-nav-list")
,   require("../rules/fork-section-headings")
,   require("../rules/fork-blockquote-cite")
,   require("../rules/fork-alt")
,   require("../rules/fork-datacue")
,   require("../rules/fork-links-in-labels")
,   require("../rules/fork-pattern-title")
,   require("../rules/fork-placeholder-label")
,   require("../rules/fork-focus-ring-css")
,   require("../rules/fork-input-bidi-plaintext")
,   require("../rules/fork-license-main")
,   require("../rules/fork-header")
,   require("../rules/fork-tz-warning")
,   require("../rules/fork-local-floating")
,   require("../rules/landscape")(exports)

    // make this a W3C spec and finalise basics
,   require("../rules/references")
,   require("../rules/aria-steve")
,   require("../rules/boilerplate")
,   require("../rules/fixes")
,   require("../rules/toc")
,   require("../rules/id")
,   require("../rules/404")
,   require("../rules/dependencies")
,   require("../rules/report") // send the source
];
