import fetch from './fetch'
export const isOffline = ()=>location.href.indexOf('file:///') != -1;
export const isAndroid = ()=>(/Android/i).test(window.navigator.userAgent);
export const isQQ = ()=>(/QQ/i).test(window.navigator.userAgent);
export const isWeChat = ()=>(/micromessenger/i).test(window.navigator.userAgent);
export const isWeibo = ()=>(/weibo/i).test(window.navigator.userAgent);
export const isIOS = (() => {
    let ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('iphone') != -1 || ua.indexOf('ipad') != -1 || ua.indexOf('ipod') != -1;
});

export const getQueryString = ((name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let result = window.location.search.substr(1).match(reg);
    if (result != null) return unescape(result[2]);
    return null;
});
export const param = function (obj) {
    var temp = [];
    for (var key in obj) {
        temp.push(key + '=' + encodeURIComponent(obj[key]));
    }
    return temp.join('&');
};


export const emptyFunc = ()=> {

};
export const alog = (name)=> {
    window.alog && window.alog('speed.set', name, +new Date);
    window.alog.fire && window.alog.fire("mark");
};
export const lazyLoad = (()=> {

    let hasListener = false;
    let xThreshold = 20;
    let yThreshold = 200;
    let timer;

    function listener() {
        timer && clearTimeout(timer);
        timer = setTimeout(()=> {
            let imgs = document.querySelectorAll('.lazy-load-img');
            imgs = Array.prototype.slice.call(imgs);
            imgs.forEach((imgItem)=> {
                let rect = imgItem.getBoundingClientRect();
                if (rect.top < window.screen.height + yThreshold && rect.left < window.screen.width + xThreshold) {
                    let realSrc = imgItem.getAttribute('data-src');
                    if (realSrc.indexOf('http://') != -1) {
                        imgItem.src = realSrc;
                        let className = imgItem.className.replace('lazy-load-img', ' ');
                        className += ' lazy-img-actived';
                        imgItem.className = className;
                    }
                }
            });
        }, 100);
    }

    return {
        add(options = {x: 20, y: 200}){
            options.x && (xThreshold = options.x);
            options.y && (yThreshold = options.y);
            if (!hasListener) {
                hasListener = true;
                window.addEventListener('scroll', listener, true);
            }
            listener();
        },
        remove(){
            if (hasListener) {
                hasListener = false;
                window.removeEventListener('scroll', listener, true);
            }
        },
        trigger(){
            return listener()
        }
    }
})();

export const sak = function (data) {
    var img = new Image();
    var params = {
        resid: 31,   //webapp
        func: "place",
        da_ver: "2.1.0",
        da_trd: 'xinpin_chisha',
        page: data.page || 'ChiShaIndex',
        da_src: data.da_src || 'ChiShaIndexPg',
        da_act: data.da_act || 'show',
        from: 'webapp',  //webapp,na-iphone na-android, nuomi-iphone, nuomi-android
        xid1: data.xid1 || '',    //        //
        xid2: data.xid2 || '',          //
        xid3: data.xid3 || '',     //
        xid4: data.xid4 || '',      //
        xid5: data.xid5 || '',
        city_id: '131',
        t: Date.now()
    };
    var url = 'http://log.waimai.baidu.com/static/transparent.gif?' + param(params);
    img.onload = function () {
        img = null;
    };
    img.src = url;
};

export const getParams = function (url) {
    var vars = {},
        hash, hashes, i;

    url = url || window.location.href;

    // 没有参数的情况
    if (url.indexOf('?') == -1) {
        return vars;
    }

    hashes = url.slice(url.indexOf('?') + 1).split('&');

    for (i = 0; i < hashes.length; i++) {
        if (!hashes[i] || hashes[i].indexOf('=') == -1) {
            continue;
        }
        hash = hashes[i].split('=');
        if (hash[1]) {
            vars[hash[0]] = (hash[1].indexOf("#") != -1) ? hash[1].slice(0, hash[1].indexOf("#")) : hash[1];
        }
    }
    return vars;
};


