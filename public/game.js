var url = "https://palmer-jc.github.io/lib/QueuedInterpolation.1.1.min.js";
var s = document.createElement("script");
s.src = url;
document.head.appendChild(s);

//list of pressed keys
var keys = [];

// Key codes
// The commented numbers are for arrow keys
var LEFT = 65; // 37;
var UP = 87; // 38;
var RIGHT = 68; // 39;
var DOWN = 83; // 40;
var SPACE = 32;

let date = new Date();

//map coords
//var map = [];

//list of projectiles
var proj = [];

//players
var player;
var otherPlayers = {};

var decalList = [];

var playerModel;

var spawns = [{x: 243.85, y: 132, z: -218.78}, {x: -343.63, y: 132, z: 293.73}];

var healthbar;

let mousedown = false;

let groundDecalList = [];

var createScene = function () {
    var gravityVector = new BABYLON.Vector3(0, -100, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    //playerModel = task.loadedMeshes[0];
    /*BABYLON.SceneLoader.ImportMesh("", "./OBJ/", "Snowman-Generic3.obj", scene, function (newMeshes) {
        // Set the target of the camera to the first imported mesh
        playerModel = newMeshes[0];
    });*/

    //lights
    var light = new BABYLON.DirectionalLight("DirLight", new BABYLON.Vector3(-0.1, -1, 0.2), scene);
    light.specular = new BABYLON.Color3(0, 0, 0);
    light.position = new BABYLON.Vector3(300, 0, 100);
    light.shadowEnabled = true;

    var light3 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, -1, 0), scene);
    light3.diffuse = new BABYLON.Color3(0.7, 0.7, 0.9);
    light3.specular = new BABYLON.Color3(0, 0, 0);
    light3.intensity = 0.8;

    //create ground
    let width = 1000;
    let height = 1000;

    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "map2.png", width, height, 60, 0, 255 / 2, scene, false);
    let ray = new BABYLON.Ray(new BABYLON.Vector3(0, 200, 0), new BABYLON.Vector3(0, -1, 0), 400);
    //ground.position.set(500, 0, 500);
    /*BABYLON.Mesh.CreateGround("ground", width, height, 80, scene, true);

    ground.position.set(0, -30, 0);

    var positions = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);

    let dx = width / map.length;
    let index = 0;
    for (var y = 0; y < 80; y++) {
        for (var x = 0; x < 80; x++) {
            positions[index + 1] = map[y][positions[index] / dx + 40];
            index += 3;
        }
    }

    ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    ground.occlusionType = BABYLON.AbstractMesh.OCCLUSION_TYPE_NONE;*/

    var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("grid.jpg", scene);
    groundMaterial.diffuseTexture.uScale = 160 * 2;
    groundMaterial.diffuseTexture.vScale = 160 * 2;
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    groundMaterial.emissiveColor = new BABYLON.Color3(0, 0, 0);
    groundMaterial.ambientColor = new BABYLON.Color3(0, 0, 0);
    ground.material = groundMaterial;

    //create player/data
    player = new Player(0, 0, 0, playerModel);
    let spawn = true;
    let team = 0;
    let lastPlayerPos = new BABYLON.Vector3();

    var flags = [new Flag(spawns[0].x, spawns[0].y, spawns[0].z, 1), new Flag(spawns[1].x, spawns[1].y, spawns[1].z, 2)];

    let gunOffset = new Vector(0, 1, 0);

    function rotateGunOffset(alpha) {
        gunOffset.x = Math.cos(alpha + Math.PI / 2);
        gunOffset.z = Math.sin(alpha + Math.PI / 2);
    }

    let startCamPos = [camera.beta, camera.alpha];
    let weaponTypes = {
        normal: function (alpha, beta) {
            rotateGunOffset(alpha);
            alpha += 0.01;
            let vel = new Vector(Math.cos(alpha) * Math.sin(beta), Math.cos(beta), Math.sin(alpha) * Math.sin(beta));
            proj.push(new Projectile(fromBabylon(player.mesh.position).add(gunOffset).add(vel.mult(-4)), vel.mult(3), team, true, 1));
        },
        machineGun: function (alpha, beta) {
            rotateGunOffset(alpha);
            alpha += 0.01;
            alpha += (Math.random() - 0.5) / 30;
            beta += (Math.random() - 0.5) / 30;
            beta += 0.04;
            let vel = new Vector(Math.cos(alpha) * Math.sin(beta), Math.cos(beta), Math.sin(alpha) * Math.sin(beta));
            let variance = -Math.random() - 1;
            proj.push(new Projectile(fromBabylon(player.mesh.position).add(gunOffset).add(vel.mult(variance)), vel.mult(-6 / variance), team, true, 0.5));
        },
        sniper: function (alpha, beta) {
            camera.angularSensibilityX = camera.angularSensibilityY = 1000;
            setTimeout(function () {
                camera.fov = 1;
            }, 100);
            let vel = new Vector(Math.cos(alpha) * Math.sin(beta), Math.cos(beta), Math.sin(alpha) * Math.sin(beta));
            proj.push(new Projectile(fromBabylon(player.mesh.position).add(gunOffset).add(vel.mult(-4)), vel.mult(300), team, true, 1));
        },
    };
    let currentType = "normal";
    mousedown = false;
    let velOffset = [0, 0];
    let posOffset = [0, 0];

    //create projectiles on click
    document.addEventListener("mouseup", function (e) {
        mousedown = false;
        if (e.which === 3) {
            let close = [];

            let alpha = camera.alpha;
            let beta = camera.beta;
            let vec1 = new Vector(Math.cos(alpha) * Math.sin(beta), Math.cos(beta), Math.sin(alpha) * Math.sin(beta));

            let pos2 = fromBabylon(player.mesh.position);

            for (let index = 0; index < Object.keys(otherPlayers).length; index++) {
                if (Object.keys(otherPlayers)[index] !== multiplayer.getID()) {
                    let pos1 = fromBabylon(otherPlayers[Object.keys(otherPlayers)[index]].mesh.position);
                    let vec2 = pos1.clone().sub(pos2);
                    vec2.y = vec1.y = 0;
                    if (vec2.angleTo(vec1) > 2.5) {
                        close.push([pos1, Object.keys(otherPlayers)[index]]);
                    }
                }
            }

            let closest = null;
            let bestDist = 400;
            for (let player_ in close) {
                let dist = Vector.distsq(close[player_][0], pos2);
                if (dist < bestDist) {
                    closest = close[player_];
                    bestDist = dist;
                }
            }

            if (closest !== null) {
                multiplayer.changeHealth(-10, closest[1]);
            }
        } else {
            switch (currentType) {
                case "normal":
                    weaponTypes[currentType](camera.alpha, camera.beta);
                    break;
                case "sniper":
                    weaponTypes[currentType](camera.alpha, camera.beta);
                    break;
                default:
                    break;
            }
        }
    });
    document.addEventListener("mousedown", function (e) {
        mousedown = true;
        if (e.which === 3) {
            return;
        } else {
            switch (currentType) {
                case "sniper":
                    velOffset = [0, 0];
                    camera.fov = 0.1;
                    camera.angularSensibilityX = camera.angularSensibilityY = 30000;
                    startCamPos = [camera.beta, camera.alpha];
                    posOffset = [0, 0];
                    break;
                default:
                    break;
            }
        }
    });
    document.addEventListener("mousemove", function (e) {
        if (mousedown) {
            if (e.which === 3) {
                return;
            } else {
                switch (currentType) {
                    case "sniper":
                        velOffset[1] -= e.movementX / 10000;
                        velOffset[0] -= e.movementY / 10000;
                        break;
                    default:
                        break;
                }
            }
        }
    });

    //update player
    var team1 = document.getElementById("team1");
    var team2 = document.getElementById("team2");

    let delay = 0;
    let flagCountDown = 0;
    var highlight = new BABYLON.HighlightLayer("hl1", scene);
    let wait = null;
    let healtime = null;
    let heal = false;

    scene.executeWhenReady(scene.registerBeforeRender(function () {
        if (mousedown) {
            switch (currentType) {
                case "machineGun":
                    if (delay % 3 === 0)
                        weaponTypes[currentType](camera.alpha, camera.beta);
                    break;
                case "sniper":
                    posOffset[1] += velOffset[1];
                    posOffset[0] += velOffset[0];
                    camera.beta = startCamPos[0] + posOffset[0];
                    camera.alpha = startCamPos[1] + posOffset[1];
                    camera.update();
                    break;
                default:
                    break;
            }
        }
        //add delay to ensure things load
        if (ground) {
            delay++;
        }
        if (delay > 100) {
            team1.innerText = multiplayer.getScores().Team1;
            team2.innerText = multiplayer.getScores().Team2;


            player.input(keys);
            player.update(ground);

            let players = multiplayer.getPlayers();
            let th = player.health;

            if (players[multiplayer.getID()] !== undefined) {
                player.health = players[multiplayer.getID()].Health;
            }

            if (player.health < th) {
                heal = false;
                clearTimeout(wait);
                clearInterval(healtime);
                wait = setTimeout(function () {
                    heal = true;
                }, 1000);
            }

            if (player.health >= 100) {
                heal = false;
                clearInterval(healtime);
            }
            if (heal) {
                heal = false;
                healtime = setInterval(function () {
                    if (players[multiplayer.getID()].Health >= 100) {
                        clearInterval(healtime);
                    } else {
                        multiplayer.changeHealth(1, multiplayer.getID());
                    }
                }, 1000);
            }
            let color;
            if (player.health < 15) color = "#e74c3c"; else if (player.health < 50) color = "#f39c12"; else color = "#2ecc71";
            healthbar[0].style.left = "-" + (100 - player.health) + "%";
            healthbar[0].style.background = color;
            document.querySelectorAll("#health-text")[0].innerHTML = player.health;
            document.querySelectorAll("#health")[0].style.color = color;
            document.querySelectorAll('#armor-bar .level')[0].style.left = "-" + (160 - player.maxSpeed) / 1.6 + "%";
            document.querySelectorAll("#armor-text")[0].innerHTML = player.maxSpeed;

            if (player.health <= 0) {
                spawn = true;
                multiplayer.changeHealth(-player.health + 100, multiplayer.getID());
            }

            //broadcast decals/projectiles info
            for (var i = 0; i < proj.length; i++) {
                let id = proj[i].update(ground, scene, otherPlayers, players, decalList);
                if (id === -2) {
                    multiplayer.broadcast("-2" + multiplayer.getID(), proj[i].pos.x, proj[i].pos.y, proj[i].pos.z, proj[i].vel.x, proj[i].vel.y, proj[i].vel.z, proj[i].type);
                } else if (id !== 0 && id !== -1) {
                    multiplayer.broadcast(id.pickedMesh.tempID, id.pickedPoint.x, id.pickedPoint.y, id.pickedPoint.z, team, 0, 0, proj[i].type);
                    proj.splice(i, 1);
                    console.log(id.pickedMesh.tempID)
                } else if (id === -1) {
                    multiplayer.broadcast("-1" + multiplayer.getID(), proj[i].pos.x, proj[i].pos.y, proj[i].pos.z, 0, 0, 0, proj[i].type);
                    proj.splice(i, 1);
                }
            }

            //get broadcasted decals/projectiles
            let broadDecals = multiplayer.getBroadcasts();
            if (Object.keys(broadDecals).length > 0) {
                for (let dec2 in broadDecals) {
                    let dec = broadDecals[dec2];
                    let pos = new BABYLON.Vector3(dec.Coordinates.X, dec.Coordinates.Y, dec.Coordinates.Z);
                    if (dec.ID.slice(0, 2) === "-2" & dec.ID !== "-2" + multiplayer.getID()) {
                        let tvel = new BABYLON.Vector3(dec.Vel.X, dec.Vel.Y, dec.Vel.Z);
                        proj.push(new Projectile(pos, tvel, team, false, dec.Size));
                    } else if (dec.ID.slice(0, 2) !== "-1" && dec.ID !== '') {
                        if (dec.ID === multiplayer.getID()) {
                            console.log(dec.ID)
                            if (dec.Vel.X === team) {
                                player.friendHit();
                                console.log("fh");
                            } else {
                                player.enemyHit();
                            }
                        } else if (otherPlayers[dec.ID]) {
                            decalList.push(new Decal(pos, (Vector.sub(fromBabylon(otherPlayers[dec.ID].mesh.position), fromBabylon(pos)).normalize()).toBabylon(), otherPlayers[dec.ID].mesh, scene));
                        }
                    } else if (dec.ID !== 0 && dec.ID !== '' && dec.ID !== "-1" + multiplayer.getID()) {
                        var decalMaterial = new BABYLON.StandardMaterial("decalMat", scene);
                        decalMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
                        decalMaterial.zOffset = -2;
                        var decalSize = new BABYLON.Vector3(10, 10, 10);
                        var decal = BABYLON.MeshBuilder.CreateDecal("decal", ground, {
                            position: pos,
                            normal: ground.getNormalAtCoordinates(pos.x, pos.z),
                            size: decalSize
                        }, scene);
                        decal.material = decalMaterial;
                        groundDecalList.push(decal);
                    }
                }
            }

            let flagsEvents = multiplayer.getFlagEvents();
            //update player list and positions
            if (players) {
                let s = Object.keys(players);
                let s2 = Object.keys(otherPlayers);
                if (!arraysEqual(s2, s)) {
                    for (let i = 0; i < s.length; i++) {
                        let found = false;
                        for (let j = 0; j < s2.length; j++) {
                            if (s[i] === s2[j])
                                found = true;
                        }
                        if (!found) {
                            if (players[s[i]].Team === 1)
                                otherPlayers[s[i]] = new OtherPlayer(0, 0, 0, 0, s[i], "", 1, playerModel, scene);
                            else
                                otherPlayers[s[i]] = new OtherPlayer(0, 0, 0, 0, s[i], "", 2, playerModel, scene);
                            /*if (s[i] === multiplayer.getID()) {
                                otherPlayers[s[i]].mesh.dispose();
                                advancedTexture.removeControl(otherPlayers[s[i]].healthbar);
                                otherPlayers[s[i]].healthbar.dispose();
                                advancedTexture.removeControl(otherPlayers[s[i]].label);
                                otherPlayers[s[i]].label.dispose();
                            }*/
                        }
                    }
                    for (let i = 0; i < s2.length; i++) {
                        let found = false;
                        for (let j = 0; j < s.length; j++) {
                            if (s[j] === s2[i])
                                found = true;
                        }
                        if (!found) {
                            otherPlayers[s2[i]].mesh.dispose();
                            /*advancedTexture.removeControl(otherPlayers[s2[i]].healthbar);
                            otherPlayers[s2[i]].healthbar.dispose();
                            advancedTexture.removeControl(otherPlayers[s2[i]].label);
                            otherPlayers[s2[i]].label.dispose();*/
                            delete otherPlayers[s2[i]];
                        }
                    }
                }
                let index = 0;

                for (let player_ in players) {
                    let tid = Object.keys(players)[index];
                    if (tid !== multiplayer.getID()) {
                        if (flagsEvents.Action === 1) {
                            if (flagsEvents.Flag < 0) {
                                flags[-flagsEvents.Flag - 1] = new Flag(spawns[-flagsEvents.Flag - 1].x, spawns[-flagsEvents.Flag - 1].y, spawns[-flagsEvents.Flag - 1].z, -flagsEvents.Flag)
                            } else if (flagsEvents.ID === tid) {
                                flags[flagsEvents.Flag].taken(otherPlayers[tid].team, otherPlayers[tid].mesh, tid);
                                //otherPlayers[tid].hasFlag = true;
                            }
                        } else if (flagsEvents.Action === 0) {
                            if (flagsEvents.Flag < 0) {
                                flags[-flagsEvents.Flag - 1].mesh.dispose();
                                flags[-flagsEvents.Flag - 1] = new Flag(spawns[-flagsEvents.Flag - 1].x, spawns[-flagsEvents.Flag - 1].y, spawns[-flagsEvents.Flag - 1].z, -flagsEvents.Flag)
                            } else {
                                flags[flagsEvents.Flag].pmesh = null;
                                //flags[flagsEvents.Flag].moved = false;
                                flags[flagsEvents.Flag].hold = false;
                                flags[flagsEvents.Flag].id = 0;
                                flags[flagsEvents.Flag].count = 0;
                            }
                        }
                        otherPlayers[tid].move();
                        otherPlayers[tid].health = players[player_].Health;
                        otherPlayers[tid].mesh.position = new BABYLON.Vector3(players[player_]["X"] + 1, players[player_]["Y"] + 2, players[player_]["Z"] - 0.5);
                        //otherPlayers[Object.keys(players)[index]].mesh.rotate(-otherPlayers[Object.keys(players)[index]].alpha + players[player_]["Orientation"]);
                        let deltar = otherPlayers[tid].alpha - players[player_]["Orientation"];
                        otherPlayers[tid].mesh.rotate(BABYLON.Axis.Y, deltar, BABYLON.Space.WORLD);
                        otherPlayers[tid].alpha = players[player_]["Orientation"];
                        otherPlayers[tid].mesh.deltar = deltar;
                        //console.log(players[player_]["Orientation"])
                    } else {
                        otherPlayers[Object.keys(players)[index]].mesh.position = new BABYLON.Vector3(0, -100, -100);
                        if (spawn) {
                            /*if (flags[0].id === multiplayer.getID()) {
                                multiplayer.lostFlag(0);
                                //console.log('test3')
                                flags[0].pmesh = null;
                                //flags[i].moved = false;
                                flags[0].hold = false;
                                flags[0].id = 0;
                                flags[0].count = 0;
                            }
                            if (flags[1].id === multiplayer.getID()) {
                                multiplayer.lostFlag(1);
                                //console.log('test3')
                                flags[1].pmesh = null;
                                //flags[i].moved = false;
                                flags[1].hold = false;
                                flags[1].id = 0;
                                flags[1].count = 0;
                            }*/
                            team = players[multiplayer.getID()].Team;
                            lastPlayerPos = player.mesh.position;
                            //setTimeout(function () {
                            //console.log(team)
                            player.fall = false;
                            player.mesh.position.y = 100000 + player.mesh.position.y;

                            //}, 50);
                            spawn = false;
                            setTimeout(function () {
                                //console.log(team)
                                player.fall = true;
                                player.mesh.position = new BABYLON.Vector3(spawns[team - 1].x, spawns[team - 1].y, spawns[team - 1].z);

                            }, 1000);
                        }
                    }
                    index++;
                }
                //console.log(player.mesh.position);

                if (team > 0) {
                    for (let i = 0; i < flags.length; i++) {
                        flags[i].update();
                        //console.log(flags[i]);
                        if (!flags[i].hold) {
                            //console.log("not held");
                            if (i !== team - 1) {
                                //console.log(flags[i].count);
                                let dist = (player.pos.x - flags[i].mesh.position.x) * (player.pos.x - flags[i].mesh.position.x) + (player.pos.z - flags[i].mesh.position.z) * (player.pos.z - flags[i].mesh.position.z);
                                //console.log(flags[i].count, dist)
                                if (dist < 200) {
                                    flags[i].count++;
                                    //console.log("count: " + flags[i].count);
                                } else if (flags[i].count > 0) {
                                    flags[i].count -= 2;
                                }
                                if (flags[i].count >= 50) {
                                    flags[i].taken(team, player.mesh, multiplayer.getID());
                                    multiplayer.gotFlag(i);
                                }
                            } else {
                                let dist = (player.pos.x - flags[i].mesh.position.x) * (player.pos.x - flags[i].mesh.position.x) + (player.pos.z - flags[i].mesh.position.z) * (player.pos.z - flags[i].mesh.position.z);
                                //console.log(dist, flags[i].moved);
                                if (dist < 200 && flags[i].moved && player.pos.y < 10000) {
                                    flags[i].taken(team, player.mesh, multiplayer.getID());
                                    multiplayer.gotFlag(i);
                                }
                            }
                        } else {
                            //console.log("held");
                            if (i !== team - 1) {
                                if (player.health <= 0 && flags[i].id === multiplayer.getID()) {
                                    multiplayer.lostFlag(i);
                                    //console.log('test3')
                                    flags[i].pmesh = null;
                                    //flags[i].moved = false;
                                    flags[i].hold = false;
                                    flags[i].id = 0;
                                    flags[i].count = 0;
                                }
                                let dist2 = (player.pos.x - spawns[1 - i].x) * (player.pos.x - spawns[1 - i].x) + (player.pos.z - spawns[1 - i].z) * (player.pos.z - spawns[1 - i].z);
                                if (dist2 < 200 && flags[i].id === multiplayer.getID()) {
                                    //console.log('test2')
                                    multiplayer.updateScore();
                                    multiplayer.lostFlag(-(i + 1));
                                    flags[i].mesh.dispose();
                                    flags[i] = new Flag(spawns[i].x, spawns[i].y, spawns[i].z, i + 1);
                                    //flags[i].updatePosition(spawns[i].x, spawns[i].y, spawns[i].z)
                                }
                            } else {
                                let dist = (player.pos.x - spawns[i].x) * (player.pos.x - spawns[i].x) + (player.pos.z - spawns[i].z) * (player.pos.z - spawns[i].z);
                                if (dist < 200 && flags[i].id === multiplayer.getID()) {
                                    //console.log('test')
                                    multiplayer.lostFlag(-(i + 1));
                                    flags[i].mesh.dispose();
                                    flags[i] = new Flag(spawns[i].x, spawns[i].y, spawns[i].z, i + 1);
                                }
                                if (player.health <= 0 && flags[i].id === multiplayer.getID()) {
                                    multiplayer.lostFlag(i);
                                    //console.log('test4')
                                    flags[i].updatePosition(lastPlayerPos.x, lastPlayerPos.y, lastPlayerPos.z);
                                    flags[i].pmesh = null;
                                    //flags[i].moved = false;
                                    flags[i].hold = false;
                                    flags[i].id = 0;
                                    flags[i].count = 0;
                                }
                            }
                        }
                    }
                    /*let dist = (player.pos.x - spawns[i].x) * (player.pos.x - spawns[i].x) + (player.pos.z - spawns[i].z) * (player.pos.z - spawns[i].z);
                    if (dist < 200) {
                        flagCountDown++;
                    }
                    if (flagCountDown === 1) {
                        highlight.addMesh(flags[i].mesh, new BABYLON.Color3(i, i, 1 - i));
                    }
                    if (flagCountDown === 0) {
                        highlight.removeMesh(flags[i].mesh);
                    }
                    if (dist > 200 && flagCountDown > 0) {
                        flagCountDown -= 2;
                    }
                    if (flagCountDown > 50) {
                        highlight.removeMesh(flags[i].mesh);
                        flags[i].taken(team, player.mesh);
                        multiplayer.gotFlag(i);
                    }
                    if (player.health <= 0) {
                        multiplayer.lostFlag(i);
                    }
                    let dist2 = (player.pos.x - spawns[1 - i].x) * (player.pos.x - spawns[1 - i].x) + (player.pos.z - spawns[1 - i].z) * (player.pos.z - spawns[1 - i].z);
                    if (dist2 < 200 && flags[i].taken) {
                        if (i !== team - 1) {
                            /*setTimeout(function () {
                                flags[2 - team].updatePosition(spawns[2 - team].x, spawns[2 - team].y, spawns[1].z)
                            }, 30);
                            flags[i] = new Flag(spawns[i].x, spawns[i].y, spawns[i].z, i + 1)
                            flagCountDown = 0;
                            multiplayer.updateScore();
                        } else {
                            multiplayer.gotFlag(-(i + 1));
                        }
                    }
                }*/
                }
            }

            //move decals with player
            for (var l = 0; l < decalList.length; l++) {
                if (decalList[l].update()) decalList.splice(l, 1);
            }

            if (groundDecalList.length > 128) {
                groundDecalList[0].dispose();
                groundDecalList.splice(0, 1);
            }

            //send client player info
            multiplayer.setPosition(player.mesh.position.x, player.mesh.position.y, player.mesh.position.z);
            multiplayer.setOrientation(camera.alpha);
            multiplayer.sendPlayerData();
            camera.radius = 0.001;
        }
    }));

    var slider = document.getElementById("coh");
    var output = document.getElementById("output");
    output.innerHTML = "0";

    slider.oninput = function () {
        let c = Object.keys(models);
        for (let i = 0; i < c.length; i++) {
            if (i === parseFloat(this.value)) {
                models[c[i]].position.y = 5;
                console.log(c[i]);
            } else {
                models[c[i]].position.y = 1;
            }
        }
        output.innerHTML = this.value;
    };//"cabinRoofChimney(Clone)_primitive03","cabinRoofChimney(Clone)_primitive14","cabinRoofChimney(Clone)_primitive25","cabinRoofChimney(Clone)_primitive36","cabinRoofChimney(Clone)_primitive36","door_primitive248","cabinDoor(Clone)49","frame_primitive050","frame_primitive151","frame_primitive252","frame_primitive353","cabinCorner(Clone)55","cabinWall(Clone)56","cabinWall(Clone)57","cabinWall(Clone)58","cabinCorner(Clone)59","cabinCorner(Clone)60","cabinWall(Clone)61","cabinWall(Clone)62","cabinRoof(Clone)_primitive063","cabinRoof(Clone)_primitive164","cabinRoof(Clone)_primitive065","cabinRoof(Clone)_primitive166","cabinRoof(Clone)_primitive067","cabinRoof(Clone)_primitive168","cabinSideCenter(Clone)69","cabinSideCenter(Clone)70","cabinRoof(Clone)_primitive071","cabinRoof(Clone)_primitive172","cabinFloor(Clone)73",
};

