function string2ArrayBuffer(string) {
    let buffer = new ArrayBuffer(string.length * 2);
    let bufferView = new Uint16Array(buffer);
    for (let i = 0, strLen=string.length; i < strLen; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}

function arrayBuffer2Base16(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function hashString(string) {
    let buffer = string2ArrayBuffer(string);
    crypto.subtle.digest("SHA-256", buffer);

    return new Promise(function (resolve, reject) {
        crypto.subtle.digest("SHA-256", buffer).then(ab => resolve(arrayBuffer2Base16(ab)));
    });
}

function userSignup(name, email, password, username) {
    let token = localStorage.getItem("token");
    if (token !== null) {
        console.error("already logged in");
        return;
    }

    hashString(password).then(hashed => {
        fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: hashed,
                username: username
            })
        }).then(res => res.json()).then(res => {
            if (res.status === "error") {
                console.error(res.reason);
                // TODO: display error to user
                return;
            }

            console.log("success")
            // TODO: tell user to login
        }).catch(err => {
            console.error(err);
            // TODO: display error to user
        });
    });
}

function userLogin(email, password) {
    let token = localStorage.getItem("token");
    if (token !== null) {
        console.error("already logged in");
        return;
    }

    hashString(password).then(hashed => {
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: hashed
            })
        }).then(res => res.json()).then(res => {
            if (res.status === "error") {
                console.error(res.reason);
                // TODO: display to user
                return
            } else if (!res.hasOwnProperty("token")) {
                console.error("unable to successfully log in: no token");
                // TODO: display to user
                return;
            }

            localStorage.setItem("token", res.token);
            // TODO: enable game
        }).catch(err => {
            console.error(err);
            // TODO: display error to user
        });
    });
}

function userLogout() {
    let token = localStorage.getItem("token");
    if (token === null) {
        console.log("not signed in");
        // TODO: inform user already logged out
        return;
    }

    fetch(`/api/logout?token=${token}`, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    }).then(res => res.json()).then(res => {
        if (res.status === "error") {
            console.error(res.reason);
            // TODO: force user to login
            return;
        }

        console.log("logged out");
        localStorage.removeItem("token");
        // TODO: disable game
    }).catch(err => {
        console.error(err);
        // TODO: display error to user
    });
}

function verifyToken() {
    let token = localStorage.getItem("token");
    if (token === null) {
        localStorage.removeItem("token");
        console.log("invalid");
        // TODO: force user to login
        return;
    }

    fetch(`/api/verify?token=${token}`, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    }).then(res => res.json()).then(res => {
        if (res.status === "error") {
            console.error(res.reason);
            // TODO: force user to login
            return;
        }
        console.log(`valid: ${res.valid}`);
    }).catch(err => {
        console.error(err);
        // TODO: display error to user
    });
}

function userUpdate(name="", email="", password="", username="") {
    let token = localStorage.getItem("token");
    if (token === null) {
        localStorage.removeItem("token");
        console.log("invalid");
        // TODO: force user to login
        return;
    }

    hashString(password).then(hashed => {
        if (hashed === "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855") hashed = "";

        fetch("/api/update", {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Token": token
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: hashed,
                username: username
            })
        }).then(res => res.json()).then(res => {
            if (res.status === "error") {
                console.error(res.reason);
                // TODO: display to user
                return;
            }

            // TODO: display success
            console.log("updated");
        }).catch(err => {
            console.error(err);
            // TODO: display to user
        });
    });
}
