//===== VANILA JS =====//
const links = document.querySelectorAll(".cursorLink");
const sections = document.querySelectorAll(".sectionLink");

links.forEach((link) => {
  if (link.getAttribute("data-split") !== "false") {
    const string = link.textContent.trim();
    const arr = string.split("");
    let newString = "";
    arr.forEach((item) => {
      newString += `<div>${item}</div>`;
    });
    link.innerHTML = newString;
  }

  let letters = link.querySelectorAll("div");
  link.addEventListener("mouseenter", () => {
    randomLetter();
  });

  link.addEventListener("click", (e) => {
    if (!link.href) return;
    if (!link.href.includes("#")) return;

    e.preventDefault();
    scrollToSection();
  });
  function randomLetter() {
    letters.forEach((letter) => {
      letter.style.order = 0;
    });
    letters.forEach((letter, i) => {
      setTimeout(() => {
        letter.style.order = 10 + i;
      }, 50 * i);
    });
  }

  function scrollToSection() {
    let id = link.href.split("#");
    sections.forEach((el) => {
      if (el.id === id[1]) window.scrollTo(0, el.offsetTop);
    });
    headerBtn.classList.remove("open");
  }
});

// Show time at footer
const clock = document.querySelector(".clockJS");
function updateClock() {
  let date = new Date();
  let time = date.toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZoneName: "short",
  });
  clock.innerHTML = time;
}
updateClock();
const updateEachMin = setInterval(updateClock, 60000);

const headerBtn = document.querySelector(".headerBtn");
headerBtn.addEventListener("click", () => {
  headerBtn.classList.toggle("open");
});
document.addEventListener("click", (e) => {
  let check1 = e.target.closest(".header-btn");
  let check2 = e.target.closest(".header-menu");
  if (check1 == null && check2 == null) {
    headerBtn.classList.remove("open");
  }
});

//===== THREE JS =====//
import gsap from "gsap";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { CGEffect } from "./js/lib/threejs/cgeffect.js";

import { works } from "./js/module/works.js";
import workFrag from "./shaders/work/fragment.glsl?raw";
import workVert from "./shaders/work/vertex.glsl?raw";

import ribbonVert from "./shaders/ribbon/vertex.glsl?raw";
import ribbonFrag from "./shaders/ribbon/fragment.glsl?raw";

/**
 * Base
 */
let END = 0;

// Canvas
const canvas = document.querySelector("canvas.webGL");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  scale: 1,
  baseW: window.innerWidth,
  aspect: window.innerWidth / window.innerHeight,
  aspectW: Math.round(window.innerWidth / 32),
  aspectH: Math.round(window.innerHeight / 32),
  pc: window.innerWidth >= 1024,
};

// Scene
const scenePix = new THREE.Scene();
const sceneMain = new THREE.Scene();

// Lights
const direct1 = new THREE.DirectionalLight(0xffffff, 1);
const direct2 = new THREE.DirectionalLight(0xffffff, 0.5);
direct1.position.set(0.25, 0.4, 0.5);
direct2.position.set(-0.25, -0.4, 0.5);
sceneMain.add(direct1);
sceneMain.add(direct2);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const baseTexture = new THREE.WebGLRenderTarget(sizes.width, sizes.height, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
});

/**
 * Generate hero portrait
 */
const portrait = {
  geo: {},
  tex: {},
  normal: {},
  depth: {},
  mat: {},
  mesh: {},
  img: {},
  X: 0,
  Y: 0,
  Z: sizes.height,
  scale: 1,
  W: 0,
  H: 0,
};
sizes.pc
  ? (portrait.geo = new THREE.PlaneGeometry(
      sizes.height,
      sizes.height,
      sizes.height,
      sizes.height
    ))
  : (portrait.geo = new THREE.PlaneGeometry(
      sizes.width * 1.25,
      sizes.width * 1.25,
      1,
      1
    ));
portrait.tex = textureLoader.load("/image/hero-portrait3.png", (img) => {
  END += 4;
});
portrait.depth = textureLoader.load("/image/depth.jpg", (img) => {
  END += 4;
});
portrait.normal = textureLoader.load("/image/normal-blur.jpg", (img) => {
  END += 4;
});

