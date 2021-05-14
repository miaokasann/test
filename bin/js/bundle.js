var laya = (function () {
    'use strict';

    var View = Laya.View;
    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class LoadingUI extends Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("Loading");
            }
        }
        ui.LoadingUI = LoadingUI;
        REG("ui.LoadingUI", LoadingUI);
        class RockerUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("Rocker");
            }
        }
        ui.RockerUI = RockerUI;
        REG("ui.RockerUI", RockerUI);
        class UIMainUI extends Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("UIMain");
            }
        }
        ui.UIMainUI = UIMainUI;
        REG("ui.UIMainUI", UIMainUI);
        class VideoUI extends Scene {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("Video");
            }
        }
        ui.VideoUI = VideoUI;
        REG("ui.VideoUI", VideoUI);
    })(ui || (ui = {}));

    class Loading extends ui.LoadingUI {
        constructor() {
            super();
            this.progress = 0;
            Laya.init(600, 400, Laya.WebGL);
            Laya.stage.bgColor = "#FFF";
            Laya.loader.load(["UI/progress_loading.png", "UI/progress_loading$bar.png"], Laya.Handler.create(this, onLoaded));
            function onLoaded() {
                this.pro = new Laya.ProgressBar("ui/progress_loading.png");
                this.pro.width = 400;
                this.pro.pos(60, 150);
                this.pro.value = 0;
                this.pro.sizeGrid = "5,5,5,5";
                Laya.stage.addChild(this.pro);
                Laya.timer.loop(10, this, this.changeProgressBar);
            }
        }
        changeProgressBar() {
            if (this.pro.value >= 1) {
                this.pro.value = 0;
            }
            this.pro.value += Math.random() * 0.1;
            this.tips.text = "正在加载中，请耐心等待：" + Math.floor(this.pro.value * 100) + " %";
        }
        showInfo() {
            this.tips.text = "加载 0";
            this.tips.fontSize = 15;
        }
    }

    var Event = Laya.Event;
    class JoyStick extends ui.RockerUI {
        constructor(touchSp) {
            super();
            this._MaxMoveDistance = 10;
            this._curTouchId = -1;
            this._touchRect = touchSp;
        }
        onAwake() {
            this.joystickBg.on(Event.MOUSE_DOWN, this, this._onMouseDown);
            this._touchRect.on(Event.MOUSE_UP, this, this._onMouseUp);
            this._touchRect.on(Event.MOUSE_OUT, this, this._onMouseUp);
            this._originPiontX = this.width / 2;
            this._originPiontY = this.height / 2;
            this._originPiont = new Laya.Point(this._originPiontX, this._originPiontY);
            this._joystickRadius = this._originPiontX - this.joystickPoint.width / 2;
        }
        _onMouseDown(evt) {
            this._curTouchId = evt.touchId;
            this._startStageX = evt.stageX;
            this._startStageY = evt.stageY;
            this.joystickPoint.pos(this._originPiontX, this._originPiontY);
            this._touchRect.on(Event.MOUSE_MOVE, this, this._onMouseMove);
            JoyStick._isTouchMove = true;
        }
        _onMouseMove(evt) {
            if (evt.touchId != this._curTouchId)
                return;
            let locationPos = this.globalToLocal(new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY), false);
            this.joystickPoint.pos(locationPos.x, locationPos.y);
            this._deltaX = locationPos.x - this._originPiont.x;
            this._deltaY = locationPos.y - this._originPiont.y;
            let dx = this._deltaX * this._deltaX;
            let dy = this._deltaY * this._deltaY;
            JoyStick.angle = Math.atan2(this._deltaX, this._deltaY) * 180 / Math.PI;
            if (JoyStick.angle < 0)
                JoyStick.angle += 360;
            JoyStick.angle = Math.round(JoyStick.angle);
            JoyStick.radians = Math.PI / 180 * JoyStick.angle;
            if (dx + dy >= this._joystickRadius * this._joystickRadius) {
                let x = Math.floor(Math.sin(JoyStick.radians) * this._joystickRadius + this._originPiont.x);
                let y = Math.floor(Math.cos(JoyStick.radians) * this._joystickRadius + this._originPiont.y);
                this.joystickPoint.pos(x, y);
            }
            else {
                this.joystickPoint.pos(locationPos.x, locationPos.y);
            }
        }
        _onMouseUp(evt) {
            if (evt.touchId != this._curTouchId)
                return;
            this._touchRect.off(Event.MOUSE_MOVE, this, this._onMouseMove);
            this.joystickPoint.pos(this._originPiontX, this._originPiontY);
            JoyStick.radians = JoyStick.angle = -1;
            JoyStick._isTouchMove = false;
        }
        distanceSquare(srcX, srcY, desX, desY) {
            return (desX - srcX) * (desX - srcX) + (desY - srcY) * (desY - srcY);
        }
    }
    JoyStick._isTouchMove = false;
    JoyStick.angle = -1;
    JoyStick.radians = -1;

    class UIMain extends ui.UIMainUI {
        constructor() {
            super();
        }
        static initJoystick() {
            let joystick = new JoyStick(Laya.stage);
            Laya.stage.addChild(joystick);
            joystick.zOrder = 9999;
            joystick.x = 200;
            joystick.y = joystick.height - 200;
            alert(1111);
        }
    }

    class videoControlScript extends Laya.Script {
        constructor() {
            super();
        }
        onAwake() {
            this.videoOwner = this.owner;
        }
        creatVideo(e) {
            let div = Laya.Browser.createElement("div");
            div.className = "div",
                this.divElement = div,
                Laya.Browser.document.body.appendChild(div);
            let i = new Laya.Size(this.videoOwner.width, this.videoOwner.height);
            Laya.Utils.fitDOMElementInArea(div, this.videoOwner, 0, 0, i.width, i.height);
            let video = Laya.Browser.createElement("video");
            video.setAttribute("id", "myvideo"),
                this.videoElement = video,
                video.controls = !0,
                video.setAttribute("webkit-playsinline", !0),
                video.setAttribute("playsinline", !0),
                video.setAttribute("x5-video-player-type", "h5"),
                video.setAttribute("x-webkit-airplay", !0),
                video.setAttribute("x5-video-orientation", "portrait"),
                video.setAttribute("preload", "auto"),
                video.setAttribute("width", "100%"),
                video.setAttribute("height", "100%"),
                video.style.zInddex = Laya.Render.canvas.style.zIndex + 1,
                video.type = "vedio/mp4",
                video.src = e,
                div.appendChild(video);
            var cMask = new Laya.Sprite();
            cMask.graphics.drawCircle(80, 80, 50, "#ff0000");
            cMask.pos(120, 50);
            video.mask = cMask;
        }
        playVideo(e) {
            null != this.videoElement && (this.videoElement.pause(),
                this.videoElement.src = e,
                this.videoElement.play());
        }
        videoEvent() {
            this.videoElement.addEventListener("loadstart", () => { }),
                this.videoElement.addEventListener("progress", () => { }),
                this.videoElement.addEventListener("play", () => { }),
                this.videoElement.addEventListener("pause", () => { }),
                this.videoElement.addEventListener("seeking", () => { }),
                this.videoElement.addEventListener("seeked", () => { }),
                this.videoElement.addEventListener("waiting", () => { }),
                this.videoElement.addEventListener("timeupdate", () => { }),
                this.videoElement.addEventListener("ended", () => { }),
                this.videoElement.addEventListener("error", () => { });
        }
        myClear() {
            console.log(Laya.Browser.document.body.hasChildNodes(this.divElement));
            null != this.divElement && Laya.Browser.document.body.hasChildNodes(this.divElement) && Laya.Browser.document.body.removeChild(this.divElement);
        }
    }

    class Video extends ui.VideoUI {
        constructor() {
            super();
        }
        onAwake() {
            this.width = Laya.stage.width;
            this.videoWin.pos((Laya.stage.width - this.videoWin.width) / 2, this.videoWin.y);
            this.btn_close.on(Laya.Event.MOUSE_DOWN, this, this.onCloseClick);
            this.videoWin.x = this.width / 2 - this.videoWin.width / 2;
            this.videoWin.y = this.height / 2 - this.videoWin.height / 2;
            this.videoCtl = this.videoWin.addComponent(videoControlScript);
        }
        createVideo(e) {
            this.videoCtl.creatVideo(e);
        }
        createVideos(e) {
            this._urls = e;
            this._currentPlayIndex = 0;
            this.videoCtl.creatVideo(e[0]);
        }
        onCloseClick() {
            null != this.videoCtl && this.videoCtl.myClear();
            this.destroy();
            this.videoCtl = null;
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/LoadingUI.ts", Loading);
            reg("script/RockerUI.ts", JoyStick);
            reg("script/UIMainUI.ts", UIMain);
            reg("script/VideoUI.ts", Video);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "Loading.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class ConstEvent {
        constructor() { }
    }

    class CameraControlScript extends Laya.Script3D {
        constructor() {
            super();
            this._MaxMoveDistance = 10;
            this._tempVector3 = new Laya.Vector3();
            this.yawPitchRoll = new Laya.Vector3();
            this.resultRotation = new Laya.Quaternion();
            this.tempRotationZ = new Laya.Quaternion();
            this.tempRotationX = new Laya.Quaternion();
            this.tempRotationY = new Laya.Quaternion();
            this.rotaionSpeed = 0.00010;
            this.lastMouseX = 0;
            this.lastMouseY = 0;
            this.isMouseDown = false;
            this.moveSpeed = 2;
            this.posX = 0.0;
            this.posY = 0.0;
            this.point = new Laya.Vector2();
            this._outHitResult = new Laya.HitResult();
            this.outs = new Laya.HitResult();
            this.ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, -2, 0));
            this.outHitInfo = new Laya.HitResult();
            this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
        }
        onAwake() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
            this.camera = this.owner;
        }
        _onDestroy() {
            Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.off(Laya.Event.MOUSE_UP, this, this.mouseUp);
        }
        onUpdate() {
            var elapsedTime = Laya.timer.delta;
            if (JoyStick.angle != -1) {
                var speedX = Math.sin(JoyStick.radians);
                var speedZ = Math.cos(JoyStick.radians);
                this.moveForward(this.moveSpeed * elapsedTime * .001 * speedZ);
                this.moveRight(this.moveSpeed * elapsedTime * .001 * speedX);
                ConstEvent.cameraRotate = new Laya.Vector3(0, 0, 0);
                var rayOrigin = new Laya.Vector3(0, 0, 0);
                Laya.Vector3.add(this.camera.transform.position, new Laya.Vector3(speedX, 0, speedZ), rayOrigin);
                this.ray.origin = rayOrigin;
                this.camera.parent.scene.physicsSimulation.rayCast(this.ray, this.outHitInfo, 5);
                if (this.outHitInfo.succeeded) {
                    speedX = speedZ = 0;
                    ConstEvent.cameraTranslate = new Laya.Vector3(speedX, 0, speedZ);
                }
            }
            else if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown && !JoyStick._isTouchMove && !ConstEvent.isTurning) {
                this.posX = this.point.x = Laya.MouseManager.instance.mouseX;
                this.posY = this.point.y = Laya.MouseManager.instance.mouseY;
                this.camera.viewportPointToRay(this.point, this._ray);
                this.camera.parent.scene.physicsSimulation.rayCast(this._ray, this.outs);
                if (this.outs.succeeded && this.outs.collider.owner.name == "dimianl") {
                    if (this.touchMove != undefined && !this.touchMove) {
                        console.log(this.outs.point);
                        console.log(this.camera.transform.position);
                        console.log("x", this.outs.point.x - this.camera.transform.position.x);
                        console.log("z", this.outs.point.z - this.camera.transform.position.z);
                        this.moveRight((this.outs.point.x - this.camera.transform.position.x) * elapsedTime * .001 * this.moveSpeed);
                        this.moveForward((this.outs.point.z - this.camera.transform.position.z) * elapsedTime * .001 * this.moveSpeed);
                    }
                    else {
                        ConstEvent.cameraTranslate = new Laya.Vector3(0, 0, 0);
                    }
                }
                if (this.outs.succeeded && this.outs.collider.owner.name == "dianshi") {
                    debugger;
                }
                var offsetX = Laya.stage.mouseX - this.lastMouseX;
                var offsetY = Laya.stage.mouseY - this.lastMouseY;
                var yprElem = this.yawPitchRoll;
                yprElem.x += offsetX * this.rotaionSpeed * elapsedTime;
                yprElem.y += offsetY * this.rotaionSpeed * elapsedTime;
                this.updateRotation();
                this.lastMouseX = Laya.stage.mouseX;
                this.lastMouseY = Laya.stage.mouseY;
            }
            else if (ConstEvent.isTurning) {
                ConstEvent.cameraRotate = new Laya.Vector3(0, .001 * elapsedTime * ConstEvent.turnSpeed, 0);
                ConstEvent.cameraTranslate = new Laya.Vector3(0, 0, 0);
            }
            else {
                Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-0.001 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(0.001 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-0.001 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(0.001 * elapsedTime);
                ConstEvent.cameraTranslate = new Laya.Vector3(0, 0, 0);
                ConstEvent.cameraRotate = new Laya.Vector3(0, 0, 0);
            }
        }
        mouseDown(e) {
            this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
            this._startStageX = e.stageX;
            this._startStageY = e.stageY;
            this.isMouseDown = true;
            this.touchMove = false;
        }
        mouseUp(e) {
            this.isMouseDown = false;
        }
        mouseMove(e) {
            let moveDis = this.distanceSquare(this._startStageX, this._startStageY, e.stageX, e.stageY);
            this.touchMove = moveDis > 0 ? true : false;
        }
        moveForward(distance) {
            this._tempVector3.x = 0;
            this._tempVector3.z = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        moveRight(distance) {
            this._tempVector3.z = 0;
            this._tempVector3.x = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        moveVertical(distance) {
            this._tempVector3.x = this._tempVector3.z = 0;
            this.camera.transform.translate(this._tempVector3, false);
        }
        updateRotation() {
            if (Math.abs(this.yawPitchRoll.y) < 0.50) {
                Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
                this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
                this.camera.transform.localRotation = this.camera.transform.localRotation;
            }
        }
        onEnable() {
        }
        onDisable() {
        }
        distanceSquare(srcX, srcY, desX, desY) {
            return (desX - srcX) * (desX - srcX) + (desY - srcY) * (desY - srcY);
        }
    }

    class kefuCharacterControl extends Laya.Script3D {
        constructor() {
            super(),
                this._dir = new Laya.Vector3;
            this._rotateUpDir = new Laya.Vector3(0, 0, 0);
            this.lookAtRotation = new Laya.Quaternion(0, 0, 0, 0);
        }
        init(e, t) {
            this.isOpposite = t,
                this.target = e;
        }
        onStart() {
            this.monkey = this.owner;
        }
        onUpdate() {
            if (this.target !== null) {
                this._dir.x = this.target.transform.position.x - this.monkey.transform.position.x;
                this._dir.y = 0;
                this._dir.z = this.target.transform.position.z - this.monkey.transform.position.z;
                this.isOpposite && (this._dir.x *= -1, this._dir.z *= -1);
                this._dir.z *= -1,
                    Laya.Quaternion.rotationLookAt(this._dir, this._rotateUpDir, this.lookAtRotation);
                this.monkey.transform.rotation = this.lookAtRotation;
            }
        }
    }

    class Main {
        constructor() {
            this.posX = 0.0;
            this.posY = 0.0;
            this.point = new Laya.Vector2();
            this._outHitResult = new Laya.HitResult();
            this.outs = new Laya.HitResult();
            this._tempVector3 = new Laya.Vector3();
            Config.useRetinalCanvas = true;
            Config.isAntialias = true;
            Config.isAlpha = true;
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
            Laya.stage.screenMode = "horizontal";
            Laya.stage.bgColor = null;
            ConstEvent.cameraTranslate = new Laya.Vector3;
            ConstEvent.cameraRotate = new Laya.Vector3;
            ConstEvent.turnSpeed = 0;
            ConstEvent.isTurning = false;
            this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
            this.PreloadingRes();
        }
        PreloadingRes() {
            var resource = [
                "res/LayaScene_changjing/Conventional/changjing.ls",
                "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm",
                "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat",
                "res/threeDimen/skyBox/skyBox2/SkyBox2.lmat",
                "res/atlas/kefu2d.png",
                "res/atlas/play.jpg"
            ];
            Laya.loader.create(resource, Laya.Handler.create(this, this.on3DComplete));
        }
        on3DComplete() {
            this.scene = Laya.stage.addChild(Laya.Loader.getRes("res/LayaScene_changjing/Conventional/changjing.ls"));
            console.log(this.scene);
            this.scene.ambientColor = new Laya.Vector3(0.6, 0, 0);
            this.camera = this.scene.getChildByName("Main Camera");
            this.camera.enableHDR = false;
            this.camera.addComponent(CameraControlScript);
            this.scene.addChild(this.camera);
            var cub1 = this.scene.getChildByName('zhanguan');
            var cub2 = cub1.getChildByName('dimianl');
            var cub3 = cub1.getChildByName('dianshi');
            var cubeCollider2 = cub2.getComponent(Laya.PhysicsCollider);
            var cubeCollider3 = cub3.getComponent(Laya.PhysicsCollider);
            cubeCollider2.friction = 2;
            cubeCollider2.restitution = 0.3;
            cubeCollider3.friction = 2;
            cubeCollider3.restitution = 0.3;
            ConstEvent.video = new Video();
            Main.rocker = new JoyStick(Laya.stage);
            Laya.stage.addChild(Main.rocker);
            Main.rocker.x = 25;
            Main.rocker.y = Laya.stage.height - 120;
            this.addButton(Laya.stage.width - 80, Laya.stage.height - 100, 10, 10, "→", function (e) {
                e.stopPropagation();
                this.beginTurn(true);
            }, function (e) {
                e.stopPropagation();
                this.stopTurn();
            });
            var kefuMat = new Laya.UnlitMaterial();
            kefuMat.albedoTexture = Laya.Loader.getRes("res/atlas/kefu2d.png");
            kefuMat.albedoIntensity = 1;
            kefuMat.alphaTest = true;
            kefuMat.alphaTestValue = 0.6;
            kefuMat.renderQueue = Laya.Material.RENDERQUEUE_ALPHATEST;
            var kefu = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createQuad(0.6, 1.7)));
            kefu.transform.translate(new Laya.Vector3(-1, 1, 2.3));
            kefu.meshRenderer.material = kefuMat;
            kefu.addComponent(kefuCharacterControl).init(this.camera, false);
            this.addMouseEvent();
            Laya.timer.frameLoop(100, this, this.onFrameLoop);
        }
        addMouseEvent() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        }
        onMouseDown() {
            if (JoyStick._isTouchMove)
                return;
            this.posX = this.point.x = Laya.MouseManager.instance.mouseX;
            this.posY = this.point.y = Laya.MouseManager.instance.mouseY;
            this.camera.viewportPointToRay(this.point, this._ray);
            this.scene.physicsSimulation.rayCast(this._ray, this.outs);
            if (this.outs) {
                if (this.outs.collider.owner.name == 'dianshiqiang') {
                    ConstEvent.video = new Video();
                    Laya.stage.addChild(ConstEvent.video);
                    let url = 'https://2dhall-video.ciftis.org/trans-video/20200813/08b05b19efc64b498ca7124746505234.mp4';
                    ConstEvent.video.createVideo(url);
                }
            }
        }
        moveForward(distance) {
            this._tempVector3.x = 0;
            this._tempVector3.z = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        moveRight(distance) {
            this._tempVector3.z = 0;
            this._tempVector3.x = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        beginTurn(isLeft) {
            ConstEvent.turnSpeed = isLeft ? -50 : 50,
                ConstEvent.isTurning = true;
            this.changeActionButton.scale(1.2, 1.2);
        }
        stopTurn() {
            ConstEvent.isTurning = false;
            this.changeActionButton.scale(1, 1);
        }
        addButton(x, y, width, height, text, clikFun, stopClick) {
            Laya.loader.load(["res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.changeActionButton = Laya.stage.addChild(new Laya.Button("res/threeDimen/ui/button.png", text));
                this.changeActionButton.size(width, height);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 10;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(x, y);
                this.changeActionButton.on(Laya.Event.MOUSE_DOWN, this, clikFun);
                this.changeActionButton.on(Laya.Event.MOUSE_UP, this, stopClick);
            }));
        }
        onFrameLoop() {
            this.camera.transform.translate(ConstEvent.cameraTranslate, false);
            this.camera.transform.rotate(ConstEvent.cameraRotate, true, false);
        }
    }
    new Main();

    return Main;

}());
