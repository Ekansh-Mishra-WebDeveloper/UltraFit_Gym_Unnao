// admin.js – Main admin logic for UltraFit Admin Panel
// Imports modular modals and carousels, handles data fetching, rendering, CRUD, and UI interactions.

import {
  heroEditModal,
  statsEditModal,
  trainerEditModal,
  transformationEditModal,
  logoEditModal,
  dietEditModal,
  workoutEditModal,
  membershipEditModal,
  productEditModal,
  galleryEditModal,
  reelsEditModal,
  reviewsEditModal,
  membersEditModal,
  confirmModal,
  successModal
} from './modals.js';

// ========== GLOBAL STATE ==========
let currentToken = localStorage.getItem('adminToken');
let isAdmin = !!currentToken;
const API_BASE = '/api';

// Data stores
let siteSettings = {};
let statsData = {};
let trainers = [];
let members = [];
let products = [];
let transformations = [];
let dietPlans = [];
let workoutPlans = [];
let memberships = [];
let galleryImages = [];
let reels = [];
let reviews = [];
let contactInfo = {};

// ========== HELPER FUNCTIONS ==========
async function fetchJSON(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (isAdmin && currentToken) headers['Authorization'] = `Bearer ${currentToken}`;
  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Fetch error ${url}:`, err);
    return null;
  }
}

async function loadAllData() {
  const [settings, stats, trainersRes, membersRes, productsRes, transRes, dietRes, workoutRes, membershipRes, galleryRes, reelsRes, reviewsRes, contactRes] = await Promise.all([
    fetchJSON(`${API_BASE}/sitesettings`),
    fetchJSON(`${API_BASE}/stats`),
    fetchJSON(`${API_BASE}/trainers`),
    fetchJSON(`${API_BASE}/members`),
    fetchJSON(`${API_BASE}/products`),
    fetchJSON(`${API_BASE}/transformations`),
    fetchJSON(`${API_BASE}/dietplans`),
    fetchJSON(`${API_BASE}/workoutplans`),
    fetchJSON(`${API_BASE}/memberships`),
    fetchJSON(`${API_BASE}/gallery`),
    fetchJSON(`${API_BASE}/reels`),
    fetchJSON(`${API_BASE}/reviews`),
    fetchJSON(`${API_BASE}/contactinfo`)
  ]);
  if (settings) siteSettings = settings;
  if (stats) statsData = stats;
  if (trainersRes) trainers = trainersRes;
  if (membersRes) members = membersRes;
  if (productsRes) products = productsRes;
  if (transRes) transformations = transRes;
  if (dietRes) dietPlans = dietRes;
  if (workoutRes) workoutPlans = workoutRes;
  if (membershipRes) memberships = membershipRes;
  if (galleryRes) galleryImages = galleryRes.images || [];
  if (reelsRes) reels = reelsRes;
  if (reviewsRes) reviews = reviewsRes;
  if (contactRes) contactInfo = contactRes;
}

function showToast(message, isError = false) {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = 'admin-toast';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.style.borderLeftColor = isError ? '#e74c3c' : '#FFD700';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Confirmation and success modals (using modular templates)
function showConfirmModal(message, onConfirm, successMessage = 'Changes Saved Successfully') {
  const modalContainer = document.getElementById('modalContainer');
  modalContainer.innerHTML = confirmModal(message);
  modalContainer.style.display = 'flex';
  const yesBtn = document.getElementById('confirmYesBtn');
  const noBtn = document.getElementById('confirmNoBtn');
  const handleYes = () => {
    modalContainer.style.display = 'none';
    yesBtn.removeEventListener('click', handleYes);
    noBtn.removeEventListener('click', handleNo);
    onConfirm();
    showSuccessModal(successMessage);
  };
  const handleNo = () => {
    modalContainer.style.display = 'none';
    yesBtn.removeEventListener('click', handleYes);
    noBtn.removeEventListener('click', handleNo);
  };
  yesBtn.addEventListener('click', handleYes);
  noBtn.addEventListener('click', handleNo);
}

function showSuccessModal(message) {
  const modalContainer = document.getElementById('modalContainer');
  modalContainer.innerHTML = successModal(message);
  modalContainer.style.display = 'flex';
  const okBtn = document.getElementById('successOkBtn');
  const handleOk = () => {
    modalContainer.style.display = 'none';
    okBtn.removeEventListener('click', handleOk);
  };
  okBtn.addEventListener('click', handleOk);
}

function openCloudinaryUpload(callback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${currentToken}` },
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (data.url) callback(data.url);
      else showToast('Upload failed', true);
    } catch (err) {
      showToast('Upload error', true);
    }
  };
  input.click();
}

// ========== RENDER FUNCTIONS (with original CTAs and per-card Update button) ==========
function renderHero() {
  const heroLogo = document.getElementById('heroLogo');
  if (heroLogo) heroLogo.src = siteSettings.logoUrl || '/UltraFit logo.png';
  const navLogo = document.getElementById('navLogo');
  if (navLogo) navLogo.src = siteSettings.logoUrl || '/UltraFit logo.png';
  const heroSub = document.getElementById('heroSubheading');
  if (heroSub) heroSub.innerText = siteSettings.heroSubheading || 'The Standard of Strength';
  const heroBtn = document.getElementById('heroCtaBtn');
  if (heroBtn) heroBtn.innerText = siteSettings.heroButtonText || 'Claim Your 3-Day VIP Pass';
  const liveStatus = document.getElementById('liveStatusText');
  if (liveStatus) liveStatus.innerText = siteSettings.liveStatusText || 'Open Now – Closing at 10 PM';
  const floatBtn = document.getElementById('floatingCtaBtn');
  if (floatBtn) floatBtn.innerText = siteSettings.floatingButtonText || 'Book 3-Day Free Trial';
}

