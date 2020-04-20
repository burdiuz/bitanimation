const observer = new ResizeObserver((components) =>
  components.forEach(({ target: component, contentRect }) => {
    console.log('resized');
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
