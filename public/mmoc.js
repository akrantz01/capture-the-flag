let MMOC = (function () {
    const reqd = (name) => {
        throw new Error("Expected argument '" + name + "'")
    };

    const SERVER_CODES = Object.freeze({
        SET_PLAYER_DATA: 1,
        SET_OBJECT_DATA: 2,
        DELETE_OBJECT: 3,
        BROADCAST: 4,
        UPDATE_SCORE: 5,
        TAKE_FLAG: 6,
        RESET_FLAG: 7,
        UPDATE_HEALTH: 8,
        EVENT_FLAG: 9
    });

    let _id = "";
    let _x = 0;
    let _y = 0;
    let _z = 0;
    let _orientation = 0;
    let _other = {};
    let _data = {};
    let _broadcasts = {};
    let _flag_events = {};
    let _connected = false;


    class MMOC {
        init(id_len = 8) {
            this.ws = new WebSocket(`wss://${document.domain}/ws`);

            this.ws.onopen = function (event) {
                let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (let i = 0; i < id_len; i++) {
                    _id += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                _connected = true;
            };

            this.ws.onmessage = function (event) {
                let broad = event.data;
                let other = "";
                let index = broad.indexOf("}\n{");
                if (index === -1) index = broad.indexOf("}{");
                if (index === -1) index = broad.indexOf("} {");
                if (index !== -1) {
                    broad = broad.substring(index + 1);
                    other = event.data.substring(0, index + 1);
                    broad = JSON.parse(broad);
                    other = JSON.parse(other);

                    if (broad.Type === SERVER_CODES.BROADCAST) _broadcasts[broad.ID] = broad;
                    else if (broad.Type === SERVER_CODES.EVENT_FLAG) _flag_events = broad;
                    else _data = broad;
                    if (other.Type === SERVER_CODES.BROADCAST) _broadcasts[other.ID] = other;
                    else if (other.Type === SERVER_CODES.EVENT_FLAG) _flag_events = other;
                    else _data = other;
                } else {
                    let d = JSON.parse(event.data);
                    if (d.Type === SERVER_CODES.BROADCAST) _broadcasts[d.ID] = d;
                    else if (d.Type === SERVER_CODES.EVENT_FLAG) _flag_events = d;
                    else _data = d;
                }
            };
        }

        sendPlayerData() {
            if (!_connected) return;
            this.ws.send(JSON.stringify({
                type: SERVER_CODES.SET_PLAYER_DATA,
                id: _id,
                other: _other,
                coordinates: {
                    x: _x,
                    y: _y,
                    z: _z
                },
                orientation: _orientation
            }));
        }

        sendObjectData(object = reqd('object')) {
            if (!_connected) return;
            this.ws.send(JSON.stringify({
                type: SERVER_CODES.SET_OBJECT_DATA,
                id: object.id,
                other: object.other,
                coordinates: {
                    x: object.x,
                    y: object.y,
                    z: object.z
                }
            }));
        }

        removeObject(object = reqd('object')) {
            if (!_connected) return;
            this.ws.send(JSON.stringify({
                type: SERVER_CODES.DELETE_OBJECT,
                id: object.id
            }));
        }

        broadcast(id = reqd('id'), x = reqd('x'), y = reqd('y'), z = reqd('z'), dx = reqd('dx'), dy = reqd('dy'), dz = reqd('dz'), size = reqd('size')) {
            if (!_connected) return;
            this.ws.send(JSON.stringify({
                type: SERVER_CODES.BROADCAST,
                id: id,
                vel: {
                    x: dx,
                    y: dy,
                    z: dz
                },
                coordinates: {
                    x: x,
                    y: y,
                    z: z
                },
                size: size
            }))
        }

        getScores() {
            return _data["Scores"];
        }

        updateScore() {
            if (!_connected) return;
            this.ws.send(JSON.stringify({
                type: SERVER_CODES.UPDATE_SCORE,
                id: _id
            }));
        }

        gotFlag(flag) {
            if (!_connected) return;
            this.ws.send(JSON.stringify({
                type: SERVER_CODES.EVENT_FLAG,
                id: _id,
                flag: flag,
                action: 1
            }));
            this.ws.send(JSON.stringify({
                type: SERVER_CODES.TAKE_FLAG,
                id: _id
            }));
        }

        lostFlag(flag) {
            if (!_connected) return;
            this.ws.send(JSON.stringify({
                type: SERVER_CODES.EVENT_FLAG,
                id: _id,
                flag: flag,
                action: 0
            }));
            this.ws.send(JSON.stringify({
                type: SERVER_CODES.RESET_FLAG,
                id: _id
            }));
        }

        changeHealth(by, id) {
            if (!_connected) return;
            this.ws.send(JSON.stringify({
                type: SERVER_CODES.UPDATE_HEALTH,
                id: id,
                health: by
            }));
        }

        getData() {
            return _data;
        }

        getPlayers() {
            return _data["Users"];
        }

        getGlobals() {
            return _data["Globals"];
        }

        getObjects() {
            return _data["Objects"];
        }

        getBroadcasts() {
            let temp = JSON.parse(JSON.stringify(_broadcasts));
            _broadcasts = {};
            return temp;
        }

        getFlagEvents() {
            let temp = JSON.parse(JSON.stringify(_flag_events));
            _flag_events = {};
            return temp;
        }

        setPosition(x = reqd('x'), y = reqd('y'), z = reqd('z')) {
            _x = x;
            _y = y;
            _z = z;
        }

        getID() {
            return _id;
        }

        setOrientation(by = reqd("by")) {
            _orientation = by;
        }

        setOther(key = reqd("key"), value = reqd("value")) {
            _other[key] = value;
        }

        isconnected() {
            return new Promise(function (resolve, reject) {
                if (_connected) {
                    resolve();
                } else {
                    reject();
                }
            });
        }
    }

    return MMOC;
})();

class MovingObject {
    constructor(mesh, p, r) {
        this.id = (function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x1000).toString(16).substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        })();
        this.mesh = mesh;

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.other = {};

        this.p = p;
        this.r = r;
    }

    render() {
        this.p();
        this.r();
    }

    setOther(key, value) {
        this.other[key] = value;
    }

    getOther(key) {
        return this.other[key];
    }
}
