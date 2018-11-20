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
let OBJECTS = {};

app.ws('/ws', function (ws, req) {
    let userID;

    ws.on("open", function () {
        ws.on("close", function () {
            delete DATA[userID];
        })
    });

    ws.on('message', function (msgs) {
        let msg = JSON.parse(msgs);
        switch (msg.type) {
            case 1:
                userID = msg.id;

                DATA[msg.id] = {
                    X: msg.coordinates.x,
                    Y: msg.coordinates.y,
                    Z: msg.coordinates.z,
                    Orientation: msg.orientation,
                    Other: msg.other
                };
                break;

            case 2:
                OBJECTS[msg.id] = {
                    other: msg.other,
                    x: msg.coordinates.x,
                    y: msg.coordinates.y,
                    z: msg.coordinates.z
                };
                break;

            case 3:
                ws.send(JSON.stringify(DATA));
                break;

            case 4:
                delete OBJECTS[msg.id];
                break;

        }
    });
});

app.get("/debug*", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(DATA));
});

app.use(express.static('public'));

console.log(`[+] Running server on ${args.host}:${args.port}...`);
app.listen(args.port, args.host, function () {});

