(function () {
  var $ = function (s) {
    return document.querySelector(s);
  };
  $("#yr").textContent = new Date().getFullYear();
  $("#hero").classList.add("go");
  /* reveal on scroll */
  var io = new IntersectionObserver(
    function (e) {
      e.forEach(function (x) {
        if (x.isIntersecting) {
          x.target.classList.add("in");
          io.unobserve(x.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  document.querySelectorAll("[data-r]").forEach(function (el) {
    io.observe(el);
  });
  /* progress + rolling ball + active nav */
  var prog = $("#prog"),
    ball = $("#ball"),
    links = document.querySelectorAll("nav a"),
    secs = [].map.call(links, function (a) {
      return $(a.getAttribute("href"));
    });
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight,
      p = h > 0 ? scrollY / h : 0;
    prog.style.transform = "scaleX(" + p + ")";
    ball.style.transform =
      "translateX(" + p * (innerWidth - 24) + "px) rotate(" + p * 2400 + "deg)";
    var cur = -1;
    secs.forEach(function (s, i) {
      if (s && s.getBoundingClientRect().top < innerHeight * 0.4) cur = i;
    });
    links.forEach(function (a, i) {
      a.classList.toggle("on", i === cur);
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  /* mobile menu */
  var nav = $("#nav"),
    bg = $("#burger");
  bg.onclick = function () {
    var o = nav.classList.toggle("open");
    bg.setAttribute("aria-expanded", o);
    bg.textContent = o ? "✕" : "☰";
  };
  links.forEach(function (a) {
    a.onclick = function () {
      nav.classList.remove("open");
      bg.textContent = "☰";
    };
  });
  /* logo tilt */
  var st = $("#stage"),
    bd = $("#badge");
  st.addEventListener("pointermove", function (e) {
    var r = st.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    bd.style.animation = "none";
    bd.style.transform =
      "rotateY(" + x * 24 + "deg) rotateX(" + -y * 24 + "deg)";
  });
  st.addEventListener("pointerleave", function () {
    bd.style.transform = "";
  });
  /* reservation builder */
  var days = [
      "Понеделник",
      "Вторник",
      "Среда",
      "Четврток",
      "Петок",
      "Сабота",
      "Недела",
    ],
    times = [],
    i;
  for (i = 16; i <= 23; i++) times.push(i + ":00");
  var sel = { d: "", t: "" },
    msg = $("#msg"),
    cp = $("#copy"),
    nm = $("#name");
  function chips(box, arr, key) {
    var el = $(box);
    arr.forEach(function (v) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = v;
      b.setAttribute("aria-pressed", "false");
      b.onclick = function () {
        sel[key] = v;
        el.querySelectorAll(".chip").forEach(function (c) {
          c.setAttribute("aria-pressed", c === b);
        });
        upd();
      };
      el.appendChild(b);
    });
  }
  chips("#days", days, "d");
  chips("#times", times, "t");
  function text() {
    var n = nm.value.trim();
    return (
      "Здраво! Сакам да резервирам термин за фудбал: " +
      sel.d +
      ", во " +
      sel.t +
      "." +
      (n ? " Име: " + n + "." : "") +
      " Дали е слободен?"
    );
  }
  function upd() {
    var ok = sel.d && sel.t;
    cp.disabled = !ok;
    msg.classList.toggle("ready", !!ok);
    msg.textContent = ok
      ? text()
      : "Избери ден и време за да се појави пораката.";
  }
  nm.oninput = upd;
  function toast(t) {
    var T = $("#toast");
    T.textContent = t;
    T.classList.add("show");
    setTimeout(function () {
      T.classList.remove("show");
    }, 2600);
  }
  cp.onclick = function () {
    var t = text();
    function ok() {
      toast("Пораката е копирана");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(ok, fb);
    } else fb();
    function fb() {
      var a = document.createElement("textarea");
      a.value = t;
      document.body.appendChild(a);
      a.select();
      try {
        document.execCommand("copy");
        ok();
      } catch (e) {
        toast("Означи ја пораката и копирај ја рачно");
      }
      a.remove();
    }
  };
})();
