// src/micro-ce/source.js
import { fetchSource } from "./utils";
export default function loadHtml(app) {
  fetchSource(app.url).then((html) => {
    html = html
      .replace(/<head[^>]*>[\s\S]*?<\/head>/i, (match) => {
        return match
          .replace(/<head/i, "<q-app-head")
          .replace(/<\/head>/i, "</q-app-head>");
      })
      .replace(/<body[^>]*>[\s\S]*?<\/body>/i, (match) => {
        return match
          .replace(/<body/i, "<q-app-body")
          .replace(/<\/body>/i, "</q-app-body>");
      });

    const htmlDom = document.createElement("div");
    htmlDom.innerHTML = html;

    extractSourceDom(htmlDom, app);

    const appHead = htmlDom.querySelector('q-app-head')
    if (app.source.links.size) {
      fetchLinksFromHtml(app, appHead, htmlDom)
    } else {
      app.onLoad(htmlDom)
    }

    if (app.source.scripts.size) {
      fetchScriptsFromHtml(app, htmlDom)
    } else {
      app.onLoad(htmlDom)
    }

    console.log( Array.from(app.source.links.entries())); //查看缓存中内容
  });
}

function extractSourceDom(parent, app) {
  const children = Array.from(parent.children);
  
  children.length && children.forEach((child) => {
    extractSourceDom(child, app)
  })

  for (const dom of children) { 
    if (dom instanceof HTMLLinkElement) { 
      const href = dom.getAttribute('href');
      if (dom.getAttribute('rel') === 'stylesheet' && href) {
        app.source.links.set(href, {
          code: '',
        })
      }
      parent.removeChild(dom)
    } else if (dom instanceof HTMLScriptElement) {
      const src = dom.getAttribute('src')
      if (src) { // 如有有src属性，表示是远程script
        app.source.scripts.set(src, {
          code: '', // 代码内容
          isExternal: true, // 是否远程script
        })
      } else if (dom.textContent) { // 如果dom中有内容，表示是内联script
        //随机字符串名字
        const nonceStr = Math.random().toString(36).substring(2, 15)
        app.source.scripts.set(nonceStr, {
          code: dom.textContent, // 代码内容
          isExternal: false, // 是否远程script
        })
      }

      parent.removeChild(dom)
    }
  }
}

export function fetchLinksFromHtml(app, appHead, htmlDom) {
  const linkEntries = Array.from(app.source.links.entries());
  const fetchLinkPromise = [];
  for (let [href, source] of linkEntries) {
    if (!href.includes('http')) { 
       href = `${app.url.endsWith('/') ? app.url.substring(0,app.url.length-1):app.url}${href}`;
    }
    fetchLinkPromise.push(fetchSource(href));
  }

  Promise.all(fetchLinkPromise).then(res => { 
    for (let i = 0; i < res.length; ++i) { 
      const code = res[i]; // 获取css代码资源
      linkEntries[i][1].code = code;
      const link2Style = document.createElement('style')
      link2Style.textContent = code
      appHead.appendChild(link2Style)
    }
    app.onLoad(htmlDom);
  }).catch((e) => {
    console.error('加载css出错', e)
  })
}

/**
 * 获取js远程资源
 * @param app 应用实例
 * @param htmlDom html DOM结构
 */
export function fetchScriptsFromHtml (app, htmlDom) {
  const scriptEntries = Array.from(app.source.scripts.entries())
  // 通过fetch请求所有js资源
  const fetchScriptPromise = []
  for (let [url, info] of scriptEntries) {
    if (!url.includes('http')) { 
      url = `${app.url.endsWith('/') ? app.url.substring(0,app.url.length-1):app.url}${url}`;
      console.log(url);
    }
    
    fetchScriptPromise.push(info.code ? Promise.resolve(info.code) :  fetchSource(url))
  }

  Promise.all(fetchScriptPromise).then((res) => {
    for (let i = 0; i < res.length; i++) {
      const code = res[i]
      scriptEntries[i][1].code = code
    }

    app.onLoad(htmlDom)
  }).catch((e) => {
    console.error('加载js出错', e)
  })
}