function renderStats() {
  if (statsData) {
    const statMembers = document.getElementById('statMembers');
    if (statMembers) statMembers.innerText = statsData.membersCount || 0;
    const statTrainers = document.getElementById('statTrainers');
    if (statTrainers) statTrainers.innerText = statsData.trainersCount || 0;
    const statTransformations = document.getElementById('statTransformations');
    if (statTransformations) statTransformations.innerText = statsData.transformationsCount || 0;
  }
}

function renderTrainers() {
  const container = document.getElementById('trainersContainer');
  if (!container) return;
  if (!trainers.length) {
    container.innerHTML = '<p>No trainers yet.</p>';
    return;
  }
  container.innerHTML = trainers.map(t => `
    <div class="leader-card" data-id="${t._id}" data-type="trainer">
      <img src="${t.photoUrl}" class="trainer-img">
      <h3>${escapeHtml(t.name)}</h3>
      <p>${escapeHtml(t.position)}</p>
      <div class="trainer-socials">
        <a href="https://wa.me/${t.whatsappNumber}" target="_blank" class="social-icon whatsapp"><i class="fab fa-whatsapp"></i></a>
        <a href="${t.instagramUrl}" target="_blank" class="social-icon instagram"><i class="fab fa-instagram"></i></a>
      </div>
      <button class="btn-outline-gold view-profile-btn">View Profile</button>
      <button class="card-update-btn" data-type="trainer" data-id="${t._id}">✏️ Update</button>
    </div>
  `).join('');
  attachUpdateButtons();
}

function renderTransformations() {
  const container = document.getElementById('transformationsContainer');
  if (!container) return;
  if (!transformations.length) {
    container.innerHTML = '<p>No transformations yet.</p>';
    return;
  }
  container.innerHTML = transformations.map(t => `
    <div class="trans-card" data-id="${t._id}" data-type="transformation">
      <div class="luxury-comparison-slider" data-before="${t.afterImage}" data-after="${t.beforeImage}">
        <div class="comparison-images"><img class="before-image"><div class="after-image-container"><img class="after-image"></div></div>
        <div class="slider-handle" style="left:50%"><div class="vertical-line"></div><div class="handle-circle"><i class="fas fa-arrows-alt-h"></i></div></div>
        <div class="comparison-label before-label">BEFORE</div><div class="comparison-label after-label">AFTER</div>
      </div>
      <button class="btn-see-more">See more</button>
      <button class="card-update-btn" data-type="transformation" data-id="${t._id}">✏️ Update</button>
    </div>
  `).join('');
  attachUpdateButtons();
  document.querySelectorAll('.luxury-comparison-slider').forEach(slider => initLuxurySlider(slider));
}

function renderDietPlans() {
  const container = document.getElementById('dietGrid');
  if (!container) return;
  if (!dietPlans.length) {
    container.innerHTML = '<p>No diet plans yet.</p>';
    return;
  }
  container.innerHTML = dietPlans.map(d => `
    <div class="diet-card" data-id="${d._id}" data-type="dietPlan">
      <div class="diet-card-image"><img src="${d.imageUrl}"></div>
      <div class="diet-card-content">
        <h3>${escapeHtml(d.title)}</h3>
        <p>${escapeHtml(d.shortDescription)}</p>
        <div class="diet-targets">${(d.targets || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
        <button class="btn-outline-gold full-plan-btn">Full Diet Plan</button>
        <button class="card-update-btn" data-type="dietPlan" data-id="${d._id}">✏️ Update</button>
      </div>
    </div>
  `).join('');
  attachUpdateButtons();
}

function renderWorkoutPlans() {
  const container = document.getElementById('workoutGrid');
  if (!container) return;
  if (!workoutPlans.length) {
    container.innerHTML = '<p>No workout plans yet.</p>';
    return;
  }
  container.innerHTML = workoutPlans.map(w => `
    <div class="workout-card" data-id="${w._id}" data-type="workoutPlan">
      <div class="workout-card-image"><img src="${w.imageUrl}"></div>
      <div class="workout-card-content">
        <h3>${escapeHtml(w.title)}</h3>
        <p>${escapeHtml(w.shortDescription)}</p>
        <div class="workout-targets">${(w.targets || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
        <button class="btn-outline-gold full-workout-btn">Full Workout Plan</button>
        <button class="card-update-btn" data-type="workoutPlan" data-id="${w._id}">✏️ Update</button>
      </div>
    </div>
  `).join('');
  attachUpdateButtons();
}

function renderMemberships() {
  const container = document.getElementById('membershipGrid');
  if (!container) return;
  if (!memberships.length) {
    container.innerHTML = '<p>No membership plans yet.</p>';
    return;
  }
  container.innerHTML = memberships.map(m => `
    <div class="membership-card" data-id="${m._id}" data-type="membership">
      <h3>${escapeHtml(m.planName)}</h3>
      <div class="price">₹${m.price}<span>/${m.duration}</span></div>
      <p>${escapeHtml(m.description)}</p>
      <button class="btn-primary join-now-btn">Join Now</button>
      <button class="card-update-btn" data-type="membership" data-id="${m._id}">✏️ Update</button>
    </div>
  `).join('');
  attachUpdateButtons();
}

