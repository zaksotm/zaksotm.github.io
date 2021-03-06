let camera, scene, renderer, mesh;

init();
animate();

var model;

function init() {
	var linebreak = document.createElement("br");

	var buttonLoadFile = document.getElementById("apply");
	buttonLoadFile.onclick = applyTexture;

	var buttonFullSize = document.getElementById("fullSize");
	buttonFullSize.onclick = fullSize;

	var buttonSmallSize = document.getElementById("smallSize");
	buttonSmallSize.onclick = smallSize;

	//create scene for 3D model
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	//camera = new THREE.PerspectiveCamera(1, window.innerWidth/window.innerHeight, 0.1, 1000);
	camera = new THREE.PerspectiveCamera(1, 1, 1, 1000);

	/*
	ambientLight = new THREE.AmbientLight(0x404040, 4.0);
	scene.add(ambientLight);
	*/

	var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
	hemiLight.position.set( 0, 1000, 0 );
	scene.add( hemiLight );


	//Create 3D model
	//load gltf file
	var gLoader = new THREE.GLTFLoader();

	console.log("anti");

	gLoader.load('mockup_v2.11.gltf', function ( gltf ) {
		scene.add( gltf.scene );
		model = gltf.scene;
		}
	);

	camera.position.set(0, 600, 0);
	camera.lookAt(new THREE.Vector3(0,0,0));

	renderer = new THREE.WebGLRenderer({ antialias: true});
	renderer.setSize( window.innerHeight, window.innerHeight);
	//renderer.setSize( 3000, 3000);
	//renderer.setSize( 1000, 1000);
	//renderer.antialias = true;
	renderer.outputEncoding = THREE.sRGBEncoding;

	document.body.appendChild(renderer.domElement);
	//document.getElementById("canvasHolder").appendChild(renderer.domElement);

	function fullSize(){
		renderer.setSize( 3000, 3000);
	}

	function smallSize(){
		renderer.setSize( window.innerHeight, window.innerHeight);
	}

	function applyTexture(){
		console.log("function applyTexture called");
		var filesSelected = document.getElementById("inputFileToLoad").files;
		if (filesSelected.length > 0){
			var fileToLoad = filesSelected[0];

			if (fileToLoad.type.match("image.*")){
				var fileReader = new FileReader();
				fileReader.onload = function(fileLoadedEvent) {
					//Create texture from uploaded image
					var tLoader = new THREE.TextureLoader();
					bitmapTexture = tLoader.load(fileLoadedEvent.target.result);

					//Set bitmap properties
					bitmapTexture.flipY = false;
					bitmapTexture.generateMipmaps = false;
					bitmapTexture.wrapS = bitmapTexture.wrapT = THREE.ClampToEdgeWrapping;
					bitmapTexture.minFilter = THREE.LinearFilter;
					bitmapTexture.encoding = THREE.sRGBEncoding;


					//Create material from bitmap
					var materialBitmap = new THREE.MeshStandardMaterial({
						map: bitmapTexture,
						opacity: 0.95,
						transparent: true,
					});

					//Get and create material of Heel color
					var heelColor = document.getElementById("heelColor");
					var heelColorHex = heelColor.options[heelColor.selectedIndex].value;
					var materialHeel = new THREE.MeshStandardMaterial({
						color: parseInt(heelColorHex, 16),
						opacity: 0.95,
						transparent: true,
					});

					//Get and create material of Toe color
					var toeColor = document.getElementById("toeColor");
					var toeColorHex = toeColor.options[toeColor.selectedIndex].value;
					var materialToe = new THREE.MeshStandardMaterial({
						color: parseInt(toeColorHex, 16),
						opacity: 0.95,
						transparent: true,
					});

					//Get and create material of Cuff color
					var cuffColor = document.getElementById("cuffColor");
					var cuffColorHex = cuffColor.options[cuffColor.selectedIndex].value;
					var materialCuff = new THREE.MeshStandardMaterial({
						color: parseInt(cuffColorHex, 16),
						opacity: 0.95,
						transparent: true,
					});

					//Assign new Materials
					model.children[2].children[0].material = materialBitmap;
					model.children[2].children[1].material = materialToe;
					model.children[2].children[2].material = materialHeel;
					model.children[2].children[3].material = materialCuff;
				};
				fileReader.readAsDataURL(fileToLoad);
			}
		}
	}
}


function animate() {
	//if (model) model.rotation.z += 0.001;
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
