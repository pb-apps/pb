const studies = [
  {
    id: "study1",
    title: {
      en: "Timeless Messages",
      es: "Mensajes Eternos",
      fr: "Messages Intemporels",
      ar: "رسائل خالدة"
    }
  },
  {
    id: "study2",
    title: {
      en: "A Complete System",
      es: "Un Sistema Completo",
      fr: "Un Système Complet",
      ar: "نظام متكامل"
    }
  },
  {
    id: "study3",
    title: {
      en: "The Dead Sea Scrolls",
      es: "Los Rollos del Mar Muerto",
      fr: "Les Manuscrits de la mer Morte",
      ar: "مخطوطات البحر الميت"
    }
  },
  {
    id: "study4",
    title: {
      en: "Enemies of the Book",
      es: "Enemigos del Libro",
      fr: "Les Ennemis du Livre",
      ar: "أعداء الكتاب"
    }
  },
  {
    id: "study5",
    title: {
      en: "Missing in Action",
      es: "Desaparecidos en Acción",
      fr: "Portés Disparus",
      ar: "مفقودون في المعركة"
    }
  },
  {
    id: "study6",
    title: {
      en: "Harmony in History",
      es: "Armonía en la Historia",
      fr: "Harmonie dans l’Histoire",
      ar: "الانسجام في التاريخ"
    }
  }
];



const uiText = {
  es: {
    viewAnswer: "Ver respuesta",
    correct: "✅ Respuesta correcta",
    wrong: "❌ Respuesta incorrecta",
    selectOption: "⚠️ Selecciona una opción"
  },
  en: {
    viewAnswer: "View answer",
    correct: "✅ Correct answer",
    wrong: "❌ Incorrect answer",
    selectOption: "⚠️ Select an option"
  },
  fr: {
    viewAnswer: "Voir la réponse",
    correct: "✅ Réponse correcte",
    wrong: "❌ Réponse incorrecte",
    selectOption: "⚠️ Sélectionnez une option"
  },
  ar: {
    viewAnswer: "عرض الإجابة",
    correct: "✅ إجابة صحيحة",
    wrong: "❌ إجابة غير صحيحة",
    selectOption: "⚠️ اختر خيارًا"
  }
};



let currentIndex = 0;
let currentStudy = null;
let answers = {};

// Al cargar la app → menú
renderMenu();


/* ==================== TRADUCCION DEL TITULO =========== */

function getHomeTitle() {
  const lang = localStorage.getItem("lang") || "en";

  const titles = {
    en: "PROPHETS AND BOOKS",
    es: "PROFETAS Y LIBROS",
    fr: "PROPHÈTES ET LIVRES",
    ar: "الأنبياء والكتب"
  };

  return titles[lang] || titles["en"];
}

/* ======== DEL SUBTITULO LESSON ========*/

function getLessonLabel() {
  const lang = localStorage.getItem("lang") || "en";

  const labels = {
    en: "Lesson",
    es: "Lección",
    fr: "Leçon",
    ar: "الدرس"
  };

  return labels[lang] || labels["en"];
}


/* ============ BOTÓN VOLVER AL MENÚ ===========*/

function getBackLabel() {
  const lang = localStorage.getItem("lang") || "en";

  const labels = {
    en: "⬅ Back to menu",
    es: "⬅ Volver al menú",
    fr: "⬅ Retour au menu",
    ar: "⬅ العودة إلى القائمة"
  };

  return labels[lang] || labels["en"];
}


/* ================= MENU ================= */

function renderMenu() {
  const menu = document.getElementById("menu");
  const content = document.getElementById("content");
  const title = document.getElementById("title");

  content.innerHTML = "";
  title.innerText = "";

  const lang = localStorage.getItem("lang") || "en";

  menu.innerHTML = `
    <div class="home-header">
      <h1>${getHomeTitle()}</h1>

      
      <select id="langSelector">
      <option value="en">🇬🇧 English</option>  
      <option value="es">🇪🇸 Español</option>
        
        <option value="fr">🇫🇷 Français</option>
        <option value="ar">🇸🇦 العربية</option>
      </select>
    </div>

    <div class="home-grid">
      ${studies.map((s, i) => `
        <div class="lesson-card" onclick="loadStudy('${s.id}')">
          <div class="lesson-title">
  ${s.title[localStorage.getItem("lang") || "en"]}</div>
          <div class="lesson-sub">${getLessonLabel()} ${i + 1}</div>

        </div>
      `).join("")}
    </div>

    <div class="home-images">
      <img src="./images/img1.jpg">
      <img src="./images/img2.jpg">
      <img src="./images/img3.jpg">
    </div>
  `;

  // ahora sí existe el select
  const selector = document.getElementById("langSelector");
  selector.value = lang;

  selector.addEventListener("change", e => {
    localStorage.setItem("lang", e.target.value);
    renderMenu(); 
  });
}