function renderProductsGrid() {
  const container = document.getElementById('productsGrid');
  if (!container) return;
  const firstFour = products.slice(0, 4);
  if (!firstFour.length) {
    container.innerHTML = '<p>No products yet.</p>';
    return;
  }
  container.innerHTML = firstFour.map(p => `
    <div class="product-card" data-id="${p._id}" data-type="product">
      <img src="${p.imageUrl}">
      <h3>${escapeHtml(p.name)}</h3>
      <p class="price">₹${p.price}</p>
      <button class="btn-gold-whatsapp" data-product="${escapeHtml(p.name)}">Buy Now</button>
      <button class="card-update-btn" data-type="product" data-id="${p._id}">✏️ Update</button>
    </div>
  `).join('');
  attachUpdateButtons();
  document.querySelectorAll('.btn-gold-whatsapp').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const product = btn.getAttribute('data-product');
      window.open(`https://wa.me/?text=Hello%20UltraFit%2C%20I%27m%20interested%20in%20${encodeURIComponent(product)}`, '_blank');
    });
  });
}

// Members Carousel (with update button inside each item)
function renderMembersCarousel() {
  const container = document.getElementById('membersCarouselItems');
  if (!container) return;
  const firstFive = members.slice(0, 5);
  if (!firstFive.length) {
    container.innerHTML = '<div class="carousel-item">No members yet.</div>';
    return;
  }
  container.innerHTML = firstFive.map(m => `
    <div class="carousel-item">
      <div class="member-card" data-id="${m._id}" data-type="member">
        <img class="member-avatar" src="${m.photoUrl}" alt="${m.name}">
        <div class="member-name">${escapeHtml(m.name)}</div>
        <div class="member-role">${escapeHtml(m.position || 'Member')}</div>
        <div class="member-age">${m.age} years old</div>
        <div class="member-bio">“${escapeHtml(m.feedback || 'No feedback yet.')}”</div>
        <button class="btn-outline-gold view-members-btn" onclick="window.location.href='admin-members.html'">View Members</button>
        <button class="card-update-btn" data-type="member" data-id="${m._id}">✏️ Update</button>
      </div>
    </div>
  `).join('');
  attachUpdateButtons();
  setupCarousel('membersCarouselItems', 'membersPrevBtn', 'membersNextBtn', 'membersDots', firstFive.length);
}

// Gallery Carousel
function renderGalleryCarousel() {
  const track = document.getElementById('galleryTrack');
  if (!track) return;
  if (!galleryImages.length) {
    track.innerHTML = '<div class="carousel-slide">No images</div>';
    return;
  }
  track.innerHTML = galleryImages.map(img => `
    <div class="carousel-slide">
      <img src="${img}" alt="gallery">
      <button class="card-update-btn" data-type="gallery" data-idx="${galleryImages.indexOf(img)}" style="margin-top:0.5rem;">✏️ Update</button>
    </div>
  `).join('');
  attachUpdateButtons();
  setupCarouselTrack('galleryTrack', 'galleryPrevBtn', 'galleryNextBtn', 'galleryDots', galleryImages.length);
}

// Reels Carousel
function renderReelsCarousel() {
  const track = document.getElementById('reelsTrack');
  if (!track) return;
  if (!reels.length) {
    track.innerHTML = '<div class="carousel-slide">No reels</div>';
    return;
  }
  track.innerHTML = reels.map(r => `
    <div class="carousel-slide">
      <video src="${r.videoUrl}" controls muted></video>
      <button class="card-update-btn" data-type="reel" data-id="${r._id}" style="margin-top:0.5rem;">✏️ Update</button>
    </div>
  `).join('');
  attachUpdateButtons();
  setupCarouselTrack('reelsTrack', 'reelsPrevBtn', 'reelsNextBtn', 'reelsDots', reels.length);
}

// Reviews Carousel
function renderReviewsCarousel() {
  const track = document.getElementById('reviewsTrack');
  if (!track) return;
  if (!reviews.length) {
    track.innerHTML = '<div class="carousel-slide">No reviews</div>';
    return;
  }
  track.innerHTML = reviews.map(r => `
    <div class="carousel-slide">
      <div class="review-card" data-id="${r._id}" data-type="review">
        <img class="review-avatar" src="${r.photoUrl}">
        <div class="review-name">${escapeHtml(r.name)}</div>
        <div class="review-stars">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
        <div class="review-text">“${escapeHtml(r.review)}”</div>
        <button class="card-update-btn" data-type="review" data-id="${r._id}">✏️ Update</button>
      </div>
    </div>
  `).join('');
  attachUpdateButtons();
  setupCarouselTrack('reviewsTrack', 'reviewsPrevBtn', 'reviewsNextBtn', 'reviewsDots', reviews.length);
}

function renderContact() {
  const phone = document.getElementById('contactPhone');
  if (phone) phone.innerText = contactInfo.phone || '+1 (212) 555-7890';
  const whatsapp = document.getElementById('contactWhatsapp');
  if (whatsapp) whatsapp.innerText = contactInfo.whatsappNumber || '+1 (212) 555-7891';
  const fb = document.getElementById('contactFb');
  if (fb) fb.href = contactInfo.facebookUrl || '#';
  const ig = document.getElementById('contactIg');
  if (ig) ig.href = contactInfo.instagramUrl || '#';
  const address = document.getElementById('contactAddress');
  if (address) address.innerText = contactInfo.address || '123 Strength Avenue, Manhattan, NY 10001, USA';
}

