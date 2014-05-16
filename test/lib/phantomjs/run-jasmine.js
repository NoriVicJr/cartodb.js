var system = require('system');


/**
 * Enable Color Mode Setting
 * @type {enum}
 */
var consoleStyles = {
    reset      : '\033[m',
    bold       : '\033[1m',
    red        : '\033[31m',
    green      : '\033[32m',
    yellow     : '\033[33m',
    blue       : '\033[34m',
    magenta    : '\033[35m',
    cyan       : '\033[36m',
    white      : '\033[37m',
    bg_red     : '\033[41m',
    bg_green   : '\033[42m',
    bg_yellow  : '\033[43m',
    bg_blue    : '\033[44m',
    bg_magenta : '\033[45m',
    bg_cyan    : '\033[46m',
    bg_white   : '\033[47m'
};


/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 4001, //< Default Max Timeout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 100ms
};


if (system.args.length !== 2) {
    console.log('Usage: run-jasmine.js URL');
    phantom.exit(1);
}

var page = require('webpage').create();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};


console.log('-----------');

page.open(system.args[1], function(status){

    if (status !== "success") {
        console.log("Unable to access network");
        phantom.exit();
    } else {
        console.log('Starting tests...');

        waitFor(function checkForPageToBeLoaded() {
            return page.evaluate(function(consoleStyles) {
                // The duration div is added upon all tests completing
                if (document.body.querySelector('.banner .duration')) {
                    return true;
                }
                return false;
            }, consoleStyles);
        }, function pageLoaded() {

            console.log('-----------');

            var jasmineVersion = getJasmineVersion();

            
            var symbolsStatusArray = getSymbolsStatusArray();



            console.log( jasmineVersion );
            var symbolsLine = transformSymbolsToDotLine(symbolsStatusArray);

            console.log( symbolsLine );
            console.log( getResultSummary() );
            console.log( getFailedSpecs() );

            function getFailedSpecs() {
                return page.evaluate(function(consoleStyles) {
                    var i, j;

                    // Get failing spec's details
                    list = document.body.querySelectorAll('div.jasmine_reporter .specDetail.failed');
                    for (i = 0; i < list.length; ++i) {
                        el = list[i];
                        desc = el.querySelectorAll('.description');
                        fail = el.querySelectorAll('.messages .resultMessage');
                        // failStackTrace = el.querySelectorAll('.stackTrace'); // PhantomJS isn't bringing this over
                        for (j = 0; j < desc.length; ++j) {
                            console.log(desc[j].innerText);
                        }
                        for (j = 0; j < fail.length; ++j) {
                            console.log(fail[j].innerText);
                        }
                        // for (j = 0; j < failStackTrace.length; ++j) {
                        //     console.log(failStackTrace[j].innerText);
                        // }
                    }

                }, consoleStyles);
            }


            /**
             * Get 38 specs | 1 failing alert bar text
             * @return {string} Alert bar result summary text
             */
            function getResultSummary() {
                return page.evaluate(function(consoleStyles) {
                    return ( document.body.querySelector('.resultsMenu.bar') || document.body.querySelector('.bar') ).innerText;
                });
            }


            /**
             * Get the version and title from the Jasmine HTMLRunner divs
             * @return {string} Title and Version
             */
            function getJasmineVersion() {
                return page.evaluate(function() {
                    return document.body.querySelector('.banner .title').innerText + ' ' + document.body.querySelector('#HTMLReporter .version').innerText;
                });
            }

            /**
             * Get an array of strings containing either 'passed', 'pending', or 'failed'.
             * If tests have finished, there should be no 'pending' strings present, but
             * this is not enforced.
             * @return {array} Array of strings
             */
            function getSymbolsStatusArray() {
                return page.evaluate(function() {
                    var symbols = [],
                        dotElements = document.body.querySelectorAll('.symbolSummary > li'),
                        i, item;

                    for ( i = 0, l = dotElements.length; i < l; ++i ) {
                        symbols.push( dotElements[i].className );
                    }

                    return symbols;
                });
            }


            /**
             * Transform an array of symbol statuses into colored dots and x's.
             * @param  {array} symbolsStatusArray Array of strings containing 'passed' or 'failed'
             * @return {string}                   String of console color coded characters
             */
            function transformSymbolsToDotLine(symbolsStatusArray) {
                var ret = '';

                for ( var item, className, i = 0, l = symbolsStatusArray.length, last = l-1; i < l; ++i ) {
                    item = symbolsStatusArray[i],
                    className = item;
                    if ( className === 'passed' )
                        ret += consoleStyles.green + '.';
                    else if ( className === 'failed' )
                        ret += consoleStyles.red + 'x';
                    // if ( i !== last)
                        // ret += '\n';
                }

                ret += consoleStyles.reset;

               return ret;
            }



            // We are finished, so exit.
            phantom.exit();
        });
    }
});

function pageLoaded() {

}


/*
    Desired output:

    On Failure

    On Success



 */


// Testing colored output
// console.log('test\ttabbed\tsupertabbed\n' + consoleStyles.bg_green + 'hey-----------' + consoleStyles.reset);
// console.log(consoleStyles.bold + consoleStyles.red);
// console.log('hooray colors');
// console.log(consoleStyles.reset);