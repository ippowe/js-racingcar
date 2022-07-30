import { Car } from "./Car.js";
import { Alert, alertError } from "./utils/Alert.js";
import { CAR_NAME_INPUT, CAR_GENERATE_BUTTON } from "./utils/selector.js";
import { CAR_FACTORY_ERROR_MESSAGES } from "./utils/errorMessage.js";
import { CAR_NAME_SEPARATOR, MAX_CAR_NAME_LENGTH } from "./utils/constant.js";
import { isDuplicated, isEmptyString, isFunction, isHTMLFormElement } from "./utils/validator.js";

export class CarFactory {
  $form;
  $input;
  $carContainer;
  onCarsGenerated;

  constructor($form, { onCarsGenerated, $carContainer } = {}) {
    if (!isHTMLFormElement($form)) {
      throw new TypeError(`${$form} is not a HTMLFormElement`);
    }

    if (!isFunction(onCarsGenerated)) {
      throw new TypeError(`${onCarsGenerated} is not a function`);
    }

    this.$carContainer = $carContainer;
    this.$form = $form;
    this.$input = $form.querySelector(CAR_NAME_INPUT);
    this.$button = $form.querySelector(CAR_GENERATE_BUTTON);

    this.onCarsGenerated = onCarsGenerated;
    this.addEventHandlers();
  }

  validateCarName(carName) {
    if (isEmptyString(carName)) {
      throw new Alert(CAR_FACTORY_ERROR_MESSAGES.CAR_NAME_IS_EMPTY);
    }

    if (carName.length > MAX_CAR_NAME_LENGTH) {
      throw new Alert(CAR_FACTORY_ERROR_MESSAGES.CAR_NAME_LOGGER_THAN_MAX_LENGTH);
    }
  }

  validateCarNames(carNames) {
    if (isDuplicated(carNames)) {
      throw new Alert(CAR_FACTORY_ERROR_MESSAGES.CAR_NAMES_DUPLICATED);
    }
    carNames.forEach((name) => this.validateCarName(name));
  }

  getCarNames(e) {
    const carNames = new FormData(e.target).get("carNames");
    return carNames.split(CAR_NAME_SEPARATOR).map((name) => name.trim());
  }

  generateCars(e) {
    try {
      e.preventDefault();
      const carNames = this.getCarNames(e);
      this.validateCarNames(carNames);
      const cars = carNames.map((name) => new Car(this.$carContainer, name));
      this.onCarsGenerated(cars);
    } catch (error) {
      alertError(error, this.focusInput.bind(this));
    }
  }

  focusInput() {
    this.$input.focus();
  }

  addEventHandlers() {
    this.$form.addEventListener("submit", this.generateCars.bind(this));
  }

  disableButton() {
    this.$button.disabled = true;
  }

  rest() {
    this.$input.value = "";
    this.$button.disabled = false;
    this.$carContainer.innerHTML = "";
    this.$input.focus();
  }
}
