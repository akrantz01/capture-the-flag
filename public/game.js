//list of pressed keys
var keys = [];

/*currently on fence0
[", {x: 0, y: 0, z: 0}", ", {x: -76, y: 78, z: 77}", ", {x: 311, y: 0, z: 170}", ", {x: -103, y: 0, z: 111}", ", {x: 99, y: 0, z: 28.081017125192844}", ", {x: 34, y: 0, z: 11}", ", {x: 231, y: 90, z: -145}", ", {x: -156, y: 0, z: -224}", ", {x: -162, y: -2, z: -224}", ", {x: -192, y: 0, z: -224}", ", {x: -426, y: 83, z: 197.81645722438955}", ", {x: 216, y: -3, z: 228.62414309043842}", ", {x: 48.614135955672765, y: 69, z: 302.69270927916335}", ", {x: 15, y: 0, z: 96.366923201049}", ", {x: 126.85939427492343, y: 0, z: 12.264696854805358}", ", {x: 75.26286696952977, y: 40, z: 298.29452756284235}", ", {x: -257, y: 0, z: -263}", ", {x: 386, y: 0, z: 67.96195374967739}", ", {x: 58, y: 0, z: -115}", ", {x: 49.18251664818074, y: 0, z: 29.55082021686961}", ", {x: 420, y: 89, z: 324.6530476304758}", ", {x: 87, y: 44, z: 38}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 5.24099311144921, y: 0, z: 144.8703287145665}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}", ", {x: 0, y: 0, z: 0}"]
 */

// Key codes
// The commented numbers are for arrow keys
var LEFT = 37;//65; // 37;
var UP = 38;//87; // 38;
var RIGHT = 39;//68; // 39;
var DOWN = 40;//83; // 40;
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
let xdist = 0;
var createScene = function () {
    var gravityVector = new BABYLON.Vector3(0, -100, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    //camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 100, 0), scene);
//camera.keysDown = camera.keysUp = camera.keysLeft = camera.keysRight = [];
    //camera.radius = 0.001;
    //camera.maxZ = 1000;
    //camera.fov = 1;
    document.onkeydown = (e) => {
        if (e.key === 'd') {
            let tempstr = [];
            for (let i = 0; i < masterMeshList.length; i++) {
                tempstr.push(", {x: " + masterMeshList[i].position.x + ", y: " + masterMeshList[i].position.y + ", z: " + masterMeshList[i].position.z + "}");
            }
            console.log(tempstr);
        }
    }

    // Start by only enabling position control
    document.onkeydown({key: "w"})

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
    //console.log(ground);



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
        xdist = 0;
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
        //console.log(e)
        xdist = e.movementX;
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
        if (delay === 10) {
            console.log(ground.getHeightAtCoordinates(409, 490));
            var tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            sled.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            campfire.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            bench1.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            bench2.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            present1.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            present2.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            present3.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];

            tree1.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            tree2.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            tree3.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            tree4.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            tree5.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            tree6.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            tree7.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            tree8.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            fancytree.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            lightpost1.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            lightpost2.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];

            snowman1.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            snowman2.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];

            snowfort.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];

            cabin1.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
            tpos = [(Math.random()+0)/2*width, (Math.random()+0)/2*height];
            cabin2.position = new BABYLON.Vector3(tpos[0], ground.getHeightAtCoordinates(tpos[0], tpos[1]), tpos[1]);
        }
        if (delay > 100) {
            team1.innerText = multiplayer.getScores().Team1;
            team2.innerText = multiplayer.getScores().Team2;


            player.input(keys);
            player.update(ground);
           // console.log(player.mesh.position.x+", "+ player.mesh.position.y+", "+ player.mesh.position.z)

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
        //let c = Object.keys(models);
        /*for (let i = 0; i < masterMeshList.length; i++) {
            /*let cont = true;
            for (let a = 0; a < cabin1list.length; a++) {
                if (c[i] === cabin1list[a]) {
                    cont = false;
                }
            }

            if (i === parseFloat(this.value) && cont) {
                models[c[i]].position.y = 5;
                console.log(c[i]);
            } else {
                models[c[i]].position.y = 1;
            }
        }*/
        curmod = masterMeshList[parseFloat(this.value)];
        output.innerHTML = curmod.name;
    };//"cabinRoofChimney(Clone)_primitive03","cabinRoofChimney(Clone)_primitive14","cabinRoofChimney(Clone)_primitive25","cabinRoofChimney(Clone)_primitive36","cabinRoofChimney(Clone)_primitive36","door_primitive248","cabinDoor(Clone)49","frame_primitive050","frame_primitive151","frame_primitive252","frame_primitive353","cabinCorner(Clone)55","cabinWall(Clone)56","cabinWall(Clone)57","cabinWall(Clone)58","cabinCorner(Clone)59","cabinCorner(Clone)60","cabinWall(Clone)61","cabinWall(Clone)62","cabinRoof(Clone)_primitive063","cabinRoof(Clone)_primitive164","cabinRoof(Clone)_primitive065","cabinRoof(Clone)_primitive166","cabinRoof(Clone)_primitive067","cabinRoof(Clone)_primitive168","cabinSideCenter(Clone)69","cabinSideCenter(Clone)70","cabinRoof(Clone)_primitive071","cabinRoof(Clone)_primitive172","cabinFloor(Clone)73",

    var sliderx = document.getElementById("x");
    var outputx = document.getElementById("outputx");
    outputx.innerHTML = "0";

    sliderx.oninput = function () {
        curmod.position.x = parseFloat(this.value);
        outputx.innerHTML = this.value;
    };

    var slidery = document.getElementById("y");
    var outputy = document.getElementById("outputy");
    outputy.innerHTML = "0";

    slidery.oninput = function () {
        curmod.position.y = parseFloat(this.value);
        outputy.innerHTML = this.value;
    };

    var sliderz = document.getElementById("z");
    var outputz = document.getElementById("outputz");
    outputz.innerHTML = "0";

    sliderz.oninput = function () {
        curmod.position.z = parseFloat(this.value);
        outputz.innerHTML = this.value;
    };
};
let curmod = null;

