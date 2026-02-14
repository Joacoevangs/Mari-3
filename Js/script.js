
// Cargar el SVG y animar los corazones
fetch('Img/treelove.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) return;

    // Animación de "dibujo" para todos los paths
    const allPaths = Array.from(svg.querySelectorAll('path'));
    allPaths.forEach(path => {
      path.style.stroke = '#222';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    // Forzar reflow y luego animar
    setTimeout(() => {
      allPaths.forEach((path, i) => {
        path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
        path.style.strokeDashoffset = 0;
        setTimeout(() => {
          path.style.fillOpacity = '1';
          path.style.stroke = '';
          path.style.strokeWidth = '';
        }, 1200 + i * 80);
      });

      // Después de la animación de dibujo, mueve y agranda el SVG
      const totalDuration = 1200 + (allPaths.length - 1) * 80 + 500;
      setTimeout(() => {
        svg.classList.add('move-and-scale');
        // Mostrar texto con efecto typing
        setTimeout(() => {
          showDedicationText();
          // Mostrar petalos flotando
          startFloatingObjects();
          // Mostrar cuenta regresiva
          showCountdown();
          // Iniciar música de fondo
          playBackgroundMusic();
        }, 1200); //Tiempo para agrandar el SVG
      }, totalDuration);
    }, 50);

    // Selecciona los corazones (formas rojas)
    const heartPaths = allPaths.filter(el => {
      const style = el.getAttribute('style') || '';
      return style.includes('#FC6F58') || style.includes('#C1321F');
    });
    heartPaths.forEach(path => {
      path.classList.add('animated-heart');
    });
  });

// Efecto máquina de escribir para el texto de dedicatoria (seguidores)
function getURLParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function showDedicationText() { //seguidores
  let text = getURLParam('text');
  if (!text) {
    text = `Para el amor de mi vida<3 :\n\nYa no son dias, ni semanas, ni meses, se han convertido en años a tu lado y con mucho orgullo y alegria puedo decir que soy afortunado de tenerte como pareja de vida<3. Tu sonrisa, tu voz, tu forma de ser, absolutamente todo en ti me gusta.\n\nGracias por estar para mi siempre, por darme tu amor incondicional y tu apoyo, gracias por ser mi soporte cuando mas lo necesito.\n\nTe amo 100millones.`;  } else {
    text = decodeURIComponent(text).replace(/\\n/g, '\n');
  }
  const container = document.getElementById('dedication-text');
  container.classList.add('typing');
  let i = 0;
  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      setTimeout(type, text[i - 2] === '\n' ? 350 : 45);
    } else {
      // Al terminar el typing, mostrar la firma animada
      setTimeout(showSignature, 600);
    }
  }
  type();
}

// Firma manuscrita animada
function showSignature() {
  // Cambia para buscar la firma dentro del contenedor de dedicatoria
  const dedication = document.getElementById('dedication-text');
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  let firma = getURLParam('firma');
  signature.textContent = firma ? decodeURIComponent(firma) : "Con amor, Joaquin";
  signature.classList.add('visible');
}



// Controlador de objetos flotantes
function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  let count = 0;
  function spawn() {
    let el = document.createElement('div');
    el.className = 'floating-petal';
    // Posición inicial
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = 0.7 + Math.random() * 0.3;
    container.appendChild(el);

    // Animación flotante
    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;
    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = 0.2;
    }, 30);

    // Eliminar después de animar
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    // Generar más objetos
    if (count++ < 32) setTimeout(spawn, 350 + Math.random() * 500);
    else setTimeout(spawn, 1200 + Math.random() * 1200);
  }
  spawn();
}


