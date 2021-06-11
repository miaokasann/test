class B extends Laya.Script3D {
        constructor() {
            super(),
            this.currentName = ""
        }
        onTriggerEnter(e) {
            if (1 != Y.instance.loadType)
                return;
            Y.instance.isInCompanyEx = !0,
            this.currentName != e.owner.name && "" != this.currentName && _.LeaveCompnay(parseInt(this.currentName)),
            this.currentName = e.owner.name;
            let t = w.getInstance();
            t.currentCompanyNew = t.findCompnay(parseInt(e.owner.name)),
            p.event("SetDaoHangList")
        }
        onTriggerExit(e) {
            1 == Y.instance.loadType && this.currentName == e.owner.name && (Y.instance.isInCompanyEx = !1,
            p.event("SetCompanyDaoHangDownList", !1),
            _.LeaveCompnay(parseInt(this.currentName)),
            this.currentName = "")
        }
    }
    var F = Laya.Vector3;
    class H extends Laya.Script3D {
        constructor() {
            super(...arguments),
            this.moveSpeed = 3,
            this.touchId = -1,
            this.rotateSpeed = 3,
            this.checkDistance = 4,
            this.colliderFilter = D.None | D.KeFu3D | D.ZhanWei,
            this.checkProductGroupCollider = D.KeFu2D | D.KeFu3D | D.ZhanPin | D.ShiPinMian,
            this.checkClickScreen = D.Plane | D.ZhanPin | D.KeFu2D | D.Tips,
            this._dirForward = new Laya.Vector3(0,0,1),
            this._outHitResult = new Laya.HitResult,
            this.pointMosueDown = new Laya.Vector2
        }
        init() {
            this.collider = this.owner.getComponent(Laya.PhysicsCollider),
            this.collider.collisionGroup = D.Role;
            let e = this.owner.getChildByName("Cube");
            if (null != e) {
                let t = e.getComponent(Laya.Rigidbody3D);
                t.collisionGroup = D.Cube,
                t.canCollideWith = D.ZhanTai,
                e.addComponent(B)
            }
            this._ray = new Laya.Ray(new Laya.Vector3(0,0,0),new Laya.Vector3(0,0,0)),
            this.camera = this.owner.getChildByName("Main Camera"),
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDown),
            Laya.stage.on(Laya.Event.KEY_UP, this, this.onKeyUp),
            this.registorListenner(),
            this.oriRotationRulerX = this.camera.transform.localRotationEulerX,
            this._hasMoveCamera = !1
        }
        registorListenner() {
            N.instance.cameraTouch.on(Laya.Event.MOUSE_DOWN, this, this.onTouchStart),
            N.instance.cameraTouch.on(Laya.Event.MOUSE_MOVE, this, this.onTouchMove),
            N.instance.cameraTouch.on(Laya.Event.MOUSE_UP, this, this.onTouchEnd),
            N.instance.cameraTouch.on(Laya.Event.MOUSE_OUT, this, this.onTouchEnd)
        }
        clearListenner() {
            N.instance.cameraTouch.off(Laya.Event.MOUSE_DOWN, this, this.onTouchStart),
            N.instance.cameraTouch.off(Laya.Event.MOUSE_MOVE, this, this.onTouchMove),
            N.instance.cameraTouch.off(Laya.Event.MOUSE_UP, this, this.onTouchEnd),
            N.instance.cameraTouch.off(Laya.Event.MOUSE_OUT, this, this.onTouchEnd)
        }
        onKeyDown(e) {
            if (3 != Y.instance.gameState)
                return;
            let t = new Laya.Vector3;
            e.keyCode == Laya.Keyboard.A ? t.x = 1 : e.keyCode == Laya.Keyboard.W ? t.z = 1 : e.keyCode == Laya.Keyboard.D ? t.x = -1 : e.keyCode == Laya.Keyboard.S && (t.z = -1),
            this.moveDir = t
        }
        onKeyUp(e) {
            this.moveDir = null
        }
        onUpdate() {
            if (3 != Y.instance.gameState)
                return;
            this.inputMoveCtrl = !1;
            let e = Laya.timer.delta / 1e3
              , t = e * this.moveSpeed
              , i = Y.instance.getInputCtrl();
            if (0 != i.joyOffset.x || 0 != i.joyOffset.y) {
                this.moveDir = null;
                let e = new Laya.Vector2(i.joyOffset.x,i.joyOffset.y);
                Laya.Vector2.normalize(e, e),
                this.translatePos = new Laya.Vector3(e.x * t * -1,0,e.y * t * -1);
                let s = this.owner.transform.position.clone();
                this.owner.transform.translate(this.translatePos, !0);
                let n = new Laya.HitResult;
                Y.instance.myScene.physicsSimulation.shapeCast(this.collider.colliderShape, s, this.owner.transform.position, n, null, null, D.Role, this.colliderFilter) && (this.owner.transform.position = s),
                this.inputMoveCtrl = !0
            } else if (null != this.moveDir) {
                this.translatePos = new Laya.Vector3(this.moveDir.x * t,0,this.moveDir.z * t);
                let e = this.owner.transform.position.clone();
                this.owner.transform.translate(this.translatePos, !0);
                let i = new Laya.HitResult;
                Y.instance.myScene.physicsSimulation.shapeCast(this.collider.colliderShape, e, this.owner.transform.position, i, null, null, D.Role, this.colliderFilter) && (this.owner.transform.position = e),
                this.inputMoveCtrl = !0
            }
            if (this.inputMoveCtrl && (this.clickMoving = !1,
            Y.instance.ShowClickTips(!1, this.clickMovePos)),
            this.clickMoving)
                if (this.clickMovePassedTime += e,
                this.clickMovePassedTime >= this.clickMoveTimer)
                    this.owner.transform.position = this.clickMovePos,
                    this.clickMoving = !1,
                    Y.instance.ShowClickTips(!1, this.clickMovePos),
                    Y.instance.ArriveTarget(this.clickColliderTag);
                else {
                    let e = this.owner.transform.position.clone()
                      , i = this.owner.transform.position;
                    i.x += this.clickMoveDir.x * t,
                    i.z += this.clickMoveDir.z * t,
                    this.owner.transform.position = i;
                    let s = new Laya.HitResult;
                    Y.instance.myScene.physicsSimulation.shapeCast(this.collider.colliderShape, e, this.owner.transform.position, s, null, null, D.Role, this.colliderFilter) && (this.owner.transform.position = e,
                    this.clickMoving = !1,
                    Y.instance.ShowClickTips(!1, this.clickMovePos))
                }
            else
                Y.instance.ShowClickTips(!1, this.clickMovePos)
        }
        checkForwardCollider(e) {
            (e || null != this.translatePos && !Y.instance.notDetectForward) && (this.checkForwardColliderDetail(e, 0) || this.checkForwardColliderDetail(e, 1))
        }
        checkForwardColliderDetail(e, t) {
            let i = !1;
            this.camera.transform.getForward(this._dirForward);
            let s = this.camera.transform.position;
            return this._ray = new Laya.Ray(new F(s.x,s.y + t,s.z),this._dirForward),
            this._isShowKefu = !1,
            Y.instance.myScene.physicsSimulation.rayCast(this._ray, this._outHitResult, this.checkDistance, D.Role, this.checkProductGroupCollider),
            this._outHitResult.succeeded ? (e || null != this.translatePos) && (this._outHitResult.collider.owner.name.startsWith("kefu") ? (this._isShowKefu = !0,
            Y.instance.DaoHangListStatus = 1,
            p.event("ShowKeFu"),
            i = !0) : this._outHitResult.collider.owner.name.startsWith("zhanpin") ? (this.colliderZhanWei(this._outHitResult.collider.owner.name),
            i = !0) : this._outHitResult.collider.owner.name.startsWith("shipin") && (this.colliderShiPing(this._outHitResult.collider.owner.name),
            i = !0)) : (this._isShowKefu = !1,
            2 == Y.instance.loadType ? Y.instance.DaoHangListStatus = 1 : Y.instance.isInCompanyEx ? Y.instance.DaoHangListStatus = 1 : Y.instance.DaoHangListStatus = 0,
            p.event("HideKeFu"),
            p.event("HideDetails"),
            p.event("ShowNoramlDaoHao")),
            i
        }
        checkForward() {
            null != this._ray && null != this._outHitResult && this.checkForwardDetaio(0) && this.checkForwardDetaio(1)
        }
        checkForwardDetaio(e) {
            let t = !1;
            this.camera.transform.getForward(this._dirForward);
            let i = this.camera.transform.position;
            return this._ray = new Laya.Ray(new F(i.x,i.y + e,i.z),this._dirForward),
            Y.instance.myScene.physicsSimulation.rayCast(this._ray, this._outHitResult, this.checkDistance, D.Role, this.checkProductGroupCollider),
            this._outHitResult.succeeded && (this._outHitResult.collider.owner.name.startsWith("kefu") ? (this._isShowKefu = !0,
            Y.instance.DaoHangListStatus = 1,
            p.event("ShowKeFu"),
            t = !0) : this._outHitResult.collider.owner.name.startsWith("zhanpin") ? (this.colliderZhanWei(this._outHitResult.collider.owner.name),
            t = !0) : this._outHitResult.collider.owner.name.startsWith("shipin") && (this.colliderShiPing(this._outHitResult.collider.owner.name),
            t = !0)),
            t
        }
        colliderZhanWei(e) {
            if (3 != Y.instance.gameState)
                return;
            let t = parseInt(e.replace("zhanpin", ""));
            w.getInstance().currentCompanyNew.moveToProduct(t),
            Y.instance.currentChanpingType = a.chanping,
            Y.instance.DaoHangListStatus = 2,
            p.event("ShowDetails", this._outHitResult.collider.owner.transform.position),
            p.event("ShowDetailDaoHao")
        }
        colliderShiPing(e) {
            if (3 != Y.instance.gameState)
                return;
            let t = 0;
            t = e.startsWith("shiping") ? parseInt(e.replace("shiping", "")) : parseInt(e.replace("shipin", ""))
        }
        onTouchStart(e) {
            3 == Y.instance.gameState && -1 == this.touchId && (this._hasMoveCamera = !1,
            this.clickMoving = !1,
            Y.instance.ShowClickTips(!1, this.clickMovePos),
            this.touchId = e.touchId,
            this.touchUIPos = new Laya.Vector2(e.stageX,e.stageY))
        }
        onTouchMove(e) {
            if (3 == Y.instance.gameState && this.touchUIPos && this.touchId == e.touchId && (Math.abs(e.stageX - this.touchUIPos.x) > 5 || Math.abs(e.stageY - this.touchUIPos.y) > 5)) {
                this._hasMoveCamera = !0;
                let t = Laya.timer.delta / 1e3 * this.rotateSpeed;
                this.owner.transform.rotate(new Laya.Vector3(0,(e.stageX - this.touchUIPos.x) * t), !0, !1);
                let i = (e.stageY - this.touchUIPos.y) * t;
                this.camera.transform.localRotationEulerX = u.Clamp(this.camera.transform.localRotationEulerX + i, -30, 30),
                this.touchUIPos.x = e.stageX,
                this.touchUIPos.y = e.stageY
            }
        }
        setCameraRotataion(e) {
            this.camera.transform.localRotationEulerX = -e
        }
        onTouchEnd(e) {
            3 == Y.instance.gameState && e.touchId == this.touchId && (this.touchUIPos = null,
            this.touchId = -1,
            this._hasMoveCamera || this.onMyMouseClick(null),
            this._hasMoveCamera = !1)
        }
        resetXRotaionEuler() {
            this.camera.transform.localRotationEulerX = this.oriRotationRulerX
        }
        onMyMouseClick(e) {
            if (3 != Y.instance.gameState)
                return;
            this.pointMosueDown.x = Laya.MouseManager.instance.mouseX,
            this.pointMosueDown.y = Laya.MouseManager.instance.mouseY;
            let t = new Laya.Ray(new Laya.Vector3,new Laya.Vector3);
            Y.instance._camera.viewportPointToRay(this.pointMosueDown, t);
            let i = new Laya.HitResult;
            Y.instance.myScene.physicsSimulation.rayCast(t, i, 1e5, D.Role, this.checkClickScreen),
            i.succeeded && (console.log("点击到了" + i.collider.owner.name),
            this.setClickMoveParams(i, i.collider.collisionGroup))
        }
        setClickMoveParams(e, t) {
            if (this.clickColliderTag = t,
            t == D.Plane)
                this.clickMovePos = e.point,
                this.clickMovePos.y = this.owner.transform.position.y;
            else if (t == D.ZhanPin || t == D.Tips || t == D.KeFu2D) {
                if (t == D.ZhanPin) {
                    let t = parseInt(e.collider.owner.name.replace("zhanpin", ""));
                    w.getInstance().currentCompanyNew.moveToProduct(t)
                }
                if (t == D.Tips)
                    if (e.collider.owner.name.startsWith("tishi")) {
                        let t = parseInt(e.collider.owner.name.replace("tishi", ""));
                        w.getInstance().currentCompanyNew.moveToTiShi(t)
                    } else {
                        let t = parseInt(e.collider.owner.name.replace("zptishi", ""));
                        w.getInstance().currentCompanyNew.moveToProduct(t),
                        this.clickColliderTag = D.ZhanPin
                    }
                return void Y.instance.ArriveTarget(this.clickColliderTag)
            }
            let i = !1
              , s = Laya.Vector3.distance(this.clickMovePos, this.owner.transform.position)
              , n = s;
            t != D.KeFu2D && t != D.ZhanPin && t != D.Tips || (n = s - 1) < 0 && (i = !0,
            n *= -1),
            this.clickMoveTimer = n / this.moveSpeed,
            this.clickMovePassedTime = 0,
            this.clickMoveDir = new Laya.Vector3;
            let o = new Laya.Vector3(this.clickMovePos.x - this.owner.transform.position.x,0,this.clickMovePos.z - this.owner.transform.position.z);
            if (i && (o.x *= -1,
            o.y *= -1,
            o.z *= -1),
            F.normalize(o, this.clickMoveDir),
            t == D.KeFu2D || t == D.ZhanPin || t == D.Tips) {
                let e = this.clickMovePos;
                e.x = this.clickMoveDir.x * n + this.owner.transform.position.x,
                e.z = this.clickMoveDir.z * n + this.owner.transform.position.z,
                this.clickMovePos = e
            }
            this.moveDir = null,
            this.clickMoving = !0,
            Y.instance.ShowClickTips(!0, this.clickMovePos)
        }
        SetCameraPosY(e) {
            let t = this.camera.transform.localPosition;
            t.y = e ? -.1 : 1,
            this.camera.transform.localPosition = t
        }
    }