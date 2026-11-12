/* حفظ صورة من canvas: على الآيفون والجوال تُفتح نافذة المشاركة (فيها «حفظ الصورة» إلى الصور)،
   وعلى الكمبيوتر — ومنه ماك — تُنزَّل الصورة ملفًّا. */
(function(){
  var touch = window.matchMedia && matchMedia('(hover:none) and (pointer:coarse)').matches;
  function download(blob, name){
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000);
  }
  window.saveCanvas = function(canvas, name){
    return new Promise(function(done){
      canvas.toBlob(function(blob){
        var file = null;
        try { file = new File([blob], name, { type:'image/png' }); } catch(e){}
        if (touch && file && navigator.canShare && navigator.canShare({ files:[file] })){
          navigator.share({ files:[file] }).then(done, function(err){
            if (err && err.name === 'AbortError') return done(); // أغلق المستخدم النافذة
            download(blob, name); done();
          });
        } else { download(blob, name); done(); }
      }, 'image/png');
    });
  };
})();
