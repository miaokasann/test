import { BlurEffect, BlurMaterial } from "./script/BlurShader/BlurEffect";

export default class CommandBuffer_Outline {
    private commandBuffer: Laya.CommandBuffer;
    private cameraEventFlag: Laya.CameraEventFlags = Laya.CameraEventFlags.BeforeImageEffect;
    private camera: Laya.Camera;

    private renders:Laya.BaseRender[]  = [];
    private materials:Laya.Material[] = [];

    private viewPort: Laya.Viewport = null;
    public static instance: CommandBuffer_Outline ;

    private isUseOuline: boolean = true; // 控制是否使用描边

    public static GetInstance(): CommandBuffer_Outline{
        if(this.instance == null) this.instance = new CommandBuffer_Outline();
        return this.instance;
    }

    public init(a): void {
        //使用之前必须先初始化 
        if(this.camera == null){
            BlurEffect.init();
            this.camera = a; //传入你照射物体的相机
            this.viewPort = this.camera.viewport;
            //Laya.Shader3D.debugMode = true;
        }
    }

    private renderTexture: Laya.RenderTexture = null;
    private subRendertexture: Laya.RenderTexture = null;
    private downRenderTexture: Laya.RenderTexture = null;
    private blurTexture: Laya.RenderTexture = null;
    private buf: Laya.CommandBuffer = null;