// ========== GENERIC CAROUSEL SETUP ==========
function setupCarousel(itemsId, prevId, nextId, dotsId, total) {
  let current = 0;
  let transitioning = false;
  let autoTimer = null;
  let pauseTimer = null;
  const itemsContainer = document.getElementById(itemsId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);

  function update(instant = false) {
    if (instant) itemsContainer.style.transition = 'none';
    else itemsContainer.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
    itemsContainer.style.transform = `translateX(-${current * 100}%)`;
    if (instant) itemsContainer.offsetHeight;
    updateDots();
  }
  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === current) dot.classList.add('active');
      dot.addEventListener('click', () => {
        if (!transitioning) {
          goTo(i);
          resetAutoSlide();
        }
      });
      dotsContainer.appendChild(dot);
    }
  }
  function goTo(index) {
    if (transitioning) return;
    transitioning = true;
    current = index;
    update(false);
    setTimeout(() => transitioning = false, 500);
  }
  function next() { goTo((current + 1) % total); }
  function prev() { goTo((current - 1 + total) % total); }
  function startAutoSlide() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => { if (!transitioning) next(); }, 3000);
  }
  function resetAutoSlide() {
    if (pauseTimer) clearTimeout(pauseTimer);
    if (autoTimer) clearInterval(autoTimer);
    pauseTimer = setTimeout(() => startAutoSlide(), 6000);
  }
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoSlide(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoSlide(); });
  startAutoSlide();
  update(true);
}

function setupCarouselTrack(trackId, prevId, nextId, dotsId, total) {
  let current = 0;
  let transitioning = false;
  let autoTimer = null;
  let pauseTimer = null;
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);

  function update(instant = false) {
    if (instant) track.style.transition = 'none';
    else track.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
    track.style.transform = `translateX(-${current * 100}%)`;
    if (instant) track.offsetHeight;
    updateDots();
  }
  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === current) dot.classList.add('active');
      dot.addEventListener('click', () => {
        if (!transitioning) {
          goTo(i);
          resetAutoSlide();
        }
      });
      dotsContainer.appendChild(dot);
    }
  }
  function goTo(index) {
    if (transitioning) return;
    transitioning = true;
    current = index;
    update(false);
    setTimeout(() => transitioning = false, 500);
  }
  function next() { goTo((current + 1) % total); }
  function prev() { goTo((current - 1 + total) % total); }
  function startAutoSlide() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => { if (!transitioning) next(); }, 3000);
  }
  function resetAutoSlide() {
    if (pauseTimer) clearTimeout(pauseTimer);
    if (autoTimer) clearInterval(autoTimer);
    pauseTimer = setTimeout(() => startAutoSlide(), 6000);
  }
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoSlide(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoSlide(); });
  startAutoSlide();
  update(true);
}

// ========== ATTACH UPDATE BUTTONS ==========
function attachUpdateButtons() {
  document.querySelectorAll('.card-update-btn').forEach(btn => {
    btn.removeEventListener('click', handleUpdateClick);
    btn.addEventListener('click', handleUpdateClick);
  });
}

