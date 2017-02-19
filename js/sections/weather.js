(function () {
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

    app.namespace('weather').WeatherPageSectionViewModel = WeatherPageSectionViewModel;
}());