var multiplayer = new MMOC();

var canvas = document.getElementById("renderCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
var scene = new BABYLON.Scene(engine);

//camera
var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 200, new BABYLON.Vector3.Zero(), scene);
camera.setTarget(new BABYLON.Vector3(0, 0, 0));
camera.attachControl(canvas, true);
camera.keysDown = camera.keysUp = camera.keysLeft = camera.keysRight = [];
camera.radius = 0.001;
camera.maxZ = 1000;
camera.fov = 1;

//console.log(camera);

//asset loader
var assetsManager = new BABYLON.AssetsManager(scene);
assetsManager.onTaskErrorObservable.add(function (task) {
    console.log('task failed', task.errorObject.message, task.errorObject.exception);
});
assetsManager.onProgress = function (remainingCount, totalCount, lastFinishedTask) {
    engine.loadingUIText = 'We are loading the scene. ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.';
};
assetsManager.onFinish = function (tasks) {
    createScene();
    healthbar = document.querySelectorAll('#health-bar .level');

    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });

    multiplayer.init();
};

/*
//load map image and create coordinate map
var imageTask = assetsManager.addImageTask("image task", "map2.png");
imageTask.onSuccess = function (task) {
    var canvas = document.createElement('canvas');
    canvas.width = task.image.width;
    canvas.height = task.image.height;
    let context = canvas.getContext('2d');
    context.drawImage(task.image, 0, 0, task.image.width, task.image.height);
    let mapData = context.getImageData(0, 0, task.image.width, task.image.height);
    for (var y = 0; y < task.image.width; y++) {
        let temp = [];
        for (var x = 0; x < task.image.height; x++) {
            //double positions to make level planes
            temp.push(mapData.data[y * (task.image.width * 4) + x * 4]);
            temp.push(mapData.data[y * (task.image.width * 4) + x * 4]);
        }
        map.push(temp);
        map.push(temp);
    }
};*/

