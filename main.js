import './style.css'
import { gsap } from "gsap";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { NoToneMapping, PointLight, Sphere } from 'three';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';

gsap.registerPlugin(ScrollTrigger);

let loadedPage = document.querySelector('.loaded-page');
const about = document.querySelector('.about');
const home = document.querySelector('.home');
const projects = document.querySelector('.projects');
let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX =  window.innerWidth/2;
const windowHalfY = (window.innerHeight*2.5)/2;

const load = document.querySelector('.load');
const tl = gsap.timeline();


const canvas = document.querySelector('#canvas-scene');
let scene, renderer, camera, avatar, loader;

function init() {

   // Load 3D Scene
scene = new THREE.Scene(); 

// Load a Renderer
renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#canvas-scene')});

// Load Camera Perspektive
camera = new THREE.PerspectiveCamera( 40, (window.innerWidth) / (window.innerHeight*2.5), 1, 20000 );

// load the 3d model

loader = new GLTFLoader();	

camera.position.set( 15, -4, 6 );
camera.rotation.set(0.09, 0.7, -0.06)
 // Load a Renderer
renderer.setClearColor( 0x161716 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight*2.5);
 // Load the Orbitcontroller
// var controls = new OrbitControls( camera, renderer.domElement ); 
			
 // Load Light
var ambientLight = new THREE.AmbientLight( 0xcccccc ,1.5);
scene.add( ambientLight );
			
var directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 0, 0, 1 ).normalize();
scene.add( directionalLight );		


const light = new THREE.PointLight(0xcccccc, 1.7);
light.position.set(0,100,-10);
scene.add(light)
loader.load( 'objects/avatarlaptop8.glb', function ( gltf ) {	
	gltf.scene.scale.set( 2, 2, 2  );			   
	gltf.scene.position.x = 4; 
  gltf.scene.position.y = -3;				    
	gltf.scene.position.z = 0;				    
  scene.add( gltf.scene );
  avatar = scene.children[3];
	}, function ( xhr ) {
    
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	}, function (error) {
    console.error(error);
  });	 

  THREE.DefaultLoadingManager.onLoad = function ( ) {

    console.log( 'Loading Complete!');
    ScrollTrigger.refresh()
  };
}

const tlScroll = new gsap.timeline({repeat:-1});

tlScroll.to("#Capa_1", {
  duration:0.5,
  y:'-=30',  
  ease:"power1.inOut"
}).to("#Capa_1", {
  duration:0.4,
  opacity:0.2
}).to("#Capa_1", {
  duration:0.5,
  y:'+=30',  
  ease:"power1.inOut",
}).to("#Capa_1", {
  duration:0.4,
  opacity:0.7
});

// const tlAbout = new gsap.timeline({});
// function animateInfo () { 
//   tlAbout.to('.about-me', {
//     scrollTrigger: {
//       trigger: ".info",
//       start: "top center",
//       end:"+=200",
//       markers:true
//     },
//     opacity:1,
//     ease: "expo.inOut"
//   });
  
  tl.to(".load", {
    paddingRight: "200px",
    duration: 3,
    ease: "expo.inOut"
  }).to('.loaded-page', {
    opacity:1,
    ease: "expo.In"
  });



  tl.from(".aa-symbol", { x: 1500, duration: 0.8, ease: "expo.Out", stagger: 0.01 });
  tl.from(".title", { x: 1500, duration: 2.5, ease: "elastic(0.5, 0.3)", }, "-=0.7");

  
function animate() {
	render();
	requestAnimationFrame( animate );

	}

function render() {
	renderer.render( scene, camera );
  if(avatar!==undefined) {
    targetX = mouseX * .001
    targetY = mouseY * .0001  
    avatar.rotation.x += .5 * (targetY - avatar.rotation.x)  
    avatar.rotation.y += .5 * (targetX - avatar.rotation.y)  
    setScroll();
    if (window.innerWidth<680) {
      avatar.position.x = 2;
      avatar.scale.set(1.5,1.5,1.5);
    }
    myFunction(x);
    
  }
	}
init();
render();
animate();
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - windowHalfX)
  mouseY = (e.clientY - windowHalfY)

})
addEventListener('resize', (e) => {
  camera.aspect = window.innerWidth /(window.innerHeight*2.5);
  camera.updateProjectionMatrix();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight*2.5);
  render();
});

about.addEventListener('click', () => {
  document.querySelector('.scroll-trigger').scrollIntoView({ 
    behavior: 'smooth' 
  });
} );

home.addEventListener('click', () => {
  document.querySelector('body').scrollIntoView({ 
    behavior: 'smooth' 
  });
} );

projects.addEventListener('click', () => {
  document.querySelector('.projects-title').scrollIntoView({ 
    behavior: 'smooth' 
  });
} );

function setScroll() {
  let timeline = new gsap.timeline({
  })

  timeline.to(camera.position, {
    scrollTrigger: {
      trigger: ".home-section",
      start: "400px center",
      end: "+=400",
      scrub:2
    },
    x: 15,
    y:0,
    z:17,
    ease: "expo.InOut"
  }).to(".filter", {
    scrollTrigger: {
      trigger: ".home-section",
      start: "400px center",
      end: "+=400",
      scrub:2,
    },
    opacity:0.1
  }).to(avatar.position, {
    scrollTrigger: {
      trigger: ".home-section",
      start: "400px center",
      end: "+=400",
      scrub:2
    },
    y:-1,
    ease: "expo.InOut"
  }).to("#Capa_1", {
    scrollTrigger: {
      trigger: ".home-section",
      start: "400px center",
      end: "+=400",
      scrub:2
    },
    opacity: 0 
  });

  let tlInfo = new gsap.timeline({
  })
  tlInfo.to('.about-me', {
    scrollTrigger: {
      trigger: ".info",
      start: "top 85%",
      end: "+=10"
    },
    x:-30,
    ease: "expo.inOut"
  });
}


var x = window.matchMedia("(max-width: 700px)")

function myFunction(x) {
  if (x.matches) { // If media query matches
    avatar.position.x = 2;
    avatar.scale.set(1.5,1.5,1.5);
  } 
}