portrait.mat = new THREE.MeshStandardMaterial({
  map: portrait.tex,
  displacementMap: portrait.depth,
  displacementScale: 100,
  normalMap: portrait.normal,
  transparent: true,
  fog: false,
  // wireframe: true,
});

portrait.mesh = new THREE.Mesh(portrait.geo, portrait.mat);
sceneMain.add(portrait.mesh);

// For positions
portrait.img = document.querySelector(".portraitImg");
function portraitUpdate() {
  portrait.X = portrait.img.getBoundingClientRect().left;
  portrait.Y = portrait.img.getBoundingClientRect().top;
  portrait.scale =
    portrait.img.getBoundingClientRect().width / portrait.img.offsetWidth;

  portrait.mesh.position.z = sizes.height - portrait.Z;

  introProgress > 0
    ? (portrait.mesh.position.y = (portrait.Y * portrait.Z) / sizes.height)
    : (portrait.mesh.position.y = (-portrait.Y * portrait.Z) / sizes.height);

  portrait.mesh.scale.y = portrait.scale;
  portrait.mesh.scale.x = portrait.scale;
  if (sizes.pc) {
    portrait.mesh.position.x = portrait.X - (sizes.width - sizes.height) / 2;
  } else {
    portrait.mesh.position.y =
      -portrait.Y - (sizes.width * 1.25 - sizes.height) / 2 + 2;
    portrait.mesh.position.x = portrait.X;
  }

  // rotate
  // portrait.mesh.rotation.y = (cursor.X / sizes.width - 0.5) * 0.4
  gsap.to(portrait.mesh.rotation, {
    y: (cursor.X / sizes.width - 0.6) * 0.4,
    duration: 2,
  });
}

/**
 * Generate about content
 */
const aboutJS = document.querySelector(".aboutJS");
const aboutItems = aboutJS.querySelectorAll(".aboutItem");

function aboutUpdate() {
  aboutItems.forEach((item, i) => {
    if (item.getBoundingClientRect().top + item.offsetHeight <= sizes.height) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

/**
 * Generate work slider
 */
const sliderWrap = document.querySelector(".workJS");
const slider = {
  geo: {},
  group: {},
  control: {},
  W: sizes.width * 0.2,
  H: (sizes.width * 0.2 * 9) / 16,
  pos: 0,
  X: 0,
  Y: 0,
  imgs: [],
  vids: [],
  urls: [],
  meshes: [],
  scale: 1,
  dragged: false,
  cursor: 0,
  rotate: 0,
  drag: 0,
  leaved: true,
  active: -1,
};
slider.geo = new THREE.PlaneGeometry(
  slider.W,
  slider.H,
  slider.W / 10,
  slider.H / 10
);

slider.group = new THREE.Group();
slider.control = new THREE.Group();
works.forEach((obj, i) => {
  let tex = {};

  if (obj.video !== "" && obj.image === "") {
    slider.vids[i] = document.createElement("video");
    slider.vids[i].muted = true;
    slider.vids[i].loop = true;
    slider.vids[i].autoplay = true;
    slider.vids[i].playsinline = true;
    slider.vids[i].src = obj.video;
    slider.vids[i].pause;
    tex = new THREE.VideoTexture(slider.vids[i]);
    END += 5;
  } else {
    slider.urls[i] = obj.url;
    tex = textureLoader.load(obj.image, () => {
      END += 5;
    });
  }

  let mesh = {};

  let mat = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: tex },
      uDrag: { value: 0.0 },
      uRadius: { value: 0.0 },
      uCenter: { value: 0.0 },
    },
    vertexShader: workVert,
    fragmentShader: workFrag,
    transparent: true,
    side: THREE.DoubleSide,
  });

  mesh = new THREE.Mesh(slider.geo, mat);

  if (i < 6) {
    mesh.rotation.y += ((Math.PI * 2) / 6) * i;
  } else if (i < 10) {
    mesh.rotation.y += ((Math.PI * 2) / 4) * i + Math.PI / 4;
    mesh.rotateX(-Math.PI / 5);
  } else {
    mesh.rotation.y += ((Math.PI * 2) / 4) * i + Math.PI / 4;
    mesh.rotateX(Math.PI / 5);
  }

  mesh.translateZ(sizes.height * 0.4);

  slider.meshes.push(mesh);
  slider.group.add(mesh);
});
slider.control.add(slider.group);
sceneMain.add(slider.control);

