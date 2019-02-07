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
            console.log("success")
            // TODO: tell user to login
        }).catch(err => {
            console.error(err);
            // TODO: display error to user
        });
    });
}

function userLogin(email, password) {

}

function userLogout() {

}

function verifyToken() {

}
