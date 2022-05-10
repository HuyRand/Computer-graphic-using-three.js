

function init() {


    scene = new THREE.Scene(); // declaring scene agent
    gui =  new dat.GUI(); // assigning GUI agent


    var clock = new THREE.Clock();
    GLTFLoader = new THREE.GLTFLoader(); 
    
    AffineTransformation=null; //Currently chosen Affine Transformation 
    // Check if the player has chosen a Affine transformation
    InTranslation= false; 
    InRotation= false;
    InScale= false;

    InAmbient=false; //check if Ambient option is selected 
    IsShadow = false; //check if shadow option is selected 
    InLightingSetting=false; //check if lighting setting  option - adjusting the position of the light source, its direction and intensity - is selected 

    IsCheckAffine=false; //check if an Affine transformation option is selected 
    InTexture=false; // check if Texture option is selected 
    Texture=null; // texture entity to make a new material
    CurrentAnimation=null;  

    IsRotating=false;
    IsMorphing=false;
    IsAnimating=false;
    IsEnlarging=true;


    //axis
    AxisHelper = new THREE.AxesHelper(20)

    //populating plane
    var planeMaterial = getMaterial('phong', 'rgb(255,255,255)');
    var plane = getPlane(planeMaterial, 100);
    plane.name='plane-1';
    //populating a default object - box , face type
    var ShapeMaterial = getMaterial('phong', 'rgb(120,120,120)')
    Shape = getBox(ShapeMaterial, 3, 3, 3);
    Shape.add(AxisHelper)
    Shape.name = 'box'
    Shape.position.y = 1.5
    Type = 'face';

    //populating lighting component - spot light , spot type 
    Lighting = getSpotLight(1); 
    Lighting.name='spot';
    SetUpLighting()


    //Position the plane to be under and orthogonal to the current display object
    plane.rotation.x = Math.PI / 2;



    //Adding entities into the scene
    scene.add(plane);
    scene.add(Lighting);
    
    scene.add(Shape)

    // GLTFLoader.load('Monke.glb', function(gltf){
    //     scene.add( gltf.scene );
    //     Shape = gltf.scene.children[2];
    //     console.log(Shape)

    // });

    // console.log(Shape)

    // Declaring camera agent
    camera = new THREE.OrthographicCamera(
        -15,
        15,
        15,
        -15,
        1,
        1000
    );
    camera.position.x = 10;
    camera.position.y = 18;
    camera.position.z = -18;
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // look at the object 

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor('rgb(120,120,120)');
    document.getElementById("webgl").appendChild(renderer.domElement);
    OrbitControls = new THREE.OrbitControls(camera, renderer.domElement); // camera helper which enables the user the move the camera with ease 


    update(renderer, scene, camera, OrbitControls, clock);

    
    return scene;
}

function getMaterial(type, color) {
    var selectedMaterial;
    var materialOption = {
        color: color === undefined ? 'rgb(255,255,255)' : color,
    };

    switch (type) {
        case 'basic':
            selectedMaterial = new THREE.MeshBasicMaterial(materialOption);
            break;
        case 'lambert':
            selectedMaterial = new THREE.MeshLambertMaterial(materialOption);
            break;
        case 'phong':
            selectedMaterial = new THREE.MeshPhongMaterial(materialOption);
            break;
        case 'standard':
            selectedMaterial = new THREE.MeshStandardMaterial(materialOption);
            break;
    }
    selectedMaterial.side = THREE.DoubleSide;
    return selectedMaterial;

}

function getBox(material, w, h, d) {
    var geometry = new THREE.BoxGeometry(w, h, d);
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.castShadow = true;
    mesh.matrixAutoUpdate
    return mesh;
}

function getCone(material, r, h) {
    var geometry = new THREE.ConeGeometry(r, h, 64);
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.castShadow = true;
    mesh.matrixAutoUpdate
    return mesh;
}

