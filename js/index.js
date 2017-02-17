(function () {
    var request = app.request;

    var ViewModel = function () {
        var isLoading = true,
            self = this;

        self.init = function (cityName) {
            self.cityName(cityName);
            self.getCurrentWeatherByCityName(cityName);
        };

        self.getBackgroundClass = function (currentWeather) {
            var weatherCode = currentWeather ? currentWeather.weather[0].id : 800;

            switch (true) {
                case weatherCode < 300:
                    return 'thunder';
                    break;
                case weatherCode < 500:
                    return 'rain';
                    break;
                case weatherCode < 600:
                    return 'rain';
                    break;
                case weatherCode < 701:
                    return 'snowing';
                    break;
                case weatherCode < 741:
                    return 'haze';
                    break;
                case weatherCode < 800:
                    return 'fog';
                    break;
                case weatherCode < 801:
                    return 'sunny';
                    break;
                case weatherCode < 802:
                    return 'partlyCloudy';
                    break;
                case weatherCode < 900:
                    return 'moreclouds';
                    break;
            }
        };

        self.cityName = ko.observable();
        self.currentWeather = ko.observable();
        self.searches = ko.observableArray();

        self.searchAddAnimation = function (arr, val) {
                setTimeout(function () {
                    arr[1].classList.add('show');
                }, 100);
        };

        self.getCurrentWeatherByCityName = function (cityName) {
            self.searches.remove(function (item) {
                return item == cityName;
            });
            self.searches.unshift(cityName);

            if (self.searches().length > 15) {
                self.searches.pop();
            }

            getCurentWeatherByCityName(cityName);
        };

        self.getPrecipitation = function (rain, snow) {
            var precipitation = 0;

            if (rain && rain['3h']) {
                precipitation += rain['3h'];
            }

            if (snow && snow['3h']) {
                precipitation += snow['3h'];
            }

            return precipitation;
        };

        function getCurentWeatherByCityName(cityName) {
            request.ajax("http://openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=b1b15e88fa797225412429c1c50c122a1", function (data) {
                isLoading = false;

                self.currentWeather(data);
            })
        }
    };

    var viewModel = new ViewModel();
    viewModel.init('Moscow');

    ko.applyBindings(viewModel);
}());