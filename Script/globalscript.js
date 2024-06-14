const apiUrl = "http://192.168.29.192:5000";

// --------------------------------Work Section work tab---------------------------------

async function fetchProjectsData() {
  try {
    const response = await fetch(`${apiUrl}/section_works`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const projectsData = await response.json();
    return projectsData;
  } catch (error) {
    console.error("Failed to fetch projects data:", error);
    return []; // Return an empty array in case of an error
  }
}
async function initializeProjects() {
  const projectsContainer = document.querySelector(".projects");

  // Fetch projects data
  const projectsData = await fetchProjectsData();

  // Check if projects data is available
  if (projectsData && projectsData.length > 0) {
    // Loop through data and create project cards
    projectsData.forEach((data, index) => {
      const projectCard = createProjectCard(data, index);
      projectsContainer.appendChild(projectCard);
    });
  } else {
    // Display a message or handle empty data case
    projectsContainer.innerHTML = "<p>No projects found.</p>";
  }
}
function createProjectCard(data, index) {
  const projectCard = document.createElement("div");
  projectCard.classList.add("project-card");

  const formattedIndex = ("0" + (index + 1)).slice(-2);
  projectCard.innerHTML = `
    <div class="project-heading">
      <p>${formattedIndex}. ${data.heading}</p>
      <span></span>
      <span></span>
    </div>
    <div class="project-descreption">
      <p>${data.content}</p>
    </div>
    <div class="goto-btn">
      <button class="goto-btn-btn">
        <img src="./assets/logos/arrow.png" alt=""
      </button>
    </div>
    <div class="card-img">
     <img src="${data.work_img}" alt="${data.work_img_original_name}" />
    </div>
  `;

  return projectCard;
}

document.addEventListener("DOMContentLoaded", () => {
  initializeProjects();
});
// ------------------------------Services Section services tab----------------------------
let leftCount = 1;
let rightCount = 1;
let servicesData = [];

function createServiceHTML(service, index) {
  const serviceNumber = (index + 1).toString().padStart(2, "0");
  const isEven = index % 2 === 0;
  const imgClass = isEven
    ? `service-img-left-${leftCount++}`
    : `service-img-right-${rightCount++}`;

  return `
    <div class="service service-${serviceNumber}">
      <div class="service-img ${imgClass} animation-1">
        <img src="${service.section_img}" alt="${service.section_heading}" />
      </div>
      <div class="service-number">
        <p>${serviceNumber}</p>
      </div>
      <div class="white-line"></div>
      <div class="services-content">
        <p>${service.section_heading}</p>
        <p>${service.section_content}</p>
      </div>
    </div>
  `;
}

function createServiceHTMLMobile(service, index) {
  const isEven = index % 2 === 0;
  return `
    <div class="service service-${(index + 1).toString().padStart(2, "0")}">
      <div class="service-number">
        <p>${(index + 1).toString().padStart(2, "0")}</p>
      </div>
      <div class="services-content">
        <p>${service.section_heading}</p>
        <p>${service.section_content}</p>
      </div>
      <div class="white-line"></div>
      <div class="service-img ${
        isEven ? "service-img-left" : "service-img-right"
      }">
        <img src="${service.section_img}" alt="${service.section_heading}" />
      </div>
    </div>
  `;
}
function renderMainService(mainServiceData) {
  const mainTitleElement = document.getElementById("serviceTitle");
  const mainDescriptionElement = document.getElementById("serviceDescription");

  mainTitleElement.textContent = mainServiceData.main_heading;
  mainDescriptionElement.textContent = mainServiceData.main_content;
}

function renderServices(servicesData) {
  const servicesContainer = document.querySelector(".services");
  let servicesHTML = "";

  for (let i = 0; i < servicesData.length; i++) {
    servicesHTML += createServiceHTML(servicesData[i], i);
  }

  servicesContainer.innerHTML = servicesHTML;
}

function renderServicesMobile() {
  const servicesContainer = document.querySelector(
    ".services-wrapper-mobile .services"
  );
  let servicesHTML = "";

  for (let i = 0; i < servicesData.length; i += 2) {
    servicesHTML += '<div class="service-group">';
    servicesHTML += createServiceHTMLMobile(servicesData[i], i);
    if (i + 1 < servicesData.length) {
      servicesHTML += createServiceHTMLMobile(servicesData[i + 1], i + 1);
    }
    servicesHTML += "</div>";
  }

  servicesContainer.innerHTML = servicesHTML;
}

async function fetchServicesData() {
  try {
    const response = await fetch(`${apiUrl}/section_services`); // API endpoint URL
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    servicesData = await response.json();
    renderServices(servicesData);
    renderServicesMobile();

    setupAnimations();
  } catch (error) {
    console.error("Failed to fetch services data:", error);
  }
}
async function fetchServicesHeading() {
  try {
    const response = await fetch(`${apiUrl}/section_services/1`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const mainServiceData = await response.json();
    renderMainService(mainServiceData);
  } catch (error) {
    console.error("Failed to fetch main service data:", error);
  }
}
function setupAnimations() {
  gsap.to("progress", {
    value: 100,
    ease: "none",
    scrollTrigger: { scrub: 0.3 },
  });
  gsap.from(".pageHead", {
    opacity: 0,
    y: 100,
    duration: 0.5,
    delay: 0.5,
  });

  function animateOnPC() {
    gsap.registerPlugin(ScrollTrigger);
    const animateImageLeft = (element) => {
      gsap.from(element, {
        opacity: 0,
        x: -100,
        duration: 0.5,
        delay: 0.5,
        scrollTrigger: {
          trigger: element,
          start: "bottom bottom-=0px",
          toggleActions: "play none none reverse",
        },
      });
    };
    const animateImageRight = (element) => {
      gsap.from(element, {
        opacity: 0,
        x: 100,
        duration: 0.5,
        delay: 0.5,
        scrollTrigger: {
          trigger: element,
          start: "bottom bottom-=0",
          toggleActions: "play none none reverse",
        },
      });
    };

    for (let i = 1; i < leftCount; i++) {
      animateImageLeft(`.service-img-left-${i}`);
      animateImageRight(`.service-img-right-${i}`);
    }
  }

  if (window.matchMedia("(min-width: 1024px)").matches) {
    animateOnPC();
  }
}

fetchServicesHeading();
fetchServicesData();
// ------------------------------Services Section services tab----------------------------

// ------------------------------Home Tab Slider content----------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  const carouselInnerPc = document.getElementById("carousel-inner-pc");
  const carouselInnerMobile = document.getElementById("carousel-inner-mobile");

  // Fetch data from the API
  const response = await fetch(`${apiUrl}/sliders`);
  const projects = await response.json();

  const itemsPerSlidePc = 3;
  const numberOfSlidesPc = Math.ceil(projects.length / itemsPerSlidePc);

  for (let i = 0; i < numberOfSlidesPc; i++) {
    const carouselItem = document.createElement("div");
    carouselItem.className = `carousel-item ${i === 0 ? "active" : ""}`;

    const carouselCard = document.createElement("div");
    carouselCard.className = "carousel-card";

    for (
      let j = i * itemsPerSlidePc;
      j < i * itemsPerSlidePc + itemsPerSlidePc;
      j++
    ) {
      if (j >= projects.length) break;

      const project = projects[j];

      const projectImg = document.createElement("div");
      projectImg.className = "project-img";

      const img = document.createElement("img");
      img.src = project.image_url;
      img.alt = project.description;

      const projectDescription = document.createElement("div");
      projectDescription.className = "project-desc";

      const desc = document.createElement("p");
      desc.textContent = project.description;

      projectDescription.appendChild(desc);
      projectImg.appendChild(img);
      projectImg.appendChild(projectDescription);
      carouselCard.appendChild(projectImg);
    }

    carouselItem.appendChild(carouselCard);
    carouselInnerPc.appendChild(carouselItem);
  }

  projects.forEach((project, index) => {
    const carouselItem = document.createElement("div");
    carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;

    const carouselCard = document.createElement("div");
    carouselCard.className = "carousel-card";

    const projectImg = document.createElement("div");
    projectImg.className = "project-img-mobile";

    const img = document.createElement("img");
    img.src = project.image_url;
    img.alt = project.description;

    const projectDescription = document.createElement("div");
    projectDescription.className = "project-desc-mobile";

    const desc = document.createElement("p");
    desc.textContent = project.description;

    projectDescription.appendChild(desc);
    projectImg.appendChild(img);
    projectImg.appendChild(projectDescription);
    carouselCard.appendChild(projectImg);
    carouselItem.appendChild(carouselCard);
    carouselInnerMobile.appendChild(carouselItem);
  });
});

