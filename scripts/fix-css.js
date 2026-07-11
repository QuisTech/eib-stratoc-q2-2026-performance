const fs = require('fs');
const css = fs.readFileSync('app/globals.css', 'utf8');

const validCss = css.substring(0, css.indexOf('.print-only {\r\n  display: none;\r\n}') + 35);

const newCss = `
/* ── SCORM Component Overrides ───────────────────────── */
.block-flashcards__wrapper {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.flashcard {
  perspective: 1000px;
  position: relative;
  min-height: 250px;
  width: 100%;
}

.flashcard-side {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background-color: var(--card);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

.flashcard-side--back {
  transform: rotateY(180deg);
  background-color: #fafafa;
  color: #111;
}

.dark .flashcard-side--back {
  background-color: #1a1a1a;
  color: #eee;
}

.flashcard--flipped .flashcard-side--front {
  transform: rotateY(-180deg);
}

.flashcard--flipped .flashcard-side--back {
  transform: rotateY(0deg);
}

.flashcard-side__content {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.flashcard-side-flip {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}

.flashcard-side-flip__btn {
  background: rgba(0,0,0,0.05);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.dark .flashcard-side-flip__btn {
  background: rgba(255,255,255,0.1);
}

.flashcard-side-flip__btn:hover {
  background: rgba(0,0,0,0.1);
}

.dark .flashcard-side-flip__btn:hover {
  background: rgba(255,255,255,0.2);
}

.flashcard-side-flip__icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.flashcard-side-flip__tooltip {
  position: absolute;
  bottom: 100%;
  right: 50%;
  transform: translateX(50%);
  margin-bottom: 8px;
  background: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.flashcard-side-flip:hover .flashcard-side-flip__tooltip {
  opacity: 1;
}

.visually-hidden-always {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Accordion SCORM Styles */
.blocks-accordion {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.blocks-accordion__item {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background-color: var(--card);
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.blocks-accordion__header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}

.blocks-accordion__header:hover {
  background: var(--muted);
}

.blocks-accordion__title {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--primary);
}

.blocks-accordion__toggler {
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1;
  color: var(--muted-foreground);
  transition: transform 0.3s ease;
}

.blocks-accordion__content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.blocks-accordion__item--open .blocks-accordion__content {
  max-height: 2000px;
}

.blocks-accordion__description {
  padding: 0 1.25rem 1.25rem 1.25rem;
  color: var(--muted-foreground);
  line-height: 1.6;
}
`;

// Note: Ensure cross-platform newline matching. If print-only is not found, fallback to substring of valid length
let finalCss = validCss;
if (css.indexOf('.print-only {') === -1) {
  finalCss = css.substring(0, 5000); // safety fallback
}

fs.writeFileSync('app/globals.css', validCss + newCss);
console.log('Fixed globals.css');
