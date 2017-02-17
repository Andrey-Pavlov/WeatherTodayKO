(function() {
    function ajax(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                callback(JSON.parse(this.response));
            } else {
            }
        };

        request.onerror = function () {
            // There was a connection error of some sort
        };

        request.send();
    }

app.namespace('request').ajax = ajax;
}());