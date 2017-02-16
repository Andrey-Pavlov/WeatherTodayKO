(function () {
    var ViewModel = function () {
        var isLoading = true,
            self = this;

        self.cityName = ko.observable();
        self.currentWeather = ko.observable();
        self.searches = ko.observableArray();

        self.getCurrentWeatherByCityName = function() {
            self.searches.remove(function(item) { return item == self.cityName(); });
            self.searches.unshift(self.cityName());

            if(self.searches().length > 15) {
                self.searches.pop();
            }

            getCurentWeatherByCityName(self.cityName);
        };

        self.getPrecipitation = function(rain, snow) {
            var precipitation = 0;

            if(rain && rain['3h']) {
                precipitation += rain['3h'];
            }

            if(snow && snow['3h']) {
                precipitation += snow['3h'];
            }

            return precipitation;
        };

        function getCurentWeatherByCityName(cityName) {
            ajax("http://openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=b1b15e88fa797225412429c1c50c122a1", function (data) {
                isLoading = false;

                self.currentWeather(data);
            })
        }
    };

    ko.applyBindings(new ViewModel());


    function ajax(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                callback(JSON.parse(this.response));
            } else {
            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
        };

        request.send();
    }
}());