function getCylinder(material, rT, rB, h) {
    var geometry = new THREE.CylinderGeometry(rT, rB, h, 32);
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.castShadow = true;
    mesh.matrixAutoUpdate
    return mesh;
}

function getDodecahedron(material, r) {
    var geometry = new THREE.DodecahedronGeometry(r);
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.castShadow = true;
    mesh.matrixAutoUpdate
    return mesh;
}

function getWheel(material, r, t) {
    var geometry = new THREE.TorusGeometry(r, t, 5, 100);
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.castShadow = true;
    mesh.matrixAutoUpdate
    return mesh;
}

function getBoxGrid(amount, seperationMultiplier) {
    var group = new THREE.Group()

    for (var i = 0; i < amount; i++) {
        var obj = getBox(1, 1, 1);
        obj.position.x = i * seperationMultiplier;
        obj.position.y = obj.geometry.parameters.height / 2;
        group.add(obj);
        for (var j = 1; j < amount; j++) {
            var obj = getBox(1, 1, 1);
            obj.position.x = i * seperationMultiplier;
            obj.position.y = obj.geometry.parameters.height / 2;
            obj.position.z = j * seperationMultiplier;
            group.add(obj);
        }
    }

    group.position.x = -(seperationMultiplier * (amount - 1)) / 2;
    group.position.z = -(seperationMultiplier * (amount - 1)) / 2;
    return group;
}

function getPlane(material, size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.receiveShadow = true;
    return mesh;
}

function getSphere(material, size) {
    var geometry = new THREE.SphereGeometry(size, 24, 24);

    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.receiveShadow = true;
    mesh.matrixAutoUpdate
    return mesh;
}

function getTeapot(material, size) {
    var geometry = new THREE.TeapotGeometry(size = size);

    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    //mesh.castShadow = true;
    mesh.matrixAutoUpdate
    return mesh;

}

function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;
    return light;
}

