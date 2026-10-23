/* رسم كود QR بهوية «باب اليمن»: وحدات بنية مستديرة الحواف، عيون مستديرة، وشعار البوابة في الوسط */
(function(){
  var emblem = new Image();
  var emblemReady = new Promise(function(res){ emblem.onload = res; emblem.onerror = res; });
  emblem.src = (document.currentScript && document.currentScript.src || '').replace(/qr-draw\.js.*$/, 'emblem.png');

  function rr(ctx, x, y, w, h, r){
    ctx.beginPath(); ctx.moveTo(x+r, y); ctx.arcTo(x+w, y, x+w, y+h, r); ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r); ctx.arcTo(x, y, x+w, y, r); ctx.closePath();
  }

  // يرسم داخل مربع (x,y,size) على سياق موجود — تستعمله صفحة التصميم أيضًا
  function paintQR(ctx, url, x, y, size, opt){
    opt = opt || {};
    // مركز العين يجب أن يبقى داكنًا: الذهبي الفاتح يُقرأ أبيض فيتعطّل المسح
    var dark = opt.dark || '#5A2814', eye = opt.eye || '#3E1A0B', light = opt.light || '#FFFFFF';
    var qr = qrcode(0, 'H'); qr.addData(url); qr.make();
    var n = qr.getModuleCount(), quiet = opt.quiet == null ? 2 : opt.quiet;
    var m = size / (n + quiet*2), ox = x + quiet*m, oy = y + quiet*m;

    if (!opt.transparent){ ctx.fillStyle = light; rr(ctx, x, y, size, size, size*0.06); ctx.fill(); }

    // منطقة الشعار في الوسط (تتحمّلها درجة التصحيح H)
    var ew = Math.round(n*0.34), eh = Math.round(ew*292/688) + 2;
    if ((n - ew) % 2) ew++; if ((n - eh) % 2) eh++;
    var ec = (n - ew)/2, er = (n - eh)/2;
    var inEye = function(r, c){ return (r < 7 && c < 7) || (r < 7 && c >= n-7) || (r >= n-7 && c < 7); };
    var inLogo = function(r, c){ return r >= er-1 && r < er+eh+1 && c >= ec-1 && c < ec+ew+1; };

    ctx.fillStyle = dark;
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++){
      if (!qr.isDark(r, c) || inEye(r, c) || inLogo(r, c)) continue;
      // مربعات كاملة بحواف مستديرة قليلًا — النقاط الدائرية تُضعف قراءة بعض الماسحات
      rr(ctx, ox + c*m, oy + r*m, m, m, m*0.25); ctx.fill();
    }
    [[0,0],[0,n-7],[n-7,0]].forEach(function(p){
      var ex = ox + p[1]*m, ey = oy + p[0]*m;
      ctx.fillStyle = dark; rr(ctx, ex, ey, 7*m, 7*m, 2.2*m); ctx.fill();
      ctx.fillStyle = opt.transparent ? '#FFFFFF' : light; rr(ctx, ex+m, ey+m, 5*m, 5*m, 1.5*m); ctx.fill();
      ctx.fillStyle = eye; rr(ctx, ex+2*m, ey+2*m, 3*m, 3*m, 1*m); ctx.fill();
    });
    if (emblem.naturalWidth){
      var w = ew*m, h = w*292/688;
      ctx.drawImage(emblem, ox + ec*m, oy + (n*m - h)/2, w, h);
    }
  }

  window.paintBrandQR = function(ctx, url, x, y, size, opt){
    return emblemReady.then(function(){ paintQR(ctx, url, x, y, size, opt); });
  };
  window.drawBrandQR = function(canvas, url, opt){
    opt = opt || {}; var s = opt.size || canvas.width;
    canvas.width = canvas.height = s;
    var ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, s, s);
    return window.paintBrandQR(ctx, url, 0, 0, s, opt);
  };
})();
