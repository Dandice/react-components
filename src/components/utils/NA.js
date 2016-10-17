import {isOffline, getQueryString, isQQ, isWeChat, isWeibo, getWXToken} from './utils'

const NA = {
    titleBarData: {
        title: '吃啥',
        rightMenu: undefined,
        rightMenuFunc: undefined,
        actionList: undefined,
        backFunction: undefined
    },
    /**
     *@title 标题
     *@rightMenu 右上菜单
     *@backFunc 返回回调
     *@rightMenuFunc 右上菜单回调
     */
    setTitleBar(options) {
        if (!window.WMApp) return;
        if (options.useBefore) {
            delete options.useBefore;
            NA.titleBarData = {
                ...NA.titleBarData,
                ...options
            }
        } else {
            NA.titleBarData = options;
        }
        const {title, rightMenu, actionList, rightMenuFunc, backFunction} = NA.titleBarData;
        window.WMApp.page.setTitleBar({
            titleText: title,    // 标题
            titleClickAble: 0,     // 是否可点击，0不可点，1可点，默认0
            actionText: rightMenu,     // 右边操作文案，
            actionClickAble: 1,    // 右边按钮是否可点击
            actionList: actionList
        });
        // 回退事件，返回1表示关闭，返回非1表示关闭，默认客户端直接关闭
        window.WMApp.entry.setPageAction('onBack', backFunction);
        // 操作点击事件回调
        if (rightMenuFunc) {
            window.WMApp.entry.setPageAction('onActionClick', rightMenuFunc);
        }
    },
    login(url) {
        return new Promise((resolve, reject)=> {
            if (window.WMApp) {
                WMApp.account.login(function (data) {
                    if (data.status) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            } else {
                location.href = 'http://wappass.baidu.com/passport/?authsite=1&sms=1&u=' + encodeURIComponent(url);
            }
        });
    },
    getAsyncLocation(callback){
        WMApp.location.getAsyncLocation(function (data) {
            callback({
                "city_id": data.cityId,
                "lng": parseFloat(data.lng),
                "lat": parseFloat(data.lat)
            });
        });
    },
    getSyncLocation () {
        if (window.WMApp) {
            const data = WMApp.location.getSyncLocation();
            return {
                "city_id": data.cityId,
                "lng": parseFloat(data.lng),
                "lat": parseFloat(data.lat)
            };
        } else {
            //return {};
            return {
                "city_id": 131,
                "lng": 12948327.01,
                "lat": 4844687.5
            };
        }
    },
    getUserInfo () {
        if (window.WMApp) {
            return new Promise((resolve) => {
                WMApp.account.getUserInfo(data => {
                    resolve(data);
                });
            });
        } else {
            return Promise.resolve({});
        }
    },
    sendOfflineStat (params) {
        if (window.WMApp) {
            WMApp.stat.sendOfflineStat(params);
        }
    },
    changePage(options){
        const {newPage = true, url = location.href, title = "吃啥", offline = true, scrollViewBounces = 1} = options;
        if (!window.WMApp || !newPage) {
            location.href = url.replace('#', `?time=${Date.now()}#`)
        }
        if (offline && isOffline() && window.WMApp) {
            var hashs = url.split('#');
            NA.gotoOffsetPage('index', title, {router: hashs[1]});
        }
        else {
            var params = {
                pageName: 'webview',
                pageParams: {
                    url: encodeURIComponent(url),    // url需encode
                    header: 1,     // 0无头，1白头，2红头，默认1
                    scrollViewBounces: scrollViewBounces
                }
            };
            window.WMApp.page.changePage(params);
        }
    },
    gotoOffsetPage(page, title, pdata) {
        var data = {
            pluginId: "bdwm.plugin.chisha",
            page: page,
            title: encodeURIComponent(title),
            pageData: encodeURIComponent(JSON.stringify(pdata))
        }
        var link = `bdwm://plugin?pluginId=${data.pluginId}&pageName=${data.page}&title=${data.title}&pageData=${data.pageData}&scrollViewBounces=0`;
        location.href = link;
    },
    pageRefresh() {
        if (!window.WMApp) return;
        let args = arguments;
        let freshTimer;
        WMApp.page.openPageRefresh();
        WMApp.entry.setPageAction('onPageRefresh', ()=> {
            let argumentsArray = Array.prototype.slice.call(args);
            let allPromise = argumentsArray.map(function (func) {
                return func()
            });
            Promise.all(allPromise).then(function () {
                freshTimer && clearTimeout(freshTimer);
                WMApp.page.hidePageRefresh();
            }, error=> {
                freshTimer && clearTimeout(freshTimer);
                WMApp.page.hidePageRefresh();
            });
            freshTimer = setTimeout(()=> {
                WMApp.page.hidePageRefresh();
            }, 3000);
        });
    },
    showLoading(){
        window.WMApp && window.WMApp.nui.loading({show: 1});
    },
    hideLoading(){
        window.WMApp && window.WMApp.nui.loading({show: 0});
    }
};

export default NA
