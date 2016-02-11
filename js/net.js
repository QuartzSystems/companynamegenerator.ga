(function() {
    var net = {
        urlTemplate: "https://api.opencorporates.com/companies/search?page={{page}}&callback=?",
        constructURL: function(template, page) {
            return template.replace(/{{page}}/g, page);
        },
        makeOpenCorporatesRequest: function(page, callback, callback2) {
            $.getJSON(net.constructURL(net.urlTemplate, page), function(data) {
               callback(data.results.companies); 
            }).fail((callback2 ? callback2: callback));
        },
        filterCompanyNames: function(companies) {
            return companies.map(function(obj) {return obj.company.name});
        },
        getCompanyNamesFromPage: function(page, cb, cb2) {
            net.makeOpenCorporatesRequest(page, function(companyNames) {
                cb(net.filterCompanyNames(companyNames));
            }, function() {
                cb2();
            });
        }
    }
    window.net = net;
})();