/* 简单评论板：在每篇日记页面中寻找 #talk-board 并渲染评论 UI
   存储：localStorage，键为 'comments:' + location.pathname
   功能：发布、显示、删除（本地、即时），对输入做简单转义防 XSS
*/
(function(){
    function escapeHtml(s){
        return String(s).replace(/[&<>"']/g, function(c){
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
        });
    }

    // sanitize user-provided HTML using a small whitelist
    function sanitizeHtml(dirty){
        if(!dirty) return '';
        var tmp = document.createElement('div');
        // convert newlines to <br> so plaintext line breaks are preserved
        var withBreaks = String(dirty).replace(/\n/g,'<br>');
        tmp.innerHTML = withBreaks;

        var defaultWhitelist = {
            'b': ['class'], 'i': ['class'], 'em': ['class'], 'strong': ['class'], 'a': ['href','title','class','style'],
            'code': ['class','style'], 'pre': ['class','style'], 'br': [], 'p': ['class','style'], 'ul': ['class'], 'ol': ['class'], 'li': ['class','style'], 'span': ['class','style']
        };

        // Build effective whitelist by merging defaults with optional user config:
        // - window.TALK_ALLOWED_TAGS: array or comma/space-separated string of tags to allow (extends/replaces defaults if provided)
        // - window.TALK_ALLOWED_ATTRS: object mapping tag -> array of allowed attributes to add
        var whitelist = {};
        var userTags = window.TALK_ALLOWED_TAGS;
        if(userTags){
            var tags = Array.isArray(userTags) ? userTags : String(userTags).split(/\s*,\s*|\s+/);
            tags.forEach(function(t){
                t = String(t).toLowerCase();
                whitelist[t] = defaultWhitelist[t] ? defaultWhitelist[t].slice() : [];
            });
        }else{
            for(var k in defaultWhitelist) if(defaultWhitelist.hasOwnProperty(k)) whitelist[k] = defaultWhitelist[k].slice();
        }

        // Merge user-provided attribute map
        var userAttrMap = window.TALK_ALLOWED_ATTRS;
        if(userAttrMap && typeof userAttrMap === 'object'){
            Object.keys(userAttrMap).forEach(function(tag){
                var arr = Array.isArray(userAttrMap[tag]) ? userAttrMap[tag] : String(userAttrMap[tag]).split(/\s*,\s*|\s+/);
                whitelist[tag] = (whitelist[tag] || []).concat(arr);
            });
        }

        // dedupe attributes lists
        Object.keys(whitelist).forEach(function(tag){
            var seen = {};
            whitelist[tag] = (whitelist[tag] || []).filter(function(a){ a = String(a).toLowerCase(); if(seen[a]) return false; seen[a]=true; return true; });
        });

        function sanitizeStyle(v){
            if(!v) return '';
            var parts = String(v).split(';');
            var allowed = ['color','background-color','font-weight','font-style','text-decoration','font-size'];
            var out = [];
            parts.forEach(function(p){
                var kv = p.split(':');
                if(kv.length < 2) return;
                var prop = kv[0].trim().toLowerCase();
                var val = kv.slice(1).join(':').trim();
                if(allowed.indexOf(prop) === -1) return;
                var low = val.toLowerCase();
                if(/url\(|expression|javascript:|<|>/.test(low)) return;
                // allow hex, named colors, rgb/rgba, numbers with units
                var ok = false;
                if(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(val)) ok = true;
                else if(/^[a-z]+$/i.test(val)) ok = true;
                else if(/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i.test(val)) ok = true;
                else if(/^[-+]?\d+(?:px|em|rem|%)?$/.test(val)) ok = true;
                if(ok) out.push(prop+':'+val);
            });
            return out.join(';');
        }

        function clean(node){
            var nodeType = node.nodeType;
            if(nodeType === 3) return; // text node ok
            if(nodeType !== 1) return; // skip non-element non-text

            var name = node.nodeName.toLowerCase();
            if(!whitelist.hasOwnProperty(name)){
                // replace disallowed element with its text content
                var txt = document.createTextNode(node.textContent);
                node.parentNode.replaceChild(txt, node);
                return;
            }

            // sanitize attributes
            var allowedAttrs = whitelist[name];
            var attrs = Array.prototype.slice.call(node.attributes || []);
            attrs.forEach(function(a){
                var an = a.name.toLowerCase();
                if(allowedAttrs.indexOf(an) === -1){
                    node.removeAttribute(a.name);
                }else{
                    if(an === 'href'){
                        var v = node.getAttribute('href') || '';
                        if(!/^(https?:|mailto:|\/|#)/i.test(v)){
                            node.removeAttribute('href');
                        }
                    }else if(an === 'class'){
                        var cv = node.getAttribute('class') || '';
                        // allow only letters, numbers, dash, underscore and spaces
                        if(!/^[A-Za-z0-9_\- ]*$/.test(cv)) node.removeAttribute('class');
                    }else if(an === 'style'){
                        var sv = node.getAttribute('style') || '';
                        var cleaned = sanitizeStyle(sv);
                        if(cleaned) node.setAttribute('style', cleaned);
                        else node.removeAttribute('style');
                    }
                }
            });

            // recurse children (copy snapshot because cleaning may modify childNodes)
            var children = Array.prototype.slice.call(node.childNodes);
            children.forEach(clean);
        }

        var children = Array.prototype.slice.call(tmp.childNodes);
        children.forEach(clean);
        return tmp.innerHTML;
    }

    // small helper to call backend if configured
    function useBackend(){ return typeof window.COMMENTS_API === 'string' && window.COMMENTS_API.length>0; }

    document.addEventListener('DOMContentLoaded', function(){
        var board = document.getElementById('talk-board');
        if(!board) return;

        var key = 'comments:' + location.pathname;

        var style = document.createElement('style');
        style.textContent = '#talk-board .tb{border:1px solid #ddd;padding:12px;border-radius:6px;margin-top:12px;background:#fff}#talk-board form input,#talk-board form textarea{width:100%;box-sizing:border-box;padding:8px;margin:6px 0;border:1px solid #ccc;border-radius:4px}#talk-board .comment{border-top:1px solid #f0f0f0;padding:8px 0}#talk-board .meta{font-size:12px;color:#666}#talk-board .del{color:#c00;cursor:pointer;margin-left:8px}';
        document.head.appendChild(style);

        // local storage functions
        function loadLocal(){ try{ return JSON.parse(localStorage.getItem(key) || '[]'); }catch(e){ return []; } }
        function saveLocal(arr){ localStorage.setItem(key, JSON.stringify(arr)); }

        var comments = loadLocal();

        function renderComment(c, idx){
            var name = escapeHtml(c.name || '匿名');
            var time = new Date(c.t).toLocaleString();
            var body = sanitizeHtml(c.text);
            var delHtml = '';
            try{
                // When using Supabase, do not show delete UI by default to avoid allowing anonymous deletes.
                // To intentionally enable client-side deletes with Supabase, set `window.SUPABASE_ALLOW_DELETE = true` before loading talk.js.
                if(!(useSupabase() && !window.SUPABASE_ALLOW_DELETE)){
                    delHtml = '<span class="del" data-i="'+idx+'">删除</span>';
                }
            }catch(e){ /* ignore */ }
            return '<div class="comment" data-i="'+idx+'">'
                +'<div class="meta">'+name+' · '+time + (delHtml ? delHtml : '') +'</div>'
                +'<div class="body">'+body+'</div>'
                +'</div>';
        }

        var html = '<div class="tb">'
            +'<form id="talk-form">'
            +'<input id="talk-name" placeholder="昵称（可选）" maxlength="40">'
            +'<textarea id="talk-text" placeholder="写下你的评论..." rows="4" required></textarea>'
            +'<button type="submit">发布评论</button>'
            +'</form>'
            +'<div id="talk-list">';

        comments.forEach(function(c,i){ html += renderComment(c,i); });

        html += '</div></div>';
        board.innerHTML = html;

        var form = document.getElementById('talk-form');
        var list = document.getElementById('talk-list');

        // Backend API helpers (custom backend)
        function apiGet(){
            return fetch(window.COMMENTS_API + '/comments?path=' + encodeURIComponent(location.pathname)).then(function(r){ return r.json(); });
        }
        function apiPost(payload){
            return fetch(window.COMMENTS_API + '/comments', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).then(function(r){ return r.json(); });
        }
        function apiDelete(id){
            return fetch(window.COMMENTS_API + '/comments/' + encodeURIComponent(id), {method:'DELETE'}).then(function(r){ return r.json(); });
        }

        // Supabase support (serverless). If you set window.SUPABASE_URL and window.SUPABASE_KEY,
        // talk.js will use Supabase REST API. You must create a table `comments` with columns:
        // id (text, primary key), path (text), name (text), text (text), t (bigint)
        function useSupabase(){ return typeof window.SUPABASE_URL === 'string' && typeof window.SUPABASE_KEY === 'string' && window.SUPABASE_URL && window.SUPABASE_KEY; }
        function supabaseHeaders(){ return { 'apikey': window.SUPABASE_KEY, 'Authorization': 'Bearer ' + window.SUPABASE_KEY, 'Content-Type':'application/json' }; }
        function apiGetSupabase(){
            var url = window.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/comments?path=eq.' + encodeURIComponent(location.pathname) + '&select=*';
            return fetch(url, { headers: supabaseHeaders() }).then(function(r){ return r.json(); });
        }
        function apiPostSupabase(payload){
            var url = window.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/comments';
            return fetch(url, { method: 'POST', headers: Object.assign({'Prefer':'return=representation'}, supabaseHeaders()), body: JSON.stringify(payload.comment || payload) }).then(function(r){ return r.json(); });
        }
        function apiDeleteSupabase(id){
            var url = window.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/comments?id=eq.' + encodeURIComponent(id);
            return fetch(url, { method: 'DELETE', headers: supabaseHeaders() }).then(function(r){ return r.json(); });
        }

        // If Supabase configured, load from Supabase; else if backend configured, load from backend and render
        if(useSupabase()){ apiGetSupabase().then(function(data){ comments = Array.isArray(data)?data:[]; var s=''; comments.forEach(function(c,i){ s+=renderComment(c,i); }); list.innerHTML = s; }).catch(function(){ /* ignore */ }); }
        else if(useBackend()){ apiGet().then(function(data){ comments = Array.isArray(data)?data:[]; var s=''; comments.forEach(function(c,i){ s+=renderComment(c,i); }); list.innerHTML = s; }).catch(function(){ /* ignore */ }); }

        form.addEventListener('submit', function(e){
            e.preventDefault();
            var name = document.getElementById('talk-name').value.trim();
            var text = document.getElementById('talk-text').value.trim();
            if(!text) return;
            var c = { id: ('c'+Date.now()+'-'+Math.floor(Math.random()*10000)), name: name, text: text, t: Date.now() };

            if(useSupabase()){
                apiPostSupabase({ path: location.pathname, id: c.id, name: c.name, text: c.text, t: c.t }).then(function(saved){
                    return apiGetSupabase();
                }).then(function(data){ comments = Array.isArray(data)?data:[]; var s=''; comments.forEach(function(cc,i){ s+=renderComment(cc,i); }); list.innerHTML = s; }).catch(function(){ alert('发布失败（网络或服务器错误）'); });
            }else if(useBackend()){
                apiPost({ path: location.pathname, comment: c }).then(function(saved){
                    // refresh list from server
                    return apiGet();
                }).then(function(data){ comments = Array.isArray(data)?data:[]; var s=''; comments.forEach(function(cc,i){ s+=renderComment(cc,i); }); list.innerHTML = s; }).catch(function(){ alert('发布失败（网络或服务器错误）'); });
            }else{
                comments.push(c);
                saveLocal(comments);
                list.insertAdjacentHTML('beforeend', renderComment(c, comments.length-1));
            }

            form.reset();
        });

        list.addEventListener('click', function(e){
            var el = e.target;
            if(el.classList.contains('del')){
                var i = parseInt(el.getAttribute('data-i'));
                if(isNaN(i)) return;
                if(!confirm('确认删除这条评论？')) return;

                if(useSupabase()){
                    var id = comments[i] && comments[i].id;
                    if(!id) return;
                    apiDeleteSupabase(id).then(function(){ return apiGetSupabase(); }).then(function(data){ comments = Array.isArray(data)?data:[]; var s=''; comments.forEach(function(c, idx){ s += renderComment(c, idx); }); list.innerHTML = s; }).catch(function(){ alert('删除失败'); });
                }else if(useBackend()){
                    var id = comments[i] && comments[i].id;
                    if(!id) return;
                    apiDelete(id).then(function(){ return apiGet(); }).then(function(data){ comments = Array.isArray(data)?data:[]; var s=''; comments.forEach(function(c, idx){ s += renderComment(c, idx); }); list.innerHTML = s; }).catch(function(){ alert('删除失败'); });
                }else{
                    comments.splice(i,1);
                    saveLocal(comments);
                    var s = '';
                    comments.forEach(function(c, idx){ s += renderComment(c, idx); });
                    list.innerHTML = s;
                }
            }
        });
    });
})();
