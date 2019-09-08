let request = require("request-promise")
class RequestEngine {
    constructor() {
        this.jar = request.jar();
        request = request.defaults({
            jar: this.jar,
            followAllRedirects: true
        });
    }
    async initializeCookies() {
        await request({ method: "GET", url: 'https://shatelland.com/upload' });
    }
    async login(email, password) {
        var options = {
            resolveWithFullResponse: true,
            method: 'POST',
            url: 'https://shatelland.com/Authentication/Login',
            headers: {
                'cache-control': 'no-cache',
                'Accept-Language': 'en-US,en;q=0.9',
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form:
            {
                Email: email,
                Password: password,
                Remember: 'true',
                'Item1.Remember': 'false',
                redirectTo: '~/Upload/Index'
            }
        };
        try {
            let res = await request(options);
            if (res.body.includes('<script src="/uploadCenter/js/libs/angular-resource.js"></script>'))
                return true;
            else
                return false
        } catch (e) {
            return false;
        }

    }
    async uploadFile(url) {
        var options = {
            method: 'POST',
            url: 'https://dl4.shatelland.com/api/Leech',
            resolveWithFullResponse: true,
            headers:
            {
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
                Origin: 'https://shatelland.com',
                Referer: 'https://shatelland.com/Upload/Index',
                Accept: '*/*'
            },
            body:
            {
                Url: url,
                ConnectionId: '',
                FolderId: 0
            },
            json: true
        };
        try {
            await request(options);
            return true;
        } catch (e) {
            return false;
        }
    }
    async cancelUpload() {
        var options = {
            method: 'GET',
            url: 'https://dl4.shatelland.com/api/LeechManager/currentuser/cancel',
            headers:
            {
                Accept: 'application/json, text/plain, */*'
            }
        };
        try {
            await request(options);
        } catch (e) {
            console.log("Oops")
        }

    }
}
module.exports = RequestEngine;