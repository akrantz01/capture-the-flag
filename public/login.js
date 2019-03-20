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
    let buffer = string2ArrayBuffer(string);
    crypto.subtle.digest("SHA-256", buffer);

    return new Promise(function (resolve, reject) {
        crypto.subtle.digest("SHA-256", buffer).then(ab => resolve(arrayBuffer2Base16(ab)));
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

window.onload = () => {
    let state = STATES.LOGIN;

    // Event listeners for login
    document.getElementById("login-switch").onclick = () => {
        state = STATES.SIGNUP;
        document.getElementById("login-log").innerText = "";
        document.getElementById("login-email").value = "";
        document.getElementById("login-password").value = "";
    };
    document.getElementById("login-submit").onclick = (e) => {
        e.target.disabled = true;
        userLogin(document.getElementById("login-email").value, document.getElementById("login-password").value).then(() => {
            userData().then(data => {
                localStorage.setItem("user", JSON.stringify(data));

                document.getElementById("account-data-name").innerText = data.name;
                document.getElementById("account-data-email").innerText = data.email;
                document.getElementById("account-data-username").innerText = data.username;
                document.getElementById("account-data-highscore").innerText = data.statistics.highscore;
                document.getElementById("account-data-timeplayed").innerText = data.statistics.time_played;

                state = STATES.ACCOUNT;
                e.target.disabled = false;
            }).catch(err => {
                document.getElementById("account-log").innerText = capitalizeFirstLetter(err.toString());
            });
        }).catch(err => {
            document.getElementById("login-log").innerText = capitalizeFirstLetter(err.toString());
            e.target.disabled = false;
        });
    };

    // Event listeners for signup
    document.getElementById("signup-switch").onclick = () => {
        state = STATES.LOGIN;
        document.getElementById("signup-log").innerText = "";
        document.getElementById("signup-email").value = "";
        document.getElementById("signup-password").value = "";
        document.getElementById("signup-name").value = "";
        document.getElementById("signup-username").value = "";
    };
    document.getElementById("signup-submit").onclick = (e) => {
        e.target.disabled = true;
        userSignup(document.getElementById("signup-name").value, document.getElementById("signup-email").value, document.getElementById("signup-password").value, document.getElementById("signup-username").value).then(status => {
            state = (status) ? STATES.LOGIN : STATES.ACCOUNT;
            e.target.disabled = false;
        }).catch(err => {
            document.getElementById("signup-log").innerText = capitalizeFirstLetter(err.toString());
            e.target.disabled = false;
        });

    };


    // Event listeners for account
    document.getElementById("account-logout").onclick = (e) => {
        e.target.disabled = true;
        userLogout().then(() => {
            state = STATES.LOGIN;
            e.target.disabled = false;
            document.getElementById("account-log").innerText = "";
            document.getElementById("account-email").value = "";
            document.getElementById("account-password").value = "";
            document.getElementById("account-name").value = "";
            document.getElementById("account-username").value = "";
        }).catch(err => {
            document.getElementById("account-log").innerText = capitalizeFirstLetter(err.toString());
            e.target.disabled = false;
        });
    };
    document.getElementById("account-submit").onclick = (e) => {
        e.target.disabled = true;
        userUpdate(document.getElementById("account-name").value, document.getElementById("account-email").value, document.getElementById("account-password").value, document.getElementById("account-username").value).then(() => {
            userData().then(data => {
                localStorage.setItem("user", JSON.stringify(data));

                document.getElementById("account-data-name").innerText = data.name;
                document.getElementById("account-data-email").innerText = data.email;
                document.getElementById("account-data-username").innerText = data.username;
                document.getElementById("account-data-highscore").innerText = data.statistics.highscore;
                document.getElementById("account-data-timeplayed").innerText = data.statistics.time_played;

                e.target.disabled = false;
                document.getElementById("account-log").innerText = "";
                document.getElementById("account-email").value = "";
                document.getElementById("account-password").value = "";
                document.getElementById("account-name").value = "";
                document.getElementById("account-username").value = "";
            }).catch(err => {
                document.getElementById("account-log").innerText = capitalizeFirstLetter(err.toString());
            });
        }).catch(err => {
            document.getElementById("account-log").innerText = capitalizeFirstLetter(err.toString());
            e.target.disabled = false;
        });
    };


    verifyToken().then(status => {
        if (status) state = STATES.ACCOUNT;
        else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    }).catch(() => {
        state = STATES.LOGIN;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }).finally(() => {
        document.getElementById("login-switch").disabled = false;
        document.getElementById("login-submit").disabled = false;

        setInterval(() => {
            switch (state) {
                case STATES.LOGIN:
                    document.getElementById("state_login").style.display = "block";
                    document.getElementById("state_signup").style.display = "none";
                    document.getElementById("state_account").style.display = "none";
                    break;

                case STATES.SIGNUP:
                    document.getElementById("state_login").style.display = "none";
                    document.getElementById("state_signup").style.display = "block";
                    document.getElementById("state_account").style.display = "none";
                    break;

                case STATES.ACCOUNT:
                    let user = JSON.parse(localStorage.getItem("user"));
                    document.getElementById("account-data-name").innerText = user.name;
                    document.getElementById("account-data-email").innerText = user.email;
                    document.getElementById("account-data-username").innerText = user.username;
                    document.getElementById("account-data-highscore").innerText = user.statistics.highscore;
                    document.getElementById("account-data-timeplayed").innerText = user.statistics.time_played;

                    document.getElementById("state_login").style.display = "none";
                    document.getElementById("state_signup").style.display = "none";
                    document.getElementById("state_account").style.display = "block";
                    break;
            }
        }, 15);
    });
};
