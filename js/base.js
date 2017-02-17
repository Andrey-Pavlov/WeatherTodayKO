window.app = {
    namespace: function (namespace) {
        var object = this, tokens = namespace.split("."), token;

        while (tokens.length > 0) {
            token = tokens.shift();

            if (typeof object[token] === "undefined") {
                object[token] = {};
            }

            object = object[token];
        }

        return object;
    }
};