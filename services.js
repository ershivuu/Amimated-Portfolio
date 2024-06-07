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
        start: "bottom bottom-=5px",
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
        start: "bottom bottom-=5px",
        toggleActions: "play none none reverse",
      },
    });
  };

  animateImageLeft(".service-img-left");
  animateImageLeft(".service-img-left-2");
  animateImageLeft(".service-img-left-3");

  animateImageRight(".service-img-right");
  animateImageRight(".service-img-right-2");
  animateImageRight(".service-img-right-3");
}
if (window.matchMedia("(min-width: 1024px)").matches) {
  animateOnPC();
}

//--------------------------------------------------------

let hoverInProgress = false;
let words = [
  ["H", "O", "M", "E"],
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
