let express = require('express');

let app = express();
let expressws = require('express-ws')(app);

let args = require("yargs")
    .usage("$0 [--host <host>] [--port <port>]")
    .alias("h", "host")
    .nargs("h", 1)
    .describe("h", "host to bind the server to")
    .default("h", "127.0.0.1")
    .string("h")
    .alias("p", "port")
    .nargs("p", 1)
    .describe("p", "port to bind the server to")
    .default("p", 8080)
    .number("p")
    .help("help")
    .argv;

if (isNaN(args.port)) {
    console.error("[-] Error starting: Port must be a number");
    process.exit(1);
}

let DATA = {};

app.ws('/ws', function (ws, req) {
    ws.on('message', function (msg) {
        console.log(msg)
    });
});

app.get("/debug*", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(DATA));
});

app.use(express.static('public'));

console.log(`[+] Running server on ${args.host}:${args.port}...`);
app.listen(args.port, args.host, function () {});

