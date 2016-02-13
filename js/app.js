(function() {
    var net = window.net;
    var loading = false;
    var onButtonPush = function(cb) {
        if(!loading) {
            loading = true;
            $('#companyNameGenerator-mainButton').attr("disabled", true);
            $('#result').removeAttr("data-fail").slideUp();
            $('#loader').slideDown();
            net.getCompanyNamesFromPage(Math.floor(Math.random() * ((10 - 1) + 1) + 8), function(companyNames) {
                net.getCompanyNamesFromPage(Math.floor(Math.random() * ((10 - 1) + 1) + 8), function(companyNames02) {
                    $('#companyNameGenerator-mainButton').removeAttr("disabled");
                    companyNames.concat(companyNames02);
                    loading = false;
                    cb(generateName(companyNames).replace(/"/g, "").replace(/  /g, " "));
                    $('#loader').slideUp();
                });
            }, function() {
                loading = false;
                $('#companyNameGenerator-mainButton').removeAttr("disabled");
                $('#loader').slideUp();
                $('#result').html("<b>Loading Error</b><br>We probably got rate-limited :&lpar;").attr("data-fail", "true").slideDown();
            });
        }
    };
    var generateName = function(companyNames) {
        var chain = new Foswig(3);
        chain.addWordsToChain(companyNames.map(function(name) {
            return name //.replace(/\ /g, "");
        }));
        return chain.generateWord(20, 100, false);
    }
    var $mainButton = $('#companyNameGenerator-mainButton');
    var $result = $('#result');
    var fillResult = function(name) {
        var twitter = document.createElement('a');
        var bumperText = "";
        twitter.setAttribute('href', 'http://twitter.com/share');
        twitter.setAttribute('class', 'twitter-share-button twitter-tweet');
        if(name.length < 64) {
            bumperText = "I generated the company name ";
        } else if(name.length < 73) {
            bumperText = "Generate a name like";
        }
        twitter.setAttribute('data-text', bumperText + ' "' + name.trim().replace(/  /g, " ") + '" at ');
        twitter.setAttribute('data-url', location.href);
        twitter.setAttribute('data-via', 'qsysmine');
        twitter.style.top = '20px';
        twitter.style.left = '300px';
        twitter.innerHTML = "Tweet";
        $result.html(name + "<br><br>");
        $result.append(twitter);
        $result.slideDown();
        twttr.widgets.load();
    }
    $mainButton.click(onButtonPush.bind(undefined, fillResult));
    $('html').keyup(function(e) {
        var keyCode = e.keyCode;
        var rKeyCode = 82;
        if(keyCode === rKeyCode) {
            onButtonPush.bind(undefined, fillResult)();
        }
    });
    if(navigator.userAgent.split("iPhone").length > 1) {
        $('#orPressR').hide();
    }
    onButtonPush.bind(undefined, fillResult)();
})();