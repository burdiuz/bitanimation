import { COMPONENT_NAME as TOOLBTN_COMPONENT_NAME } from './components/tool-button.js';

export const nextTick = (callback) => {
  let promise = null;
  let lastArgs;

  return (...args) => {
    lastArgs = args;

    if (promise) {
      return;
    }

    promise = Promise.resolve().then(() => {
      promise = null;

      callback(...lastArgs);
    });
  };
};

export const debounce = (callback, timeout = 0) => {
  let timeoutId = 0;

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};

export const createToolButton = (icon, title, handler, slot, size) => {
  const btn = document.createElement('button', {
    is: TOOLBTN_COMPONENT_NAME,
  });

  btn.setAttribute('size', size);
  btn.setAttribute('icon', icon.charAt(0) === '.' ? icon : `./icons/${icon}`);
  btn.setAttribute('title', title);

  if (slot) {
    btn.setAttribute('slot', slot);
  }

  btn.addEventListener('click', handler);

  return btn;
};

const observer = new ResizeObserver((components) =>
  components.forEach(({ target: component, contentRect }) => {
    component.resizeCallback(contentRect);
  })
);

export const observe = (component) => {
  observer.observe(component);

  return () => unobserve(component);
};

export const unobserve = (component) => {
  observer.unobserve(component);
};
