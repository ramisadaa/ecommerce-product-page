'use strict';
const $ = (selector) => document.querySelector(selector);
const imagePaths = [1, 2, 3, 4].map((number) => `./images/image-product-${number}.jpg`);
const gallery = $('.lightbox');
const mainThumbnails = $('.review .myphoto');
$('.lightbox-thumbnails').innerHTML = mainThumbnails.innerHTML;
let imageIndex = 0;
let selectedQuantity = 0;
let cartQuantity = 0;
const panel = $('.cartpop');
const cartButton = $('.cart');
const badge = $('.cart-quantity');
const status = $('#cart-status');
function showImage(index) {
  imageIndex = (index + imagePaths.length) % imagePaths.length;
  $('.display-img').src = imagePaths[imageIndex];
  $('.display-img').alt = `Fall Limited Edition Sneakers — product image ${imageIndex + 1}`;
  $('.lightbox-image').src = imagePaths[imageIndex];
  $('.lightbox-image').alt = `Fall Limited Edition Sneakers — product image ${imageIndex + 1}`;
  document.querySelectorAll('.thumbnail').forEach((button) => {
    const active = Number(button.dataset.image) === imageIndex;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
document.querySelectorAll('.thumbnail').forEach((button) => {
  button.addEventListener('click', () => showImage(Number(button.dataset.image)));
});
document.querySelectorAll('.previous').forEach((button) => button.addEventListener('click', () => showImage(imageIndex - 1)));
document.querySelectorAll('.next').forEach((button) => button.addEventListener('click', () => showImage(imageIndex + 1)));
function updateScrollLock() { document.body.classList.toggle('modal-open', gallery.open || $('#navigation').classList.contains('open')); }
$('.image-open').addEventListener('click', () => {
  if (window.matchMedia('(max-width: 767px)').matches) return;
  setCartOpen(false);
  gallery.showModal();
  updateScrollLock();
});
$('.lightbox-close').addEventListener('click', () => gallery.close());
gallery.addEventListener('close', updateScrollLock);
gallery.addEventListener('click', (event) => { if (event.target === gallery) { const box = gallery.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) gallery.close(); } });
gallery.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(imageIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showImage(imageIndex + 1); }
});
function setQuantity(value) { selectedQuantity = Math.max(0, value); $('.quantity').textContent = selectedQuantity; }
$('.minus').addEventListener('click', () => setQuantity(selectedQuantity - 1));
$('.plus').addEventListener('click', () => setQuantity(selectedQuantity + 1));
function setCartOpen(open) { panel.hidden = !open; cartButton.setAttribute('aria-expanded', String(open)); cartButton.setAttribute('aria-label', open ? 'Close cart' : 'Open cart'); }
function renderCart() {
  badge.hidden = cartQuantity === 0;
  badge.textContent = cartQuantity;
  if (!cartQuantity) { $('.cart-content').innerHTML = '<p class="cart-empty">Your cart is empty.</p>'; return; }
  $('.cart-content').innerHTML = `<div class="cart-item"><img src="./images/image-product-1-thumbnail.jpg" alt="Fall Limited Edition Sneakers" class="cart-item-image"><div class="cart-item-details"><p class="cart-item-name">Fall Limited Edition Sneakers</p><p>$125.00 × ${cartQuantity} <span class="cart-item-total">$${(125 * cartQuantity).toFixed(2)}</span></p></div><button class="cart-item-delete icon-button" aria-label="Remove sneakers from cart"><img src="./images/icon-delete.svg" alt=""></button></div><button class="checkout-btn">Checkout</button>`;
}
$('.add-to-cart').addEventListener('click', () => {
  if (!selectedQuantity) { status.textContent = 'Choose a quantity before adding to your cart.'; return; }
  cartQuantity += selectedQuantity;
  renderCart();
  status.textContent = `${selectedQuantity} pair(s) added. Your cart contains ${cartQuantity} pair(s).`;
});
cartButton.addEventListener('click', () => setCartOpen(panel.hidden));
$('.cart-content').addEventListener('click', (event) => {
  if (event.target.closest('.cart-item-delete')) { cartQuantity = 0; renderCart(); status.textContent = 'Sneakers removed from your cart.'; cartButton.focus(); }
  if (event.target.closest('.checkout-btn')) { status.textContent = 'This challenge is a demo. Payment checkout is not connected.'; }
});
document.addEventListener('click', (event) => { if (!panel.hidden && !panel.contains(event.target) && !cartButton.contains(event.target)) setCartOpen(false); });
const navigation = $('#navigation');
const menuButton = $('.menu-toggle');
const backdrop = $('.menu-backdrop');
function setMenuOpen(open) {
  navigation.inert = !open;
  navigation.classList.toggle('open', open);
  backdrop.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  updateScrollLock();
  if (open) { setCartOpen(false); $('.menu-close').focus(); }
  else menuButton.focus();
}
menuButton.addEventListener('click', () => setMenuOpen(true));
$('.menu-close').addEventListener('click', () => setMenuOpen(false));
backdrop.addEventListener('click', () => setMenuOpen(false));
navigation.addEventListener('click', (event) => { if (event.target.closest('a') && navigation.classList.contains('open')) setMenuOpen(false); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { setCartOpen(false); if (navigation.classList.contains('open')) setMenuOpen(false); }
  if (event.key === 'Tab' && navigation.classList.contains('open')) {
    const focusables = [...navigation.querySelectorAll('button, a')];
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
const mobileQuery = window.matchMedia('(max-width: 767px)');
function syncViewport() {
  if (mobileQuery.matches && gallery.open) gallery.close();
  if (!mobileQuery.matches && navigation.classList.contains('open')) { navigation.classList.remove('open'); backdrop.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); updateScrollLock(); }
  navigation.inert = mobileQuery.matches && !navigation.classList.contains('open');
}
const menuObserver = new MutationObserver(() => { navigation.inert = mobileQuery.matches && !navigation.classList.contains('open'); });
menuObserver.observe(navigation, { attributes: true, attributeFilter: ['class'] });
mobileQuery.addEventListener('change', syncViewport);
showImage(0);
renderCart();
syncViewport();