    public createDrawMeshCommandBuffer(camera:Laya.Camera, renders:Laya.BaseRender[] , materials:Laya.Material[]):Laya.CommandBuffer{
        if(this.renders.length == 0 || this.materials.length == 0 ) return;

        this.buf = new Laya.CommandBuffer();
        //当需要在流程中拿摄像机渲染效果的时候 设置true
        camera.enableBuiltInRenderTexture = true;
        //创建和屏幕一样大的Rendertexture

        this.renderTexture = Laya.RenderTexture.createFromPool(this.viewPort.width , this.viewPort.height,Laya.RenderTextureFormat.R8G8B8A8,Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        //将RenderTexture设置为渲染目标
        this.buf.setRenderTarget(this.renderTexture);

        //清楚渲染目标的颜色为黑色，不清理深度
        this.buf.clearRenderTarget(true,false,new Laya.Vector4(0,0,0,0));

        //将传入的Render渲染到纹理上
        for(var i = 0,n = renders.length;i<n;i++){
            if(renders == null){
                this.RemoveCommandBuffer_Outline();
                return;
            }
            this.buf.drawRender(renders[i],materials[i],0);
        }
        //创建新的RenderTexture
        this.subRendertexture = Laya.RenderTexture.createFromPool(this.viewPort.width,this.viewPort.height,Laya.RenderTextureFormat.R8G8B8A8,Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        //将renderTexture的结果复制到subRenderTexture
        this.buf.blitScreenQuad(this.renderTexture,this.subRendertexture);
        //设置模糊的参数
        var downSampleFactor:number = 2;
        var downSampleWidth:number = this.viewPort.width/downSampleFactor;
        var downSampleheigh:number = this.viewPort.height/downSampleFactor; 
        var texSize:Laya.Vector4 = new Laya.Vector4(1.0/this.viewPort.width,1.0/this.viewPort.height,this.viewPort.width,downSampleheigh);
        //创建模糊材质
        var blurMaterial: BlurMaterial = new BlurMaterial(texSize,1);

        //创建降采样RenderTexture1
         this.downRenderTexture = Laya.RenderTexture.createFromPool(downSampleWidth,downSampleheigh,Laya.RenderTextureFormat.R8G8B8,Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        //降采样  使用blurMaterial材质的0SubShader将Rendertexture渲染到DownRendertexture
        this.buf.blitScreenQuadByMaterial(this.renderTexture, this.downRenderTexture ,null,blurMaterial,0);

         //创建降采样RenderTexture2
        this.blurTexture =  Laya.RenderTexture.createFromPool(downSampleWidth,downSampleheigh,Laya.RenderTextureFormat.R8G8B8,Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        this.blurTexture.filterMode = Laya.FilterMode.Bilinear;

        //Horizontal blur 使用blurMaterial材质的1SubShader
        this.buf.blitScreenQuadByMaterial( this.downRenderTexture ,this.blurTexture,null,blurMaterial,1);
        //vertical blur 使用blurMaterial材质的2SubShader
        this.buf.blitScreenQuadByMaterial(this.blurTexture, this.downRenderTexture ,null,blurMaterial,2);
        //Horizontal blur使用blurMaterial材质的1SubShader
        this.buf.blitScreenQuadByMaterial( this.downRenderTexture ,this.blurTexture,null,blurMaterial,1);
        //vertical blur使用blurMaterial材质的2SubShader
        this.buf.blitScreenQuadByMaterial(this.blurTexture, this.downRenderTexture ,null,blurMaterial,2);
        //在命令流里面插入设置图片命令流，在调用的时候会设置blurMaterial的图片数据
        this.buf.setShaderDataTexture(blurMaterial._shaderValues,BlurMaterial.SHADERVALUE_SOURCETEXTURE0, this.downRenderTexture );
        this.buf.setShaderDataTexture(blurMaterial._shaderValues,BlurMaterial.ShADERVALUE_SOURCETEXTURE1,this.subRendertexture);
        //caculate edge计算边缘图片
        this.buf.blitScreenQuadByMaterial(this.blurTexture,this.renderTexture,null,blurMaterial,3);
        //重新传入图片
        this.buf.setShaderDataTexture(blurMaterial._shaderValues,BlurMaterial.SHADERVALUE_SOURCETEXTURE0,this.renderTexture);
        //将camera渲染结果复制到subRendertexture，使用blurMaterial的4通道shader
        this.buf.blitScreenQuadByMaterial(null,this.subRendertexture,null,blurMaterial,4);
        //将subRenderTexture重新赋值到camera的渲染结果上面
        this.buf.blitScreenQuadByMaterial(this.subRendertexture,null);
        return this.buf;
    }


  /** 为目标物体添加上描边 */
    public AddCommandBuffet_Outline(sprite3D : Laya.Sprite3D): void{

        if((sprite3D as Laya.MeshSprite3D) == null || !this.isUseOuline){ 
          // console.log('spreite3D node meshSprite3D is null');
           return;
        }
        //此处判断传进来的是否为蒙皮网格
        if((sprite3D as Laya.MeshSprite3D).meshRenderer == null){
            this.renders.push( (sprite3D as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer);
           // console.log( (sprite3D as Laya.SkinnedMeshSprite3D).skinnedMeshRenderer);
         }else{
            this.renders.push( (sprite3D as Laya.MeshSprite3D).meshRenderer );
           // console.log( (sprite3D as Laya.MeshSprite3D).meshRenderer);
         }  

        var unlitMaterial = new Laya.UnlitMaterial();
        unlitMaterial.albedoColor = new Laya.Vector4(255,0,0,255);

        this.materials.push(unlitMaterial);

        //创建commandBuffer
        this.commandBuffer = this.createDrawMeshCommandBuffer(this.camera , this.renders , this.materials);
        //将commandBuffer加入渲染流程
        this.camera.addCommandBuffer(this.cameraEventFlag,this.commandBuffer);
        //console.log( '添加描边:' + sprite3D.name);

    }

    /** 移除在物体上边的描边 */
    public RemoveCommandBuffer_Outline(): void{
        if(this.renders.length == 0 || !this.isUseOuline) return;
        this.renders = [];
        this.materials = [];
        this.camera.removeCommandBuffer(this.cameraEventFlag,this.commandBuffer);
        this.buf = null;

        /** 释放之前使用的贴图，不然会增加10兆渲染内存 */
        if(this.renderTexture != null) Laya.RenderTexture.recoverToPool(this.renderTexture);
        if(this.blurTexture != null) Laya.RenderTexture.recoverToPool(this.blurTexture);
        if(this.subRendertexture != null) Laya.RenderTexture.recoverToPool(this.subRendertexture);
        if(this.downRenderTexture != null) Laya.RenderTexture.recoverToPool(this.downRenderTexture);

        //console.log('清除描边');
    }

}