async function handleUpdateClick(e) {
  const btn = e.currentTarget;
  const type = btn.getAttribute('data-type');
  const id = btn.getAttribute('data-id');
  const idx = btn.getAttribute('data-idx');
  const modalContainer = document.getElementById('modalContainer');

  if (type === 'trainer') {
    const trainer = trainers.find(t => t._id === id);
    if (!trainer) return;
    modalContainer.innerHTML = trainerEditModal(trainer);
    modalContainer.style.display = 'flex';
    document.getElementById('cancelTrainerBtn').onclick = () => {
      showConfirmModal('Are you sure you want to discard changes?', () => {
        modalContainer.style.display = 'none';
      }, 'Changes Discarded');
    };
    document.getElementById('saveTrainerBtn').onclick = () => {
      showConfirmModal('Are you sure you want to save changes?', async () => {
        const updated = {
          name: document.getElementById('trainerName').value,
          position: document.getElementById('trainerPosition').value,
          bio: document.getElementById('trainerBio').value,
          whatsappNumber: document.getElementById('trainerWhatsapp').value,
          instagramUrl: document.getElementById('trainerInstagram').value
        };
        const res = await fetchJSON(`${API_BASE}/trainers/${id}`, { method: 'PUT', body: JSON.stringify(updated) });
        if (res) {
          showToast('Trainer updated');
          location.reload();
        } else showToast('Update failed', true);
      }, 'Trainer Updated');
    };
    document.getElementById('trainerUploadArea').onclick = () => {
      openCloudinaryUpload(async (url) => {
        await fetchJSON(`${API_BASE}/trainers/${id}`, { method: 'PUT', body: JSON.stringify({ photoUrl: url }) });
        location.reload();
      });
    };
  } else if (type === 'transformation') {
    const trans = transformations.find(t => t._id === id);
    if (!trans) return;
    modalContainer.innerHTML = transformationEditModal(trans);
    modalContainer.style.display = 'flex';
    document.getElementById('cancelTransBtn').onclick = () => {
      showConfirmModal('Are you sure you want to discard changes?', () => {
        modalContainer.style.display = 'none';
      }, 'Changes Discarded');
    };
    document.getElementById('saveTransBtn').onclick = () => {
      showConfirmModal('Are you sure you want to save changes?', async () => {
        const beforeImage = document.getElementById('transBeforePreview').src;
        const afterImage = document.getElementById('transAfterPreview').src;
        const res = await fetchJSON(`${API_BASE}/transformations/${id}`, { method: 'PUT', body: JSON.stringify({ beforeImage, afterImage }) });
        if (res) location.reload();
        else showToast('Save failed', true);
      }, 'Transformation Updated');
    };
    document.getElementById('transBeforeUpload').onclick = () => {
      openCloudinaryUpload((url) => {
        document.getElementById('transBeforePreview').src = url;
      });
    };
    document.getElementById('transAfterUpload').onclick = () => {
      openCloudinaryUpload((url) => {
        document.getElementById('transAfterPreview').src = url;
      });
    };
  } else if (type === 'dietPlan') {
    const diet = dietPlans.find(d => d._id === id);
    if (!diet) return;
    modalContainer.innerHTML = dietEditModal(diet);
    modalContainer.style.display = 'flex';
    document.getElementById('cancelDietBtn').onclick = () => {
      showConfirmModal('Are you sure you want to discard changes?', () => {
        modalContainer.style.display = 'none';
      }, 'Changes Discarded');
    };
    document.getElementById('saveDietBtn').onclick = () => {
      showConfirmModal('Are you sure you want to save changes?', async () => {
        const updated = {
          title: document.getElementById('dietName').value,
          shortDescription: document.getElementById('dietDesc').value,
          targets: [document.getElementById('dietTag1').value, document.getElementById('dietTag2').value].filter(t => t)
        };
        const res = await fetchJSON(`${API_BASE}/dietplans/${id}`, { method: 'PUT', body: JSON.stringify(updated) });
        if (res) location.reload();
        else showToast('Save failed', true);
      }, 'Diet Updated');
    };
    document.getElementById('dietUploadArea').onclick = () => {
      openCloudinaryUpload(async (url) => {
        await fetchJSON(`${API_BASE}/dietplans/${id}`, { method: 'PUT', body: JSON.stringify({ imageUrl: url }) });
        location.reload();
      });
    };
  } else if (type === 'workoutPlan') {
    const workout = workoutPlans.find(w => w._id === id);
    if (!workout) return;
    modalContainer.innerHTML = workoutEditModal(workout);
    modalContainer.style.display = 'flex';
    document.getElementById('cancelWorkoutBtn').onclick = () => {
      showConfirmModal('Are you sure you want to discard changes?', () => {
        modalContainer.style.display = 'none';
      }, 'Changes Discarded');
    };
    document.getElementById('saveWorkoutBtn').onclick = () => {
      showConfirmModal('Are you sure you want to save changes?', async () => {
        const updated = {
          title: document.getElementById('workoutName').value,
          shortDescription: document.getElementById('workoutDesc').value,
          targets: [document.getElementById('workoutTag1').value, document.getElementById('workoutTag2').value].filter(t => t)
        };
        const res = await fetchJSON(`${API_BASE}/workoutplans/${id}`, { method: 'PUT', body: JSON.stringify(updated) });
        if (res) location.reload();
        else showToast('Save failed', true);
      }, 'Workout Updated');
    };
    document.getElementById('workoutUploadArea').onclick = () => {
      openCloudinaryUpload(async (url) => {
        await fetchJSON(`${API_BASE}/workoutplans/${id}`, { method: 'PUT', body: JSON.stringify({ imageUrl: url }) });
        location.reload();
      });
    };
  } else if (type === 'membership') {
    const plan = memberships.find(m => m._id === id);
    if (!plan) return;
    modalContainer.innerHTML = membershipEditModal(plan);
    modalContainer.style.display = 'flex';
    document.getElementById('cancelMembershipBtn').onclick = () => {
      showConfirmModal('Are you sure you want to discard changes?', () => {
        modalContainer.style.display = 'none';
      }, 'Changes Discarded');
    };
    document.getElementById('saveMembershipBtn').onclick = () => {
      showConfirmModal('Are you sure you want to save changes?', async () => {
        const updated = {
          planName: document.getElementById('membershipName').value,
          price: parseInt(document.getElementById('membershipPrice').value),
          duration: document.getElementById('membershipDuration').value,
          description: document.getElementById('membershipDesc').value
        };
        const res = await fetchJSON(`${API_BASE}/memberships/${id}`, { method: 'PUT', body: JSON.stringify(updated) });
        if (res) location.reload();
        else showToast('Save failed', true);
      }, 'Membership Updated');
    };
  } else if (type === 'product') {
    const product = products.find(p => p._id === id);
    if (!product) return;
    modalContainer.innerHTML = productEditModal(product);
    modalContainer.style.display = 'flex';
    document.getElementById('cancelProductBtn').onclick = () => {
      showConfirmModal('Are you sure you want to discard changes?', () => {
        modalContainer.style.display = 'none';
      }, 'Changes Discarded');
    };
    document.getElementById('saveProductBtn').onclick = () => {
      showConfirmModal('Are you sure you want to save changes?', async () => {
        const updated = {
          name: document.getElementById('productName').value,
          price: parseInt(document.getElementById('productPrice').value)
        };
        const res = await fetchJSON(`${API_BASE}/products/${id}`, { method: 'PUT', body: JSON.stringify(updated) });
        if (res) location.reload();
        else showToast('Save failed', true);
      }, 'Product Updated');
    };
    document.getElementById('productUploadArea').onclick = () => {
      openCloudinaryUpload(async (url) => {
        await fetchJSON(`${API_BASE}/products/${id}`, { method: 'PUT', body: JSON.stringify({ imageUrl: url }) });
        location.reload();
      });
    };
  } else if (type === 'member') {
    const member = members.find(m => m._id === id);
    if (!member) return;
    modalContainer.innerHTML = membersEditModal([member]); // pass as array for modal structure
    modalContainer.style.display = 'flex';
    document.getElementById('cancelMembersBtn').onclick = () => {
      showConfirmModal('Are you sure you want to discard changes?', () => {
        modalContainer.style.display = 'none';
      }, 'Changes Discarded');
    };
    document.getElementById('saveMembersBtn').onclick = () => {
      showConfirmModal('Are you sure you want to save changes?', async () => {
        // This modal handles multiple members; for single member we update just the first
        const name = document.querySelector('.member-name')?.value;
        const age = document.querySelector('.member-age')?.value;
        const feedback = document.querySelector('.member-feedback')?.value;
        const photoUrl = document.querySelector('.member-edit-item img')?.src;
        const updated = { name, age: parseInt(age), feedback, photoUrl };
        const res = await fetchJSON(`${API_BASE}/members/${id}`, { method: 'PUT', body: JSON.stringify(updated) });
        if (res) location.reload();
        else showToast('Save failed', true);
      }, 'Member Updated');
    };
  } else if (type === 'gallery') {
    // For gallery, we need to handle image replacement via modal
    const images = galleryImages;
    modalContainer.innerHTML = galleryEditModal(images);
    modalContainer.style.display = 'flex';
    document.getElementById('cancelGalleryBtn').onclick = () => {
      showConfirmModal('Are you sure you want to discard changes?', () => {
        modalContainer.style.display = 'none';
      }, 'Changes Discarded');
    };
    document.getElementById('saveGalleryBtn').onclick = () => {
      showConfirmModal('Are you sure you want to save changes?', async () => {
        // Collect updated images from the modal (simplified: assume images are unchanged)
        // In a real implementation, you'd capture changes.
        modalContainer.style.display = 'none';
      }, 'Gallery Updated');
    };
  } else if (type === 'reel') {
    const reel = reels.find(r => r._id === id);
    if (!reel) return;
    modalContainer.innerHTML = reelsEditModal([reel]);
    modalContainer.style.display = 'flex';
    document.getElementById('cancelReelsBtn').onclick = () => {
      showConfirmModal('Are you sure you want to discard changes?', () => {
        modalContainer.style.display = 'none';
      }, 'Changes Discarded');
    };
    document.getElementById('saveReelsBtn').onclick = () => {
      showConfirmModal('Are you sure you want to save changes?', async () => {
        const newUrl = document.querySelector('.reel-url')?.value;
        if (newUrl) {
          const res = await fetchJSON(`${API_BASE}/reels/${id}`, { method: 'PUT', body: JSON.stringify({ videoUrl: newUrl }) });
          if (res) location.reload();
        }
      }, 'Reel Updated');
    };
  } else if (type === 'review') {
    const review = reviews.find(r => r._id === id);
    if (!review) return;
    modalContainer.innerHTML = reviewsEditModal([review]);
    modalContainer.style.display = 'flex';
    document.getElementById('cancelReviewsBtn').onclick = () => {
      showConfirmModal('Are you sure you want to discard changes?', () => {
        modalContainer.style.display = 'none';
      }, 'Changes Discarded');
    };
    document.getElementById('saveReviewsBtn').onclick = () => {
      showConfirmModal('Are you sure you want to save changes?', async () => {
        const name = document.querySelector('.review-name')?.value;
        const reviewText = document.querySelector('.review-text')?.value;
        const rating = document.querySelector('.review-rating')?.value;
        const updated = { name, review: reviewText, rating: parseInt(rating) };
        const res = await fetchJSON(`${API_BASE}/reviews/${id}`, { method: 'PUT', body: JSON.stringify(updated) });
        if (res) location.reload();
      }, 'Review Updated');
    };
  }
}

