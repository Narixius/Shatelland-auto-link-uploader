const inquirer = require('inquirer');
const notifier = require('node-notifier');
const Spinner = require('cli-spinner').Spinner;
require('colors');
let store = require('./store')
store = new store();
let RequestEngine = require("./requestEngine")
RequestEngine = new RequestEngine();
class App {
    constructor() {
        this.userNotified = false;
        console.log("Welcome to Shatelland.com auto link uploader.".black.bgGreen)
    }
    async start() {
        var spinner = new Spinner('%s Loading... ');
        spinner.setSpinnerString("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");
        spinner.start();
        await RequestEngine.initializeCookies();
        spinner.stop(true);
        console.log("You need to login to the service first.".cyan)
        await this.authDataCommand();
        this.controller();
        this.autoUploader();
    }
    async controller() {
        for (; ;) {
            console.log("");
            console.log(((!this.userNotified) ? "You can upload files now." : "You can upload another file").black.bgGreen)
            await this.getUploadURL();
        }
    }
    async authDataCommand() {
        var questions = [
            {
                type: 'input',
                name: 'email',
                message: 'Please enter username :',
            },
            {
                type: 'password',
                name: 'password',
                message: 'Please enter password :',
            },
        ]
        var answers = await inquirer.prompt(questions);
        var spinner = new Spinner('%s Logging in... ');
        spinner.setSpinnerString("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");
        spinner.start();
        let res = await RequestEngine.login(answers.email, answers.password)
        spinner.stop(true);
        if (!res) {
            console.log("⚠️ Incorrect credentials. Try again...".black.bgRed);
            await this.authDataCommand();
        } else {
            console.log("✔️ Signed in successfully".black.bgGreen)
        }
    }
    autoUploader() {
        setInterval(async () => {
            if (store.get("urls").length > 0) {
                let res = await RequestEngine.uploadFile(store.get("urls")[0]);
                if (res) {
                    notifier.notify({
                        title: 'Shatelland Uploader',
                        message: 'another Queued link has started uploading - ' + store.get("urls")[0]
                    });
                    store.removeFirst();
                }
            } else if (!this.userNotified) {
                notifier.notify({
                    title: 'Shatelland Uploader!',
                    message: '✔️ All links uploaded'
                });
                this.userNotified = true;
            }
        }, 4000)
    }
    async getUploadURL() {
        var questions = [
            {
                type: 'input',
                name: 'url',
                message: 'Please enter the file url :',
                validate: function (value) {
                    var pass = value.match(
                        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i
                    );
                    if (pass) {
                        return true;
                    }
                    return 'It\'s not a valid url! ';
                }
            },
        ]
        var answers = await inquirer.prompt(questions);
        var spinner = new Spinner('%s Uploading Request... ');
        spinner.setSpinnerString("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");
        spinner.start();
        let res = await RequestEngine.uploadFile(answers.url);
        spinner.stop(true);
        if (!res) {
            this.userNotified = false;
            store.add(answers.url);
            console.log("⚠️ You are uploading another file.".black.bgYellow)
            console.log("⚠️ You link has been added to queue and will upload after first one ends.".black.bgYellow)
        } else {
            this.userNotified = false;
            console.log("✔️ Upload has started".black.bgGreen)
        }
    }
}
module.exports = App;