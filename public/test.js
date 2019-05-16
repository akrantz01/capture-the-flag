!function (l) {
    function e(e) {
        for (var t, n, o = e[0], r = e[1], a = e[2], s = 0, i = []; s < o.length; s++) n = o[s], h[n] && i.push(h[n][0]), h[n] = 0;
        for (t in r) Object.prototype.hasOwnProperty.call(r, t) && (l[t] = r[t]);
        for (u && u(e); i.length;) i.shift()();
        return c.push.apply(c, a || []), d()
    }

    function d() {
        for (var e, t = 0; t < c.length; t++) {
            for (var n = c[t], o = !0, r = 1; r < n.length; r++) {
                var a = n[r];
                0 !== h[a] && (o = !1)
            }
            o && (c.splice(t--, 1), e = s(s.s = n[0]))
        }
        return e
    }

    var n = {}, h = {app: 0}, c = [];

    function s(e) {
        if (n[e]) return n[e].exports;
        var t = n[e] = {i: e, l: !1, exports: {}};
        return l[e].call(t.exports, t, t.exports, s), t.l = !0, t.exports
    }

    s.m = l, s.c = n, s.d = function (e, t, n) {
        s.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: n})
    }, s.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(e, "__esModule", {value: !0})
    }, s.t = function (t, e) {
        if (1 & e && (t = s(t)), 8 & e) return t;
        if (4 & e && "object" == typeof t && t && t.__esModule) return t;
        var n = Object.create(null);
        if (s.r(n), Object.defineProperty(n, "default", {
            enumerable: !0,
            value: t
        }), 2 & e && "string" != typeof t) for (var o in t) s.d(n, o, function (e) {
            return t[e]
        }.bind(null, o));
        return n
    }, s.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return s.d(t, "a", t), t
    }, s.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, s.p = "";
    var t = window.webpackJsonp = window.webpackJsonp || [], o = t.push.bind(t);
    t.push = e, t = t.slice();
    for (var r = 0; r < t.length; r++) e(t[r]);
    var u = o;
    c.push([1, "vendor"]), d()
}([, function (e, t, n) {
    "use strict";
    var o = this && this.__importDefault || function (e) {
        return e && e.__esModule ? e : {default: e}
    };
    Object.defineProperty(t, "__esModule", {value: !0}), n(2), n(3);
    var r = o(n(4));
    window.addEventListener("DOMContentLoaded", function () {
        var e = new r.default("#renderCanvas");
        e.doRender();
        var t = new URL(window.location.href);
        e.from = t.searchParams.get("from").toUpperCase(), e.to = t.searchParams.get("to").toUpperCase()
    })
}, function (e, t, n) {
}, , function (e, t, n) {
    "use strict";
    var o = this && this.__importStar || function (e) {
        if (e && e.__esModule) return e;
        var t = {};
        if (null != e) for (var n in e) Object.hasOwnProperty.call(e, n) && (t[n] = e[n]);
        return t.default = e, t
    };
    Object.defineProperty(t, "__esModule", {value: !0});
    var i = o(n(0));
    n(9);
    var r = o(n(10)), a = function () {
        function e(e) {
            this.alphabetModels = {}, this.from = "", this.to = "", this.santaAnimGroups = {}, this.colors = ["5D5455", "EA4033", "E5A67B", "F2D6C1", "9DBC9D", "122521", "2D493A", "AA7153", "868080", "373938"], document.onkeydown = this.handleKeyDown.bind(this), document.onkeyup = this.handleKeyUp.bind(this), i.Engine.ShadersRepository = "src/shaders/", this._canvas = document.querySelector(e), this._engine = new i.Engine(this._canvas, !0, {}, !0), this._scene = new i.Scene(this._engine), this._scene.fogMode = i.Scene.FOGMODE_EXP2, this._scene.fogDensity = .05, this._scene.fogColor = new i.Color3(.8, .83, .8), this._scene.collisionsEnabled = !0, this._scene.gravity = new i.Vector3(0, 0, 0), this.createBasicEnv(), this.createGUI()
        }

        return e.prototype.createBasicEnv = function () {
            var o = this, e = i.Mesh.CreateSphere("skyBox", 10, 2500, this._scene),
                t = new i.ShaderMaterial("gradient", this._scene, "gradient", {});
            t.setFloat("offset", 0), t.setFloat("exponent", .6), t.setColor3("topColor", i.Color3.FromInts(0, 119, 255)), t.setColor3("bottomColor", i.Color3.FromInts(240, 240, 255)), t.backFaceCulling = !1, e.material = t;
            var n = new i.DirectionalLight("dir", new i.Vector3(1, -1, -2), this._scene);
            n.position = new i.Vector3(-300, 300, 600), n.intensity = .5, new i.HemisphericLight("light", new i.Vector3(0, 1, 0), this._scene).intensity = 1, this._shadowGenerator = new i.ShadowGenerator(2048, n), this._freeCamera = new i.FreeCamera("camera1", new i.Vector3(-3.12, 1.3, 3.5), this._scene), this._freeCamera.setTarget(new i.Vector3(0, 1, 0)), this._assetsManager = new i.AssetsManager(this._scene), this._assetsManager.addTextureTask("snowflake", "assets/textures/snowflake.png"), this._assetsManager.addMeshTask("environment", "", "assets/3d/christmas.glb", ""), this._assetsManager.addMeshTask("alphabets", "", "assets/3d/alphabets.glb", ""), this._assetsManager.addMeshTask("santa", "", "assets/3d/santa_with_anims_textures.glb", ""), this._engine.loadingUIText = "Loading...", this._assetsManager.onProgressObservable.add(function (e) {
                var t = e.remainingCount, n = e.totalCount;
                o._engine.loadingUIText = "Loading the scene. " + t + " out of " + n + " items still need to be loaded."
            }), this._assetsManager.onTaskSuccessObservable.add(function (e) {
                if ("environment" == e.name && (o.environment = new i.Mesh("environment", o._scene), e.loadedMeshes.forEach(function (e) {
                    o.environment.addChild(e), o._shadowGenerator.getShadowMap().renderList.push(e), e.receiveShadows = !0
                })), "snowflake" == e.name && o.generateSnowParticles(e.texture), "alphabets" == e.name && e.loadedMeshes.forEach(function (e) {
                    (o.alphabetModels[e.name] = e).setEnabled(!1)
                }), "santa" == e.name) {
                    o.santa = new i.Mesh("santa", o._scene);
                    var t = e.loadedSkeletons[0];
                    t && (t.animationPropertiesOverride = new i.AnimationPropertiesOverride, t.animationPropertiesOverride.enableBlending = !0, t.animationPropertiesOverride.blendingSpeed = .05, t.animationPropertiesOverride.loopMode = 1), t.getScene().animationGroups.forEach(function (e) {
                        o.santaAnimGroups[e.name] = e
                    }), e.loadedMeshes.forEach(function (e) {
                        o.santa.addChild(e)
                    }), o.santa.scaling = new i.Vector3(.075, .075, .075), o.santa.rotation.y = o.degToRad(-20), o.santa.position.x = -1, o.santa.position.z = 1, o._shadowGenerator.getShadowMap().renderList.push(o.santa)
                }
            }), this._assetsManager.onTasksDoneObservable.add(function () {
                o.generateFromTo()
            }), this._assetsManager.load();
            var r = i.Mesh.CreateGround("ground", 200, 200, 1, this._scene);
            r.material = new i.StandardMaterial("ground", this._scene), r.material.diffuseColor = i.Color3.FromInts(193, 181, 151), r.material.specularColor = i.Color3.Black(), r.receiveShadows = !0;
            new i.Sound("Jingle Bells", "assets/sounds/jingle_bells.mp3", this._scene, null, {loop: !0, autoplay: !0})
        }, e.prototype.generateSnowParticles = function (e) {
            var t = new i.ParticleSystem("particles", 2e4, this._scene);
            t.particleTexture = e, t.emitter = new i.Vector3(0, 1, 0), t.minEmitBox = new i.Vector3(-10, 10, -10), t.maxEmitBox = new i.Vector3(15, 0, 10), t.color1 = new i.Color4(1, 1, 1, 1), t.color2 = new i.Color4(1, 1, 1, 1), t.colorDead = new i.Color4(1, 1, 1, .5), t.minSize = .1, t.maxSize = .2, t.minLifeTime = .3, t.maxLifeTime = 1.5, t.emitRate = 1500, t.blendMode = i.ParticleSystem.BLENDMODE_STANDARD, t.gravity = new i.Vector3(0, -9.81, 0), t.direction1 = new i.Vector3(-7, -8, 3), t.direction2 = new i.Vector3(7, -8, -3), t.minAngularSpeed = 0, t.maxAngularSpeed = Math.PI, t.minEmitPower = 1, t.maxEmitPower = 3, t.updateSpeed = 5e-4, t.start()
        }, e.prototype.doRender = function () {
            var e = this;
            this._engine.runRenderLoop(function () {
                e._scene.render();
                (new Date).getTime()
            }), window.addEventListener("resize", function () {
                e._engine.resize()
            })
        }, e.prototype.generateFromTo = function () {
            var e = "", t = "", n = new i.AbstractMesh("fromNameMesh", this._scene);
            n.rotation.y = this.degToRad(135);
            var o = new i.AbstractMesh("toNameMesh", this._scene);
            o.rotation.y = this.degToRad(135), null != this.from && (e = this.from), null != this.to && (t = this.to);
            for (var r = this._shadowGenerator.getShadowMap(), a = 0; a < e.length; a++) {
                var s = this.alphabetModels[e[a]].clone(e[a], n, !0);
                n.addChild(s), s.material = new i.StandardMaterial(e[a] + "Mat", this._scene), s && (s.position.x = .2 * a, s.rotation.x = Math.PI / 2, r.renderList.push(s), s.material.emissiveColor = this.HexToRGB(this.colors[Math.floor(this.colors.length * Math.random())]))
            }
            n.position = new i.Vector3(this.santa.position.x - .5, .25, this.santa.position.z);
            for (a = t.length - 1; 0 <= a; a--) {
                (s = this.alphabetModels[t[a]].clone(t[a], o, !0)).material = new i.StandardMaterial(t[a] + "Mat", this._scene), s && (s.position.x = .2 * a, s.rotation.x = this.degToRad(90), r.renderList.push(s), s.material.emissiveColor = this.HexToRGB(this.colors[Math.floor(this.colors.length * Math.random())]))
            }
            o.position = new i.Vector3(this.santa.position.x - .5, .2, this.santa.position.z)
        }, e.prototype.handleKeyDown = function (e) {
        }, e.prototype.handleKeyUp = function (e) {
        }, e.prototype.degToRad = function (e) {
            return e * Math.PI / 180
        }, e.prototype.HexToRGB = function (e) {
            var t = this.HexToR(e) / 255, n = this.HexToG(e) / 255, o = this.HexToB(e) / 255;
            return new i.Color3(t, n, o)
        }, e.prototype.CutHex = function (e) {
            return "#" == e.charAt(0) ? e.substring(1, 7) : e
        }, e.prototype.HexToR = function (e) {
            return parseInt(this.CutHex(e).substring(0, 2), 16)
        }, e.prototype.HexToG = function (e) {
            return parseInt(this.CutHex(e).substring(2, 4), 16)
        }, e.prototype.HexToB = function (e) {
            return parseInt(this.CutHex(e).substring(4, 6), 16)
        }, e.prototype.createGUI = function () {
            var e = r.AdvancedDynamicTexture.CreateFullscreenUI("UI"),
                t = new r.Image("but", "assets/textures/Merry_Christmas.png");
            t.width = .25, t.height = .2, t.verticalAlignment = r.Control.VERTICAL_ALIGNMENT_TOP, e.addControl(t)
        }, e
    }();
    t.default = a
}]);