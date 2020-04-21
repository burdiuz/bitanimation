(() => {
  const idToValue = (id) => `#${id.substr(2)}`;
  const valueToId = (value) => `c-${value.substr(1)}`;

  class BitColorSelectElement extends HTMLElement {
    static get observedAttributes() {
      return ['options', 'value'];
    }

    constructor() {
      super();

      this.root = this.attachShadow({ mode: 'closed' });
      this.root.innerHTML = `<style>
          :host {
            display:flex;
          }

          .value, .option {
            border: solid #aaaaaa 1px;
          }

          .value {
            width: 40px;
            height: 40px;
          }

          .options {
            display: flex;
          }

          .option {
            width: 25px;
            height: 25px;
            margin: 2px;
          }
        </style>
        <div class="value">
        </div>
        <div class="options"></div>`;
    }

    get value() {
      return this._value;
    }

    set value(value) {
      if (this._value) {
        const prev = this.root.querySelector(`#${valueToId(this._value)}`);

        if (prev) {
          prev.style.removeProperty('border-color');
        }
      }

      this._value = value;

      this.root.querySelector('.value').style.backgroundColor = value;
      this.root.querySelector(`#${valueToId(value)}`).style.borderColor =
        '#ff0000';
    }

    attributeChangedCallback(name, _, value) {
      switch (name) {
        case 'options':
          const options = this.root.querySelector('.options');

          value.split(',').forEach((item) => {
            const optionValue = item.trim();
            const option = document.createElement('div');

            option.className = 'option';
            option.id = valueToId(optionValue);
            option.style.backgroundColor = optionValue;

            option.addEventListener('click', this.optionClickHandle);

            options.appendChild(option);
          });
          break;
        case 'value':
          this.value = value;
          break;
      }
    }

    optionClickHandle = ({ target: { id } }) => {
      const value = idToValue(id);

      this.value = value;
      this.dispatchEvent(new CustomEvent('change', { detail: { value } }));
    };
  }

  window.customElements.define('bit-color-select', BitColorSelectElement);
})();
