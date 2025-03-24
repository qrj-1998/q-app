import loadHtml from './source'

export const appInstanceMap = new Map()

export default class CreateApp {
  constructor({ name, url, container }) {
    this.name = name // 应用名称
    this.url = url  // url地址
    this.container = container
    this.status = 'loading'

    loadHtml(this)
  }

  // 组件状态，包括 created/loading/mount/unmount
  status = 'created' 

  source = { 
    links: new Map(),
    scripts: new Map(),
  }

  onLoad (htmlDom) {
    this.loadCount = this.loadCount ? this.loadCount + 1 : 1
    if (this.loadCount === 2 && this.status !== 'unmount') {
      this.source.html = htmlDom
      this.mount()
    }
  }

  mount () {
    const cloneHtml = this.source.html.cloneNode(true)
    const fragment = document.createDocumentFragment()
    Array.from(cloneHtml.childNodes).forEach((node) => {
      fragment.appendChild(node)
    })
    this.container.appendChild(fragment)
    console.log(this.container);

    this.source.scripts.forEach((info) => {
      (0, eval)(info.code)
    })
    this.status = 'mounted'
  }

  unmount(destroy) {
    // 更新状态
    this.status = 'unmount'
    // 清空容器
    this.container = null
    // destroy为true，则删除应用
    if (destroy) {
      appInstanceMap.delete(this.name)
    }
  }
}