const workGuide = document.querySelector(".workGuide");

sliderWrap.addEventListener("mouseenter", () => {
  sliderWrap.style.cursor = `grab`;
  slider.leaved = false;
});
sliderWrap.addEventListener("click", (e) => {
  e.preventDefault();
});

sliderWrap.addEventListener("mousedown", (e) => {
  e.preventDefault();
  workGuide.classList.add("hide");

  slider.dragged = false;

  slider.dragging = true;
  slider.start = cursor.X;

  sliderWrap.style.cursor = `grabbing`;
});
sliderWrap.addEventListener("touchstart", (e) => {
  workGuide.classList.add("hide");

  slider.dragged = false;

  slider.dragging = true;

  cursor.X = e.touches[0].clientX;
  cursor.Y = e.touches[0].clientY;

  slider.start = e.touches[0].clientX;
});

sliderWrap.addEventListener("mouseup", () => {
  if (!slider.dragged && slider.urls[slider.active])
    window.open(slider.urls[slider.active], "_blank");

  sliderWrap.style.cursor = `grab`;
  slider.dragging = false;
});
sliderWrap.addEventListener("touchend", () => {
  slider.dragging = false;
});

sliderWrap.addEventListener("mouseleave", () => {
  sliderWrap.style.cursor = `grab`;
  slider.dragging = false;
  slider.leaved = true;
});
sliderWrap.addEventListener("touchleave", () => {
  slider.dragging = false;
  slider.leaved = true;
});

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
const objectsToTest = slider.meshes;
let isHover = false;
function raycasting() {
  raycaster.setFromCamera(mouse, cameraMain);
  const intersects = raycaster.intersectObjects(objectsToTest);

  intersects.length ? (isHover = true) : (isHover = false);

  if (isHover) {
    slider.meshes.forEach((obj, i) => {
      if (obj.uuid === intersects[0].object.uuid) {
        slider.active = i;
      }
    });
  } else {
    slider.active = -1;
  }
}

// For positions
function workUpdate() {
  sizes.pc ? (slider.scale = 1) : (slider.scale = 3);

  // Position
  slider.pos = -sliderWrap.getBoundingClientRect().top;

  slider.group.scale.set(sizes.scale, sizes.scale, sizes.scale);
  slider.group.position.y = slider.pos;

  if (slider.meshes.length > 0) {
    slider.meshes.forEach((mesh) => {
      mesh.material.uniforms.uCenter.value = slider.pos;
      mesh.material.uniforms.uRadius.value = sizes.height * 0.4;
      mesh.scale.set(slider.scale, slider.scale, slider.scale);
      if (sizes.pc)
        mesh.material.uniforms.uDrag.value = -Math.abs(slider.drag * 0.0002);
    });
  }

  slider.group.rotation.y = slider.pos * 0.002;
  slider.leaved
    ? (slider.cursor += (sizes.height / 2 - slider.cursor) * 0.05)
    : (slider.cursor += (cursor.Y - slider.cursor) * 0.05);

  slider.control.rotation.x = (0.5 - slider.cursor / sizes.height) * 0.35;

  if (slider.dragging) {
    slider.drag = cursor.X - slider.start;
    slider.start += (cursor.X - slider.start) * 0.05;
  } else {
    slider.drag -= slider.drag * 0.05;
  }

  sizes.pc
    ? (slider.rotate += slider.drag * 0.0001)
    : (slider.rotate += slider.drag * 0.0003);
  slider.control.rotation.y = slider.rotate;

  if (!slider.dragging && !slider.urls[slider.active] && slider.active >= 0) {
    if (slider.vids[slider.active]) {
      slider.vids[slider.active].play();
    }
  }
  slider.vids.forEach((vid, i) => {
    if (i !== slider.active) {
      vid.pause();
      vid.currentTime = 0;
    }
  });
}
/**
 * Generate services ribbon
 */
