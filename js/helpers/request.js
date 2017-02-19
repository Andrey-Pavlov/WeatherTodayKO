(function() {
    function ajax(url, callback, httpErrorCallback, xhrErrorCallback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                callback(JSON.parse(this.response));
            } else {
                httpErrorCallback(this.response);
            }
        };

        request.onerror = function () {
            xhrErrorCallback(arguments);
        };

        request.send();
    }

    var jsonp = (function(){
        var that = {};

        that.send = function(src, options) {
            var options = options || {},
                callback_name = options.callbackName || 'callback',
                on_success = options.onSuccess || function(){},
                on_timeout = options.onTimeout || function(){},
                timeout = options.timeout || 10;

            var timeout_trigger = window.setTimeout(function(){
                window[callback_name] = function(){};
                on_timeout();
            }, timeout * 1000);

            window[callback_name] = function(data){
                window.clearTimeout(timeout_trigger);
                on_success(data);
            };

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = src;

            document.getElementsByTagName('head')[0].appendChild(script);
        };

        return that;
    })();


    app.namespace('request').ajax = ajax;
    app.namespace('request').jsonp = jsonp;
}());