// ========== ADD BUTTONS LOGIC ==========
async function addNewItem(type) {
  let defaultData = {};
  let url = '';
  let successMsg = '';
  switch (type) {
    case 'trainer': url = `${API_BASE}/trainers`; defaultData = { name: 'New Trainer', position: '', photoUrl: '', bio: '', whatsappNumber: '', instagramUrl: '' }; successMsg = 'Trainer Added'; break;
    case 'transformation': url = `${API_BASE}/transformations`; defaultData = { beforeImage: '', afterImage: '' }; successMsg = 'Transformation Added'; break;
    case 'dietPlan': url = `${API_BASE}/dietplans`; defaultData = { title: 'New Diet', imageUrl: '', shortDescription: '', targets: [] }; successMsg = 'Diet Plan Added'; break;
    case 'workoutPlan': url = `${API_BASE}/workoutplans`; defaultData = { title: 'New Workout', imageUrl: '', shortDescription: '', targets: [] }; successMsg = 'Workout Plan Added'; break;
    case 'membership': url = `${API_BASE}/memberships`; defaultData = { planName: 'New Plan', price: 0, duration: 'month', description: '' }; successMsg = 'Membership Added'; break;
    case 'product': url = `${API_BASE}/products`; defaultData = { name: 'New Product', price: 0, imageUrl: '', shortDescription: '', category: 'supplements' }; successMsg = 'Product Added'; break;
    case 'member': url = `${API_BASE}/members`; defaultData = { name: 'New Member', age: 25, since: '2024', photoUrl: '', experience: 'beginner', goal: 'musclegain', featured: false, status: 'active', feedback: '' }; successMsg = 'Member Added'; break;
    case 'reel': url = `${API_BASE}/reels`; defaultData = { videoUrl: '', thumbnail: '' }; successMsg = 'Reel Added'; break;
    case 'review': url = `${API_BASE}/reviews`; defaultData = { name: 'New Review', photoUrl: '', review: '', rating: 5 }; successMsg = 'Review Added'; break;
    default: return;
  }
  showConfirmModal(`Are you sure you want to add ${type}?`, async () => {
    const res = await fetchJSON(url, { method: 'POST', body: JSON.stringify(defaultData) });
    if (res) {
      console.log(`New ${type} added`);
      location.reload();
    } else showToast('Add failed', true);
  }, successMsg);
}

