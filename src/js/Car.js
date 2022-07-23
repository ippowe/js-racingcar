import { CAR_CONTAINER } from "./utils/selector.js";
import { MAX_POSSIBILITY, MOVE_THRESHOLD } from "./utils/constant.js";
import { isHTMLElement } from "./utils/validator.js";

export class Car {
  $app;
  $container;
  $carEl;
  name;
  rounds;
  position;

  constructor($app, name) {
    if (!isHTMLElement($app)) {
      throw new TypeError(`${app} is not a HTMLElement`);
    }
    this.$app = $app;
    this.$container = $app.querySelector(CAR_CONTAINER);
    this.name = name;
  }

  createCarEl() {
    const el = document.createElement("div");
    el.classList.add("mr-2");
    el.innerHTML = `<div class="car-player">${this.name}</div>`;
    return el;
  }

  setCarEl() {
    this.$carEl = this.createCarEl();
  }

  setRounds(rounds) {
    this.rounds = rounds;
  }

  setup(rounds) {
    this.setRounds(rounds);
    this.setCarEl();
    return this.$carEl;
  }

  isMovable() {
    return Math.random() * MAX_POSSIBILITY >= MOVE_THRESHOLD;
  }

  race() {
    for (let round = 0; round < this.rounds; round++) {
      if (this.isMovable()) this.moveForward();
    }
  }

  getForwardIcon() {
    const icon = document.createElement("div");
    icon.classList.add("forward-icon", "mt-2");
    icon.innerText = "⬇️️";
    return icon;
  }

  moveForward() {
    this.$carEl.appendChild(this.getForwardIcon());
    this.position += 1;
  }
}
