(() => {
  const DIALS = {
    black: { name: "Desert Midnight", kicker: "Black", face: "#121211", glow: "#262420", ink: "#e8e1d1", accent: "#b99a62",
      line: "The UAE desert after sunset. Quiet, deep, unmistakable.",
      desc: "A black dial that holds the stillness of the dunes after dark. Brass hands and Arabic numerals catch the light the way the horizon holds the last of the sun." },
    green: { name: "Green Horizon", kicker: "Green", face: "#163024", glow: "#28503e", ink: "#ece4d0", accent: "#c9aa6c",
      line: "A nod to Dubai's greener future and an ambition that keeps moving.",
      desc: "Deep green for a country that keeps planting forward. A dial for the person who measures progress in decades, not quarters." },
    red: { name: "Union Flame", kicker: "Red", face: "#561413", glow: "#7d2621", ink: "#f0e6d2", accent: "#d8bd86",
      line: "The red of the flag. Energy, courage and unity.",
      desc: "Taken from the vertical band of the flag that holds the other colours together. The most outspoken of the four, and the warmest on the wrist." },
    pearl: { name: "Pearl Legacy", kicker: "White · Gold", face: "#ebe6db", glow: "#fbf8f1", ink: "#25221d", accent: "#a5803e",
      line: "White for peace, gold for prosperity. A nod to Gulf pearling.",
      desc: "A pearl-white dial with gold accents, recalling the divers who built the Gulf's first fortunes long before the skyline. The most formal of the four." },
  };
  const AR = ["١٢","١","٢","٣","٤","٥","٦","٧","٨","٩","١٠","١١"];
  let uid = 0;

  function svg(key) {
    const d = DIALS[key] || DIALS.black, id = "d" + uid++;
    let ticks = "", nums = "";
    for (let i = 0; i < 60; i++) {
      const hr = i % 5 === 0;
      ticks += `<line x1="200" y1="${hr ? 30 : 32}" x2="200" y2="${hr ? 44 : 38}" stroke="${hr ? d.accent : d.ink}" stroke-opacity="${hr ? 1 : .45}" stroke-width="${hr ? 2.4 : 1}" transform="rotate(${i * 6} 200 200)"/>`;
    }
    AR.forEach((n, i) => {
      const a = (i * 30 - 90) * Math.PI / 180;
      nums += `<text x="${(200 + 128 * Math.cos(a)).toFixed(1)}" y="${(200 + 128 * Math.sin(a)).toFixed(1)}">${n}</text>`;
    });
    return `<svg viewBox="0 0 400 400" role="img" aria-label="${d.name} dial">
<defs>
<linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6b6862"/><stop offset=".45" stop-color="#2a2926"/><stop offset=".55" stop-color="#1a1917"/><stop offset="1" stop-color="#57544e"/></linearGradient>
<radialGradient id="${id}f" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="${d.glow}"/><stop offset="1" stop-color="${d.face}"/></radialGradient>
<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>
<circle cx="200" cy="200" r="197" fill="url(#${id}c)"/>
<circle cx="200" cy="200" r="186" fill="#0d0d0c"/>
<circle cx="200" cy="200" r="182" fill="url(#${id}f)"/>
${ticks}
<g fill="${d.ink}" font-family="Amiri,'Noto Naskh Arabic',serif" font-size="30" text-anchor="middle" dominant-baseline="central">${nums}</g>
<text x="200" y="128" fill="${d.ink}" font-family="'Bodoni Moda',Didot,serif" font-size="13" letter-spacing="5" text-anchor="middle">SOVRAN</text>
<text x="200" y="282" fill="${d.accent}" font-family="'Hanken Grotesk',sans-serif" font-size="7.5" letter-spacing="3" text-anchor="middle">UNION · UAE</text>
<g class="h hh"><path d="M196 214 L197.5 112 L200 104 L202.5 112 L204 214 Z" fill="${d.accent}"/></g>
<g class="h hm"><path d="M197.5 216 L198.6 64 L200 56 L201.4 64 L202.5 216 Z" fill="${d.accent}"/></g>
<g class="h hs"><path d="M199.4 236 L199.6 48 L200.4 48 L200.6 236 Z" fill="${d.ink}"/><circle cx="200" cy="226" r="4" fill="${d.ink}"/></g>
<circle cx="200" cy="200" r="6.5" fill="${d.accent}"/><circle cx="200" cy="200" r="2" fill="#0d0d0c"/>
<circle cx="200" cy="200" r="182" fill="url(#${id}g)"/>
</svg>`;
  }

  function setHands(el, h, m, s) {
    const r = (c, deg) => { const g = el.querySelector(c); if (g) g.style.transform = `rotate(${deg}deg)`; };
    r(".hh", (h % 12) * 30 + m * .5);
    r(".hm", m * 6 + s * .1);
    r(".hs", s * 6);
  }

  function render(el) {
    el.innerHTML = svg(el.dataset.dial);
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
      hero.innerHTML = svg(k); tick();
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
