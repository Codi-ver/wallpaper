// Lumora front-end — small, dependency-free interactions.

// Mobile nav toggle
(function () {
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }
})();

// Scroll reveal for elements marked .reveal
(function () {
  var els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  els.forEach(function (el) { io.observe(el); });
})();

// Admin: show chosen filename on the file drop label
(function () {
  var input = document.getElementById("wallpaper");
  var label = document.getElementById("filedropText");
  if (input && label) {
    input.addEventListener("change", function () {
      if (input.files && input.files[0]) {
        var f = input.files[0];
        var kb = Math.round(f.size / 1024);
        label.textContent = f.name + " · " + kb + " KB";
      }
    });
  }
})();
