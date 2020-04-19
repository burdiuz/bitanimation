const customAttributesMixin = (ElementClass) => {
  let invalid = false;

  return class extends ElementClass {
    isInvalid() {
      return invalid;
    }

    invalidate() {
      if (invalid) {
        return;
      }

      invalid = true;
      Promise.resolve().then(() => this.validate());
    }

    validate() {
      invalid = false;
    }

    attributeChangedCallback(name, _, newValue) {
      const parserFnName = `${name}AttrParser`;
      const value =
        parserFnName in this ? this[parserFnName](newValue) : newValue;

      const oldValue = this[name];

      if (oldValue === newValue) {
        return;
      }

      this[name] = value;

      const { invalidationAttributes } = Object.getPrototypeOf(
        this
      ).constructor;

      if (invalidationAttributes.includes(name)) {
        this.invalidate();
      }
    }
  };
};

const decNumberParse = (value) => Number.parseInt(value, 10);