var multiplayer = new MMOC();

var canvas = document.getElementById("renderCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
var scene = new BABYLON.Scene(engine);

//camera
var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 200, new BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, false);

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

let playerTask = assetsManager.addMeshTask("player task", "", "./GLTF/", "christmas.glb");
let models = {};
let cabin1 = new BABYLON.Mesh("cabin1", scene);
let cabin2 = new BABYLON.Mesh("cabin2", scene);
let sled = new BABYLON.Mesh("sled", scene);
let campfire = new BABYLON.Mesh("campfire", scene);
let bench1 = new BABYLON.Mesh("bench1", scene);
let bench2 = new BABYLON.Mesh("bench2", scene);
let present1 = new BABYLON.Mesh("present1", scene);
let present2 = new BABYLON.Mesh("present2", scene);
let present3 = new BABYLON.Mesh("present3", scene);

let fences = [];
let stones = [];
let tree1 = new BABYLON.Mesh("tree1", scene);
let tree2 = new BABYLON.Mesh("tree2", scene);
let tree3 = new BABYLON.Mesh("tree3", scene);
let tree4 = new BABYLON.Mesh("tree4", scene);
let tree5 = new BABYLON.Mesh("tree5", scene);
let tree6 = new BABYLON.Mesh("tree6", scene);
let tree7 = new BABYLON.Mesh("tree7", scene);
let tree8 = new BABYLON.Mesh("tree8", scene);
let fancytree = new BABYLON.Mesh("fancytree", scene);
let lightpost1 = new BABYLON.Mesh("lightpost1", scene);
let lightpost2 = new BABYLON.Mesh("lightpost2", scene);