function getSpotLight(intensity) {
    var light = new THREE.SpotLight(0xffffff, intensity);
    light.castShadow = true;
    light.shadow.bias = 0.0001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

function getDirectionalLight(intensity) {
    var light = new THREE.DirectionalLight(0xffffff, intensity);
    light.castShadow = true;
    light.shadow.camera.left = -10;
    light.shadow.camera.bottom = -10;
    light.shadow.camera.right = 10;
    light.shadow.camera.top = 10;
    return light;
}

function getAmbientLight(intensity) {
    var light = new THREE.AmbientLight('rgb(10,30,50)', intensity);
    return light;
}

function update(renderer, scene, camera, controls, clock) {
    renderer.render(
        scene,
        camera,
    );

    if(IsAnimating === true)
    {
        var ToApply;

        if(IsRotating === true)
        {

            switch(Type){
                case 'face':
                    Shape.rotation.y+=0.01;
                    break;
                case 'edge':
                    EdgeHelper.rotation.y+=0.01;
                    break;
                case 'vertex':
                    VertexHelper.rotation.y+=0.01;
                    break;
            }

        }
        else if(IsMorphing === true)
        {  
            var Tx,Ty,Tz;
            switch(Type){
                case 'face':
                    HolderScale= Shape.scale.x
                    break;
                case 'edge':
                    HolderScale= EdgeHelper.scale.x
                    break;
                case 'vertex':
                    HolderScale= VertexHelper.scale.x
                    break;
            }
            if(HolderScale >= 1.5 || HolderScale <= 0.999)
            {
                IsEnlarging=!IsEnlarging;
            }
            if(IsEnlarging === true)
            {
                Tx = 1.001, Ty = 1.001, Tz = 1.001;
            }
            else
            {
                Tx = 0.999, Ty = 0.999, Tz = 0.999; 
            }
            ToApply=new THREE.Matrix4().makeScale(Tx,Ty,Tz);
            switch(Type){
                case 'face':
                    Shape.applyMatrix4(ToApply);
                    break;
                case 'edge':
                    EdgeHelper.applyMatrix4(ToApply);
                    break;
                case 'vertex':
                    VertexHelper.applyMatrix4(ToApply);
                    break;
            }

        }
    }
    controls.update();
    requestAnimationFrame(function () {
        update(renderer, scene, camera,controls,  clock);
    });
}

async function TypeUpdate(TypeName) {
    //Remove all the previous kinds of displaying the object
    PrevTypeName=Type;
    Type = TypeName

    scene.remove(Shape);
    await UpdateShapeHelper(Shape.name); // reseting the shape's default settings to have a new base for vertex and edge function to work on 
    scene.remove(VertexHelper);
    scene.remove(EdgeHelper);

    //Shape works as a base providing the geometry and hence VertexHelper, EdgeHelper use it to make a new mesh 
    switch (TypeName) {
        case 'vertex':
            var PointMaterial = new THREE.PointsMaterial( { color: 0x00FF00 } );
            VertexHelper=new THREE.Points( Shape.geometry, PointMaterial );
            VertexHelper.position.y=3;
            VertexHelper.add(AxisHelper)
            scene.add(VertexHelper);
            break;
        case 'edge':
            edges = new THREE.EdgesGeometry(Shape.geometry);
            EdgeHelper = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00FF00  }));
            EdgeHelper.position.y=3;
            EdgeHelper.add(AxisHelper);
            scene.add(EdgeHelper);
            break;
        case 'face':
            scene.add(Shape);
            break;
    }

    ReAttachAffine(); // after such process , the newly updates object setting is reset , thus needs to reset the affine transformation
    CurrentSelectedTypeGUI(); // update check mark

    if(IsShadow === true)
    {
        TurnOnShadow();
    }
    if(InTexture)
    {
        ApplyTexture();
    }
}
async function UpdateShape(ShapeName) {
    PrevShapeName=Shape.name; // updating flag for adding and removing check mark
    //Removing the base completely 
    if (Shape !== undefined) {
        Shape.geometry.dispose()
        scene.remove(Shape)
    }

    //Calling a new shape
    await UpdateShapeHelper(ShapeName)
    
    //Add object modified accordingly to the selected type to the scene
    switch(Type)
    {
        case 'face':
            scene.add(Shape);
            break;
        case 'vertex':
            TypeUpdate('vertex');
            break;
        case 'edge':
            TypeUpdate('edge');
            break;
    }

    //same logic In TypeUpdate
    ReAttachAffine();
    CurrentSelectedShapeGUI();
    if(IsShadow === true)
    {
        TurnOnShadow();
    }
    if(InTexture)
    {
        ApplyTexture();
    }
}
async function UpdateShapeHelper(ShapeName) //return a mesh with default setting 
{
    var ShapeMaterial = getMaterial('phong', 'rgb(120,120,120)')

    switch (ShapeName) {
        case 'box':
            Shape = getBox(ShapeMaterial, 3, 3, 3);
            Shape.position.y = 1.6;
            break;
        case 'cone':
            Shape = getCone(ShapeMaterial, 2, 5);
            Shape.position.y = 2.5;
            break;
        case 'cylinder':
            Shape = getCylinder(ShapeMaterial, 1, 1, 3);
            Shape.position.y = 1.5;
            break;
        case 'sphere':
            Shape = getSphere(ShapeMaterial, 2);
            Shape.position.y = 2;
            break;
        case 'teapot':
            Shape = getTeapot(ShapeMaterial, 2);
            Shape.position.y = 2;
            break;
        case 'wheel':
            Shape = getWheel(ShapeMaterial, 2);
            Shape.position.y = 2.5;
            break;
        case 'dodecahedron':
            Shape = getDodecahedron(ShapeMaterial, 2);
            Shape.position.y = 2;
            break;
        case 'custom':
            if (document.getElementById('selectedModel').files.length != 0)
                {
                    await LoadCustomModel()
                    Shape.position.y=4;
                }
            break;
    }

    // remove custom model file
    if (ShapeName!='custom')
    {
        document.getElementById('selectedModel').value=null;
    }
    Shape.name=ShapeName;
    Shape.add(AxisHelper);
    
}
function Translate() //Add and remove translate gui option 
{
    PrevAffine = AffineTransformation;
    AffineTransformation='translate';
    if(InTranslation === false)
    {
        InRotation = false;
        InTranslation=true;
        InScale=false;
        TranslateHelper();
    }
    else
    {
        RemoveAffineGUI();
        InTranslation=false;
    }
    CurrentSelectedAffineTransformation(); //update check mark
}
function TranslateHelper()
{
    RemoveAffineGUI(); //remove all the previous selected affine transformation if needed 
    AffineFolder = gui.addFolder('Translate');
    AffineFolder.open();
    switch(Type){
        case 'face':
            AffineFolder.add(Shape.position,'x',-40,40);
            AffineFolder.add(Shape.position,'y',-40,40);
            AffineFolder.add(Shape.position,'z',-40,40);
            break;
        case 'vertex':
            AffineFolder.add(VertexHelper.position,'x',-40,40);
            AffineFolder.add(VertexHelper.position,'y',-40,40);
            AffineFolder.add(VertexHelper.position,'z',-40,40);
            break;
        case 'edge':
            AffineFolder.add(EdgeHelper.position,'x',-40,40);
            AffineFolder.add(EdgeHelper.position,'y',-40,40);
            AffineFolder.add(EdgeHelper.position,'z',-40,40);
            break;
    }
}
function Rotate() //Add and remove rotate gui option 
{
    PrevAffine = AffineTransformation;
    AffineTransformation='rotate';
    if(InRotation===false)
    {
        InRotation = true;
        InTranslation=false;
        InScale=false;
        RotateHelper();
    }
    else
    {
        RemoveAffineGUI();
        InRotation = false;
    }
    CurrentSelectedAffineTransformation(); //update check mark
}
function RotateHelper()
{
    RemoveAffineGUI(); //remove all the previous selected affine transformation if needed 
    AffineFolder = gui.addFolder('Rotate');
    AffineFolder.open();
    switch(Type){
        case 'face':
            AffineFolder.add(Shape.rotation,'x',-40,40);
            AffineFolder.add(Shape.rotation,'y',-40,40);
            AffineFolder.add(Shape.rotation,'z',-40,40);
            break;
        case 'vertex':
            AffineFolder.add(VertexHelper.rotation,'x',-40,40);
            AffineFolder.add(VertexHelper.rotation,'y',-40,40);
            AffineFolder.add(VertexHelper.rotation,'z',-40,40);
            break;
        case 'edge':
            AffineFolder.add(EdgeHelper.rotation,'x',-40,40);
            AffineFolder.add(EdgeHelper.rotation,'y',-40,40);
            AffineFolder.add(EdgeHelper.rotation,'z',-40,40);
            break;
    }

}
function Scale() //Add and remove scale gui option
{
    PrevAffine = AffineTransformation; 
    AffineTransformation='scale';
    if(InScale === false)
    {
        InRotation = false;
        InTranslation= false;
        InScale= true;
        ScaleHelper();
    }
    else{
        RemoveAffineGUI();
        InScale=false;
    }
    CurrentSelectedAffineTransformation(); //update checkmark
}
function ScaleHelper()
{
    RemoveAffineGUI(); //remove all the previous selected affine transformation if needed 
    AffineFolder = gui.addFolder('Scale');
    AffineFolder.open();
    switch(Type){
        case 'face':
            AffineFolder.add(Shape.scale,'x',-40,40);
            AffineFolder.add(Shape.scale,'y',-40,40);
            AffineFolder.add(Shape.scale,'z',-40,40);
            break;
        case 'vertex':
            AffineFolder.add(VertexHelper.scale,'x',-40,40);
            AffineFolder.add(VertexHelper.scale,'y',-40,40);
            AffineFolder.add(VertexHelper.scale,'z',-40,40);
            break;
        case 'edge':
            AffineFolder.add(EdgeHelper.scale,'x',-40,40);
            AffineFolder.add(EdgeHelper.scale,'y',-40,40);
            AffineFolder.add(EdgeHelper.scale,'z',-40,40);
            break;
    }
}
function ReAttachAffine() // used in UpdateShape and TypeUpdate since the base got reset
{
    if(InTranslation === true)
        TranslateHelper();
    if(InRotation === true)
        RotateHelper();
    if(InScale === true)
        ScaleHelper();
        
}
function RemoveAffineGUI() //remove all the previous selected affine transformation if needed 
{
    try{
        gui.removeFolder(AffineFolder);
        }
    catch(err)
    {
    }
}
function Shadow() // Turn shadow on and off 
{
    if(IsShadow === false)
    {
        IsShadow=true;
        TurnOnShadow();
    }
    else
    {
        IsShadow=false;
        var plane = scene.getObjectByName('plane-1');
        plane.receiveShadow = false;
        switch(Type){
            case 'face':
                Shape.castShadow=false;
                break;
            case 'vertex':
                VertexHelper.castShadow=false;
                break;
            case 'edge':
                EdgeHelper,castShadow=false;
                break;
        }
    }

    TriggerCheckMark('shadow'); // update check mark
}
function TurnOnShadow()
{
    var plane = scene.getObjectByName('plane-1');
    plane.receiveShadow = true; 
    switch(Type){
        case 'face':
            Shape.castShadow=true;
            break;
        case 'vertex':
            VertexHelper.castShadow=true;
            break;
        case 'edge':
            EdgeHelper.castShadow=true;
            break;
    }
}
function UpdateLighting(LightingName) //update lighting type 
{
    PrevLighting=Lighting.name;
    //remove all the previous populated lighting 
    scene.remove(Lighting);
    scene.remove(LightingHelper);
    LightingHelper.remove(LightSource);
    switch(LightingName)
    {
        case 'spot':
            Lighting=getSpotLight(1);
            break;
        case 'directional':
            Lighting=getDirectionalLight(1);
            break;
        case 'point':
            Lighting=getPointLight(1);
            break;
    }
    Lighting.name=LightingName;
    SetUpLighting() // reposition the light source , add lighting helper which shows the frustum of the light source, add a sphere illustrating the light source
    CurrentSelectedLighting();

    //reattaching the lighting setting since the lighting option is updated 
    if(InLightingSetting == true)
    {
        LightingSettingHelper();
    }
    
    scene.add(Lighting)
}
function SetUpLighting() //reposition the light source , add lighting helper which shows the frustum of the light source, add a sphere illustrating the light source
{
    Lighting.position.x = 13;
    Lighting.position.y = 10;
    Lighting.position.z = 10;
    Lighting.intensity = 1.5;
    LightingHelper = new THREE.CameraHelper(Lighting.shadow.camera);
    scene.add(LightingHelper);

    var SphereMaterial = getMaterial('basic', 'rgb(255,255,0)')
    LightSource = getSphere(SphereMaterial, 0.5);
    Lighting.add(LightSource);
}
function Ambient() // turn ambient on and off 
{
    if(InAmbient === false)
    {
        InAmbient = true;
        AmbientLight=getAmbientLight(1);
        scene.add(AmbientLight);
    }
    else
    {
        InAmbient = false;
        try{
        scene.remove(AmbientLight);
        }
        catch(err)
        {}
    }
    TriggerCheckMark('ambient'); // update check mark 
}
function LightingSetting() //turn LightingSetting on and off
{
    if(InLightingSetting === false)
    {
        InLightingSetting=true;

        LightingSettingHelper();

    }
    else
    {
        RemoveLightingSettingGUI();
        InLightingSetting= false;
    }
    TriggerCheckMark('lightingsetting'); // update check mark
}
function LightingSettingHelper() // add lighting setting gui 
{
    RemoveLightingSettingGUI(); // remove the previous added lighting GUI if needed 
    LightingFolder = gui.addFolder('Lighting Setting');
    LightingFolder.open();
    LightingFolder.add(Lighting,'intensity',0,10);
    LightingFolder.add(Lighting.position, 'x', 0,20);
    LightingFolder.add(Lighting.position, 'y', 0,20);
    LightingFolder.add(Lighting.position, 'z', 0,20);
}
function RemoveLightingSettingGUI() // remove lighting setting gui
{
    try{
        gui.removeFolder(LightingFolder);
    }
    catch(err)
    {}
}
function UploadImage() // Work around for the input in html
{
    document.getElementById("Image").click();
    InTexture=true;
}
function ApplyTexture() // apply texture the object after the image is loaded from the user
{
    var FileInput = document.querySelector("#Image").files[0];
    var reader = new FileReader();
    reader.readAsDataURL(FileInput);
    reader.onload = function () {
        var loader = new THREE.TextureLoader();
        var texture = loader.load(reader.result);
        var material = new THREE.MeshPhongMaterial( { map: texture } );
        switch(Type){
            case 'face':
                Shape.material = material;
                break;
            case 'vertex':
                //VertexHelper.material = material;
                break;
            case 'edge':
                //EdgeHelper.material=material;
                break;
        }
    }
}
function RemoveTexture() // remove current applied texture
{
    InTexture=false;
    document.getElementById('Image').value=null;
    var material = getMaterial('phong', 'rgb(120,120,120)')
    switch(Type){
        case 'face':
            Shape.material = material;
            break;
        case 'vertex':
            //VertexHelper.material = material;
            break;
        case 'edge':
            //EdgeHelper.material=material;
            break;
    }
}
function Animating(name)
{
    PrevAnimation=CurrentAnimation;
    CurrentAnimation=name;
    if(PrevAnimation !== CurrentAnimation)
    {
        IsAnimating=true;
        AnimatingHelper(name);

        if(PrevAnimation !== null)
        {
            RemoveCheckMark(PrevAnimation);
        }
        AddCheckMark(CurrentAnimation);
    }
    else
    {
        IsAnimating=!IsAnimating;
        if(IsAnimating)
        {
            AnimatingHelper(name);

            AddCheckMark(CurrentAnimation);
        }
        else
        {
            IsAnimating=false;
            IsMorphing=false;
            IsRotating=false;

            RemoveCheckMark(CurrentAnimation);
        }
    }
    
}
function AnimatingHelper(name)
{
    switch(name)
    {
        case 'rotating':
            IsMorphing=false;
            IsRotating=true;
            break;
        case 'morphing':
            IsMorphing=true;
            IsRotating=false;
            break;
    }
}

