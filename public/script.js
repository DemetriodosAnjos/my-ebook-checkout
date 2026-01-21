// =========================
// Utilidades
// =========================

const $ = (id) => document.getElementById(id);
const onClick = (el, fn) => el && el.addEventListener("click", fn);

// Ano automático
const yearSpan = $("year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();


// =========================
// Links de checkout
// =========================

const PLAN_URLS = {
  basic: "/api/checkout/basic",
  intermediate: "/api/checkout/intermediate",
  supreme: "/api/checkout/supreme",
};


// =========================
// Scroll suave para os planos
// =========================

function scrollToPlans() {
  const target = $("planos");
  target?.scrollIntoView({ behavior: "smooth" });
}

onClick($("cta-button"), scrollToPlans);
onClick($("cta-button-bottom"), scrollToPlans);


// =========================
// Modal de captura
// =========================

const modal = $("lead-modal");
const modalClose = $("modal-close");
const leadForm = $("lead-form");
const selectedPlanInput = $("selected-plan");

function openModal(planKey) {
  selectedPlanInput.value = planKey;
  modal.classList.add("open");
}

function closeModal() {
  modal.classList.remove("open");
}

// Abrir modal pelos planos
onClick($("buy-basic"), () => openModal("basic"));
onClick($("buy-intermediate"), () => openModal("intermediate"));
onClick($("buy-supreme"), () => openModal("supreme"));

// Fechar modal
onClick(modalClose, closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// =========================
// Envio do formulário (checkout)
// =========================

leadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const overlay = $("loading-overlay");
  const errorBox = $("lead-error");

  errorBox.textContent = "";
  overlay.classList.add("active");

  const planKey = selectedPlanInput.value;
  const url = PLAN_URLS[planKey];

  const name = $("lead-name").value.trim();
  const email = $("lead-email").value.trim();
  const phone = $("lead-phone").value.trim();

  if (!email || !email.includes("@") || !email.includes(".")) {
    overlay.classList.remove("active");
    errorBox.textContent = "Digite um e-mail válido.";
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone }),
    });

    if (!res.ok) {
      overlay.classList.remove("active");
      errorBox.textContent = "Erro ao iniciar pagamento. Tente novamente.";
      return;
    }

    const data = await res.json();

    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      overlay.classList.remove("active");
      errorBox.textContent = "Erro inesperado. Tente novamente.";
    }
  } catch {
    overlay.classList.remove("active");
    errorBox.textContent = "Erro de conexão. Verifique sua internet.";
  }
});


// =========================
// Carrossel de Depoimentos
// =========================

const track = document.querySelector(".carousel-track");
const slides = Array.from(document.querySelectorAll(".testimonial-card"));
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex = 0;

function updateCarousel() {
  if (!slides.length) return;
  const cardWidth = slides[0].offsetWidth + 24;
  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
}

onClick(nextBtn, () => {
  nextSlide();
  resetAutoplay();
});

onClick(prevBtn, () => {
  prevSlide();
  resetAutoplay();
});

// Autoplay
let autoplay = setInterval(nextSlide, 4000);

function resetAutoplay() {
  clearInterval(autoplay);
  autoplay = setInterval(nextSlide, 4000);
}

window.addEventListener("resize", updateCarousel);


// =========================
// FAQ (abre/fecha)
// =========================

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  onClick(question, () => {
    const isOpen = item.classList.contains("open");

    faqItems.forEach((i) => i.classList.remove("open"));

    if (!isOpen) item.classList.add("open");
  });
});
