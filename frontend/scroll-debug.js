// Scroll Debug Utility
// Run this in the browser console to diagnose and fix scrolling issues

console.log('🔍 Diagnosing scrolling issues...');

// Check current body and html styles
const body = document.body;
const html = document.documentElement;

console.log('📊 Current styles:');
console.log('Body overflow-y:', window.getComputedStyle(body).overflowY);
console.log('Body overflow-x:', window.getComputedStyle(body).overflowX);
console.log('Body height:', window.getComputedStyle(body).height);
console.log('Body max-height:', window.getComputedStyle(body).maxHeight);
console.log('HTML overflow-y:', window.getComputedStyle(html).overflowY);
console.log('HTML overflow-x:', window.getComputedStyle(html).overflowX);
console.log('HTML height:', window.getComputedStyle(html).height);

// Check viewport and content dimensions
console.log('📏 Dimensions:');
console.log('Viewport height:', window.innerHeight);
console.log('Document height:', document.documentElement.scrollHeight);
console.log('Body height:', body.scrollHeight);
console.log('Should scroll:', document.documentElement.scrollHeight > window.innerHeight);

// Check for elements with overflow hidden
const elementsWithOverflowHidden = Array.from(document.querySelectorAll('*'))
  .filter(el => {
    const style = window.getComputedStyle(el);
    return style.overflow === 'hidden' || style.overflowY === 'hidden';
  })
  .slice(0, 10); // Limit to first 10 for readability

console.log('🚫 Elements with overflow hidden:', elementsWithOverflowHidden);

// Fix scrolling issues
console.log('🔧 Applying fixes...');

// Force enable scrolling on body and html
body.style.setProperty('overflow-y', 'auto', 'important');
body.style.setProperty('overflow-x', 'hidden', 'important');
body.style.setProperty('height', 'auto', 'important');
body.style.setProperty('max-height', 'none', 'important');

html.style.setProperty('overflow-y', 'auto', 'important');
html.style.setProperty('height', 'auto', 'important');
html.style.setProperty('max-height', 'none', 'important');

// Check for main layout containers that might be constraining
const layoutElements = [
  document.querySelector('.App'),
  document.querySelector('[class*="layout"]'),
  document.querySelector('[class*="Layout"]'),
  document.querySelector('main'),
  document.querySelector('#root')
].filter(Boolean);

layoutElements.forEach(el => {
  if (el) {
    const style = window.getComputedStyle(el);
    console.log(`Layout element ${el.className || el.tagName}:`, {
      overflow: style.overflow,
      overflowY: style.overflowY,
      height: style.height,
      maxHeight: style.maxHeight
    });
  }
});

// Test scrolling
setTimeout(() => {
  console.log('📝 Scroll test results:');
  console.log('Can scroll down:', window.scrollY !== document.documentElement.scrollTop);
  window.scrollTo(0, 100);
  setTimeout(() => {
    console.log('Scroll position after test:', window.scrollY);
    console.log('✅ Scrolling should now work! Try scrolling the page.');
  }, 100);
}, 100);