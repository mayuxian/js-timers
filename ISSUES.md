
部分缺陷组件详情:
缺陷组件：decode-uri-component - 间接依赖
漏洞标题：decode-uri-component <=0.2.0 存在输入验证不当漏洞
影响描述：decode-uri-component 是一个用于解码 url 的工具包。 decode-uri-component 0.2.0 及之前的版本在使用 decodeUriComponent 类解析特制字符（如“%ea%ba%5a%ba”）时会触发异常 “Uncaught TypeError TypeError: decodeComponents(...).join is not a function”，使得服务停止响应。 当应用程序使用 decodeUriComponent 解析未过滤的用户输入时，攻击者可通过构造特制的 url 字符进行拒绝服务攻击。 query-string 是一个对 url 进行解析和字符串化的工具包，Github 中有 6.1k star。query-string 7.1.1 及之前版本会使用 decode-uri-component 组件对 url 进行解码，会受到该漏洞的影响。
CVE编号：CVE-2022-38900
国家漏洞库信息：
影响范围：：(-∞, 0.2.0]
最小修复版本：暂无最小修复版本
组件引入路径：yarn.lock -> @nicolo-ribaudo/chokidar-2@2.1.8-no-fsevents.2 -> anymatch@2.0.0 -> micromatch@3.1.10 -> snapdragon@0.8.2 -> source-map-resolve@0.5.3 -> decode-uri-component@0.2.0
漏洞详情：https://www.oscs1024.com/hd/MPS-2022-56259