const ribbonJS = document.querySelector(".ribbonJS");
const ribbonSection = ribbonJS.querySelector(".ribbonSection");
const ribbonTexts = ribbonJS.querySelectorAll(".ribbonItem");
const ribbonItems = ribbonSection.querySelectorAll(".ribbonItem");
const ribbon = {
  urls: [
    "../assets/images/service1.png",
    "../assets/images/service1.png",
    "../assets/images/service1.png",
    "../assets/images/service1.png",
  ],
  meshes: [],
  group: {},
  geo: {},
  tex: {},
  mat: {},
  mesh: {},
  Y: 0,
  X: 0,
  Z: sizes.height,
  scale: 1,
  W: sizes.width * 2,
  H: ribbonItems[0].offsetHeight * 1.7,
  active: -1,
};

// Hover
ribbonItems.forEach((item, i) => {
  item.addEventListener("mouseenter", () => {
    gsap.to(ribbon.meshes[i].material.uniforms.uActive, {
      value: 1.0,
    });
    gsap.to(ribbon.meshes[i].position, {
      z: -ribbon.Z,
    });
  });
  item.addEventListener("click", () => {
    gsap.to(ribbon.meshes[i].material.uniforms.uActive, {
      value: 1.0,
    });
    gsap.to(ribbon.meshes[i].position, {
      z: -ribbon.Z,
    });
  });
  item.addEventListener("touchstart", () => {
    gsap.to(ribbon.meshes[i].material.uniforms.uActive, {
      value: 1.0,
    });
    gsap.to(ribbon.meshes[i].position, {
      z: -ribbon.Z,
    });
  });
  item.addEventListener("touchend", () => {
    gsap.to(ribbon.meshes[i].material.uniforms.uActive, {
      value: 0,
    });
    gsap.to(ribbon.meshes[i].position, {
      z: -ribbon.Z - 200,
    });
  });
  item.addEventListener("mouseleave", () => {
    gsap.to(ribbon.meshes[i].material.uniforms.uActive, {
      value: 0,
    });
    gsap.to(ribbon.meshes[i].position, {
      z: -ribbon.Z - 200,
    });
  });
});
ribbonSection.addEventListener("mouseleave", () => {
  ribbon.active = -1;
});

ribbon.geo = new THREE.PlaneGeometry(
  ribbon.W,
  ribbon.H,
  ribbon.W / 20,
  ribbon.H / 20
);

ribbon.urls.forEach((url, i) => {
  let tex = textureLoader.load(url, (img) => {
    END += 4;
    mat.uniforms.uAspect.value = ribbon.H / img.source.data.height;
    img.wrapS = THREE.RepeatWrapping;
    img.wrapT = THREE.RepeatWrapping;
  });

  let mesh = {};
  let mat = new THREE.ShaderMaterial({
    uniforms: {
      uActive: { value: 0 },
      uAspect: { value: 1.0 },
      uIndex: { value: i },
      uRadius: { value: ribbon.W },
      uTexture: { value: tex },
      uTime: { value: 0.0 },
      uRange: { value: sizes.height },
      uWind: { value: sizes.pc ? 100 : 50 },
    },
    vertexShader: ribbonVert,
    fragmentShader: ribbonFrag,
    transparent: true,
  });
  mesh = new THREE.Mesh(ribbon.geo, mat);
  mesh.position.z = -ribbon.Z;
  mesh.rotation.y = -Math.PI / 100;
  ribbon.meshes.push(mesh);
  sceneMain.add(mesh);
});