// ------------------------------Home Tab Slider content------------------------------
// ------------------------------Home Tab Section-1 ----------------------------------
function animateAbout() {
  gsap.registerPlugin(ScrollTrigger);
  const animateRows = (element) => {
    gsap.from(element, {
      opacity: 0,
      y: 80,
      duration: 0.5,
      delay: 0.5,
      scrollTrigger: {
        trigger: element,
        start: "bottom bottom-=-40px",
        toggleActions: "play none none reverse",
      },
    });
  };
  animateRows(".about-row");
  animateRows(".about-row-1");
  animateRows(".about-row-2");
  animateRows(".about-row-3");
  animateRows(".about-row-4");
}
document.addEventListener("DOMContentLoaded", () => {
  const aboutMeContainer = document.getElementById("aboutMe");

  console.log("Fetching data from API...");

  fetch(`${apiUrl}/homeSectionFirst`)
    .then((response) => {
      console.log("Response received:", response);
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data received:", data);
      data.forEach((item, index) => {
        const rowDiv = document.createElement("div");
        rowDiv.className = `about about-row-${index + 1}`;

        const headingDiv = document.createElement("div");
        headingDiv.className = "left-heading";
        headingDiv.innerHTML = `<p>${item.first_heading}</p>`;

        const descriptionDiv = document.createElement("div");
        descriptionDiv.className = `description description-${index}`;
        descriptionDiv.innerHTML = `<p>${item.first_content}</p>`;

        rowDiv.appendChild(headingDiv);
        rowDiv.appendChild(descriptionDiv);
        aboutMeContainer.appendChild(rowDiv);
      });

      animateAbout();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

// ------------------------------Home Tab Section-1 ----------------------------------
/*

*/
// ------------------------------Home Tab Section-2 ----------------------------------
const workContainer = document.getElementById("services");
function createWorkItem(item, index) {
  const workDiv = document.createElement("div");
  workDiv.classList.add("work", `work-row-${index + 1}`);

  const ribbonDiv = document.createElement("div");
  ribbonDiv.classList.add(
    "work-ribbon",
    `work-ribbon-${String.fromCharCode(97 + index)}`
  );

  const image = document.createElement("img");
  image.src = item.second_image_url;
  image.alt = "";

  ribbonDiv.appendChild(image);
  workDiv.appendChild(ribbonDiv);

  const headingDiv = document.createElement("div");
  headingDiv.classList.add("work-heading");

  const headingText = document.createElement("p");
  headingText.textContent = item.second_heading;

  headingDiv.appendChild(headingText);
  workDiv.appendChild(headingDiv);

  workContainer.appendChild(workDiv);
}

fetch(`${apiUrl}/homeSectionSecond`)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((item, index) => {
      createWorkItem(item, index);
    });
    animateServices();
  })
  .catch((error) => console.error("Error fetching data:", error));

function animateServices() {
  gsap.registerPlugin(ScrollTrigger);
  const animateService = (element) => {
    gsap.from(element, {
      opacity: 0,
      y: 80,
      duration: 0.5,
      scrollTrigger: {
        trigger: element,
        start: "bottom bottom-=-10px",
        toggleActions: "play none none reverse",
      },
    });
  };
  animateService(".work-row");
  animateService(".work-row-1");
  animateService(".work-row-2");
  animateService(".work-row-3");
  animateService(".work-row-4");
}

// ------------------------------Home Tab Section-2 ----------------------------------
