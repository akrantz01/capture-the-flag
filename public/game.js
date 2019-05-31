verifyToken().then(status => {
    if (status) console.log("running game"); //runGame();
    else window.location.href = `${window.location.protocol}//${window.location.host}/login.html`;
}).catch(() => {
    window.location.href = `${window.location.protocol}//${window.location.host}/login.html`;
});

var scene, camera;
// Key codes
// The commented numbers are for arrow keys
var LEFT = 65; // 37;
var UP = 87; // 38;
var RIGHT = 68; // 39;
var DOWN = 83; // 40;
var SPACE = 32;
var ESC = 27;

function runGame() {
    $("#renderCanvas").css("display", "block");
    $("#points").css("display", "block");
    $("#crosshair").css("display", "block");

    //list of pressed keys
    var keys = [];

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

    var createScene = function () {
        var gravityVector = new BABYLON.Vector3(0, -100, 0);
        var physicsPlugin = new BABYLON.CannonJSPlugin();
        scene.enablePhysics(gravityVector, physicsPlugin);

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

        //create projectiles on click
        document.addEventListener("click", function (e) {
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
                let alpha = camera.alpha;
                let beta = camera.beta;
                let vel = new Vector(Math.cos(alpha) * Math.sin(beta), Math.cos(beta), Math.sin(alpha) * Math.sin(beta));
                proj.push(new Projectile(fromBabylon(player.mesh.position).add(vel.mult(-4)), vel.mult(3), team, true));
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

                if (player.health <= 0) {
                    spawn = true;
                    multiplayer.changeHealth(-player.health + 100, multiplayer.getID());
                }

                //broadcast decals/projectiles info
                for (var i = 0; i < proj.length; i++) {
                    let id = proj[i].update(ground, scene, otherPlayers, players, decalList);
                    if (id === -2) {
                        multiplayer.broadcast("-2" + multiplayer.getID(), proj[i].pos.x, proj[i].pos.y, proj[i].pos.z, proj[i].vel.x, proj[i].vel.y, proj[i].vel.z);
                    } else if (id !== 0 && id !== -1) {
                        multiplayer.broadcast(id.pickedMesh.tempID, id.pickedPoint.x, id.pickedPoint.y, id.pickedPoint.z, team, 0, 0);
                        proj.splice(i, 1);
                    } else if (id === -1) {
                        multiplayer.broadcast("-1" + multiplayer.getID(), proj[i].pos.x, proj[i].pos.y, proj[i].pos.z, 0, 0, 0);
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
                            proj.push(new Projectile(pos, tvel, team, false));
                        } else if (dec.ID.slice(0, 2) !== "-1" && dec.ID !== '') {
                            if (dec.ID === multiplayer.getID()) {
                                if (dec.Vel.X === team) {
                                    player.friendHit();
                                } else {
                                    player.enemyHit();
                                }
                            } else if (otherPlayers[dec.ID])
                                decalList.push(new Decal(pos, (Vector.sub(fromBabylon(otherPlayers[dec.ID].mesh.position), fromBabylon(pos)).normalize()).toBabylon(), otherPlayers[dec.ID].mesh, scene));
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

                //send client player info
                multiplayer.setPosition(player.mesh.position.x, player.mesh.position.y, player.mesh.position.z);
                multiplayer.setOrientation(camera.alpha);
                multiplayer.sendPlayerData();
                camera.radius = 0.001;
            }
        }));
    };

    var multiplayer = new MMOC();

    var canvas = document.getElementById("renderCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
    scene = new BABYLON.Scene(engine);

    //camera
    camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 200, new BABYLON.Vector3.Zero(), scene);
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    camera.keysDown = camera.keysUp = camera.keysLeft = camera.keysRight = [];
    camera.radius = 0.001;
    camera.maxZ = 1000;

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

        engine.runRenderLoop(function () {
            if (scene) {
                scene.render();
            }
        });

        multiplayer.init();
    };

    /*//load map image and create coordinate map
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

    var playerTask = assetsManager.addMeshTask("player task", "", "./", "snowman.babylon");
    playerTask.onSuccess = function (task) {
        //console.log(task.loadedMeshes[0]);
        task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
        task.loadedMeshes[0].position.y = -100;
        task.loadedMeshes[0].rotation = new BABYLON.Vector3(-2 * Math.PI / 3, 0, -1.2);
        task.loadedMeshes[0].material.ambientColor = new BABYLON.Color3(1, 1, 1);
        playerModel = task.loadedMeshes[0];
    };

    assetsManager.load();

    // Resize
    window.addEventListener("resize", function () {
        //engine.resize();
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

    // Allow exiting to account screen
    setInterval(() => {if (keys[ESC]) window.location.href = `${window.location.protocol}//${window.location.host}/login.html`}, 15);

    // Display exiting to account info
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    setTimeout(() => toastr.info("Press 'ESC' to exit to your account"), 1000);
}