// Add and remove check mark
function CurrentSelectedShapeGUI() // One check mark at all time
{
    if(String(Shape.name) !== PrevShapeName)
    {

        RemoveCheckMark(PrevShapeName);
        AddCheckMark(Shape.name);
    }
}
function CurrentSelectedTypeGUI() // One check mark at all time
{
    if(Type !== PrevTypeName)
    {
        RemoveCheckMark(PrevTypeName);
        AddCheckMark(Type);
    }
}

function CurrentSelectedAffineTransformation() // none or one check mark at all time 
{
    if(AffineTransformation !== PrevAffine)
    {
        if(PrevAffine !== null)
        {
            RemoveCheckMark(PrevAffine);
        }
        AddCheckMark(AffineTransformation);
        IsCheckAffine=true;
    }
    else if(AffineTransformation === PrevAffine )
    {
        if(IsCheckAffine === true){
            RemoveCheckMark(AffineTransformation);
            IsCheckAffine=false;
        }
        else{
            AddCheckMark(AffineTransformation);
            IsCheckAffine=true;
        }

    }
}
function CurrentSelectedLighting() // One check mark at all time 
{
    if(Lighting.name !== PrevLighting )
    {
        RemoveCheckMark(PrevLighting);
        AddCheckMark(Lighting.name);
    }
}
function TriggerCheckMark(type)// turn the check mark on and off, the function works independently
{
    switch(type)
    {
        case 'shadow':
            if(IsShadow === true && CheckIfSelected('shadow') === false)
            {
                AddCheckMark('shadow');
            }
            else if(IsShadow === false && CheckIfSelected('shadow') === true)
            {
                RemoveCheckMark('shadow');
            }
            break;
        case 'lightingsetting':
            if(InLightingSetting === true && CheckIfSelected('lightingsetting') === false)
            {
                AddCheckMark('lightingsetting');
            }
            else if(InLightingSetting === false && CheckIfSelected('lightingsetting') === true)
            {
                RemoveCheckMark('lightingsetting');
            }
            break;
        case 'ambient':
            if(InAmbient === true && CheckIfSelected('ambient') === false)
            {
                AddCheckMark('ambient');
            }
            else if(InAmbient === false && CheckIfSelected('ambient') === true)
            {
                RemoveCheckMark('ambient');
            }
            break;
    }
}
function CheckIfSelected(Name) // check if the checkmark is in the string
{
    var stringValue =  document.getElementById(Name).innerHTML;
    if(stringValue.indexOf('✓') > -1)
    {
        return true;
    }
    return false;
}
function AddCheckMark(Name)
{
    document.getElementById(Name).innerHTML +=  " ✓";
}
function RemoveCheckMark(Name)
{
    var stringValue = document.getElementById(Name).innerHTML;
    document.getElementById(Name).innerHTML = stringValue.replace(new RegExp("✓", "g"), "");
}
function UploadCustomModel(){
    // console.log('add model');
    document.getElementById("selectedModel").click()
   
}
function LoadCustomModel(){
    return new Promise((resolve,reject)=>{
        const url = URL.createObjectURL(document.getElementById("selectedModel").files[0]);
        GLTFLoader.load(url, function ( gltf ) {  
                gltf.scene.traverse( function (node) {
                   if (node instanceof THREE.Mesh)
                        Shape = node
                })
                var ShapeMaterial = getMaterial('phong', 'rgb(120,120,120)')
                Shape.material = ShapeMaterial;
                resolve();
                URL.revokeObjectURL(url);
                }, function (){  }, function (){ 
                    URL.revokeObjectURL(url);
                }
                )
    });
}


    
   

