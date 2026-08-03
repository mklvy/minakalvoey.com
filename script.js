const slides = document.querySelectorAll('.slide');
let currentIndex = 0;
let autoSlideInterval;
const creditEl = document.getElementById('credit');
const mobileCaptionEl = document.getElementById('side-caption');

function showSlide(index) {
  slides[currentIndex].classList.remove('active');
  currentIndex = (index + slides.length) % slides.length;
  slides[currentIndex].classList.add('active');
  creditEl.innerHTML = slides[currentIndex].dataset.credit || '';
  mobileCaptionEl.textContent = slides[currentIndex].querySelector('.caption').textContent;
}

function nextSlide() {
  showSlide(currentIndex + 1);
}

function prevSlide() {
  showSlide(currentIndex - 1);
}

function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 4000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

document.getElementById('next-arrow').addEventListener('click', () => {
  stopAutoSlide();
  nextSlide();
});

document.getElementById('prev-arrow').addEventListener('click', () => {
  stopAutoSlide();
  prevSlide();
});

creditEl.innerHTML = slides[currentIndex].dataset.credit || '';
mobileCaptionEl.textContent = slides[currentIndex].querySelector('.caption').textContent;
startAutoSlide();

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    stopAutoSlide();
    nextSlide();
  } else if (e.key === 'ArrowLeft') {
    stopAutoSlide();
    prevSlide();
  }
});

const body = document.body;
const infoToggle = document.getElementById('info-toggle');
const infoClose = document.getElementById('info-close');

infoToggle.addEventListener('click', () => {
  body.classList.add('info-open');
});

infoClose.addEventListener('click', () => {
  body.classList.remove('info-open');
});

const slideshowEl = document.getElementById('slideshow');

slideshowEl.addEventListener('click', (e) => {
  if (!window.matchMedia('(max-width: 768px)').matches) return;
  if (body.classList.contains('info-open')) return;
  const clickX = e.clientX;
  const screenWidth = window.innerWidth;
  stopAutoSlide();
  if (clickX < screenWidth / 2) {
    prevSlide();
  } else {
    nextSlide();
  }
});