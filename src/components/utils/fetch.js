const params = (params, encode)=> {
    if (!params) return '';
    let temp = [];
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            temp.push(key + '=' + (encode ? encodeURIComponent(params[key]) : params[key]))
        }
    }
    return temp.join('&')
}
const errorHandle = (p) => {
    return p.then(json=> {
        if (json.error_no !== undefined && json.error_no) {
            throw json;
        }
        return json;
    });
}

const fetch = (options)=> {
    const {method = 'GET', data, type = "json", redux = true, encode = true} = options;
    let {url} = options;
    let headers = {
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest'
    };
    switch (method) {
        case 'GET':
            if (url[url.length - 1] == '?') {
                url = url + params(data, encode);
            } else {
                url = url + '?' + params(data, encode);
            }
            break;
        case 'POST':
            headers = {
                ...headers,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            };
            break;
        default:
    }
    const ops = {
        method,
        headers,
        type,
        data,
    };
    if (method !== 'GET') {
        ops.body = params(data);
    }
    if (redux) {
        return dispatch => {
            return errorHandle(send(url, ops))
        }
    }
    else {
        return errorHandle(send(url, ops))
    }
}

export default fetch;