/*var playerTask = assetsManager.addMeshTask("player task", "", "./Babylon/", "Snowman-Generic3.babylon");
playerTask.onSuccess = function (task) {
    console.log(task.loadedMeshes);
    for (let i = 0; i < task.loadedMeshes.length; i++) {
        if (i !== 8 && i !== 1) {
            //task.loadedMeshes[i].position
        }
        //8,1 arms
        //9 hat
        //2 body
        //0 nose
    }
    task.loadedMeshes[0].position.y /= 2;
    task.loadedMeshes[0].position.x *= -1;
    task.loadedMeshes[0].position.z *= -1;
    task.loadedMeshes[0].parent = task.loadedMeshes[2];
    task.loadedMeshes[9].parent = task.loadedMeshes[2];
    task.loadedMeshes[1].parent = task.loadedMeshes[2];
    task.loadedMeshes[8].parent = task.loadedMeshes[2];

    //task.loadedMeshes[2].position.x = 20;
    //task.loadedMeshes[0].material.ambientColor = new BABYLON.Color3(1, 1, 1);
    //playerModel = task.loadedMeshes[0];

};*/

var playerTask = assetsManager.addMeshTask("player task", "", "./GLTF/", "christmas.glb");
let models = {};
let environment = new BABYLON.Mesh("environment", scene);
let cabin1 = new BABYLON.Mesh("cabin1", scene);
let cabin2 = new BABYLON.Mesh("cabin2", scene);
playerTask.onSuccess = function (task) {
    let listdone = [];
    let ball = new BABYLON.MeshBuilder.CreateSphere("Sphere", {diameter: 1}, scene);
    ball.position = {x: 3.6899462734583444, y: 1, z: -0.21614524871613433};
    let myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

    myMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);

    ball.material = myMaterial;
    //let tar = [154, 157, 160, 163, 163, 503, 494, 510, 513, 516, 518, 522, 526, 530, 533, 535, 537, 540, 542, 546, 549, 554, 556, 559, 561, 564, 567, 570, 572, 575];

    let i = 0;
    (task).loadedMeshes.forEach((mesh) => {
        /*if (mesh.name === "Group") {
            mesh.position.x = 10;
            mesh.position.y = 10;
            mesh.scale = new BABYLON.Vector3(100,100,100);
        }
        else*/
        //if (mesh.name.indexOf("cabin") !== -1 || mesh.name.indexOf("door") !== -1 || mesh.name.indexOf("frame") !== -1 || mesh.name.indexOf("wreath") !== -1 || mesh.name.indexOf("Red") !== -1) {
        //console.log(mesh.name)
        /*for (let i = 0; i < listdone.length; i++) {

        }
        let ball = new BABYLON.MeshBuilder.CreateSphere("Sphere", {diameter: 1}, scene);
        ball.position = mesh.position;
        //console.log((fromBabylon(mesh.position).sub(new Vector(3.6899462734583444, 1, -0.21614524871613433))).magSq())
        if (ball.position.z > -1) {
            cabin1.addChild(mesh);
            let myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);

            myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
            myMaterial.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
            myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
            myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);

            ball.material = myMaterial;
        }
        else {
            cabin2.addChild(mesh);
        }
        //{x: 3.6899462734583444, y: 7.500999950000445, z: -0.21614524871613433}
        //{x: 0.44800764952533495, y: 7.500999950000445, z: -3.6378826932399866}
        //console.log(mesh.name)
    } else {
        environment.addChild(mesh);*/
        //if (mesh.uniqueId)
        if (mesh.name.indexOf("fence") > -1 || mesh.name.indexOf("group") > -1 || mesh.name.indexOf("log") > -1 || mesh.name.indexOf("wreath") > -1 || mesh.name.indexOf("wheel") > -1 || mesh.name.indexOf("track") > -1 || mesh.name.indexOf("tie") > -1 || mesh.name.indexOf("stone") > -1 || mesh.name.indexOf("rock") > -1 || mesh.name.indexOf("light") > -1 || mesh.name.indexOf("snow") > -1 || mesh.name.indexOf("train") > -1 || mesh.name.indexOf("wagon") > -1 || mesh.name.indexOf("tree") > -1) {

        } else {
            models[mesh.name + i] = mesh;
            i++;
        }
        //}
    });
    console.log(models);
    let cabin1list = ["cabinRoofChimney(Clone)_primitive03", "cabinRoofChimney(Clone)_primitive14", "cabinRoofChimney(Clone)_primitive25", "cabinRoofChimney(Clone)_primitive36", "cabinRoofChimney(Clone)_primitive36", "door_primitive248", "cabinDoor(Clone)49", "frame_primitive050", "frame_primitive151", "frame_primitive252", "frame_primitive353", "cabinCorner(Clone)55", "cabinWall(Clone)56", "cabinWall(Clone)57", "cabinWall(Clone)58", "cabinCorner(Clone)59", "cabinCorner(Clone)60", "cabinWall(Clone)61", "cabinWall(Clone)62", "cabinRoof(Clone)_primitive063", "cabinRoof(Clone)_primitive164", "cabinRoof(Clone)_primitive065", "cabinRoof(Clone)_primitive166", "cabinRoof(Clone)_primitive067", "cabinRoof(Clone)_primitive168", "cabinSideCenter(Clone)69", "cabinSideCenter(Clone)70", "cabinRoof(Clone)_primitive071", "cabinRoof(Clone)_primitive172", "cabinFloor(Clone)73",];
    //let tar = [154, 157, 160, 163, 163, 503, 494, 510, 513, 516, 518, 522, 526, 530, 533, 535, 537, 540, 542, 546, 549, 554, 556, 559, 561, 564, 567, 570, 572, 575];
    for (let i = 0; i < tar.length; i++) {
        //tar.push(models[cabin1list[i]].uniqueId);
        cabin1.addChild(models[cabin1list[i]]);
    }
    //cabin1.scale = new BABYLON.Vector3(100,100,100);
    //cabin1.position.x += 20;
    environment.scale = new BABYLON.Vector3(10, 10, 10);
    environment.position.x += 10;
    environment.position.y += 1;
    task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
    task.loadedMeshes[0].position.x = 10;
    //task.loadedMeshes[0].rotation = new BABYLON.Vector3(-2 * Math.PI / 3, 0, -1.2);
    //task.loadedMeshes[0].rotation = new BABYLON.Vector3(-2 * Math.PI / 3, 0, -1.2);
    //task.loadedMeshes[0].material.ambientColor = new BABYLON.Color3(1, 1, 1);
    playerModel = task.loadedMeshes[0];
    //playerModel = task.loadedMeshes[0];
};

