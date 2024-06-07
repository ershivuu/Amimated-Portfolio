class printBubble {
  constructor(parent, number) {
    this.parent = parent;
    this.number = number;
  }
  addBubble() {
    for (var i = 1; i <= this.number; i++) {
      var bubble = document.createElement("div");
      bubble.classList.add("bubble");
      bubble.textContent = i;
      document.querySelector(this.parent).appendChild(bubble);
    }
  }
}

let bubble = new printBubble(".app", 60);
bubble.addBubble();
