(() => {
  const DIALS = {
    black: { name: "Desert Midnight", kicker: "Black", face: "#14161a", hand: "#d8b25a", sec: "#ebe4d3",
      line: "The UAE desert after sunset. Quiet, deep, unmistakable.",
      desc: "A black dial that holds the stillness of the dunes after dark. Brass hands and Arabic numerals catch the light the way the horizon holds the last of the sun." },
    green: { name: "Green Horizon", kicker: "Green", face: "#0f3b2c", hand: "#d8b25a", sec: "#efe7d3",
      line: "A nod to Dubai's greener future and an ambition that keeps moving.",
      desc: "Deep green for a country that keeps planting forward. A dial for the person who measures progress in decades, not quarters." },
    red: { name: "Union Flame", kicker: "Red", face: "#9c1e27", hand: "#e3c88e", sec: "#f4ecdb",
      line: "The red of the flag. Energy, courage and unity.",
      desc: "Taken from the vertical band of the flag that holds the other colours together. The most outspoken of the four, and the warmest on the wrist." },
    pearl: { name: "Pearl Legacy", kicker: "White · Gold", face: "#d8d9dc", hand: "#c99a3a", sec: "#2a2621",
      line: "White for peace, gold for prosperity. A nod to Gulf pearling.",
      desc: "A silver-white sunray dial with applied gold numerals, recalling the divers who built the Gulf's first fortunes long before the skyline. The most formal of the four." },
  };
  let uid = 0;

  function svg(key, size) {
    const d = DIALS[key] || DIALS.black, id = "d" + uid++;
    return `<svg viewBox="0 0 400 400" role="img" aria-label="${d.name} dial">
<defs>
<linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a867e"/><stop offset=".45" stop-color="#2e2d2a"/><stop offset=".55" stop-color="#1c1b19"/><stop offset="1" stop-color="#6d6a63"/></linearGradient>
<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="${id}k"><circle cx="200" cy="200" r="183"/></clipPath>
</defs>
<circle cx="200" cy="200" r="198" fill="url(#${id}c)"/>
<circle cx="200" cy="200" r="187" fill="#0d0d0c"/>
<circle cx="200" cy="200" r="183" fill="${d.face}"/>
<image href="/assets/dials/${key in DIALS ? key : "black"}-${size || 900}.webp" x="17" y="17" width="366" height="366" clip-path="url(#${id}k)" preserveAspectRatio="xMidYMid slice"/>
<g class="h hh"><path d="M195.5 216 L197.4 110 L200 100 L202.6 110 L204.5 216 Z" fill="${d.hand}" stroke="#000" stroke-opacity=".25" stroke-width=".6"/></g>
<g class="h hm"><path d="M197.2 218 L198.6 58 L200 48 L201.4 58 L202.8 218 Z" fill="${d.hand}" stroke="#000" stroke-opacity=".25" stroke-width=".6"/></g>
<g class="h hs"><path d="M199.3 240 L199.6 40 L200.4 40 L200.7 240 Z" fill="${d.sec}"/><circle cx="200" cy="228" r="4.5" fill="${d.sec}"/></g>
<circle cx="200" cy="200" r="14" fill="${d.hand}"/><circle cx="200" cy="200" r="3" fill="#0d0d0c" fill-opacity=".6"/>
<circle cx="200" cy="200" r="183" fill="url(#${id}g)"/>
</svg>`;
  }

  function setHands(el, h, m, s) {
    const r = (c, deg) => { const g = el.querySelector(c); if (g) g.style.transform = `rotate(${deg}deg)`; };
    r(".hh", (h % 12) * 30 + m * .5);
    r(".hm", m * 6 + s * .1);
    r(".hs", s * 6);
  }

  function render(el) {
    el.innerHTML = svg(el.dataset.dial, el.dataset.size);
    el.dataset.live === undefined && setHands(el, 10, 9, 36);
  }
  document.querySelectorAll("[data-dial]").forEach(render);

  // Live Dubai time
  const live = [...document.querySelectorAll("[data-live]")];
  const clock = document.querySelector("[data-time]");
  const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const tick = () => {
      const [h, m, s] = fmt.format(new Date()).split(":").map(Number);
      live.forEach(el => setHands(el, h, m, s));
      if (clock) clock.textContent = fmt.format(new Date());
  };
  if (live.length) { tick(); setInterval(tick, 1000); }

  // Hero swatches
  const sw = document.querySelector("[data-swatches]");
  if (sw) {
    const hero = document.querySelector("[data-live]");
    const name = document.querySelector("[data-name]");
    const link = document.querySelector("[data-link]");
    sw.addEventListener("click", e => {
      const b = e.target.closest("button[data-key]");
      if (!b) return;
      const k = b.dataset.key;
      sw.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
      hero.dataset.dial = k;
      hero.innerHTML = svg(k, 900); tick();
      name.textContent = DIALS[k].name;
      link.href = "/watch?d=" + k;
    });
  }

  // Product page
  const prod = document.querySelector("[data-product]");
  if (prod) {
    const k = new URLSearchParams(location.search).get("d");
    const d = DIALS[k];
    if (d) {
      const set = (sel, v) => { const n = prod.querySelector(sel); if (n) n.textContent = v; };
      const dial = prod.querySelector("[data-dial]");
      dial.dataset.dial = k; render(dial);
      set("[data-p=kicker]", d.kicker); set("[data-p=name]", d.name); set("[data-p=crumb]", d.name);
      set("[data-p=line]", d.line); set("[data-p=desc]", d.desc);
      prod.querySelector("[data-p=reserve]").href = "/contact?watch=" + k;
      document.title = d.name + " — SOVRAN";
      document.querySelectorAll("[data-other]").forEach(a => { if (a.dataset.other === k) a.remove(); });
    }
  }

  // Mobile nav
  const burger = document.querySelector(".burger"), nav = document.getElementById("nav");
  if (burger) burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", open);
    nav.classList.toggle("open", open);
  });

  // Contact form
  const form = document.querySelector("[data-form]");
  if (form) {
    const q = new URLSearchParams(location.search);
    const status = form.querySelector(".status");
    if (q.get("watch") && DIALS[q.get("watch")]) form.watch.value = q.get("watch");
    if (q.get("sent")) { status.textContent = "Received. SOVRAN will reply personally."; status.className = "status ok"; }
    form.addEventListener("submit", async e => {
      e.preventDefault();
      let bad = false;
      form.querySelectorAll("[required]").forEach(f => {
        const ok = f.checkValidity();
        f.setAttribute("aria-invalid", !ok);
        if (!ok && !bad) { f.focus(); bad = true; }
      });
      if (bad) { status.textContent = "Please complete the highlighted fields."; status.className = "status err"; return; }
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true; status.textContent = "Sending…"; status.className = "status";
      try {
        const r = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!r.ok) throw 0;
        form.reset();
        status.textContent = "Received. SOVRAN will reply personally."; status.className = "status ok";
      } catch {
        status.textContent = "Something went wrong. Email info@sovranwatches.ae instead."; status.className = "status err";
      } finally { btn.disabled = false; }
    });
  }
})();