/*BABYLON.SceneLoader.OnPluginActivatedObservable.add(function (plugin) {
    currentPluginName = plugin.name;

    if (plugin.name === "gltf" && plugin instanceof BABYLON.GLTFFileLoader) {
        plugin.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.ALL;
        plugin.compileMaterials = true;
    }
});

var loader = BABYLON.SceneLoader.Append("./GLTF/", "Snowman-Generic3.glb", scene, function () {

});
loader.onMeshLoaded = function (mesh) {
    playerModel = mesh;
    console.log(mesh);
    createScene();
    healthbar = document.querySelectorAll('#health-bar .level');

    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });

    multiplayer.init();
};
console.log(loader);*/

assetsManager.load();

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

//update key list
document.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

canvas.addEventListener("click", function (e) {
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
    if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
    }
}, false);

document.addEventListener("click", function (e) {
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
    if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
    }
}, false);

var pointerlockchange = function (e) {
    let enabled = (document.mozPointerLockElement === canvas || document.webkitPointerLockElement === canvas || document.msPointerLockElement === canvas || document.pointerLockElement === canvas);

    if (enabled) {
        camera.attachControl(canvas);
    } else {
        camera.detachControl(canvas);
    }
};

document.addEventListener("pointerlockchange", pointerlockchange, false);
document.addEventListener("mspointerlockchange", pointerlockchange, false);
document.addEventListener("mozpointerlockchange", pointerlockchange, false);
document.addEventListener("webkitpointerlockchange", pointerlockchange, false);

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    a.sort();
    b.sort();

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}