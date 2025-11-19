document.addEventListener("DOMContentLoaded", () => {
  // ===== VERIFICATION SYSTEM =====
  const questions = [
    {
      question: "Apakah Anda mengetahui sumber berita ini?",
      options: [
        {
          text: "Ya, dari media terpercaya",
          value: 20,
          icon: "fa-check-circle",
        },
        {
          text: "Ya, tapi dari sumber tidak jelas",
          value: 10,
          icon: "fa-question-circle",
        },
        { text: "Tidak tahu sumbernya", value: 0, icon: "fa-times-circle" },
      ],
    },
    {
      question: "Sudah mengecek tanggal publikasi berita?",
      options: [
        { text: "Ya, berita terbaru", value: 15, icon: "fa-calendar-check" },
        {
          text: "Tidak yakin kapan dipublikasikan",
          value: 7,
          icon: "fa-calendar-alt",
        },
        { text: "Belum cek tanggalnya", value: 0, icon: "fa-calendar-times" },
      ],
    },
    {
      question: "Apakah ada bukti atau sumber pendukung lainnya?",
      options: [
        {
          text: "Ya, ada beberapa sumber yang sama",
          value: 20,
          icon: "fa-check-double",
        },
        { text: "Hanya satu sumber saja", value: 10, icon: "fa-check" },
        { text: "Tidak ada bukti pendukung", value: 0, icon: "fa-ban" },
      ],
    },
    {
      question: "Apakah judul berita terlihat clickbait atau sensasional?",
      options: [
        {
          text: "Tidak, judulnya wajar dan informatif",
          value: 15,
          icon: "fa-thumbs-up",
        },
        { text: "Agak sensasional tapi masih wajar", value: 7, icon: "fa-meh" },
        {
          text: "Sangat clickbait dan sensasional",
          value: 0,
          icon: "fa-exclamation-triangle",
        },
      ],
    },
    {
      question: "Sudah melakukan cross-check dengan media terpercaya?",
      options: [
        {
          text: "Ya, sudah cross-check dan cocok",
          value: 20,
          icon: "fa-search-plus",
        },
        { text: "Belum sempat cross-check", value: 10, icon: "fa-search" },
        { text: "Tidak perlu cross-check", value: 0, icon: "fa-search-minus" },
      ],
    },
    {
      question: "Apakah konten mengandung informasi yang bisa diverifikasi?",
      options: [
        {
          text: "Ya, ada data dan fakta konkret",
          value: 10,
          icon: "fa-database",
        },
        { text: "Sebagian bisa diverifikasi", value: 5, icon: "fa-list-alt" },
        {
          text: "Tidak ada informasi yang bisa diverifikasi",
          value: 0,
          icon: "fa-file-excel",
        },
      ],
    },
  ];

  let currentQuestion = 0;
  let totalScore = 0;
  let answers = [];

  // DOM elements
  const startVerificationBtn = document.getElementById("startVerification");
  const newsInput = document.getElementById("newsInput");
  const questionSection = document.getElementById("questionSection");
  const resultSection = document.getElementById("resultSection");
  const questionContainer = document.getElementById("questionContainer");
  const prevBtn = document.getElementById("prevQuestion");
  const nextBtn = document.getElementById("nextQuestion");
  const progressFill = document.querySelector(".progress-fill");
  const verifyAgainBtn = document.getElementById("verifyAgain");
  const shareSimulationBtn = document.getElementById("shareSimulation");

  // SVG progress circle setup
  const scoreProgress = document.querySelector(".score-progress");
  const scoreNumber = document.getElementById("scoreNumber");
  if (scoreProgress) {
    const r = parseFloat(scoreProgress.getAttribute("r")) || 90;
    const circumference = 2 * Math.PI * r;
    scoreProgress.style.strokeDasharray = `${circumference}`;
    scoreProgress.style.strokeDashoffset = `${circumference}`;
    // ensure transitions are smooth
    scoreProgress.style.transition =
      "stroke-dashoffset 800ms ease, stroke 300ms ease";
  }

  // Guards for required elements
  if (
    !startVerificationBtn ||
    !newsInput ||
    !questionSection ||
    !resultSection ||
    !questionContainer
  ) {
    console.warn(
      "Beberapa elemen DOM tidak ditemukan. Pastikan file JS dimuat setelah HTML nya."
    );
    return;
  }

  startVerificationBtn.addEventListener("click", () => {
    const newsText = newsInput.value.trim();
    if (newsText === "") {
      alert("Silakan masukkan teks berita terlebih dahulu!");
      return;
    }
    startVerification();
  });

  function startVerification() {
    const inputWrap = document.querySelector(".verification-input");
    if (inputWrap) inputWrap.style.display = "none";
    questionSection.style.display = "block";
    currentQuestion = 0;
    totalScore = 0;
    answers = [];
    showQuestion();
    // focus first option for accessibility
    questionContainer.focus && questionContainer.focus();
  }

  function renderOptionsHtml(question) {
    return question.options
      .map(
        (option, index) =>
          `\n      <div class=\"answer-option\" role=\"button\" tabindex=\"0\" data-value=\"${option.value}\" data-index=\"${index}\">\n        <i class=\"fas ${option.icon}\"></i>\n        <span>${option.text}</span>\n      </div>`
      )
      .join("");
  }

  function showQuestion() {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    if (progressFill) progressFill.style.width = progress + "%";

    questionContainer.innerHTML = `\n      <div class=\"question-item\">\n        <h3>Pertanyaan ${
      currentQuestion + 1
    } dari ${questions.length}</h3>\n        <h3>${
      question.question
    }</h3>\n        <div class=\"answer-options\">\n          ${renderOptionsHtml(
      question
    )}\n        </div>\n      </div>`;

    const options = questionContainer.querySelectorAll(".answer-option");
    options.forEach((option) => {
      option.addEventListener("click", () => selectOption(option));
      option.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectOption(option);
        }
      });
    });

    // Restore previous answer if exists
    if (answers[currentQuestion] !== undefined) {
      const selectedOption = Array.from(options).find(
        (opt) => parseInt(opt.dataset.value, 10) === answers[currentQuestion]
      );
      if (selectedOption) selectedOption.classList.add("selected");
    }

    prevBtn.disabled = currentQuestion === 0;
    nextBtn.textContent =
      currentQuestion === questions.length - 1 ? "Lihat Hasil" : "Selanjutnya";
  }

  function selectOption(optionEl) {
    const options = questionContainer.querySelectorAll(".answer-option");
    options.forEach((o) => o.classList.remove("selected"));
    optionEl.classList.add("selected");
    answers[currentQuestion] = parseInt(optionEl.dataset.value, 10);
  }

  prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      showQuestion();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (answers[currentQuestion] === undefined) {
      alert("Silakan pilih salah satu jawaban!");
      return;
    }
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      showQuestion();
    } else {
      showResult();
    }
  });

  function showResult() {
    totalScore = answers.reduce(
      (sum, s) => sum + (Number.isFinite(s) ? s : 0),
      0
    );

    questionSection.style.display = "none";
    resultSection.style.display = "block";

    const resultMessage = document.getElementById("resultMessage");
    const resultRecommendation = document.getElementById(
      "resultRecommendation"
    );

    // animate numeric score
    let displayed = 0;
    const target = totalScore;
    const step = Math.max(1, Math.round(target / 40));
    if (scoreNumber) {
      const animate = () => {
        displayed += step;
        if (displayed >= target) {
          displayed = target;
          scoreNumber.textContent = displayed;
        } else {
          scoreNumber.textContent = displayed;
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }

    // animate circle
    if (scoreProgress) {
      const r = parseFloat(scoreProgress.getAttribute("r")) || 90;
      const circumference = 2 * Math.PI * r;
      const offset = circumference - (target / 100) * circumference;
      scoreProgress.style.strokeDashoffset = offset;
    }

    // Determine message
    let message = "";
    let recommendation = "";
    let color = "#10b981";

    if (totalScore >= 80) {
      message = "🎉 Berita Sangat Kredibel!";
      recommendation = `<h4>Rekomendasi: AMAN UNTUK DIBAGIKAN</h4><p>Berita ini memiliki tingkat kredibilitas yang sangat tinggi. Anda telah melakukan verifikasi dengan baik!</p>`;
      color = "#10b981";
    } else if (totalScore >= 60) {
      message = "⚠️ Berita Cukup Kredibel";
      recommendation = `<h4>Rekomendasi: PERLU VERIFIKASI TAMBAHAN</h4><p>Lakukan cross-check dengan sumber lain sebelum membagikan.</p>`;
      color = "#f59e0b";
    } else if (totalScore >= 40) {
      message = "⚠️ Berita Kurang Kredibel";
      recommendation = `<h4>Rekomendasi: JANGAN DIBAGIKAN DULU</h4><p>Perlu verifikasi lebih mendalam.</p>`;
      color = "#f59e0b";
    } else {
      message = "🚫 Kemungkinan HOAX!";
      recommendation = `<h4>Rekomendasi: JANGAN DIBAGIKAN!</h4><p>Berita ini menunjukkan banyak indikasi tidak kredibel. Pertimbangkan melaporkan.</p>`;
      color = "#ef4444";
    }

    if (scoreProgress) scoreProgress.style.stroke = color;
    if (resultMessage) resultMessage.innerHTML = message;
    if (resultRecommendation) resultRecommendation.innerHTML = recommendation;
  }

  // reset / verify again
  if (verifyAgainBtn) {
    verifyAgainBtn.addEventListener("click", () => {
      const inputWrap = document.querySelector(".verification-input");
      if (inputWrap) inputWrap.style.display = "block";
      questionSection.style.display = "none";
      resultSection.style.display = "none";
      newsInput.value = "";
      currentQuestion = 0;
      totalScore = 0;
      answers = [];
      // reset progress bar and score circle
      if (progressFill) progressFill.style.width = "0%";
      if (scoreNumber) scoreNumber.textContent = "0";
      if (scoreProgress) {
        const r = parseFloat(scoreProgress.getAttribute("r")) || 90;
        const circumference = 2 * Math.PI * r;
        scoreProgress.style.strokeDashoffset = circumference;
      }
      // hide simulation if open
      const sim = document.getElementById("simulasi");
      if (sim) sim.style.display = "none";
    });
  }

  // ===== DOMINO SIMULATION =====
  let dominoIntervalId = null;
  let dominoTimeouts = [];

  if (shareSimulationBtn) {
    shareSimulationBtn.addEventListener("click", () => {
      resultSection.style.display = "none";
      const simulationSection = document.getElementById("simulasi");
      if (simulationSection) simulationSection.style.display = "block";
      simulationSection &&
        simulationSection.scrollIntoView({ behavior: "smooth" });
      startDominoSimulation();
    });
  }

  function startDominoSimulation() {
    let people = 0;
    let shares = 0;
    let hours = 0;

    const peopleEl = document.getElementById("affectedPeople");
    const sharesEl = document.getElementById("shareCount");
    const timeEl = document.getElementById("spreadTime");

    // clear any previous icons/timeouts
    document.querySelectorAll(".user-icon").forEach((i) => i.remove());
    dominoTimeouts.forEach((t) => clearTimeout(t));
    dominoTimeouts = [];
    if (dominoIntervalId) clearInterval(dominoIntervalId);

    const layers = [
      { selector: ".layer-1", count: 5 },
      { selector: ".layer-2", count: 10 },
      { selector: ".layer-3", count: 15 },
    ];

    layers.forEach((layer, layerIndex) => {
      const container = document.querySelector(layer.selector);
      if (!container) return;
      for (let i = 0; i < layer.count; i++) {
        const t = setTimeout(() => {
          const icon = document.createElement("div");
          icon.className = "user-icon";
          icon.innerHTML = '<i class="fas fa-user"></i>';
          icon.style.cssText = `position:absolute;width:30px;height:30px;background:var(--danger-color, #ef4444);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:0.8rem;animation:popIn 0.3s ease;`;

          const angle = (360 / layer.count) * i;
          const radius = (layerIndex + 1) * 75;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          icon.style.left = `calc(50% + ${x}px)`;
          icon.style.top = `calc(50% + ${y}px)`;
          icon.style.transform = "translate(-50%, -50%)";

          container.appendChild(icon);
        }, layerIndex * 500 + i * 80);
        dominoTimeouts.push(t);
      }
    });

    // Animate counters
    dominoIntervalId = setInterval(() => {
      if (people < 1000) {
        people += Math.floor(Math.random() * 50) + 20;
        shares += Math.floor(Math.random() * 10) + 5;
        hours += 0.5;

        if (peopleEl)
          peopleEl.textContent = Math.min(people, 1000).toLocaleString();
        if (sharesEl)
          sharesEl.textContent = Math.min(shares, 300).toLocaleString();
        if (timeEl) timeEl.textContent = hours.toFixed(1);
      } else {
        clearInterval(dominoIntervalId);
        dominoIntervalId = null;
      }
    }, 300);
  }

  const stopSimulationBtn = document.getElementById("stopSimulation");
  if (stopSimulationBtn) {
    stopSimulationBtn.addEventListener("click", () => {
      const sim = document.getElementById("simulasi");
      if (sim) sim.style.display = "none";

      // stop interval and timeouts
      if (dominoIntervalId) {
        clearInterval(dominoIntervalId);
        dominoIntervalId = null;
      }
      dominoTimeouts.forEach((t) => clearTimeout(t));
      dominoTimeouts = [];

      // clear user icons
      document.querySelectorAll(".user-icon").forEach((icon) => icon.remove());

      // Reset counters in result view
      const peopleEl = document.getElementById("affectedPeople");
      const sharesEl = document.getElementById("shareCount");
      const timeEl = document.getElementById("spreadTime");
      if (peopleEl) peopleEl.textContent = "0";
      if (sharesEl) sharesEl.textContent = "0";
      if (timeEl) timeEl.textContent = "0";

      // show result section again
      resultSection.style.display = "block";
    });
  }

  // Inject small CSS for user icon animation if not present
  const existingPopStyle = document.getElementById("popin-style");
  if (!existingPopStyle) {
    const style = document.createElement("style");
    style.id = "popin-style";
    style.textContent = `@keyframes popIn { 0% { transform: translate(-50%, -50%) scale(0); opacity: 0; } 50% { transform: translate(-50%, -50%) scale(1.2);} 100% { transform: translate(-50%, -50%) scale(1); opacity: 1;} } .user-icon{position:absolute;} `;
    document.head.appendChild(style);
  }

  console.log("SaringDulu.id - verif.js loaded and initialized");
});
