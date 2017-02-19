ko.bindingHandlers.fadeInFadeOut = {
    init: function (el, valueAccessor, allBindings, viewModel, bindingContext) {
        var timeIn = 5000,
            timeOut = 1000,
            i = 0,
            anchor = el.querySelector('a'),
            options = ko.unwrap(valueAccessor());

        el.classList.add('fade-animation');

        (function x() {

            setTimeout(function () {
                el.classList.add('fadeIn');
                el.classList.remove('fadeOut');

                setTimeout(function () {
                    var array = options.searchAdvices(),
                        val = array[i];

                    if(val) {
                        options.rotateCity(array[i]);

                        i++;

                        if (i === array.length) {
                            i = 0;
                        }

                        el.classList.remove('fadeIn');
                        el.classList.add('fadeOut');
                    }

                    x();
                }, timeOut);
            }, timeIn);
        })();
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    }
};

ko.bindingHandlers.autoComplete = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var settings = valueAccessor();

        var selectedOption = settings.selected;
        var autocompleteCityFunction = settings.autocompleteCityFunction;
        var searchAdvices = settings.searchAdvices;

        new autoComplete({
            selector: element,
            source: function (term, suggest) {
                autocompleteCityFunction(term, function (names) {
                    var hints = [];

                    var items = names.map(function (item) {
                        return item.split(',')[0];
                    });

                    items = distinctValues(items);
                    var arr = searchAdvices();

                    for (var i = 0; i < items.length; i++) {
                        if (items[i].toLowerCase().indexOf(term.toLowerCase()) >= 0) {
                            hints.push(items[i]);

                            arr.push(items[i]);
                        }
                    }

                    searchAdvices(distinctValues(arr));

                    suggest(hints);
                });
            },
            onSelect: function (event, term, item) {
                selectedOption(term);
            }
        });

        function distinctValues(arr, prop) {
            return arr.reduce(function(a,b){
                if (a.indexOf(b) < 0 ) a.push(b);
                return a;
            },[]);
        }
    }
};