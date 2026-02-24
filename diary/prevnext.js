// 自动在日记页插入“上一篇 / 下一篇”按钮
(function(){
  try{
    
    if(document.querySelector('.prevnext')) return; // 避免重复

    var indexHref = '../index.html';
    var baseForResolve = new URL(indexHref, location.href); // resolves to /diary/index.html

    fetch(indexHref).then(function(res){
      if(!res.ok) throw new Error('fetch index failed');
      return res.text();
    }).then(function(text){
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, 'text/html');
      // 优先按表格行解析：第一列为链接，第三列（第二个 td）为标题
      var rows = Array.from(doc.querySelectorAll('.diary table tbody tr'));
      var entries = [];
      if(rows.length){
        entries = rows.map(function(tr){
          var a = tr.querySelector('th a') || tr.querySelector('a');
          var href = a ? (a.getAttribute('href') || '') : '';
          var tds = tr.querySelectorAll('td');
          var title = '';
          if(tds && tds.length >= 2){
            title = (tds[1].innerText || '').trim().replace(/\s+/g,' ');
          }
          if(!title && a) title = (a.textContent || '').trim().replace(/\s+/g,' ');
          try{
            var path = new URL(href, baseForResolve).pathname.replace(/\\/g, '/');
            return { path: path, title: title };
          }catch(e){
            return null;
          }
        }).filter(Boolean);
      }else{
        var anchors = Array.from(doc.querySelectorAll('.diary a'));
        entries = anchors.map(function(a){
          var href = a.getAttribute('href') || '';
          var title = (a.textContent || '').trim().replace(/\s+/g,' ');
          try{
            var path = new URL(href, baseForResolve).pathname.replace(/\\/g, '/');
            return { path: path, title: title };
          }catch(e){
            return null;
          }
        }).filter(Boolean);
      }

      function normalize(p){
        if(!p) return p;
        if(p.endsWith('/')) return p + 'index.html';
        if(p.endsWith('/index.html')) return p;
        return p;
      }

      var cur = location.pathname.replace(/\\/g, '/');
      var candidates = [cur];
      if(cur.endsWith('/')) candidates.push(cur + 'index.html');
      else candidates.push(cur.replace(/\/index\.html$/,''), cur + '/index.html');

      var entryPaths = entries.map(function(e){ return e.path; });
      var curIdx = entryPaths.findIndex(function(p){
        var np = normalize(p);
        return candidates.some(function(c){ return normalize(c) === np; });
      });
      if(curIdx === -1) return;

      var prev = entries[curIdx - 1];
      var next = entries[curIdx + 1];

      var container = document.querySelector('.content') || document.body;
      var wrap = document.createElement('div');
      wrap.className = 'prevnext';
      wrap.style.margin = '12px 0';
      wrap.style.display = 'flex';
      wrap.style.justifyContent = 'space-between';

      function makeLink(obj, isPrev){
        var a = document.createElement('a');
        a.href = obj.path || '#';
        var t = obj.title || obj.path || '';
        a.textContent = (isPrev ? '« 上一篇：' : '下一篇：') + t;
        a.className = 'btn prevnext-btn';
        return a;
      }

      wrap.appendChild(prev ? makeLink(prev, true) : document.createElement('span'));
      wrap.appendChild(next ? makeLink(next, false) : document.createElement('span'));

      // 插入在内容顶部（如已有标题则在其前）
      var first = container.firstElementChild;
      container.insertBefore(wrap, first);

      // 简单样式（与 site style 协调）
      var style = document.createElement('style');
      style.textContent = '\n.prevnext-btn{background:#00ffbf;border:1px solid #ccc;padding:6px 10px;border-radius:4px;text-decoration:none;color:#222}\n.dark-mode .prevnext-btn{background:#222;border-color:#444;color:#00ffbf}\n.prevnext{gap:12px}\n';
      document.head.appendChild(style);
    }).catch(function(err){
      console && console.log && console.log('prevnext.js load error', err);
    });
  }catch(e){ console && console.log && console.log('prevnext.js err', e); }
})();
