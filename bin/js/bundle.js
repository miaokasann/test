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
            Laya.loader.load(["ui/progress_loading.png", "ui/progress_loading$bar.png"], Laya.Handler.create(this, onLoaded));
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

    class ConstEvent {
        constructor() {
        }
    }
    ConstEvent.turnSpeed = 1000;

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
                video.controls = true,
                video.setAttribute("webkit-playsinline", true),
                video.setAttribute("playsinline", true),
                video.setAttribute("x5-video-player-type", "h5"),
                video.setAttribute("x-webkit-airplay", true),
                video.setAttribute("x5-video-orientation", "portrait"),
                video.setAttribute("preload", "auto"),
                video.setAttribute("width", "100%"),
                video.setAttribute("height", "100%"),
                video.setAttribute("autoplay", "true"),
                video.style.zInddex = Laya.Render.canvas.style.zIndex + 1,
                video.type = "vedio/mp4",
                video.src = e,
                div.appendChild(video);
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
            ConstEvent.isClickVideoBtn = false;
        }
    }

    class Video extends ui.VideoUI {
        constructor() {
            super();
        }
        onAwake() {
            console.log(this);
            this.width = Laya.stage.width;
            this.videoWin.pos((Laya.stage.width - this.videoWin.width) / 2, this.videoWin.y);
            this.btn_close.pos(((Laya.stage.width - this.videoWin.width) / 2) + this.videoWin.width, this.videoWin.y);
            this.btn_close.on(Laya.Event.MOUSE_DOWN, this, this.onCloseClick);
            this.videoWin.x = this.width / 2 - this.videoWin.width / 2;
            this.videoWin.y = this.height / 2 - this.videoWin.height / 2;
            console.log('videoWin.x', this.videoWin.x);
            console.log('videoWin.y', this.videoWin.y);
            this.videoCtl = this.videoWin.addComponent(videoControlScript);
            this.videoBg.pos(0, 0);
            this.videoBg.size(Laya.stage.width, Laya.stage.height);
            this.videoBg.graphics.drawRect(0, 0, this.videoBg.width, this.videoBg.height, "rgba(0,0,0,.4)");
            this.videoBg.on(Laya.Event.MOUSE_DOWN, this, this.mouseHandler);
        }
        mouseHandler() {
            ConstEvent.isClickVideoBtn = true;
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
            ConstEvent.isClickVideoBtn = true;
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

    class CameraControlScript extends Laya.Script3D {
        constructor() {
            super();
            this._MaxMoveDistance = 10;
            this._dirForward = new Laya.Vector3();
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
            this.touchUIPos = new Laya.Vector2();
            this.rotateSpeed = 3;
            this.ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, -2, 0));
            this.outHitInfo = new Laya.HitResult();
            this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
        }
        init() {
            this.registorListenner();
        }
        registorListenner() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onTouchStart),
                Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onTouchMove),
                Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onTouchEnd),
                Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.onTouchEnd);
        }
        clearListenner() {
            Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.onTouchStart),
                Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onTouchMove),
                Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onTouchEnd),
                Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.onTouchEnd);
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
                let curRadians = Math.atan(this.GetForward.x/this.GetForward.z);
                console.log("当前指向角度:",curRadians);
                var speedX = Math.sin(JoyStick.radians+curRadians);
                console.log("弧度:",JoyStick.radians)
                console.log("角度:",JoyStick.angle);
                var speedZ = Math.cos(JoyStick.radians+curRadians);
                console.log("当前指向:",this.GetForward,"spx",speedX,"spz",speedZ);
                
                let x = Math.round(this.GetForward.x * 100)/100 >= 0 ? 1 : -1;
                let z = Math.round(this.GetForward.z * 100)/100 >= 0 ? 1 : -1;
                console.log("当前指向取整:",x,z);

                if(z>0){
                    //转向右后方
                    speedZ = -speedZ;
                    speedX = -speedX;
                }
                
                this.moveForward(this.moveSpeed * elapsedTime * .001 * speedZ );
                this.moveRight(this.moveSpeed * elapsedTime * .001 * speedX );
                var lastX = speedX - 10;
                var lastZ = speedZ - 10;
                var xV = speedX > 0 ? 1 : -1;
                var zV = speedZ > 0 ? 1 : -1;
                if (ConstEvent.isTrigger) {
                    console.log(ConstEvent.isTrigger);
                    this.moveForward(this.moveSpeed * elapsedTime * .001 * lastZ * zV);
                    this.moveRight(this.moveSpeed * elapsedTime * .001 * lastX * xV);
                }
                var rayOrigin = new Laya.Vector3(0, 0, 0);
                Laya.Vector3.add(this.camera.transform.position, new Laya.Vector3(speedX, 0, speedZ), rayOrigin);
                this.ray.origin = rayOrigin;
                this.camera.parent.scene.physicsSimulation.rayCast(this.ray, this.outHitInfo);
                if (!this.outHitInfo.succeeded) {
                    speedX = speedZ = 0;
                    ConstEvent.cameraTranslate = new Laya.Vector3(speedX, 0, speedZ);
                }
            }
            else if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown && !JoyStick._isTouchMove && !ConstEvent.isClickVideoBtn) {
                this.posX = this.point.x = Laya.MouseManager.instance.mouseX;
                this.posY = this.point.y = Laya.MouseManager.instance.mouseY;
                this.camera.viewportPointToRay(this.point, this._ray);
                this.camera.parent.scene.physicsSimulation.rayCast(this._ray, this.outs);
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
                if (Laya.KeyBoardManager.hasKeyDown(87)) {
                    if (ConstEvent.isTrigger) {
                        this.moveForward(0.001 * elapsedTime + 1);
                    }
                    this.moveForward(-0.001 * elapsedTime);
                }
                if (Laya.KeyBoardManager.hasKeyDown(83)) {
                    if (ConstEvent.isTrigger) {
                        this.moveForward(-0.001 * elapsedTime - 1);
                    }
                    this.moveForward(0.001 * elapsedTime);
                }
                if (Laya.KeyBoardManager.hasKeyDown(65)) {
                    if (ConstEvent.isTrigger) {
                        this.moveRight(0.001 * elapsedTime + 1);
                    }
                    this.moveRight(-0.001 * elapsedTime);
                }
                if (Laya.KeyBoardManager.hasKeyDown(68)) {
                    if (ConstEvent.isTrigger) {
                        this.moveRight(-0.001 * elapsedTime - 1);
                    }
                    this.moveRight(0.001 * elapsedTime);
                }
                ConstEvent.cameraTranslate = new Laya.Vector3(0, 0, 0);
                ConstEvent.cameraRotate = new Laya.Vector3(0, 0, 0);
            }
        }
        get GetForward() {
            this.camera.transform.getForward(this._dirForward);
            return this._dirForward;
        }
        onTouchStart(e) {
            console.log(e);
            this.touchId = e.touchId;
            this.touchUIPos = new Laya.Vector2(e.stageX, e.stageY);
        }
        onTouchMove(e) {
            if (this.touchUIPos && this.touchId == e.touchId && (Math.abs(e.stageX - this.touchUIPos.x) > 5 || Math.abs(e.stageY - this.touchUIPos.y) > 5)) {
                let t = Laya.timer.delta / 1e3 * this.rotateSpeed;
                this.camera.transform.rotate(new Laya.Vector3(0, (e.stageX - this.touchUIPos.x) * t), !0, !1);
                let i = (e.stageY - this.touchUIPos.y) * t;
                this.camera.transform.localRotationEulerX = this.Clamp(this.camera.transform.localRotationEulerX + i, -30, 30),
                    this.touchUIPos.x = e.stageX,
                    this.touchUIPos.y = e.stageY;
            }
            
        }
        onTouchEnd(e) {
            this.touchUIPos = null;
        }
        Clamp(e, t, i) {
            return e < t ? t : e > i ? i : e;
        }
        mouseDown(e) {
            this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
            this._startStageX = e.stageX;
            this._startStageY = e.stageY;
            this.isMouseDown = true;
            this.touchMove = false;
            console.log("鼠标按下,当前指向:",this.GetForward);
        }
        mouseUp(e) {
            this.isMouseDown = false;
        }
        mouseMove(e) {
            let moveDis = this.distanceSquare(this._startStageX, this._startStageY, e.stageX, e.stageY);
            this.touchMove = moveDis > 0 ? true : false;
            if(this.isMouseDown){
                console.log("鼠标按住移动,当前指向:",this.GetForward);
            }
            
        }
        moveForward(distance) {
            this._tempVector3.x = 0;
            this._tempVector3.y = 0;
            this._tempVector3.z = distance;
            this.camera.transform.translate(new Laya.Vector3(0, 0, distance), false);
        }
        moveRight(distance) {
            this._tempVector3.y = 0;
            this._tempVector3.z = 0;
            this._tempVector3.x = distance;
            this.camera.transform.translate(new Laya.Vector3(distance, 0, 0), false);
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

    class triggerScript extends Laya.Script3D {
        constructor() {
            super();
            this.currentName = '';
            console.log('triggerScript');
        }
        onTriggerEnter(e) {
            console.log('enter:' + e.owner.name);
            if (e.owner.name == 'qiang' || e.owner.name == 'qiangbianshang') {
                ConstEvent.isTrigger = false;
            }
            else {
                ConstEvent.isTrigger = false;
            }
        }
        onTriggerExit(e) {
            console.log('exit:' + e.owner.name);
            if (e.owner.name == 'qiang' || e.owner.name == 'qiangbianshang') {
                ConstEvent.isTrigger = true;
            }
            else {
                ConstEvent.isTrigger = false;
            }
        }
    }

    class Main {
        constructor() {
            this._dirForward = new Laya.Vector3();
            this.posX = 0.0;
            this.posY = 0.0;
            this.point = new Laya.Vector2();
            this._outHitResult = new Laya.HitResult();
            this.outs = new Array();
            this._tempVector3 = new Laya.Vector3();
            Config.useRetinalCanvas = true;
            Config.isAntialias = true;
            Config.isAlpha = true;
            let config3d = new Config3D();
            config3d.lightClusterCount = new Laya.Vector3(100, 100, 100);
            console.log(config3d);
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height);
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
            ConstEvent.isClickVideoBtn = false;
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
                "res/atlas/kefu2d.png",
                "res/atlas/play.png"
            ];
            Laya.loader.create(resource, Laya.Handler.create(this, this.on3DComplete));
        }
        on3DComplete() {
            this.scene = Laya.stage.addChild(Laya.Loader.getRes("res/LayaScene_changjing/Conventional/changjing.ls"));
            console.log(this.scene);
            console.log(this.scene);
            this.camera = this.scene.getChildByName("Main Camera");
            this.camera.enableHDR = false;
            this.camera.addComponent(CameraControlScript);
            this.camera.addComponent(triggerScript);
            this.scene.addChild(this.camera);
            this.scene.physicsSimulation.continuousCollisionDetection = true;
            ConstEvent.video = new Video();
            Main.rocker = new JoyStick(Laya.stage);
            Laya.stage.addChild(Main.rocker);
            Main.rocker.x = 25;
            Main.rocker.y = Laya.stage.height - 120;
            this.addButton(Laya.stage.width - 80, Laya.stage.height - 100, 10, 10, "→", function (e) {
                e.stopPropagation();
                this.beginTurn(true);
                console.log(this.GetForward);
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
            var kefu = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createQuad(0.7, 1.8)));
            kefu.transform.translate(new Laya.Vector3(-1.2, 1, 2.3));
            kefu.meshRenderer.material = kefuMat;
            kefu.addComponent(kefuCharacterControl).init(this.camera, false);
            var anniuMat = new Laya.UnlitMaterial();
            anniuMat.albedoTexture = Laya.Loader.getRes("res/atlas/play.png");
            anniuMat.albedoIntensity = 1;
            anniuMat.alphaTest = true;
            anniuMat.alphaTestValue = 0.6;
            anniuMat.renderQueue = Laya.Material.RENDERQUEUE_ALPHATEST;
            var anniu = this.scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createQuad(0.6, 0.6)));
            anniu.transform.translate(new Laya.Vector3(0.1, 1.8, -2.8));
            anniu.meshRenderer.material = anniuMat;
            var planeStaticCollider = anniu.addComponent(Laya.PhysicsCollider);
            var planeShape = new Laya.BoxColliderShape(1, 0, 1);
            planeStaticCollider.colliderShape = planeShape;
            planeStaticCollider.friction = 2;
            planeStaticCollider.restitution = 0.3;
            planeStaticCollider.owner.name = 'videoBtn';
            anniu.addComponent(kefuCharacterControl).init(this.camera, false);
            this.addMouseEvent();
            Laya.timer.frameLoop(10, this, this.onFrameLoop);
        }
        get GetForward() {
            this.camera.transform.getForward(this._dirForward);
            return this._dirForward;
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
            this.scene.physicsSimulation.rayCastAll(this._ray, this.outs);
            if (this.outs.length !== 0) {
                this.outs.forEach((item, index) => {
                    if (item.collider.owner.name == 'videoBtn' && !ConstEvent.isClickVideoBtn) {
                        ConstEvent.video = new Video();
                        Laya.stage.addChild(ConstEvent.video);
                        let url = 'https://2dhall-video.ciftis.org/trans-video/20200813/08b05b19efc64b498ca7124746505234.mp4';
                        ConstEvent.video.createVideo(url);
                        ConstEvent.isClickVideoBtn = true;
                    }
                });
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
