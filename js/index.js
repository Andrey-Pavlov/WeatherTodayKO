(function () {
    var request = app.request;

    var ViewModel = function () {
        var isLoading = true,
            self = this;

        self.init = function (city) {
            getCurentWeatherByCity(city);
        };
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

        self.autocompleteCityFunction = function (term, callback) {
            request.jsonp.send('http://gd.geobytes.com/AutoCompleteCity?callback=handleStuff&sort=size&q=' + term, {
                callbackName: 'handleStuff',
                onSuccess: function (json) {
                    callback(json);
                }
            })
        };

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
            getCurentWeatherByCity(this);
        };

        self.getCurrentWeatherByCityName = function (cityName) {
            getCurentWeatherByCity(resolveCityObjByCityName(cityName));

            self.cityNameSearch('');
        };

        var cacheWeather = null;

        function getCurentWeatherByCity(city) {
            request.ajax("http://openweathermap.org/data/2.5/weather?q=" + city.name + "&units=metric&appid=b1b15e88fa797225412429c1c50c122a1", function (cityWeather) {
                isLoading = false;

                if (cacheWeather) {
                    cityWeather.name = city.name;
                    cityWeather.id = city.id;
                }

                self.searches.remove(function (item) {
                    return item.id == cityWeather.id;
                });
                self.searches.unshift(cityWeather);

                if (self.searches().length > 15) {
                    self.searches.pop();
                }

                var weatherData = new WeatherPageSectionViewModel(cityWeather);
                self.currentWeather(weatherData);

                cacheWeather = weatherData;
            })
        }

        function resolveCityObjByCityName(cityName) {
            return {id: Date.now(), name: cityName};
        }
    };

    var viewModel = new ViewModel();
    viewModel.init({id: 0, name: 'Moscow'});

    ko.applyBindings(viewModel);

    function WeatherPageSectionViewModel(weatherAPIObject) {
        var self = this;

        var precipitation = 0,
            rain = weatherAPIObject.rain,
            snow = weatherAPIObject.snow;

        if (rain && rain['3h']) {
            precipitation += rain['3h'];
        }

        if (snow && snow['3h']) {
            precipitation += snow['3h'];
        }

        self.id = ko.observable(weatherAPIObject.weather[0].id);
        self.cityName = ko.observable(weatherAPIObject.name.toUpperCase());

        self.icon = ko.observable(weatherAPIObject.weather[0].icon);

        self.main = ko.observable(weatherAPIObject.weather[0].main);
        self.description = ko.observable(weatherAPIObject.weather[0].description);

        self.clouds = ko.observable(weatherAPIObject.clouds.all);

        self.temperature = ko.observable(Math.round(weatherAPIObject.main.temp));
        self.pressure = ko.observable(weatherAPIObject.main.pressure);
        self.humidity = ko.observable(weatherAPIObject.main.humidity);
        self.precipitation = ko.observable(precipitation);
    }
}());