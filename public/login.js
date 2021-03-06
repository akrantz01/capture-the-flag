STATES = Object.freeze({
    LOGIN: 0,
    SIGNUP: 1,
    ACCOUNT: 2
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

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
    if (!crypto.hasOwnProperty("subtle")) {
        console.error("Site must be served over HTTPS");
    }

    return new Promise(function (resolve) {
        crypto.subtle.digest("SHA-256", string2ArrayBuffer(string)).then(ab => resolve(arrayBuffer2Base16(ab)));
    });
}

function userSignup(name, email, password, username) {
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem("token");
        if (token !== null) {
            resolve(false);
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
                    reject(res.reason);
                    return;
                }

                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    });
}

function userLogin(email, password) {
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem("token");
        if (token !== null) {
            resolve(false);
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
                    reject(res.reason);
                    return
                } else if (!res.hasOwnProperty("token")) {
                    reject("no token");
                    return;
                }

                localStorage.setItem("token", res.token);
                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    });

}

function userLogout() {
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem("token");
        if (token === null) {
            resolve(false);
            return;
        }

        fetch("/api/logout", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Token": token
            }
        }).then(res => res.json()).then(res => {
            if (res.status === "error") {
                reject(res.reason);
                return;
            }

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            resolve(true);
        }).catch(err => {
            reject(err);
        });
    });


}

function verifyToken() {
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem("token");
        if (token === null) {
            localStorage.removeItem("token");
            resolve(false);
            return;
        }

        fetch("/api/verify", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Token": token
            }
        }).then(res => res.json()).then(res => {
            if (res.status === "error") {
                reject(res.reason);
                return;
            }
            resolve(res.valid);
        }).catch(err => {
            reject(err);
        });
    });

}

function userUpdate(name="", email="", password="", username="") {
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem("token");
        if (token === null) {
            localStorage.removeItem("token");
            resolve(false);
            return;
        }

        hashString(password).then(hashed => {
            // SHA256 value of "" <empty>
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
                    reject(res.reason);
                    return;
                }

                resolve(true);
            }).catch(err => {
                reject(err);
            });
        });
    });

}

function userData() {
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem("token");
        if (token === null) {
            localStorage.removeItem("token");
            resolve(false);
            return;
        }

        fetch("/api/user", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Token": token
            }
        }).then(res => res.json()).then(res => {
            if (res.status === "error") {
                reject(res.reason);
                return;
            }
            resolve(res.user);
        }).catch(err => {
            reject(err);
        })
    });
}

function userForgotPassword(email) {
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem("token");
        if (token !== null) {
            resolve(false);
            return;
        }

        fetch(`/api/forgot-password?email=${email}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }).then(res => res.json()).then(res => {
            if (res.state === "error") {
                reject(res.reason);
                return;
            }
            resolve(true);
        }).catch(err => {
            reject(err);
        });
    });
}

function checkPasswords(p, c) {
    let pw = document.getElementById(p);
    let pw_conf = document.getElementById(c);

    return function () {
        if (pw.value !== pw_conf.value) {
            pw.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
            pw_conf.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        } else {
            pw.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            pw_conf.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        }
    };
}