// For positions
function ribbonUpdate(t) {
  ribbon.Y = -ribbonJS.getBoundingClientRect().top * 2;

  ribbonTexts.forEach((item, i) => {
    if (item.getBoundingClientRect().top + item.offsetHeight <= sizes.height) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  ribbon.meshes.forEach((mesh) => {
    mesh.position.y = ribbon.Y;
    mesh.material.uniforms.uTime.value = t;
    mesh.material.uniforms.uRadius.value = sizes.width * 2;
    mesh.material.uniforms.uRange.value = sizes.height;
  });
}

/**
 * Generate contact signature
 */
const sign = {
  geo: {},
  tex: {},
  mat: {},
  mesh: {},
  img: {},
  X: 0,
  Y: 0,
  W: 0,
  H: 0,
  scale: 1,
  top: 0,
};

sign.img = document.querySelector(".signatureImg");
sign.W = sign.img.offsetWidth;
sign.H = sign.img.offsetHeight;

sign.geo = new THREE.PlaneGeometry(sign.W, sign.H, 1, 1);
sign.tex = textureLoader.load("/image/signature.png", () => {
  END += 4;
});
sign.mat = new THREE.MeshStandardMaterial({
  map: sign.tex,
  transparent: true,
  metalness: 0.4,
  roughness: 0.4,
  // wireframe: true,
});
sign.mesh = new THREE.Mesh(sign.geo, sign.mat);
sceneMain.add(sign.mesh);

// For positions
function signUpdate() {
  // Parallax
  sign.top = Math.max(
    0,
    -((sign.img.getBoundingClientRect().top - sizes.height) * 0.25)
  );
  sign.img.style.top = `${sign.top}px`;

  // Scale
  sign.scale = sign.img.offsetWidth / sign.W;
  sign.mesh.scale.x = sign.scale;
  sign.mesh.scale.y = sign.scale;

  // Position
  sign.Y = sign.img.getBoundingClientRect().top;

  sign.mesh.position.y =
    -sign.Y +
    sizes.height * 0.5 -
    sign.img.getBoundingClientRect().height * 0.5;

  gsap.to(sign.mesh.rotation, {
    y: -(cursor.X / sizes.width - 0.5) * 0.6,
    x: -(cursor.Y / sizes.height - 0.5) * 0.8,
    duration: 1,
  });
}

const contactText = document.querySelector(".contactText");
const contactLetters = contactText.textContent.split("");
var contactNew = "";
contactLetters.forEach((letter, i) => {
  if (letter === " ") letter = "&nbsp;";
  contactNew += `<div class="contact-letter" style="transition-delay: ${
    i * 0.05
  }s">${letter}</div>`;
});
contactText.innerHTML = contactNew;

/**
 * Generate pixelated
 */
const pixel = {
  geo: {},
  tex: {},
  mat: {},
  mesh: {},
  list: [],
  number: 32,
  index: 0,
  opacity: 0,
  red: 1.0,
  green: 1.0,
  blue: 1.0,
  scale: 1,
  aspect: sizes.width / sizes.height,
};

pixel.geo = new THREE.PlaneGeometry(1024, 1024, 1, 1);

pixel.tex = textureLoader.load("/image/pixel3.png", () => {
  END += 4;
});
if (sizes.pc) {
  for (let i = 0; i < pixel.number; i++) {
    let material = new THREE.MeshBasicMaterial({
      map: pixel.tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      opacity: 0,
    });
    let mesh = new THREE.Mesh(pixel.geo, material);
    scenePix.add(mesh);
    pixel.list.push(mesh);
  }
}

function imageHover() {
  if (pixel.index >= pixel.number) pixel.index = 0;
  if (pixel.list[pixel.index]) {
    if (cursor.speed > 2) {
      // Position

      pixel.list[pixel.index].position.x =
        cursor.X - (cursor.X % 64) - cursor.cenX;
      pixel.list[pixel.index].position.y =
        cursor.cenY - cursor.Y + (cursor.Y % 64);
      pixel.list[pixel.index].material.opacity =
        0.1 * Math.min(cursor.speed / 10, 10);

      // Direction
      cursor.dirX <= 0 ? (pixel.red = 1) : (pixel.red = 0);
      cursor.dirY <= 0 ? (pixel.blue = 1) : (pixel.blue = 0);

      pixel.list[pixel.index].material.color = new THREE.Color(
        pixel.red,
        pixel.green,
        pixel.blue
      );

      cursor.dirX;
      cursor.dirY = clamp(cursor.Y - cursor.preY, -1, 1);

      cursor.speed = 0;
      pixel.index++;
    }
  }
  pixel.list.forEach((m) => {
    if (m.material.opacity >= 0.0) {
      m.material.opacity -= 0.02;
    }
  });
}

/**
 * Camera
 */
// Base camera
const cameraPix = new THREE.PerspectiveCamera(53, sizes.width / sizes.height);
cameraPix.position.z = sizes.height;
scenePix.add(cameraPix);

const cameraMain = new THREE.PerspectiveCamera(
  53,
  sizes.width / sizes.height,
  1,
  999999
);
cameraMain.position.z = sizes.height;
sceneMain.add(cameraMain);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Resize screen
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.aspect = window.innerWidth / window.innerHeight;
  sizes.pc = window.innerWidth >= 1024;
  sizes.scale = window.innerWidth / sizes.baseW;

  // Update camera
  cameraPix.aspect = sizes.aspect;
  cameraPix.updateProjectionMatrix();
  cameraPix.position.z = sizes.height;

  cameraMain.aspect = sizes.aspect;
  cameraMain.updateProjectionMatrix();
  cameraMain.position.z = sizes.height;

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Composer
 */
const composer = new EffectComposer(renderer);
composer.setSize(sizes.width, sizes.height);
const renderPass = new RenderPass(sceneMain, cameraMain);
composer.addPass(renderPass);
const cgePass = new ShaderPass(CGEffect);
composer.addPass(cgePass);

function updateCGE() {
  cgePass.uniforms.uDisplacement.value = baseTexture.texture;
  cgePass.uniforms.speed.value = cursor.dirX;
}

/**
 * Interactive
 */
const mouse = new THREE.Vector2();
const cursor = {
  X: 0,
  Y: 0,
  preX: 0,
  preY: 0,
  cenX: sizes.width / 2,
  cenY: sizes.height / 2,
  speed: 0,
  dirX: 0,
  dirY: 0,
};

// Clamp number between two values with the following line:
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

window.addEventListener("mousemove", (e) => {
  cursor.X = e.clientX;
  cursor.Y = e.clientY;
  cursor.speed = Math.max(
    Math.abs(cursor.X - cursor.preX),
    Math.abs(cursor.Y - cursor.preY)
  );
  if (slider.dragging && Math.abs(cursor.speed) > 2) slider.dragged = true;

  cursor.dirX = clamp(cursor.X - cursor.preX, -1, 1);
  cursor.dirY = clamp(cursor.Y - cursor.preY, -1, 1);

  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;

  if (Math.abs(cursor.speed) > 2) {
    cursor.preX = cursor.X;
    cursor.preY = cursor.Y;
  }
});
window.addEventListener("touchmove", (e) => {
  cursor.X = e.touches[0].clientX;
  cursor.Y = e.touches[0].clientY;

  cursor.speed = Math.max(
    Math.abs(cursor.X - cursor.preX),
    Math.abs(cursor.Y - cursor.preY)
  );
  if (slider.dragging && Math.abs(cursor.speed) > 2) {
    slider.dragged = true;
  }
  if (slider.dragging && Math.abs(cursor.speed) == 0) {
    slider.start = cursor.X;
  }

  mouse.x = (e.touches[0].clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.touches[0].clientY / sizes.height) * 2 + 1;

  if (Math.abs(cursor.speed) > 2) {
    cursor.preX = cursor.X;
    cursor.preY = cursor.Y;
  }
});

/**
 * Animate
 */

let isLoading = true;
let isIntro = false;
let canScroll = false;

// For loader & intro
const loader1 = document.querySelector(".loaderJS");
const loader2 = document.querySelector(".loaderMB");
const wrapper = document.querySelector("#smooth-wrapper");
const transform = {
  S: 35,
  X: -159,
  Y: -200,
};
const loadingSpeed = 0.05;
const introSpeed = 0.1;
let loadingProgress = 0;
let introProgress = 1;

function loading() {
  loadingProgress += (END - loadingProgress) * loadingSpeed;
  if (loadingProgress <= 100) {
    loader1.style.backgroundPositionX = 100 - loadingProgress + "%";
    loader2.style.backgroundPositionX = 100 - loadingProgress + "%";
  } else {
    isLoading = false;
    isIntro = true;
  }
}

function intro() {
  introProgress -= introProgress * introSpeed;
  if (introProgress >= 0.00005 && sizes.pc) {
    let _S = 1 + transform.S * introProgress;
    let _X = transform.X * introProgress;
    let _Y = transform.Y * introProgress;
    wrapper.style.transform = `translate3D( ${_X}vw, ${_Y}vh,0) scale(${_S}) `;
  } else {
    introProgress = 0;
    isIntro = false;
    wrapper.style.transform = `none`;
    document.querySelector("body").classList.add("enter");
    canScroll = true;
  }
}

// For hero title
const hero = document.querySelector(".heroJS");
const text = hero.querySelector(".heroItem");
const string = hero.querySelector(".heroTxt");
const letters = string.textContent.split("");

const txt = {
  current: 0,
  acceleration: 0,
  direction: -1,
  speed: sizes.width / (60 * 8),
  pos: 0,
};

if (sizes.pc) {
  var newString = "&nbsp;";
  letters.forEach((letter) => {
    if (letter === " ") letter = "&nbsp;";
    newString += `<div class="hero-title-letter heroLetter">${letter}</div>`;
  });
  string.innerHTML = newString;
  hero.appendChild(text.cloneNode(true));

  const heroIntro = document.querySelectorAll(".heroLetter");
  heroIntro.forEach((letter, i) => {
    letter.style.transitionDelay = `${i * 0.1}s`;
  });
}

const texts = hero.querySelectorAll(".heroItem");
function heroUpdate(fps) {
  txt.acceleration = txt.current - window.pageYOffset;
  txt.acceleration <= 0 ? (txt.direction = -1) : (txt.direction = 1);
  txt.current -= txt.acceleration * 0.1;
  txt.pos += (txt.speed * txt.direction + txt.acceleration * 0.05) * 60 * fps;

  hero.style.transform = `skew(${txt.acceleration * 0.05}deg)`;

  texts.forEach((text, i) => {
    if (txt.pos < -text.offsetWidth) txt.pos = 0;
    if (txt.pos > 0) txt.pos = -text.offsetWidth;

    text.style.transform = `translate3D(${txt.pos}px,0,0)`;
  });
}

// For scrolling
let scrollOffset = 0;
let scrollAcc = 0;
const smoothWrap = document.querySelector("#smooth-wrapper");
const scrollState = document.querySelector(".scrollState");
const body = document.body;
const scrollSpeed = 0.08;
function scroller() {
  const maxHeight = Math.floor(smoothWrap.getBoundingClientRect().height - 1);
  body.style.height = maxHeight + "px";

  scrollOffset += (window.pageYOffset - scrollOffset) * scrollSpeed;
  scrollAcc = (window.pageYOffset - scrollOffset) * scrollSpeed;
  smoothWrap.style.transform = `translate3D(0,-${scrollOffset}px,0)`;
  scrollState.style.width = `${
    (scrollOffset / (body.scrollHeight - sizes.height)) * 100
  }%`;
}

// Tỉmer
const timer = new THREE.Clock();
let deltaTime = 0;
let time = 0;
// 60 fps
const FPSlimit = sizes.pc ? 1 / 60 : 1 / 120;

const tick = () => {
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  deltaTime += timer.getDelta();

  time = timer.getElapsedTime();

  if (deltaTime >= FPSlimit) {
    // Loader
    if (isLoading) loading();

    // Intro
    if (isIntro) intro();

    if (canScroll && sizes.pc) {
      // Smooth scroll
      scroller();

      // Hero title
      heroUpdate(FPSlimit);
    }

    // Portrait position
    portraitUpdate();

    // About position
    aboutUpdate();

    // Work position
    workUpdate();
    raycasting();

    // Ribbon position
    ribbonUpdate(time);

    // Signature position
    signUpdate();

    // Scroll trigger
    sections.forEach((section) => {
      let secStart = section.getBoundingClientRect().top - sizes.height / 4;
      let secEnd =
        section.getBoundingClientRect().top +
        section.getBoundingClientRect().height -
        sizes.height;
      if (secStart <= 2 || secEnd <= 2) {
        section.classList.add("animated");
      }
    });

    if (sizes.pc) {
      // Images hover
      imageHover();

      // Render
      renderer.setRenderTarget(baseTexture);
      renderer.render(scenePix, cameraPix);
      updateCGE();
      renderer.setRenderTarget(null);
      renderer.clear();
    }
    composer.render();

    deltaTime = deltaTime % FPSlimit;
  }
};

tick();

window.addEventListener("load", () => {
  // console.clear();

  console.log(
    "%cDesigned and Developed by Duynguyen",
    "color: #242424; font-size: 30px; font-weight: 900"
  );
});
