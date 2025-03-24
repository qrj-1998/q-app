import CreateApp, { appInstanceMap } from './app'

class MyElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    console.log('connectedCallback');

    const app = new CreateApp({
      name: this.name,
      url: this.url,
      container: this,
    })

    appInstanceMap.set(this.name, app)
    console.log(appInstanceMap);
  }

  disconnectedCallback() {
    console.log('disconnectedCallback');
    const app = appInstanceMap.get(this.name)
    app.unmount(this.hasAttribute('destroy'))
  }

  static get observedAttributes () {
    return ['name', 'url']
  }

  attributeChangedCallback(attrName, oldValue, newVal) {
    if (attrName === 'name' && !this.name && newVal) {
      this.name = newVal
    } else if (attrName === 'url' && !this.url && newVal) {
      this.url = newVal
    }
  }
  
}

export function defineElement () {
  if (!window.customElements.get('q-app')) {
    window.customElements.define('q-app', MyElement)
  }
}