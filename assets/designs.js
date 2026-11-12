/* تصاميم المطبوعات العشرة لـ«مطاعم باب اليمن» — كلها ترسم كود QR الموقع (SITE.url) وأيقونات الحسابات من brand.js */
(function(){
  var S = window.SITE, I = window.ICONS, M = window.MENU || { sections: [] };
  var C = { brown:'#5A2814', dark:'#3E1A0B', gold:'#FDB441', orange:'#F29A1F', cream:'#FBF3E6', cream2:'#F4E6CF', paper:'#FFFDF9', muted:'#8A6A55' };
  var K = '"Reem Kufi", Tajawal, sans-serif', T = 'Tajawal, sans-serif';
  var RIB = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='40'%3E%3Crect width='48' height='40' fill='%235A2814'/%3E%3Crect y='6' width='48' height='4' fill='%23FDB441'/%3E%3Crect y='30' width='48' height='4' fill='%23FDB441'/%3E%3Cpath d='M12 13l7 7-7 7-7-7z' fill='%23FDB441'/%3E%3Cpath d='M36 13l7 7-7 7-7-7z' fill='%23FBF3E6'/%3E%3Cpath d='M24 17l3 3-3 3-3-3z' fill='%23FDB441'/%3E%3C/svg%3E";

  function load(src){ return new Promise(function(r){ var i = new Image(); i.onload = function(){ r(i); }; i.onerror = function(){ r(null); }; i.src = src; }); }
  var ready = Promise.all([
    load('assets/logo.png'), load('assets/gate.jpg'), load(RIB), load('assets/emblem.png'),
    document.fonts ? Promise.all(['800 40px Tajawal', '700 40px Tajawal', '500 40px Tajawal', '700 40px "Reem Kufi"'].map(function(f){ return document.fonts.load(f); })) : 0
  ]).then(function(a){ return { logo:a[0], gate:a[1], rib:a[2], emblem:a[3] }; });

  /* ---------- أدوات الرسم ---------- */
  function rr(ctx, x, y, w, h, r){
    ctx.beginPath(); ctx.moveTo(x+r, y); ctx.arcTo(x+w, y, x+w, y+h, r); ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r); ctx.arcTo(x, y, x+w, y, r); ctx.closePath();
  }
  function arch(ctx, x, y, w, h){ // قوس باب يمني: مستطيل رأسه نصف دائرة
    ctx.beginPath(); ctx.moveTo(x, y+h); ctx.lineTo(x, y+w/2); ctx.arc(x+w/2, y+w/2, w/2, Math.PI, 0); ctx.lineTo(x+w, y+h); ctx.closePath();
  }
  function text(ctx, s, x, y, size, o){
    o = o || {};
    ctx.font = (o.w || 700) + ' ' + Math.round(size) + 'px ' + (o.f || T);
    if (o.max){ var sz = size; while (ctx.measureText(s).width > o.max && sz > 8){ sz -= 2; ctx.font = (o.w || 700) + ' ' + Math.round(sz) + 'px ' + (o.f || T); } }
    ctx.fillStyle = o.c || C.brown; ctx.textAlign = o.a || 'center'; ctx.direction = o.ltr ? 'ltr' : 'rtl'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(s, x, y);
  }
  // شريط النقش اليمني (من زخرفة الشعار) — ارتفاعه h بالبكسل
  function band(ctx, A, x, y, w, h){
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = C.brown; ctx.fillRect(x, y, w, h);
    var k = h/40; ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = ctx.createPattern(A.rib, 'repeat'); ctx.fillRect(0, 0, w/k + 48, 40);
    ctx.restore();
  }
  function vband(ctx, A, x, y, w, h){ // شريط عمودي
    ctx.save(); ctx.translate(x + w, y); ctx.rotate(Math.PI/2); band(ctx, A, 0, 0, h, w); ctx.restore();
  }
  function frame(ctx, A, W, H, t){ band(ctx, A, 0, 0, W, t); band(ctx, A, 0, H - t, W, t); vband(ctx, A, 0, t, t, H - 2*t); vband(ctx, A, W - t, t, t, H - 2*t); }
  function img(ctx, im, cx, y, w){ if (!im) return 0; var h = w*im.height/im.width; ctx.drawImage(im, cx - w/2, y, w, h); return h; }
  function cover(ctx, im, x, y, w, h, fy){ // ملء المساحة بالصورة مع القص
    if (!im) return; var s = Math.max(w/im.width, h/im.height), sw = w/s, sh = h/s;
    ctx.drawImage(im, (im.width - sw)/2, (im.height - sh)*(fy == null ? .5 : fy), sw, sh, x, y, w, h);
  }
  function fade(ctx, x, y, w, h, color, from){
    var g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, hexA(color, from || 0)); g.addColorStop(1, hexA(color, 1));
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  }
  function hexA(h, a){ var n = parseInt(h.slice(1), 16); return 'rgba(' + (n>>16) + ',' + (n>>8&255) + ',' + (n&255) + ',' + a + ')'; }
  // قمرية صنعانية (نافذة نصف دائرية بزجاج ملوّن) — زخرفة بألوان الهوية
  function qamariya(ctx, cx, cy, r){
    ctx.save();
    ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(cx, cy, r + r*0.07, Math.PI, 0); ctx.closePath(); ctx.fill();
    var cols = [C.gold, C.orange, C.cream, C.orange, C.gold, C.orange, C.cream, C.orange, C.gold], n = cols.length;
    for (var i = 0; i < n; i++){
      ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r*0.9, Math.PI + i*Math.PI/n, Math.PI + (i+1)*Math.PI/n); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = C.paper; ctx.lineWidth = r*0.035;
    for (i = 0; i <= n; i++){ var t = Math.PI + i*Math.PI/n; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(t)*r*0.9, cy + Math.sin(t)*r*0.9); ctx.stroke(); }
    ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(cx, cy, r*0.34, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(cx, cy, r*0.24, Math.PI, 0); ctx.closePath(); ctx.fill();
    for (i = 0; i < 13; i++){ var a2 = Math.PI + (i + .5)*Math.PI/13; ctx.fillStyle = i % 2 ? C.gold : C.cream;
      ctx.beginPath(); ctx.arc(cx + Math.cos(a2)*r*0.97, cy + Math.sin(a2)*r*0.97, r*0.035, 0, Math.PI*2); ctx.fill(); }
    ctx.strokeStyle = C.paper; ctx.lineWidth = r*0.02; ctx.beginPath(); ctx.arc(cx, cy, r*0.9, Math.PI, 0); ctx.stroke();
    ctx.restore();
  }
  function socials(){ return S.socials.filter(function(s){ return s.url; }); }
  function icon(ctx, name, cx, cy, r, o){
    o = o || {};
    ctx.fillStyle = o.bg || C.brown; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
    if (o.ring !== false){ ctx.strokeStyle = o.ring || C.gold; ctx.lineWidth = r*0.08; ctx.beginPath(); ctx.arc(cx, cy, r*0.86, 0, Math.PI*2); ctx.stroke(); }
    ctx.save(); var s = r*(o.scale || 1)/24; ctx.translate(cx - 12*s, cy - 12*s); ctx.scale(s, s);
    ctx.fillStyle = o.fg || C.cream; ctx.fill(new Path2D(I[name]), name === 'imo' ? 'evenodd' : 'nonzero'); ctx.restore();
  }
  function iconRow(ctx, cx, cy, r, gap, o){ // من اليمين إلى اليسار بترتيب brand.js
    var list = socials(), w = list.length*2*r + (list.length - 1)*gap, x = cx + w/2 - r;
    list.forEach(function(s, i){ icon(ctx, s.id, x - i*(2*r + gap), cy, r, o); });
  }
  function qr(ctx, x, y, size, o){ // كود الموقع داخل إطار ذهبي
    o = o || {}; var p = o.pad == null ? size*0.03 : o.pad;
    if (o.frame !== false){ ctx.fillStyle = o.frame || C.gold; rr(ctx, x - p, y - p, size + 2*p, size + 2*p, size*0.09); ctx.fill(); }
    return window.paintBrandQR(ctx, S.url, x, y, size, { quiet:2, dark:o.dark, eye:o.eye });
  }
  function local(n){ return n.replace(/^967/, ''); }
  function dashed(ctx, x1, y1, x2, y2, c, w, d){ ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.setLineDash(d || [w*3, w*3]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); }

  /* ---------- التصاميم ---------- */
  var D = [];

  // 1) غلاف المنيو A4
  D.push({ id:'menu-cover', title:'غلاف المنيو', size:'A4 عمودي', W:1240, H:1754, draw:function(ctx, W, H, A){
    ctx.fillStyle = C.brown; ctx.fillRect(0, 0, W, H);
    band(ctx, A, 0, 60, W, 56); band(ctx, A, 0, H - 116, W, 56);
    var ax = 150, aw = W - 300, ay = 190, ah = H - 380;
    ctx.fillStyle = C.gold; arch(ctx, ax - 14, ay - 14, aw + 28, ah + 28); ctx.fill();
    ctx.fillStyle = C.cream; arch(ctx, ax, ay, aw, ah); ctx.fill();
    ctx.save(); arch(ctx, ax, ay, aw, ah); ctx.clip(); cover(ctx, A.gate, ax, ay, aw, 520, .35); fade(ctx, ax, ay + 160, aw, 362, C.cream, 0); ctx.restore();
    var y = 450; y += img(ctx, A.logo, W/2, y, 540) + 130;
    text(ctx, 'قائمة الطعام', W/2, y, 104, { f:K, c:C.brown }); y += 54;
    ctx.save(); ctx.letterSpacing = '14px'; text(ctx, 'M E N U', W/2, y, 30, { c:C.muted, ltr:true }); ctx.restore();
    var qs = 300; y += 60;
    return qr(ctx, (W - qs)/2, y, qs).then(function(){
      text(ctx, 'امسح الكود للمنيو وحساباتنا', W/2, y + qs + 62, 34, { w:800 });
      text(ctx, S.tagline, W/2, H - 134, 32, { c:C.gold, w:700 });
    });
  }});

  // 2) صفحة المنيو A4
  D.push({ id:'menu-page', title:'صفحة المنيو', size:'A4 عمودي', W:1240, H:1754, draw:function(ctx, W, H, A){
    ctx.fillStyle = C.cream; ctx.fillRect(0, 0, W, H);
    band(ctx, A, 0, 0, W, 40);
    img(ctx, A.logo, W/2, 56, 300);
    text(ctx, 'قائمتنا', W/2, 374, 72, { f:K });
    dashed(ctx, 300, 404, W - 300, 404, C.gold, 4, [2, 12]);
    var colW = 500, gx = 80, top = 450, rowH = 530;
    M.sections.slice(0, 4).forEach(function(sec, i){
      var col = i % 2, row = Math.floor(i/2), x = W - 90 - col*(colW + gx) - colW, y = top + row*rowH;
      ctx.fillStyle = C.brown; rr(ctx, x, y, colW, 74, 37); ctx.fill();
      text(ctx, sec.title, x + colW/2, y + 51, 38, { c:C.gold, w:800, max:colW - 40 });
      sec.items.slice(0, 6).forEach(function(it, j){
        var iy = y + 150 + j*76;
        text(ctx, it[0], x + colW, iy, 34, { a:'right', w:700, max:colW - 160 });
        var nameW = ctx.measureText(it[0]).width;
        ctx.font = '800 32px Tajawal'; var price = it[1] ? it[1] + ' ' + (M.currency || '') : '';
        var pw = price ? ctx.measureText(price).width : 90;
        dashed(ctx, x + pw + 18, iy - 8, x + colW - nameW - 18, iy - 8, C.muted, 3, [2, 9]);
        if (price) text(ctx, price, x, iy, 32, { a:'left', w:800, c:C.orange, ltr:false });
      });
    });
    var fy = H - 300; ctx.fillStyle = C.brown; ctx.fillRect(0, fy, W, 300); band(ctx, A, 0, fy, W, 24);
    var qs = 200;
    return qr(ctx, 90, fy + 58, qs, { pad:8 }).then(function(){
      text(ctx, 'امسح الكود لحساباتنا', W - 90, fy + 105, 40, { a:'right', c:C.cream, w:800 });
      text(ctx, 'التوصيل: ' + S.delivery.map(local).join('  ·  '), W - 90, fy + 172, 30, { a:'right', c:C.gold, w:800, max:760 });
      var list = socials(), r = 26; list.forEach(function(s, i){ icon(ctx, s.id, W - 90 - r - i*(2*r + 14), fy + 236, r, { bg:C.cream, fg:C.brown, ring:C.gold }); });
    });
  }});

  // 3) ستاند طاولة يُطوى (وجهان متقابلان)
  function tentPanel(ctx, A, W, H){
    ctx.fillStyle = C.cream; ctx.fillRect(0, 0, W, H);
    vband(ctx, A, W - 46, 0, 46, H); vband(ctx, A, 0, 0, 46, H);
    var qs = 500, qx = 120, qy = (H - qs)/2;
    return qr(ctx, qx, qy, qs, { pad:16 }).then(function(){
      var cx = 120 + qs + (W - 46 - 120 - qs)/2 + 10, y = 120;
      y += img(ctx, A.logo, cx, y, 420) + 100;
      text(ctx, 'امسح الكود', cx, y, 74, { f:K }); y += 64;
      text(ctx, 'المنيو · التوصيل · حساباتنا', cx, y, 34, { c:C.muted, w:700 }); y += 92;
      var list = socials(), r = 34, gap = 14, w = list.length*2*r + (list.length - 1)*gap;
      list.forEach(function(s, i){ icon(ctx, s.id, cx + w/2 - r - i*(2*r + gap), y, r); });
    });
  }
  D.push({ id:'table-tent', title:'ستاند طاولة يُطوى', size:'A4 — يُطوى من المنتصف', W:1240, H:1754, draw:function(ctx, W, H, A){
    var h = H/2;
    return tentPanel(ctx, A, W, h).then(function(){
      // الوجه الثاني مقلوبًا في النصف العلوي
      var tmp = document.createElement('canvas'); tmp.width = W; tmp.height = h;
      var t = tmp.getContext('2d'); t.drawImage(ctx.canvas, 0, 0, W, h, 0, 0, W, h);
      ctx.save(); ctx.translate(W, h); ctx.rotate(Math.PI); ctx.drawImage(tmp, 0, 0); ctx.restore();
      ctx.save(); ctx.translate(0, h); return tentPanel(ctx, A, W, h).then(function(){ ctx.restore(); dashed(ctx, 0, h, W, h, C.muted, 3, [18, 12]); });
    });
  }});

  // 4) ملصق طاولة دائري
  D.push({ id:'round-sticker', title:'ملصق طاولة دائري', size:'دائري 1200', W:1200, H:1200, transparent:true, draw:function(ctx, W, H, A){
    var c = W/2;
    ctx.fillStyle = C.brown; ctx.beginPath(); ctx.arc(c, c, c, 0, Math.PI*2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(c, c, c - 20, 0, Math.PI*2); ctx.arc(c, c, c - 80, 0, Math.PI*2, true); ctx.clip();
    ctx.translate(c, c); for (var i = 0; i < 36; i++){ ctx.rotate(Math.PI*2/36); ctx.fillStyle = i % 2 ? C.gold : C.cream;
      ctx.beginPath(); ctx.moveTo(c - 50, 0); ctx.lineTo(c - 35, -15); ctx.lineTo(c - 20, 0); ctx.lineTo(c - 35, 15); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    ctx.fillStyle = C.paper; ctx.beginPath(); ctx.arc(c, c, c - 96, 0, Math.PI*2); ctx.fill();
    text(ctx, 'امسح وتابعنا', c, 250, 66, { f:K });
    var qs = 520;
    return qr(ctx, c - qs/2, 300, qs, { pad:14 }).then(function(){
      iconRow(ctx, c, 300 + qs + 92, 34, 14);
      text(ctx, S.name, c, 300 + qs + 190, 40, { w:800, c:C.muted });
    });
  }});

  // 5) ملصق الباب / الواجهة الزجاجية
  D.push({ id:'door', title:'ملصق الباب والواجهة', size:'1200 × 1600', W:1200, H:1600, draw:function(ctx, W, H, A){
    ctx.fillStyle = C.brown; ctx.fillRect(0, 0, W, H);
    frame(ctx, A, W, H, 34);
    qamariya(ctx, W/2, 380, 290);
    text(ctx, 'أهلًا وسهلًا', W/2, 520, 110, { f:K, c:C.gold });
    ctx.fillStyle = C.paper; rr(ctx, 170, 580, W - 340, 860, 48); ctx.fill();
    img(ctx, A.logo, W/2, 620, 420);
    var qs = 420;
    return qr(ctx, (W - qs)/2, 830, qs, { pad:12 }).then(function(){
      text(ctx, 'تابعونا على حساباتنا', W/2, 1330, 42, { w:800 });
      iconRow(ctx, W/2, 1395, 30, 14);
      text(ctx, 'التوصيل  ' + S.delivery.map(local).join('  ·  '), W/2, 1520, 36, { c:C.cream, w:800, max:W - 140 });
    });
  }});

  // 6) كرت زيارة بوجهين (85×55 مم تقريبًا)
  D.push({ id:'card', title:'كرت زيارة بوجهين', size:'وجهان 1050 × 600', W:1050, H:1290, draw:function(ctx, W, H, A){
    ctx.fillStyle = '#EDE3D2'; ctx.fillRect(0, 0, W, H);
    // الوجه الأمامي
    ctx.fillStyle = C.cream; ctx.fillRect(0, 0, W, 600);
    vband(ctx, A, W - 40, 0, 40, 600);
    img(ctx, A.logo, (W - 40)/2, 64, 480);
    text(ctx, S.tagline, (W - 40)/2, 520, 36, { c:C.muted, w:700 });
    // الوجه الخلفي
    var y0 = 690; ctx.fillStyle = C.brown; ctx.fillRect(0, y0, W, 600); band(ctx, A, 0, y0 + 560, W, 40);
    var qs = 360;
    return qr(ctx, 70, y0 + 90, qs, { pad:10 }).then(function(){
      var x = W - 70;
      text(ctx, 'خدمة التوصيل', x, y0 + 120, 40, { a:'right', c:C.gold, w:800 });
      S.delivery.forEach(function(n, i){ text(ctx, local(n), x, y0 + 185 + i*54, 40, { a:'right', c:C.cream, w:800, ltr:true }); });
      text(ctx, 'الشكاوى والملاحظات', x, y0 + 380, 30, { a:'right', c:C.gold, w:700 });
      text(ctx, (S.support || []).map(local).join(' · '), x, y0 + 428, 36, { a:'right', c:C.cream, w:800, ltr:true });
      var list = socials(), r = 22; list.forEach(function(s, i){ icon(ctx, s.id, x - r - i*(2*r + 10), y0 + 498, r, { bg:C.cream, fg:C.brown }); });
      text(ctx, 'خط القصّ بين الوجهين', W/2, 655, 22, { c:C.muted, w:500 });
    });
  }});

  // 7) ملصق كيس وعلبة التوصيل
  D.push({ id:'delivery', title:'ملصق كيس التوصيل', size:'مربع 1000', W:1000, H:1000, draw:function(ctx, W, H, A){
    ctx.fillStyle = C.brown; rr(ctx, 0, 0, W, H, 60); ctx.fill();
    ctx.fillStyle = C.paper; rr(ctx, 28, 28, W - 56, H - 56, 40); ctx.fill();
    band(ctx, A, 28, 28, W - 56, 36);
    text(ctx, 'شكرًا لاختياركم', W/2, 165, 74, { f:K });
    img(ctx, A.logo, W/2, 200, 340);
    var qs = 330, qy = 470;
    return qr(ctx, 90, qy, qs, { pad:10 }).then(function(){
      var x = W - 90;
      text(ctx, 'اطلبونا مرة أخرى', x, qy + 40, 40, { a:'right', w:800 });
      S.delivery.forEach(function(n, i){
        icon(ctx, 'phone', x - 22, qy + 96 + i*66, 22, { ring:false });
        text(ctx, local(n), x - 60, qy + 110 + i*66, 40, { a:'right', w:800, ltr:true });
      });
      text(ctx, 'امسح الكود لحساباتنا', x, qy + 320, 28, { a:'right', c:C.muted, w:700 });
      iconRow(ctx, W/2, H - 100, 28, 14);
    });
  }});

  // 8) ورقة الصينية / مفرش الطاولة
  D.push({ id:'tray', title:'ورقة الصينية', size:'A4 أفقي', W:1754, H:1240, draw:function(ctx, W, H, A){
    ctx.fillStyle = C.cream; ctx.fillRect(0, 0, W, H);
    frame(ctx, A, W, H, 40);
    // يمين: قوس فيه صورة باب اليمن والشعار
    var ax = W - 120 - 560, ay = 120, aw = 560, ah = H - 240;
    ctx.fillStyle = C.gold; arch(ctx, ax - 10, ay - 10, aw + 20, ah + 20); ctx.fill();
    ctx.save(); arch(ctx, ax, ay, aw, ah); ctx.clip(); ctx.fillStyle = C.brown; ctx.fillRect(ax, ay, aw, ah);
    cover(ctx, A.gate, ax, ay, aw, 640, .3); fade(ctx, ax, ay + 320, aw, 322, C.brown, 0); ctx.restore();
    ctx.fillStyle = C.paper; rr(ctx, ax + 70, ay + 600, aw - 140, 290, 30); ctx.fill();
    img(ctx, A.logo, ax + aw/2, ay + 622, 320);
    text(ctx, S.tagline, ax + aw/2, ay + ah - 50, 36, { c:C.gold, w:800 });
    // الوسط: حسابات التواصل بأسمائها
    var mx = 820, y = 190;
    text(ctx, 'تابعونا', mx, y, 80, { f:K }); y += 40;
    socials().forEach(function(s, i){
      var yy = y + 70 + i*112;
      ctx.fillStyle = C.paper; rr(ctx, mx - 230, yy - 46, 460, 92, 46); ctx.fill();
      icon(ctx, s.id, mx + 230 - 46, yy, 38);
      text(ctx, s.label, mx + 120, yy + 13, 38, { a:'right', w:800 });
    });
    // يسار: الكود والتوصيل
    var qs = 360, qx = 130, qy = 200;
    return qr(ctx, qx, qy, qs, { pad:12 }).then(function(){
      text(ctx, 'امسح الكود', qx + qs/2, qy + qs + 70, 44, { w:800 });
      ctx.fillStyle = C.brown; rr(ctx, qx - 20, qy + qs + 120, qs + 40, 330, 30); ctx.fill();
      text(ctx, 'خدمة التوصيل', qx + qs/2, qy + qs + 190, 38, { c:C.gold, w:800 });
      S.delivery.forEach(function(n, i){ text(ctx, local(n), qx + qs/2, qy + qs + 255 + i*60, 42, { c:C.cream, w:800, ltr:true }); });
    });
  }});

  // 9) ذيل فاتورة الطابعة الحرارية (80 مم) — أبيض وأسود
  D.push({ id:'receipt', title:'ذيل الفاتورة الحرارية', size:'80 مم — أبيض وأسود', W:576, H:900, draw:function(ctx, W, H, A){
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.filter = 'grayscale(1) contrast(1.35)'; img(ctx, A.logo, W/2, 20, 260); ctx.restore();
    dashed(ctx, 30, 238, W - 30, 238, '#000', 3, [8, 8]);
    text(ctx, 'شكرًا لزيارتكم', W/2, 310, 44, { f:K, c:'#000' });
    var qs = 330;
    return window.paintBrandQR(ctx, S.url, (W - qs)/2, 340, qs, { quiet:2, dark:'#000', eye:'#000' }).then(function(){
      text(ctx, 'امسح الكود لحساباتنا والمنيو', W/2, 712, 28, { c:'#000', w:800 });
      text(ctx, 'التوصيل', W/2, 768, 28, { c:'#000', w:800 });
      text(ctx, S.delivery.map(local).join(' · '), W/2, 812, 26, { c:'#000', w:800, ltr:true, max:W - 40 });
      dashed(ctx, 30, 860, W - 30, 860, '#000', 3, [8, 8]);
    });
  }});

  // 10) ستوري «اطلب الآن» مع أرقام التوصيل
  D.push({ id:'order-story', title:'ستوري «اطلب الآن»', size:'ستوري 1080 × 1920', W:1080, H:1920, draw:function(ctx, W, H, A){
    ctx.fillStyle = C.brown; ctx.fillRect(0, 0, W, H);
    cover(ctx, A.gate, 0, 0, W, 760, .35); fade(ctx, 0, 200, W, 562, C.brown, 0);
    ctx.fillStyle = C.paper; rr(ctx, 270, 100, W - 540, 390, 40); ctx.fill();
    img(ctx, A.logo, W/2, 125, 440);
    text(ctx, 'اطلب الآن', W/2, 680, 150, { f:K, c:C.gold });
    text(ctx, 'نوصّل لك أشهى المأكولات اليمنية', W/2, 752, 42, { c:C.cream, w:700 });
    S.delivery.forEach(function(n, i){
      var y = 810 + i*128;
      ctx.fillStyle = C.cream; rr(ctx, 170, y, W - 340, 104, 52); ctx.fill();
      icon(ctx, 'phone', W - 170 - 52, y + 52, 38, { bg:C.gold, fg:C.brown, ring:false });
      text(ctx, local(n), W/2 - 30, y + 70, 56, { w:800, ltr:true });
    });
    text(ctx, 'الشكاوى: ' + (S.support || []).map(local).join(' · '), W/2, 1252, 36, { c:C.gold, w:800 });
    var qs = 320, qy = 1312;
    return qr(ctx, (W - qs)/2, qy, qs, { pad:12 }).then(function(){
      text(ctx, 'امسح لكل حساباتنا', W/2, qy + qs + 72, 40, { c:C.cream, w:800 });
      iconRow(ctx, W/2, qy + qs + 150, 34, 16, { bg:C.cream, fg:C.brown });
    });
  }});

  window.BAB_DESIGNS = {
    list: D,
    render: function(d, canvas){
      return ready.then(function(A){
        canvas.width = d.W; canvas.height = d.H;
        var ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, d.W, d.H);
        return Promise.resolve(d.draw(ctx, d.W, d.H, A)).then(function(){ return canvas; });
      });
    }
  };
})();
