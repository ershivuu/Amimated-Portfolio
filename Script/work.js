gsap.to("progress", {
  value: 100,
  ease: "none",
  scrollTrigger: { scrub: 0.3 },
});

function animateOnPC() {
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
  animateService(".mail");
  animateService(".contact");
}

if (window.matchMedia("(min-width: 1024px)").matches) {
  animateOnPC();
}

//--------------------------------------------------------

let hoverInProgress = false;
let words = [
  ["A", "B", "O", "U", "T"],
  ["W", "O", "R", "K", "S"],
  ["S", "E", "R", "V", "I", "C", "E", "S"],
  ["C", "O", "N", "T", "A", "C", "T"],
  ["I", "N", "S", "T", "A", "G", "R", "A", "M"],
  ["L", "I", "N", "K", "E", "D", "I", "N"],
  ["T", "E", "L", "E", "G", "R", "A", "M"],
];

function rearrangeLetters(element) {
  if (!hoverInProgress) {
    const spans = element.querySelectorAll("span");
    const index = Array.from(
      document.querySelectorAll(".hover-effect")
    ).indexOf(element);

    hoverInProgress = true;

    for (let i = 0; i < words[index].length; i++) {
      setTimeout(() => {
        rotateLetters(spans, words[index]);
      }, 70 * i);
    }

    setTimeout(() => {
      resetLetters(spans, words[index]);
      hoverInProgress = false;
    }, 70 * words[index].length);
  }
}

function rotateLetters(spans, word) {
  let temp = word[word.length - 1];
  for (let i = word.length - 1; i > 0; i--) {
    word[i] = word[i - 1];
    spans[i].textContent = word[i];
  }
  word[0] = temp;
  spans[0].textContent = temp;
}

function resetLetters(spans, word) {
  for (let i = 0; i < spans.length; i++) {
    spans[i].textContent = word[i];
  }
}

const leftHeadings = document.querySelectorAll(".left-heading");

leftHeadings.forEach((leftHeading) => {
  leftHeading.addEventListener("mouseenter", () => {
    leftHeadings.forEach((item) => {
      if (item !== leftHeading) {
        item.style.filter = "blur(20px)";
      }
    });
  });

  leftHeading.addEventListener("mouseleave", () => {
    leftHeadings.forEach((item) => {
      item.style.filter = "none";
    });
  });
});

document.querySelectorAll(".work-heading").forEach((workHeading) => {
  workHeading.addEventListener("mouseenter", () => {
    document.querySelectorAll(".work-heading").forEach((otherWorkHeading) => {
      if (otherWorkHeading !== workHeading) {
        otherWorkHeading.style.filter = "blur(20px)";
      }
    });
  });

  workHeading.addEventListener("mouseleave", () => {
    document.querySelectorAll(".work-heading").forEach((otherWorkHeading) => {
      otherWorkHeading.style.filter = "blur(0)";
    });
  });
});
const isDesktop = () => {
  return window.innerWidth;
};

if (window.innerWidth <= 600) {
  gsap.from(".navbar-toggler-icon", {
    opacity: 0,
    scale: 0,
    duration: 2,
    delay: 3.1,
  });
  gsap.from(".navbar-brand", {
    opacity: 1,
    scale: 1.5,
    duration: 2,
    delay: 3,
    x: "10%",
    y: 300,
  });
  gsap.from(".modal-mobile", {
    opacity: 0,
    duration: 1,
    delay: 4.5,
  });
  gsap.from(".ribbon", {
    opacity: 0,
    y: 100,
    duration: 1,
    delay: 4,
  });
  const animateDescription = (element) => {
    gsap.from(element, {
      opacity: 0,
      y: 80,
      duration: 0.5,
      delay: 0.5,
      scrollTrigger: {
        trigger: element,
        start: "bottom bottom-=-20px",
        toggleActions: "play none none reverse",
      },
    });
  };
  animateDescription(".description-0");
  animateDescription(".description-1");
  animateDescription(".description-2");
  animateDescription(".description-3");
  animateDescription(".work-row");
  animateDescription(".work-row-1");
  animateDescription(".work-row-2");
  animateDescription(".work-row-3");
  animateDescription(".work-row-4");
  animateDescription(".contact");
  animateDescription(".mail");
}

function updateTime() {
  const now = new Date();
  const options = {
    timeZone: "Asia/Kolkata",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  };
  const formattedTime = now.toLocaleTimeString("en-IN", options);
  document.getElementById("indian-time").textContent = formattedTime + " IST";
}

updateTime();
setInterval(updateTime, 1000);
