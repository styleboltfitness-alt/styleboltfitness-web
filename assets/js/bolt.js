/* STYLEBOLTFITNESS · comportamiento */
(function () {
  "use strict";
  var CONFIG = { whatsapp: "56993999020", mensualidad: 35000, tz: "America/Santiago", origen: "[web]" };
  // Horario vigente: [día (0=domingo), hora, minutos, programa, color]
  var CLASES = [[1, 19, 0, "Mixta", "hong"], [3, 19, 0, "Mixta", "hong"], [5, 19, 0, "Mixta", "hong"],
                [2, 9, 0, "Solo mujeres", "chung"], [4, 9, 0, "Solo mujeres", "chung"], [6, 9, 0, "Solo mujeres", "chung"]];
  var DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  var DUR = 60; // minutos de clase

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function safe(f) { try { f(); } catch (e) { if (window.console) console.warn(e); } }
  function wa(t) { return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(t + " " + CONFIG.origen); }
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  safe(function () { $("#year").textContent = new Date().getFullYear(); });

  // WhatsApp con mensaje según el botón
  safe(function () {
    $$("[data-wa]").forEach(function (a) { a.href = wa(a.getAttribute("data-wa")); a.target = "_blank"; a.rel = "noopener"; });
  });

  // Menú móvil
  safe(function () {
    var b = $(".burger"), m = $("#menu");
    function set(o) { b.setAttribute("aria-expanded", o); b.setAttribute("aria-label", o ? "Cerrar menú" : "Abrir menú"); m.classList.toggle("open", o); document.body.classList.toggle("locked", o); }
    b.addEventListener("click", function () { set(b.getAttribute("aria-expanded") !== "true"); });
    $$("a", m).forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
    window.addEventListener("resize", function () { if (innerWidth > 980) set(false); });
  });

  // Barra inferior móvil: se oculta sobre el cierre (ya tiene su propio botón)
  safe(function () {
    var dock = $(".dock"), fin = $("#contacto");
    if (!dock || !fin || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (es) { dock.classList.toggle("hide", es[0].isIntersecting); }, { threshold: 0.25 }).observe(fin);
  });

  // Cinta: duplicar el texto para el desplazamiento continuo
  safe(function () { var t = $(".tk"); if (t && !reduced) t.textContent = t.textContent.repeat(6); });

  // ===== Marcador: próxima clase y cuenta regresiva (hora de Iquique) =====
  safe(function () {
    function ahora() { return new Date(new Date().toLocaleString("en-US", { timeZone: CONFIG.tz })); }
    function proxima(n) {
      var best = null;
      for (var off = 0; off <= 7; off++) {
        CLASES.forEach(function (c) {
          var d = new Date(n); d.setDate(n.getDate() + off); d.setHours(c[1], c[2], 0, 0);
          if (d.getDay() !== c[0]) return;
          var fin = new Date(d.getTime() + DUR * 60000);
          if (fin <= n) return;
          if (!best || d < best.inicio) best = { inicio: d, fin: fin, c: c };
        });
        if (best) break;
      }
      return best;
    }
    var pad = function (x) { return (x < 10 ? "0" : "") + x; };
    var row = $('.sb-table tr[data-d="' + ahora().getDay() + '"]');
    if (row) row.classList.add("today");
    function tick() {
      var n = ahora(), p = proxima(n);
      if (!p) return;
      var dia = p.inicio.getDay(), hoy = n.getDay(), hora = p.c[1] + ":" + pad(p.c[2]);
      var cuando = dia === hoy ? "Hoy" : dia === (hoy + 1) % 7 ? "Mañana" : DIAS[dia];
      $("#next-short").textContent = DIAS[dia].slice(0, 3).toUpperCase() + " " + hora;
      $("#next-long").textContent = p.c[3] + " · Playa Brava";
      $("#sb-next").textContent = cuando + " " + hora + " · " + p.c[3];
      var s = Math.floor((p.inicio - n) / 1000), txt;
      if (s <= 0) txt = "EN CURSO";
      else {
        var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
        txt = (d ? d + "d " : "") + pad(h) + ":" + pad(m) + ":" + pad(sec);
      }
      $("#sb-count").textContent = txt;
    }
    tick();
    setInterval(tick, 1000);
  });

  // ===== Simulador de planes (misma lógica de la página original) =====
  safe(function () {
    var fmt = function (v) { return "$" + Math.round(v).toLocaleString("es-CL"); }, g = "mix", nEl = $("#n");
    function calc() {
      var n = +nEl.value, m = n * 4, pc = { mix: 4000, wom: 5000, both: 4500 }[g];
      $("#nv").textContent = n;
      var o = [["Pagando por clase", m * pc]];
      if (g === "mix") o.push(["Promo 3 clases", Math.ceil(m / 3) * 10000]);
      if (g === "wom") o.push(["Plan semanal", 4 * Math.min(n * 5000, 15000)]);
      o.push(["Mensualidad", CONFIG.mensualidad]);
      var b = o.reduce(function (a, c) { return c[1] < a[1] ? c : a; });
      $("#r1").textContent = "Estimado de " + m + " clases al mes: " + o.map(function (x) { return x[0] + " " + fmt(x[1]); }).join(" · ");
      var s = o[0][1] - b[1];
      $("#r2").textContent = "Recomendado: " + b[0] + " " + fmt(b[1]) + (s > 0 ? " · ahorro " + fmt(s) : "");
    }
    $$(".seg button").forEach(function (bt) {
      bt.addEventListener("click", function () { g = bt.getAttribute("data-g"); $$(".seg button").forEach(function (x) { x.setAttribute("aria-pressed", x === bt); }); calc(); });
    });
    nEl.addEventListener("input", calc); calc();
  });


  // Galería del team: visor de fotos con flechas, teclado y deslizamiento
  safe(function () {
    var d = $("#lightbox"); if (!d || typeof d.showModal !== "function") return;
    var tiles = $$(".feed-tile[data-full]"), i = 0, img = $("#lb-img");
    function show(k) {
      i = (k + tiles.length) % tiles.length; var t = tiles[i];
      img.src = t.getAttribute("data-full"); img.alt = t.getAttribute("data-alt");
      $("#lb-alt").textContent = t.getAttribute("data-alt"); $("#lb-tag").textContent = t.getAttribute("data-tag");
      $("#lb-n").textContent = (i + 1) + " / " + tiles.length;
    }
    tiles.forEach(function (t, k) { t.addEventListener("click", function () { show(k); d.showModal(); document.body.classList.add("lb-open"); }); });
    d.addEventListener("close", function () { document.body.classList.remove("lb-open"); if (tiles[i]) tiles[i].focus(); });
    $(".lb-prev", d).addEventListener("click", function () { show(i - 1); });
    $(".lb-next", d).addEventListener("click", function () { show(i + 1); });
    $(".lb-close", d).addEventListener("click", function () { d.close(); });
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
    d.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); });
    var x0 = null;
    d.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    d.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1)); x0 = null; });
  });

  // Filosofía: pilares interactivos (clic/hover en computador, deslizar en celular, avance automático hasta que el usuario interactúa)
  safe(function () {
    var box = $("#pil"); if (!box) return;
    var cards = $$(".pil-card", box), cur = 0, timer = null, mobile = function () { return innerWidth <= 820; };
    function set(k, fromScroll) {
      cur = (k + cards.length) % cards.length;
      cards.forEach(function (c, n) { c.classList.toggle("on", n === cur); c.setAttribute("aria-expanded", n === cur); });
      $("#pil-i").textContent = "0" + (cur + 1);
      $("#pil-bar").style.transform = "translateX(" + cur * 100 + "%)";
      if (mobile() && !fromScroll) box.scrollTo({ left: cards[cur].offsetLeft - box.offsetLeft - parseInt(getComputedStyle(box).paddingLeft, 10), behavior: reduced ? "auto" : "smooth" });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    cards.forEach(function (c, n) {
      c.addEventListener("click", function () { stop(); set(n); });
      c.addEventListener("mouseenter", function () { if (!mobile() && matchMedia("(hover:hover)").matches) { stop(); set(n); } });
      c.addEventListener("focus", function () { if (!mobile()) set(n); });
    });
    box.addEventListener("touchstart", stop, { passive: true });
    var tk = false;
    box.addEventListener("scroll", function () {
      if (!mobile() || tk) return; tk = true;
      requestAnimationFrame(function () {
        tk = false; var best = 0, d = 1e9;
        cards.forEach(function (c, n) { var x = Math.abs(c.getBoundingClientRect().left - box.getBoundingClientRect().left); if (x < d) { d = x; best = n; } });
        if (best !== cur) set(best, true);
      });
    }, { passive: true });
    set(0, true);
    if (!reduced && "IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !timer && !box.dataset.touched) timer = setInterval(function () { set(cur + 1); }, 4200);
          else if (!e.isIntersecting) stop();
        });
      }, { threshold: .5 }).observe(box);
      ["click", "touchstart", "mouseenter"].forEach(function (ev) { box.addEventListener(ev, function () { box.dataset.touched = "1"; stop(); }, { passive: true }); });
    }
  });
})();