let scene;
let Type;
let Lighting; // Lighting entity, can either be directional light , spot light or point light
let LightingHelper,LightSource; // LightingHelper : displaying the frustum of the camera , LightSource : a sphere sitting on top of the origin of the frustum
let AmbientLight; 
let gui;
let OrbitControls; // camera helper
let Shape, VertexHelper, EdgeHelper; //Only one entity is displayed at a time
let AxisHelper; //axis helper
let camera,renderer;

let InTranslation,InRotation,InScale;     // Check if the player has chosen a Affine transformation (there can be either 0 or 1 check mark at a time; dependent on each other)

let IsShadow,InAmbient,InLightingSetting; //Check if the player has chosen one (flipping switch like behaviour, independent )

let Texture,InTexture; 

let PrevShapeName,PrevTypeName,AffineTransformation,PrevAffine,PrevLighting; //remove the previous selected option check mark if needed and add a check mark to the newly selected one

let IsCheckAffine; // check if one Affine transformation is still selected 
let AffineFolder,LightingFolder; // folder to group dat gui elements

let IsRotating,IsMorphing,IsAnimating; 
let IsEnlarging; //sub flag for Morphing function , it indicates whether to enlarge the object or shrink it
let PrevAnimation,CurrentAnimation; //remove the previous selected option check mark if needed and add a check mark to the newly selected one

let GLTFLoader,gltfScene; //Loader for gltff
let model; //test
init();