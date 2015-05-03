var Storage = require('./Storage');

var State = function (opt) {
    if (!opt || !opt.name || !opt.state) {
        throw 'name and state argument is required';
    }

    var name = opt.name,
        state = opt.state;

    var tmp = Storage.getItem(name);
    if (!tmp) {
        tmp = state;
        Storage.setItem(name, tmp);
    }
    this.orig = state;
    this.name = name;
    this.state = tmp;
};

State.prototype.get = function () {
    return Storage.getItem(this.name);
};

State.prototype.set = function (state) {
    Storage.setItem(this.name, state);
};

State.prototype.clear = function (state) {
    Storage.setItem(this.name, this.orig);
};

module.exports = {
    init: function (opt) {
        return new State(opt);
    }
};
