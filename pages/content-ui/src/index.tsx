import { createRoot } from 'react-dom/client';
import App from '@src/app';
// eslint-disable-next-line
// @ts-ignore
import tailwindcssOutput from '@src/tailwind-output.css?inline';
const EDITOR_CLASS = 'ql-editor';

const root = document.createElement('div');
root.id = 'algo-engage-root';

document.body.append(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });
shadowRoot.appendChild(rootIntoShadow);

/** Inject styles into shadow dom */
const styleElement = document.createElement('style');
styleElement.innerHTML = tailwindcssOutput;
shadowRoot.appendChild(styleElement);

createRoot(rootIntoShadow).render(<App />);

const attachRootFeed = () => {
  let qlEditor = document.querySelector(`div.${EDITOR_CLASS}[data-artdeco-is-focused='true']`);

  if (!qlEditor) return;

  if (qlEditor.closest("form")?.querySelector('#algo-engage-root')) return;

  document.querySelector('#algo-engage-root')?.remove();

  qlEditor.closest('form')?.appendChild(root);
};

const attachRootArticle = () => {
  let qlEditor = document.querySelector(`div.${EDITOR_CLASS}[data-artdeco-is-focused='true']`);

  if (!qlEditor) return;

  if (qlEditor.closest("form")?.querySelector('#algo-engage-root')) return;

  document.querySelector('#algo-engage-root')?.remove();

  qlEditor.closest('form')?.appendChild(root);
};

const attachRootAdvice = () => {
  let textEditor = document.activeElement;
  if (textEditor?.tagName !== 'TEXTAREA') return;

  if (textEditor.closest('div.contribution__reply-input-wrapper')?.querySelector('#algo-engage-root')) return;

  document.querySelector('#algo-engage-root')?.remove();

  textEditor.closest('div.contribution__reply-input-wrapper')?.appendChild(root);
};

const attachRoot = () => {
  if (window.location.href.includes('https://www.linkedin.com/advice')) attachRootAdvice();
  else if (window.location.href.includes('https://www.linkedin.com/pulse')) attachRootArticle();
  else attachRootFeed();
};
setInterval(() => {
  attachRoot();
}, 1000);
