let player, players;
let multiplayer = new MMOC();

function update(jscolor) {
    multiplayer.setOther("color", "#" + jscolor);
}

function randomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random()*16)];
    }
    return color;
}

function setup() {
    multiplayer.init();

    let c = randomColor();
    document.getElementById("color").jscolor.fromString(c);
    multiplayer.setOther("color", c);

    multiplayer.changeX(Math.floor(windowWidth/2));
    multiplayer.changeY(Math.floor(windowHeight/2));

    document.getElementById("modal").style.display = "block";
    document.getElementById("observer").onclick = function () {
        document.getElementById("modal").style.display = "none";
        player = false;
    };
    document.getElementById("player").onclick = function () {
        if (document.getElementById("color").value === "FFFFFF") {
            alert("You are not allowed to choose pure white");
        } else {
            document.getElementById("modal").style.display = "none";
        }
        player = true;
    };

    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.style("display", "block");
}

function draw() {
    background(255);
    if (player) {
        multiplayer.sendPlayerData();
        if (keyIsDown(87) || keyIsDown(38)) {
            multiplayer.changeY(-1);
        }
        if (keyIsDown(83) || keyIsDown(40)) {
            multiplayer.changeY(1);
        }
        if (keyIsDown(65) || keyIsDown(37)) {
            multiplayer.changeX(-1);
        }
        if (keyIsDown(68) || keyIsDown(39)) {
            multiplayer.changeX(1);
        }
    }

    players = multiplayer.getPlayers();
    for (let player in players) {
        fill(players[player]["Other"]["color"]);
        ellipse(players[player]["X"], players[player]["Y"], 20);
    }
}
