// ------------------------------PC DATA------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const carouselInnerPc = document.getElementById("carousel-inner-pc");

  const projects = [
    {
      img: "./assets/images/software.jpeg",
      desc: "Project 1",
    },
    {
      img: "./assets/images/mobile.jpeg",
      desc: "Project 2",
    },
    {
      img: "./assets/images/ui.jpeg",
      desc: "Project 3",
    },
    {
      img: "./assets/images/software.jpeg",
      desc: "Project 4",
    },
    {
      img: "./assets/images/mobile.jpeg",
      desc: "Project 5",
    },
    {
      img: "./assets/images/ui.jpeg",
      desc: "Project 6",
    },
    {
      img: "./assets/images/mobile.jpeg",
      desc: "Project 7",
    },
    {
      img: "./assets/images/ui.jpeg",
      desc: "Project 8",
    },
    {
      img: "./assets/images/ui.jpeg",
      desc: "Project 9",
    },
  ];

  const itemsPerSlide = 3;
  const numberOfSlides = Math.ceil(projects.length / itemsPerSlide);

  for (let i = 0; i < numberOfSlides; i++) {
    const carouselItem = document.createElement("div");
    carouselItem.className = `carousel-item ${i === 0 ? "active" : ""}`;

    const carouselCard = document.createElement("div");
    carouselCard.className = "carousel-card";

    for (
      let j = i * itemsPerSlide;
      j < i * itemsPerSlide + itemsPerSlide;
      j++
    ) {
      if (j >= projects.length) break;

      const project = projects[j];

      const projectImg = document.createElement("div");
      projectImg.className = "project-img";

      const img = document.createElement("img");
      img.src = project.img;
      img.alt = "";

      const projectDescription = document.createElement("div");
      projectDescription.className = "project-desc";

      const desc = document.createElement("p");
      desc.textContent = project.desc;

      projectDescription.appendChild(desc);
      projectImg.appendChild(img);
      projectImg.appendChild(projectDescription);
      carouselCard.appendChild(projectImg);
    }

    carouselItem.appendChild(carouselCard);
    carouselInnerPc.appendChild(carouselItem);
  }
});

// -------------------------------MOBILE DATA--------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const carouselInnerMobile = document.getElementById("carousel-inner-mobile");

  const projectsMobile = [
    {
      img: "./assets/images/software.jpeg",
      desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
    },
    {
      img: "./assets/images/mobile.jpeg",
      desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
    },
    {
      img: "./assets/images/ui.jpeg",
      desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
    },
    {
      img: "./assets/images/software.jpeg",
      desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
    },
    {
      img: "./assets/images/mobile.jpeg",
      desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
    },
    {
      img: "./assets/images/ui.jpeg",
      desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
    },
    // Add more projects as needed
  ];

  projectsMobile.forEach((project, index) => {
    const carouselItem = document.createElement("div");
    carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;

    const carouselCard = document.createElement("div");
    carouselCard.className = "carousel-card";

    const projectImg = document.createElement("div");
    projectImg.className = "project-img-mobile";

    const img = document.createElement("img");
    img.src = project.img;
    img.alt = "";

    const projectDescription = document.createElement("div");
    projectDescription.className = "project-desc-mobile";

    const desc = document.createElement("p");
    desc.textContent = project.desc;

    projectDescription.appendChild(desc);
    projectImg.appendChild(img);
    projectImg.appendChild(projectDescription);
    carouselCard.appendChild(projectImg);
    carouselItem.appendChild(carouselCard);
    carouselInnerMobile.appendChild(carouselItem);
  });
});
