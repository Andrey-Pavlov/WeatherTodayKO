(function () {
    app.namespace('weather').init = function (options) {
        var request = app.request,
            WeatherPageSectionViewModel = app.weather.WeatherPageSectionViewModel,
            cacheObj = new Cache();

        var ViewModel = function (options) {
            var self = this,
                maxItems = options.maxItems,
                url = options.url,
                appid = options.appid;

            self.backgroundClass = ko.observable();

            self.currentWeather = ko.observable();
            self.currentWeather.subscribe(function (weather) {
                var weatherCode = weather ? weather.id() : 800,
                    newBackground = null;

                switch (true) {
                    case weatherCode < 300:
                        newBackground = 'thunder';
                        break;
                    case weatherCode < 500:
                        newBackground = 'rain';
                        break;
                    case weatherCode < 600:
                        newBackground = 'rain';
                        break;
                    case weatherCode < 701:
                        newBackground = 'snowing';
                        break;
                    case weatherCode < 741:
                        newBackground = 'haze';
                        break;
                    case weatherCode < 800:
                        newBackground = 'fog';
                        break;
                    case weatherCode < 801:
                        newBackground = 'sunny';
                        break;
                    case weatherCode < 802:
                        newBackground = 'partlyCloudy';
                        break;
                    case weatherCode < 900:
                        newBackground = 'moreclouds';
                        break;
                }

                self.backgroundClass(newBackground);
            });

            self.cityNameSearch = ko.observable();
            self.submitSearch = function () {
                self.getCurrentWeatherByCityName(self.cityNameSearch());
            };

            self.autocompleteCityFunction = function (term, callback) {
                request.jsonp.send('http://gd.geobytes.com/AutoCompleteCity?callback=handleStuff&sort=size&q=' + term, {
                    callbackName: 'handleStuff',
                    onSuccess: function (json) {
                        callback(json);
                    }
                })
            };

            self.rotateCity = ko.observable();
            self.searchAdvices = ko.observableArray();

            self.searches = ko.observableArray();
            self.removeRecentSearch = function () {
                self.searches.remove(this);
            };
            self.searchAddAnimation = function (arr, val) {
                setTimeout(function () {
                    arr[1].classList.add('show');
                }, 1);
            };
            self.searchRemoveAnimation = function (node) {
                if (node.nodeType === 1) {
                    node.classList.remove('show');
                    setTimeout(function () {
                        node.remove();
                    }, 500);
                }
            };

            self.getCurrentWeatherByCity = function () {
                getCurentWeatherByCity(null, this.id);
            };

            self.getCurrentWeatherByCityName = function (cityName) {
                getCurentWeatherByCity(cityName, null);

                self.cityNameSearch('');
            };

            function getCurentWeatherByCity(cityName, id) {
                var urlString = url + '&appid=' + appid,
                    cacheItem;

                if (id) {
                    cacheItem = cacheObj.getItem(id);
                }

                if (cacheItem) {
                    setCityWeather(cacheItem);
                }
                else {
                    if (id) {
                        urlString += '&id=' + id;
                    } else if (cityName) {
                        urlString += '&q=' + cityName;
                    } else {
                        throw new Error('Incorrect weather search param.');
                    }

                    request.ajax(urlString, function (cityWeather) {
                        cacheObj.setItem(cityWeather.id, cityWeather, options.weatherCacheTime);
                        setCityWeather(cityWeather);
                    }, function(response) {
                        console.error(JSON.stringify(response));
                    });
                }

                function setCityWeather(cityWeather) {
                    var searches = self.searches(),
                        tempVar,
                        indexOfElem = -1;

                    for (var i = 0; i < searches.length; ++i) {
                        if (searches[i].id == cityWeather.id) {
                            indexOfElem = i;
                            break;
                        }
                    }

                    if (indexOfElem === -1) {
                        self.searches.unshift(cityWeather);
                    } else {
                        // Swap items
                        tempVar = searches[indexOfElem];
                        searches[indexOfElem] = searches[0];
                        searches[0] = tempVar;
                        self.searches.valueHasMutated();
                    }

                    if (searches.length > maxItems) {
                        self.searches.pop();
                    }

                    var weatherData = new WeatherPageSectionViewModel(cityWeather);
                    self.currentWeather(weatherData);

                    self.searchAdvices.push(cityWeather.name);
                }
            }
        };

        var viewModel = new ViewModel(options);

        ko.applyBindings(viewModel);
    };

    function Cache() {
        var cache = {};

        this.getItem = function (itemName, expireTimeMs) {
            var item = cache[itemName];

            return item;
        };

        this.setItem = function (itemName, item, timeMs) {
            cache[itemName] = item;

            (function (itemName) {
                setTimeout(function () {
                    delete cache[itemName];
                }, timeMs);
            }(itemName));
        };
    }
}());