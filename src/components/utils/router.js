function Router(routers) {
    this.router = routers;
    this.parseUrl();
    this.init();

    this.currentPath = "";
    this.currentRouter = null;
    this.pageStack = [];

    var newUrl = location.href.replace('#weixin.qq.com', '');
    newUrl = newUrl.replace(/&from=na\-iphone/g, '');
    history.replaceState({}, '', newUrl);

    var mats = location.hash.match(/#([^?]*?)\?(.*)/);
    if (mats && mats.length == 3) {
        var s = mats[2].replace(/\?/g, '&');

        var url = location.href.replace(mats[0], '');
        if (location.search) {
            url += '&' + s;
        } else {
            url += '?' + s;
        }
        url += '#' + mats[1];
        history.replaceState({}, '', url);
    }

    // var mats = location.hash.match(/#\/(?:.*?)(\?openId=(.*))$/);
    // if(mats && mats.length == 3){
    // 	var url = location.hash.replace(mats[2], '')
    // 	history.replaceState({}, '', url);
    // }

    this.change();
}

Router.prototype.init = function () {
    var me = this;
    if (history.pushState) {
        window.addEventListener('popstate', popState);
    } else if ("onhashchange" in window && (!document.documentMode || document.documentMode >= 8)) {
        // window.onhashchange = pathChange;
    }

    function popState() {
        var hash = location.hash;
        me.change();
    }
};

Router.prototype.change = function () {
    var hash = location.hash.slice(1);
    if (!location.hash) {
        this.dispatch('default');
    } else if (hash != this.currentPath) {
        this.dispatch(hash);
    }
};

Router.prototype.parseUrl = function () {
    var me = this;
    for (var r in me.router) {
        if (r != 'default') {
            var reg = r.replace(/\/:\w*?(\/|$)/, '/(\\w+)/');
            reg = reg.replace('/', '\\/');
            me.router[r].reg = reg.replace(/\/:\w*?(\/|$)/, '/(\\w+)/');
            me.router[r].path = r;
        }
    }
};

Router.prototype.dispatch = function (path) {
    var me = this;
    var route = this.router[path];
    var params = {};
    if (!route) {
        for (var r in me.router) {
            var reg = new RegExp('^' + me.router[r].reg + '$');
            var tempPath = path;
            if (tempPath.slice(-1) != '/') {
                tempPath += '/';
            }
            var mats = tempPath.match(reg);
            if (mats) {
                var count = 1;
                route = me.router[r];
                r.split('/').forEach(function (item, i) {
                    if (item.indexOf(':') == 0) {
                        params[item.slice(1)] = mats[count];
                        count++;
                    }
                });
                break;
            }
        }
    }
    if (route) {
        if (route.redirect) {
            me.dispatch(route.redirect);
            return;
        }
        me.loadPage(path, route, params);
    }
};

Router.prototype.changePage = function (path) {
    if (history.pushState) {
        var url = location.href.replace(location.hash, '') + '#' + path;
        history.pushState({path: path}, '', url);
        this.pageStack.push(this.currentPath);
    }
    this.dispatch(path);
};

Router.prototype.back = function () {
    var stack = this.pageStack;
    var path = stack.pop();

    history.back();
};

Router.prototype.loadPage = function (path, route, params) {
    var r = this.router[this.currentPath];
    r && r.leave && r.leave();
    route.enter && route.enter(params);
    this.currentPath = path;
    this.currentRouter = route;
};
let routeInstance;
export const route = (routers)=> {
    routeInstance = new Router(routers);
    return routeInstance;
}

export const canBack = ()=> {
    const stack = routeInstance.pageStack;
    return stack.length > 0;
}

export const back = ()=> {
    if (routeInstance) routeInstance.back();
}