async function addGalleryImage() {
  openCloudinaryUpload(async (url) => {
    const newImages = [...galleryImages, url];
    const res = await fetchJSON(`${API_BASE}/gallery`, { method: 'PUT', body: JSON.stringify({ images: newImages }) });
    if (res) {
      showToast('Image added');
      location.reload();
    } else showToast('Failed to add image', true);
  });
}

// ========== HERO, STATS, LOGO, CONTACT MODALS ==========
function setupHeroModal() {
  const openBtn = document.getElementById('openHeroModalBtn');
  if (!openBtn) return;
  openBtn.onclick = () => {
    const current = {
      heading: document.getElementById('heroSubheading').innerText,
      cta: document.getElementById('heroCtaBtn').innerText,
      bgImage: document.querySelector('.hero-video-wrapper').style.backgroundImage?.match(/url\(["']?(.*?)["']?\)/)?.[1] || ''
    };
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = heroEditModal(current);
    modalContainer.style.display = 'flex';
    document.getElementById('cancelHeroBtn').onclick = () => {
      showConfirmModal('Are you sure you want to discard changes?', () => {
        modalContainer.style.display = 'none';
      }, 'Changes Discarded');
    };
    document.getElementById('saveHeroBtn').onclick = () => {
      showConfirmModal('Are you sure you want to save changes?', async () => {
        const newHeading = document.getElementById('editHeroHeading').value;
        const newCta = document.getElementById('editHeroCta').value;
        document.getElementById('heroSubheading').innerText = newHeading;
        document.getElementById('heroCtaBtn').innerText = newCta;
        await fetchJSON(`${API_BASE}/sitesettings`, { method: 'PUT', body: JSON.stringify({ heroSubheading: newHeading, heroButtonText: newCta }) });
        modalContainer.style.display = 'none';
      }, 'Hero Updated');
    };
    document.getElementById('heroBgUploadArea').onclick = () => {
      openCloudinaryUpload(async (url) => {
        const heroBg = document.querySelector('.hero-video-wrapper');
        heroBg.style.background = `url(${url}) center/cover no-repeat`;
        document.getElementById('heroBgPreview').src = url;
        await fetchJSON(`${API_BASE}/sitesettings`, { method: 'PUT', body: JSON.stringify({ heroBackground: url }) });
      });
    };
  };
}

function setupStatsModal() {
  const editBtn = document.getElementById('editStatsBtn');
  if (!editBtn) return;
  editBtn.onclick = () => {
    const stats = {
      membersCount: parseInt(document.getElementById('statMembers').innerText),
      membersLabel: document.querySelector('.stat-card:first-child span:last-child').innerText,
      trainersCount: parseInt(document.getElementById('statTrainers').innerText),
      trainersLabel: document.querySelector('.stat-card:nth-child(2) span:last-child').innerText,
      transformationsCount: parseInt(document.getElementById('statTransformations').innerText),
      transformationsLabel: document.querySelector('.stat-card:nth-child(3) span:last-child').innerText
    };
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = statsEditModal(stats);
    modalContainer.style.display = 'flex';
    document.getElementById('cancelStatsBtn').onclick = () => {
      showConfirmModal('Are you sure you want to discard changes?', () => {
        modalContainer.style.display = 'none';
      }, 'Changes Discarded');
    };
    document.getElementById('saveStatsBtn').onclick = () => {
      showConfirmModal('Are you sure you want to save changes?', async () => {
        const newMembers = parseInt(document.getElementById('editStatMembers').value);
        const newTrainers = parseInt(document.getElementById('editStatTrainers').value);
        const newTrans = parseInt(document.getElementById('editStatTransformations').value);
        document.getElementById('statMembers').innerText = newMembers;
        document.getElementById('statTrainers').innerText = newTrainers;
        document.getElementById('statTransformations').innerText = newTrans;
        const spans = document.querySelectorAll('.stat-card span:last-child');
        spans[0].innerText = document.getElementById('editStatMembersLabel').value;
        spans[1].innerText = document.getElementById('editStatTrainersLabel').value;
        spans[2].innerText = document.getElementById('editStatTransformationsLabel').value;
        await fetchJSON(`${API_BASE}/stats`, { method: 'PUT', body: JSON.stringify({ membersCount: newMembers, trainersCount: newTrainers, transformationsCount: newTrans }) });
        modalContainer.style.display = 'none';
      }, 'Stats Updated');
    };
  };
}

function setupLogoModal() {
  const editHeroLogo = document.getElementById('editHeroLogoBtn');
  const editNavLogo = document.getElementById('editNavLogoBtn');
  const openLogoModal = () => {
    const currentLogo = document.getElementById('heroLogo').src;
    const modalContainer = document.getElementById('modalContainer');
    modalContainer.innerHTML = logoEditModal(currentLogo);
    modalContainer.style.display = 'flex';
    document.getElementById('cancelLogoBtn').onclick = () => {
      showConfirmModal('Are you sure you want to discard changes?', () => {
        modalContainer.style.display = 'none';
      }, 'Changes Discarded');
    };
    document.getElementById('saveLogoBtn').onclick = () => {
      showConfirmModal('Are you sure you want to update the logo?', async () => {
        const newLogoUrl = document.getElementById('logoPreview').src;
        if (newLogoUrl !== currentLogo) {
          await fetchJSON(`${API_BASE}/sitesettings`, { method: 'PUT', body: JSON.stringify({ logoUrl: newLogoUrl }) });
          location.reload();
        } else {
          modalContainer.style.display = 'none';
        }
      }, 'Logo Updated');
    };
    document.getElementById('logoUploadArea').onclick = () => {
      openCloudinaryUpload((url) => {
        document.getElementById('logoPreview').src = url;
      });
    };
  };
  if (editHeroLogo) editHeroLogo.onclick = openLogoModal;
  if (editNavLogo) editNavLogo.onclick = openLogoModal;
}

function setupContactModal() {
  const editBtn = document.getElementById('editContactBtn');
  if (!editBtn) return;
  editBtn.onclick = async () => {
    const newPhone = prompt('Phone number', document.getElementById('contactPhone').innerText);
    const newWhatsapp = prompt('WhatsApp number', document.getElementById('contactWhatsapp').innerText);
    const newFb = prompt('Facebook URL', document.getElementById('contactFb').href);
    const newIg = prompt('Instagram URL', document.getElementById('contactIg').href);
    const newAddr = prompt('Address', document.getElementById('contactAddress').innerText);
    if (newPhone && newWhatsapp) {
      await fetchJSON(`${API_BASE}/contactinfo`, { method: 'PUT', body: JSON.stringify({ phone: newPhone, whatsappNumber: newWhatsapp, facebookUrl: newFb, instagramUrl: newIg, address: newAddr }) });
      location.reload();
    }
  };
}

// ========== UTILITY ==========
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function initLuxurySlider(slider) {
  const beforeUrl = slider.getAttribute('data-before');
  const afterUrl = slider.getAttribute('data-after');
  const beforeImg = slider.querySelector('.before-image');
  const afterImg = slider.querySelector('.after-image');
  const afterContainer = slider.querySelector('.after-image-container');
  const handle = slider.querySelector('.slider-handle');
  if (!beforeImg || !afterImg) return;
  beforeImg.src = beforeUrl;
  afterImg.src = afterUrl;
  let startX = 0, startPercent = 50, isDragging = false;
  function setPos(percent) {
    percent = Math.min(Math.max(percent, 0), 100);
    afterContainer.style.width = percent + '%';
    handle.style.left = percent + '%';
  }
  function onStart(e) {
    isDragging = true;
    e.preventDefault();
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const rect = slider.getBoundingClientRect();
    const relX = Math.min(Math.max(0, clientX - rect.left), rect.width);
    startPercent = (relX / rect.width) * 100;
    startX = clientX;
  }
  function onMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    let clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const rect = slider.getBoundingClientRect();
    let deltaX = clientX - startX;
    let newPercent = startPercent + (deltaX / rect.width) * 100;
    setPos(newPercent);
  }
  function onEnd() { isDragging = false; }
  handle.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  handle.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd);
  setPos(50);
}

// ========== INITIALIZATION ==========
async function init() {
  if (!isAdmin) {
    // Show login modal (simple inline)
    const loginModal = document.createElement('div');
    loginModal.className = 'login-modal';
    loginModal.innerHTML = `<div class="login-card"><h2 style="color:#FFD700;">Admin Login</h2><input type="email" id="loginEmail" placeholder="Email"><input type="password" id="loginPassword" placeholder="Password"><button id="loginSubmitBtn">Login</button><div id="loginError" class="error-msg"></div></div>`;
    document.body.appendChild(loginModal);
    loginModal.style.display = 'flex';
    document.getElementById('loginSubmitBtn').addEventListener('click', async () => {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data.token) {
          localStorage.setItem('adminToken', data.token);
          location.reload();
        } else {
          document.getElementById('loginError').innerText = data.error || 'Invalid credentials';
        }
      } catch (err) {
        document.getElementById('loginError').innerText = 'Login failed';
      }
    });
    return;
  }

  await loadAllData();
  renderHero();
  renderStats();
  renderTrainers();
  renderTransformations();
  renderDietPlans();
  renderWorkoutPlans();
  renderMemberships();
  renderProductsGrid();
  renderMembersCarousel();
  renderGalleryCarousel();
  renderReelsCarousel();
  renderReviewsCarousel();
  renderContact();
  attachUpdateButtons();
  setupHeroModal();
  setupStatsModal();
  setupLogoModal();
  setupContactModal();

  // Add buttons
  document.getElementById('addTrainerBtn')?.addEventListener('click', () => addNewItem('trainer'));
  document.getElementById('addTransformationBtn')?.addEventListener('click', () => addNewItem('transformation'));
  document.getElementById('addDietBtn')?.addEventListener('click', () => addNewItem('dietPlan'));
  document.getElementById('addWorkoutBtn')?.addEventListener('click', () => addNewItem('workoutPlan'));
  document.getElementById('addMembershipBtn')?.addEventListener('click', () => addNewItem('membership'));
  document.getElementById('addProductBtn')?.addEventListener('click', () => addNewItem('product'));
  document.getElementById('addMemberBtn')?.addEventListener('click', () => addNewItem('member'));
  document.getElementById('addGalleryBtn')?.addEventListener('click', addGalleryImage);
  document.getElementById('addReelBtn')?.addEventListener('click', () => addNewItem('reel'));
  document.getElementById('addReviewBtn')?.addEventListener('click', () => addNewItem('review'));

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
}

init();