function showCountdown() {
  const container = document.getElementById('countdown');
  if (!container) return;

  // Mejora: accesibilidad (opcional)
  container.setAttribute('aria-live', 'polite');

  // Helpers
  const pad2 = (n) => String(n).padStart(2, '0');

  function parseDateParam(param, fallback) {
    // Espera "YYYY-MM-DD"
    if (!param || !/^\d{4}-\d{2}-\d{2}$/.test(param)) return fallback;
    const [y, m, d] = param.split('-').map(Number);
    return new Date(y, m - 1, d); // evita líos de zona horaria
  }

  function diffYMD(from, to) {
    // Diferencia calendario (años/meses/días)
    let y = to.getFullYear() - from.getFullYear();
    let m = to.getMonth() - from.getMonth();
    let d = to.getDate() - from.getDate();

    if (d < 0) {
      // días del mes anterior a "to"
      const prevMonthLastDay = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
      d += prevMonthLastDay;
      m -= 1;
    }
    if (m < 0) {
      m += 12;
      y -= 1;
    }
    return { years: Math.max(0, y), months: Math.max(0, m), days: Math.max(0, d) };
  }

  function getNextAnniversary(startDate, now) {
    const month = startDate.getMonth();
    const day = startDate.getDate();
    let candidate = new Date(now.getFullYear(), month, day);

    // Si ya pasó este año, usar el próximo
    if (candidate <= now) candidate = new Date(now.getFullYear() + 1, month, day);
    return candidate;
  }

  // Parámetros URL (si existen)
  const startParam = getURLParam?.('start');
  const eventParam = getURLParam?.('event');

  // Tu inicio real: 26 mayo 2023
  const defaultStart = new Date(2023, 4, 26); // mes 4 = mayo

  const startDate = parseDateParam(startParam, defaultStart);

  // Evento: si viene por URL, úsalo; si no, próximo aniversario automático
  let eventDate = parseDateParam(eventParam, null);

  function update() {
    const now = new Date();

    // Si no hay event por URL, calcula el próximo aniversario automáticamente
    if (!eventDate) eventDate = getNextAnniversary(startDate, now);

    // Tiempo juntos (total días)
    const diffMs = now - startDate;
    const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    // Tiempo juntos (años/meses/días calendario)
    const ymd = diffYMD(startDate, now);

    // Cuenta regresiva
    const eventDiff = eventDate - now;

    if (eventDiff <= 0) {
      container.innerHTML =
        `Llevamos juntos: <b>${totalDays}</b> días<br>` +
        `(${ymd.years} años, ${ymd.months} meses, ${ymd.days} días)<br>` +
        `🎉 <b>¡Feliz aniversario!</b>`;
      container.classList.add('visible');
      return; // deja de “cambiar” el contador
    }

    const eventDays = Math.floor(eventDiff / (1000 * 60 * 60 * 24));
    const eventHours = Math.floor((eventDiff / (1000 * 60 * 60)) % 24);
    const eventMinutes = Math.floor((eventDiff / (1000 * 60)) % 60);
    const eventSeconds = Math.floor((eventDiff / 1000) % 60);

    // Progreso hacia el aniversario (desde el último aniversario)
    const lastAnniversary = new Date(eventDate.getFullYear() - 1, startDate.getMonth(), startDate.getDate());
    const span = eventDate - lastAnniversary;
    const done = Math.min(span, Math.max(0, now - lastAnniversary));
    const progress = Math.round((done / span) * 100);

    container.innerHTML =
      `Llevamos juntos: <b>${totalDays}</b> días<br>` +
      `(${ymd.years} años, ${ymd.months} meses, ${ymd.days} días)<br>` +
      `Próximo aniversario: <b>${eventDays}d ${pad2(eventHours)}h ${pad2(eventMinutes)}m ${pad2(eventSeconds)}s</b><br>`;

    container.classList.add('visible');
  }

  update();
  setInterval(update, 1000);
}

// --- Música de fondo ---
function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  // --- Opción archivo local por parámetro 'musica' ---
  let musicaParam = getURLParam('musica');
  if (musicaParam) {
    // Decodifica y previene rutas maliciosas
    musicaParam = decodeURIComponent(musicaParam).replace(/[^\w\d .\-]/g, '');
    audio.src = 'Music/' + musicaParam;
  }

  // --- Opción YouTube (solo mensaje de ayuda) ---
  let youtubeParam = getURLParam('youtube');
  if (youtubeParam) {
    // Muestra mensaje de ayuda para descargar el audio
    let helpMsg = document.getElementById('yt-help-msg');
    if (!helpMsg) {
      helpMsg = document.createElement('div');
      helpMsg.id = 'yt-help-msg';
      helpMsg.style.position = 'fixed';
      helpMsg.style.right = '18px';
      helpMsg.style.bottom = '180px';
      helpMsg.style.background = 'rgba(255,255,255,0.95)';
      helpMsg.style.color = '#e60026';
      helpMsg.style.padding = '10px 16px';
      helpMsg.style.borderRadius = '12px';
      helpMsg.style.boxShadow = '0 2px 8px #e6002633';
      helpMsg.style.fontSize = '1.05em';
      helpMsg.style.zIndex = 100;
      helpMsg.innerHTML = 'Para usar música de YouTube, descarga el audio (por ejemplo, usando y2mate, 4K Video Downloader, etc.), colócalo en la carpeta <b>Music</b> y usa la URL así:<br><br><code>?musica=nombre.mp3</code>';
      document.body.appendChild(helpMsg);
      setTimeout(() => { if(helpMsg) helpMsg.remove(); }, 15000);
    }
  }

  let btn = document.getElementById('music-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'music-btn';
    btn.textContent = '🔊 Música';
    btn.style.position = 'fixed';
    btn.style.bottom = '18px';
    btn.style.right = '18px';
    btn.style.zIndex = 99;
    btn.style.background = 'rgba(255,255,255,0.85)';
    btn.style.border = 'none';
    btn.style.borderRadius = '24px';
    btn.style.padding = '10px 18px';
    btn.style.fontSize = '1.1em';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);
  }
  audio.volume = 0.7;
  audio.loop = true;
  // Intentar reproducir inmediatamente
  audio.play().then(() => {
    btn.textContent = '🔊 Música';
  }).catch(() => {
    // Si falla el autoplay, esperar click en el botón
    btn.textContent = '▶️ Música';
  });
  btn.onclick = () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = '🔊 Música';
    } else {
      audio.pause();
      btn.textContent = '🔈 Música';
    }
  };
}

// Intentar reproducir la música lo antes posible (al cargar la página)
window.addEventListener('DOMContentLoaded', () => {
  playBackgroundMusic();
});
