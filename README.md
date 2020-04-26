# bitanimation

This is a fully functional [application](https://burdiuz.github.io/bitanimation/) that allows creating simple animations.
It was made to support [MultibyteStream](https://github.com/burdiuz/js-multibyte-stream) project and try some newer frontend techniques -- native JavaScript Modules and Web Components.  
  
MultibyteStream was used to store animation state in URL. You may see that URL parameter "a" is changing whenever something changed in the animation editor. This way of keeping state allows easy sharing by copy/pasing URL and to utilize History API to allow Undo/Redo by simply going back and forward in the browser.