let snowman1 = new BABYLON.Mesh("snowman1", scene);
let snowman2 = new BABYLON.Mesh("snowman2", scene);

let snowfort = new BABYLON.Mesh("snowfort", scene);
let rockformations = [];
let snowpatches = [];

let train = new BABYLON.Mesh("train", scene);

let masterMeshList = [train, cabin1, cabin2, sled, campfire, bench1, bench2, present1, present2, present3, tree1,  tree2,  tree3,  tree4,  tree5,  tree6,  tree7,  tree8,  fancytree,  lightpost1,  lightpost2];
let cabinmeshes = {};
playerTask.onSuccess = function (task) {
    let cabinmark = 0;
    let mark = 0;
    (task).loadedMeshes.forEach((mesh) => {
        //if (mesh.uniqueId)
        if (mesh.name.indexOf("fence") > -1 || mesh.name.indexOf("group") > -1 || mesh.name.indexOf("log") > -1 || mesh.name.indexOf("wreath") > -1 || mesh.name.indexOf("wheel") > -1 || mesh.name.indexOf("track") > -1 || mesh.name.indexOf("tie") > -1 || mesh.name.indexOf("stone") > -1 || mesh.name.indexOf("rock") > -1 || mesh.name.indexOf("light") > -1 || mesh.name.indexOf("snow") > -1 || mesh.name.indexOf("train") > -1 || mesh.name.indexOf("wagon") > -1 || mesh.name.indexOf("tree") > -1) {
            models[mesh.name + mark] = mesh;//"wreath(Clone)_primitive0101", "wreath(Clone)_primitive1102"
            //"lightsRed(Clone)_primitive061", "lightsRed(Clone)_primitive062", "lightsRed(Clone)_primitive063", "lightsRed(Clone)_primitive064",
            mark++;
        } else {
            cabinmeshes[mesh.name + cabinmark] = mesh;
            cabinmark++;
        }
        //}
    });
    //console.log(models);
    //console.log(cabinmeshes);
    let cabin1list = ["cabinRoofChimney(Clone)_primitive03", "cabinWindowLarge(Clone)54", "cabinRoofChimney(Clone)_primitive14", "cabinRoofChimney(Clone)_primitive25", "cabinRoofChimney(Clone)_primitive36", "cabinRoofChimney(Clone)_primitive36", "door_primitive248", "cabinDoor(Clone)49", "frame_primitive050", "frame_primitive151", "frame_primitive252", "frame_primitive353", "cabinCorner(Clone)55", "cabinWall(Clone)56", "cabinWall(Clone)57", "cabinWall(Clone)58", "cabinCorner(Clone)59", "cabinCorner(Clone)60", "cabinWall(Clone)61", "cabinWall(Clone)62", "cabinRoof(Clone)_primitive063", "cabinRoof(Clone)_primitive164", "cabinRoof(Clone)_primitive065", "cabinRoof(Clone)_primitive166", "cabinRoof(Clone)_primitive067", "cabinRoof(Clone)_primitive168", "cabinSideCenter(Clone)69", "cabinSideCenter(Clone)70", "cabinRoof(Clone)_primitive071", "cabinRoof(Clone)_primitive172", "cabinFloor(Clone)73",];
    //+"wreath(Clone)_primitive0101", "wreath(Clone)_primitive1102"
    let cabin2list = ["frame12", "door_primitive013", "door_primitive114", "door_primitive215", "cabinDoor(Clone)16", "cabinRoofCorner(Clone)_primitive017", "cabinRoofCorner(Clone)_primitive118", "cabinRoofCorner(Clone)_primitive019", "cabinRoofCorner(Clone)_primitive120", "cabinWall(Clone)21", "cabinWall(Clone)22", "cabinCorner(Clone)23", "cabinCorner(Clone)24", "cabinRoofCorner(Clone)_primitive025", "cabinRoofCorner(Clone)_primitive126", "cabinRoofCorner(Clone)_primitive027", "cabinRoofCorner(Clone)_primitive128", "cabinWall(Clone)29", "frame_primitive030", "frame_primitive131", "cabinWindow(Clone)32", "cabinWall(Clone)33", "cabinWall(Clone)34", "frame_primitive035", "frame_primitive136", "cabinWindow(Clone)37", "cabinWall(Clone)38", "cabinWall(Clone)39", "cabinWall(Clone)40", "cabinFloor(Clone)41"];
    let campfirelist = ["campfireStones_blocks1", "campfire_large2"];
    let benches = ["bench(Clone)11", "bench(Clone)44"];
    let present1list = ["lid_primitive074", "lid_primitive175", "present(Clone)_primitive076", "present(Clone)_primitive177"];
    //+tie_primitive1100
    //+tie_primitive099
    //"tie_primitive0103", "tie_primitive1104", "tie_primitive0105", "tie_primitive1106", "tie_primitive0107", "tie_primitive1108"
    let present2list = ["lid_primitive078", "lid_primitive179", "presentLow(Clone)_primitive080", "presentLow(Clone)_primitive181"];
    let present3list = ["presentLow(Clone)_primitive080", "presentLow(Clone)_primitive181", "Group_primitive082", "Group_primitive183", "lid_primitive084", "lid_primitive185"];
    //let tar = [154, 157, 160, 163, 163, 503, 494, 510, 513, 516, 518, 522, 526, 530, 533, 535, 537, 540, 542, 546, 549, 554, 556, 559, 561, 564, 567, 570, 572, 575];
    for (let i = 0; i < cabin1list.length; i++) {
        //tar.push(models[cabin1list[i]].uniqueId);
        cabin1.addChild(cabinmeshes[cabin1list[i]]);
    }
    cabin1.addChild(models["wreath(Clone)_primitive0101"]);
    cabin1.addChild(models["wreath(Clone)_primitive1102"]);
    for (let i = 0; i < cabin2list.length; i++) {
        cabin2.addChild(cabinmeshes[cabin2list[i]]);
    }
    let cabin2lightlist = ["lightsRed(Clone)_primitive061", "lightsRed(Clone)_primitive063", "lightsRed(Clone)_primitive162", "lightsRed(Clone)_primitive164", "lightsMulti(Clone)_primitive065", "lightsMulti(Clone)_primitive068", "lightsMulti(Clone)_primitive166", "lightsMulti(Clone)_primitive169", "lightsMulti(Clone)_primitive267", "lightsMulti(Clone)_primitive270", "lightpost(Clone)_primitive071", "lightpost(Clone)_primitive172"];

    for (let i = 0; i < cabin2lightlist.length; i++) {
        cabin2.addChild(models[cabin2lightlist[i]]);
    }

    for (let i = 0; i < campfirelist.length; i++) {
        campfire.addChild(cabinmeshes[campfirelist[i]]);
    }
    sled.addChild(cabinmeshes["sled(Clone)8"]);
    bench1.addChild(cabinmeshes[benches[0]]);
    bench2.addChild(cabinmeshes[benches[1]]);
    for (let i = 0; i < present1list.length; i++) {
        present1.addChild(cabinmeshes[present1list[i]]);
    }
    for (let i = 0; i < present2list.length; i++) {
        present2.addChild(cabinmeshes[present2list[i]]);
    }
    for (let i = 0; i < present3list.length; i++) {
        present3.addChild(cabinmeshes[present3list[i]]);
    }

    let fencelist = ["fence6", "fence_simple0", "fence_simple1", "fence_simple2", "fence_corner3", "fence_simple2", "fence_corner3", "fence4", "fence5", "fence6"];
    for (let i = 0; i < fencelist.length; i++) {
        models[fencelist[i]].scaling = new BABYLON.Vector3(16, 16, 16);
        fences.push((new BABYLON.Mesh("fence" + i, scene)).addChild(models[fencelist[i]]));
        masterMeshList.push(fences[i]);
    }
    let stonelist = ["stone_tall107", "stone_tall98", "stone_tall89", "stone_tall510", "stone_tall411", "stone_tall312", "stone_tall213", "stone_tall114", "stone_smallTop215", "stone_smallTop116", "stone_smallFlat317", "stone_smallFlat218", "stone_smallFlat119", "stone_small920", "stone_small821", "stone_small722", "stone_large623", "stone_large524", "stone_large425", "stone_large326", "stone_large227", "stone_large128", "stone_statue_primitive029", "stone_statue_primitive130"];
    for (let i = 0; i < stonelist.length; i++) {
        models[stonelist[i]].scaling = new BABYLON.Vector3(16, 16, 16);
        stones.push((new BABYLON.Mesh("stone" + i, scene)).addChild(models[stonelist[i]]));
        masterMeshList.push(stones[i]);
    }
    let tree1list = ["treePineSnowed(Clone)_primitive036", "treePineSnowed(Clone)_primitive137"];
    for (let i = 0; i < tree1list.length; i++) {
        tree1.addChild(models[tree1list[i]]);
    }
    let tree2list = ["treePineSnow(Clone)_primitive044", "treePineSnow(Clone)_primitive145", "treePineSnow(Clone)_primitive246"];
    for (let i = 0; i < tree2list.length; i++) {
        tree2.addChild(models[tree2list[i]]);
    }
    let tree3list = ["treePineSnow(Clone)_primitive073", "treePineSnow(Clone)_primitive174", "treePineSnow(Clone)_primitive275"];
    for (let i = 0; i < tree3list.length; i++) {
        tree3.addChild(models[tree3list[i]]);
    }
    let tree4list = ["treePineSnow(Clone)_primitive076", "treePineSnow(Clone)_primitive177", "treePineSnow(Clone)_primitive278"];
    for (let i = 0; i < tree4list.length; i++) {
        tree4.addChild(models[tree4list[i]]);
    }
    let tree5list = ["treePineSnow(Clone)_primitive084", "treePineSnow(Clone)_primitive185", "treePineSnow(Clone)_primitive286"];
    for (let i = 0; i < tree5list.length; i++) {
        tree5.addChild(models[tree5list[i]]);
    }
    let tree6list = ["treePineSnow(Clone)_primitive087", "treePineSnow(Clone)_primitive188", "treePineSnow(Clone)_primitive289"];
    for (let i = 0; i < tree6list.length; i++) {
        tree6.addChild(models[tree6list[i]]);
    }
    let tree7list = ["treePineSnow(Clone)_primitive090", "treePineSnow(Clone)_primitive191", "treePineSnow(Clone)_primitive292"];
    for (let i = 0; i < tree7list.length; i++) {
        tree7.addChild(models[tree7list[i]]);
    }
    let tree8list = ["treePineSnow(Clone)_primitive096", "treePineSnow(Clone)_primitive197", "treePineSnow(Clone)_primitive298"];
    for (let i = 0; i < tree8list.length; i++) {
        tree8.addChild(models[tree8list[i]]);
    }
    let fancytreelist = ["treeDecorated(Clone)_primitive038", "treeDecorated(Clone)_primitive139", "treeDecorated(Clone)_primitive240", "treeDecorated(Clone)_primitive341"];
    for (let i = 0; i < fancytreelist.length; i++) {
        fancytree.addChild(models[fancytreelist[i]]);
    }
    fancytree.addChild(cabinmeshes["star7"]);
    let lightpost1list = ["lightpost(Clone)_primitive042", "lightpost(Clone)_primitive143"];
    for (let i = 0; i < lightpost1list.length; i++) {
        lightpost1.addChild(models[lightpost1list[i]]);
    }
    let lightpost2list = ["lightpost(Clone)_primitive081", "lightpost(Clone)_primitive182"];
    for (let i = 0; i < lightpost2list.length; i++) {
        lightpost2.addChild(models[lightpost2list[i]]);
    }
    let snowman1list = ["snowman(Clone)_primitive047", "snowman(Clone)_primitive148", "snowman(Clone)_primitive249"];
    for (let i = 0; i < snowman1list.length; i++) {
        snowman1.addChild(models[snowman1list[i]]);
    }
    let snowman2list = ["snowmanFancy(Clone)_primitive050", "snowmanFancy(Clone)_primitive151", "snowmanFancy(Clone)_primitive252", "snowmanFancy(Clone)_primitive353", "snowmanFancy(Clone)_primitive454"];
    for (let i = 0; i < snowman2list.length; i++) {
        snowman2.addChild(models[snowman2list[i]]);
    }
    let snowfortlist = ["snowFort(Clone)55"];
    snowfort = models[snowfortlist[0]];
    masterMeshList.push(snowfort);
    let rockformationlist = ["rockFormationSmall(Clone)_primitive157", "rockFormationMedium(Clone)_primitive058", "rockFormationMedium(Clone)_primitive159"];
    for (let i = 0; i < rockformationlist.length; i++) {
        models[rockformationlist[i]].scaling = new BABYLON.Vector3(16, 16, 16);
        rockformations.push((new BABYLON.Mesh("rockformation" + i, scene)).addChild(models[rockformationlist[i]]));
    }
    let largerockformationlist = ["rockFormationLarge(Clone)_primitive180", "rockFormationLarge(Clone)_primitive079"];
    let largerockform = new BABYLON.Mesh("lagrerockformation", scene);
    for (let i = 0; i < largerockformationlist.length; i++) {
        largerockform.addChild(models[largerockformationlist[i]]);
        largerockform.scaling = new BABYLON.Vector3(16, 16, 16);
    }
    rockformations.push(largerockform);
    let rockformation2list = ["rockFormationLarge(Clone)_primitive093", "rockFormationLarge(Clone)_primitive194"];
    let largerockform2 = new BABYLON.Mesh("lagrerockformation2", scene);
    for (let i = 0; i < rockformation2list.length; i++) {
        largerockform2.scaling = new BABYLON.Vector3(16, 16, 16);
        largerockform2.addChild(models[rockformation2list[i]]);
    }
    rockformations.push(largerockform2);
    for (let i = 0; i < rockformations.length; i++) {
        masterMeshList.push(rockformations[i]);
    }

    let snowpatchlist = ["snowPatch(Clone)60", "snowPatch(Clone)83", "snowPatch(Clone)95"];
    for (let i = 0; i < snowpatchlist.length; i++) {
        models[snowpatchlist[i]].scaling = new BABYLON.Vector3(16, 16, 16);
        snowpatches.push((new BABYLON.Mesh("snowpatch" + i, scene)).addChild(models[snowpatchlist[i]]));
        masterMeshList.push(snowpatches[i]);
    }

    let trainlist = ["trackCorner(Clone)_primitive0109", "trackCorner(Clone)_primitive1110", "trackCorner(Clone)_primitive2111", "trackCornerLarge(Clone)_primitive0112", "trackCornerLarge(Clone)_primitive1113", "trackCornerLarge(Clone)_primitive2114", "trackStraight(Clone)_primitive0115", "trackStraight(Clone)_primitive1116", "trackStraight(Clone)_primitive2117", "trackCorner(Clone)_primitive0118", "trackCorner(Clone)_primitive1119", "trackCorner(Clone)_primitive2120", "trackStraight(Clone)_primitive0121", "trackStraight(Clone)_primitive1122", "trackStraight(Clone)_primitive2123", "trackCornerLarge(Clone)_primitive0124", "trackCornerLarge(Clone)_primitive1125", "trackCornerLarge(Clone)_primitive2126", "trackCornerLarge(Clone)_primitive0127", "trackCornerLarge(Clone)_primitive1128", "trackCornerLarge(Clone)_primitive2129", "trackStraight(Clone)_primitive0130", "trackStraight(Clone)_primitive1131", "trackStraight(Clone)_primitive2132", "trackCornerLarge(Clone)_primitive0133", "trackCornerLarge(Clone)_primitive1134", "trackCornerLarge(Clone)_primitive2135", "trackCorner(Clone)_primitive0136", "trackCorner(Clone)_primitive1137", "trackCorner(Clone)_primitive2138", "trackCorner(Clone)_primitive0139", "trackCorner(Clone)_primitive1140", "trackCorner(Clone)_primitive2141", "trackStraight(Clone)_primitive0142", "trackStraight(Clone)_primitive1143", "trackStraight(Clone)_primitive2144", "wheel_primitive0145", "wheel_primitive1146", "wheel_primitive0147", "wheel_primitive1148", "trainLocomotive(Clone)_primitive0149", "trainLocomotive(Clone)_primitive1150", "wheel_primitive0151", "wheel_primitive1152", "wheel_primitive0153", "wheel_primitive1154", "wheel_primitive0155", "wheel_primitive1156", "wheel_primitive0157", "wheel_primitive1158", "trainTender(Clone)_primitive0159", "trainTender(Clone)_primitive1160", "wheel_primitive0161", "wheel_primitive1162", "wheel_primitive0163", "wheel_primitive1164", "trainWagon(Clone)_primitive0165", "trainWagon(Clone)_primitive1166", "trainWagon(Clone)_primitive2167", "trainWagon(Clone)_primitive3168", "log169", "log170", "log171", "log172", "log173", "wheel_primitive0174", "wheel_primitive1175", "wheel_primitive0176", "wheel_primitive1177", "trainWagonFlat(Clone)_primitive0178", "trainWagonFlat(Clone)_primitive1179"];
    for (let i = 0; i < trainlist.length; i++) {
        models[trainlist[i]].scaling = new BABYLON.Vector3(16, 16, 16);
        train.addChild(models[trainlist[i]]);
    }
    //cabin1.scale = new BABYLON.Vector3(100,100,100);
    cabin1.position.x += 20;
    cabin2.position.y += 20;

    sled.scaling = new BABYLON.Vector3(16, 16, 16);
    campfire.scaling = new BABYLON.Vector3(16, 16, 16);
    bench1.scaling = new BABYLON.Vector3(16, 16, 16);
    bench2.scaling = new BABYLON.Vector3(16, 16, 16);
    present1.scaling = new BABYLON.Vector3(16, 16, 16);
    present2.scaling = new BABYLON.Vector3(16, 16, 16);
    present3.scaling = new BABYLON.Vector3(16, 16, 16);

    tree1.scaling = new BABYLON.Vector3(16, 16, 16);
    tree2.scaling = new BABYLON.Vector3(16, 16, 16);
    tree3.scaling = new BABYLON.Vector3(16, 16, 16);
    tree4.scaling = new BABYLON.Vector3(16, 16, 16);
    tree5.scaling = new BABYLON.Vector3(16, 16, 16);
    tree6.scaling = new BABYLON.Vector3(16, 16, 16);
    tree7.scaling = new BABYLON.Vector3(16, 16, 16);
    tree8.scaling = new BABYLON.Vector3(16, 16, 16);
    fancytree.scaling = new BABYLON.Vector3(16, 16, 16);
    lightpost1.scaling = new BABYLON.Vector3(16, 16, 16);
    lightpost2.scaling = new BABYLON.Vector3(16, 16, 16);

    snowman1.scaling = new BABYLON.Vector3(16, 16, 16);
    snowman2.scaling = new BABYLON.Vector3(16, 16, 16);

    snowfort.scaling = new BABYLON.Vector3(16, 16, 16);
    cabin1.scaling = new BABYLON.Vector3(16, 16, 16);
    cabin2.scaling = new BABYLON.Vector3(16, 16, 16);
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