/* ================= LOAD STUDY ================= */

function loadStudy(studyId) {
  currentIndex = studies.findIndex(s => s.id === studyId);

  fetch(`./data/${studyId}.json`)
    .then(res => res.json())
    .then(study => {
      currentStudy = study;

      // 🔥 Cargar respuestas guardadas de ESTE estudio
      answers =
        JSON.parse(localStorage.getItem(`answers_${currentStudy.meta.id}`)) ||
        {};

      renderAll();
    });
}


/* ================= RENDER ALL ================= */


function renderAll() {
  const lang = localStorage.getItem("lang") || "en";
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  const menu = document.getElementById("menu");
  const content = document.getElementById("content");

  // ocultar menú
  menu.innerHTML = "";

  // limpiar contenido
  content.innerHTML = "";

  // título
  document.getElementById("title").innerText =
    `${currentStudy.meta.title[lang] || currentStudy.meta.title["en"]} (${currentIndex + 1}/6)`;

  // bloques
  renderBlocks(currentStudy.blocks, lang);

  // botón volver
  const backBtn = document.createElement("button");
  backBtn.innerText = getBackLabel();
  backBtn.onclick = renderMenu;
  backBtn.style.marginBottom = "15px";
  content.appendChild(backBtn);
}

/* ================= BLOQUES ================= */

function renderBlocks(blocks, lang) {
  const container = document.getElementById("content");
  container.innerHTML = ""; // limpiar antes de renderizar

  blocks.forEach(b => {
    let el;

    if (b.type === "image") {
      el = document.createElement("img");
      el.src = b.src;
      el.className = "study-image";
    }

    if (b.type === "heading") {
      el = document.createElement("h2");
      el.innerText = b[lang];
    }

    if (b.type === "paragraph") {
      el = document.createElement("p");
      el.innerText = b[lang];
    }

    if (b.type === "verse") {
      el = document.createElement("blockquote");
      el.innerText = `${b[lang]} (${b.reference})`;
    }

    if (b.type === "question") {
      el = document.createElement("div");
      el.style.margin = "20px 0";
      el.style.padding = "10px";
      el.style.border = "1px solid #ccc";
      el.style.borderRadius = "8px";

      el.innerHTML = `
        <strong>${b.question[lang]}</strong><br/><br/>
        ${b.options[lang]
          .map((opt, i) => `
            <label>
           <input 
 type="radio"
  name="q${b.id}"
  value="${i}"
  ${answers[b.id] === i ? "checked" : ""}
  onchange="saveAnswer(${b.id}, ${i})"
/>
              ${opt}
            </label><br/>
          `).join("")}
        <button onclick="checkAnswer(${b.id}, ${b.correct})">
          ${uiText[lang]?.viewAnswer || "Ver respuesta"}
        </button>
        <div id="feedback-${b.id}" style="margin-top:10px;"></div>
      `;
    }

    if (el) container.appendChild(el);
  });
}


/* ================= RESPUESTAS ================= */

// Guardar respuesta
function saveAnswer(qId, value) {
  if (!currentStudy || !currentStudy.meta || !currentStudy.meta.id) return;

  const key = `answers_${currentStudy.meta.id}`;

  const studyAnswers = JSON.parse(localStorage.getItem(key)) || {};
  studyAnswers[qId] = value;

  localStorage.setItem(key, JSON.stringify(studyAnswers));

  answers = studyAnswers; // mantener sincronizado
}


// Comprobar respuesta
function checkAnswer(questionId, correctIndex) {
  const lang = localStorage.getItem("lang") || "en";
  const feedback = document.getElementById(`feedback-${questionId}`);
  const selected = document.querySelector(
    `input[name="q${questionId}"]:checked`
  );

  if (!selected) {
    feedback.innerHTML = uiText[lang].selectOption;
    feedback.className = "feedback-warning";
    return;
  }

  if (Number(selected.value) === correctIndex) {
    feedback.innerHTML = uiText[lang].correct;
    feedback.className = "feedback-correct";
  } else {
    feedback.innerHTML = uiText[lang].wrong;
    feedback.className = "feedback-wrong";
  }
}

