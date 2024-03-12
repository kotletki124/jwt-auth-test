import type { AuthStoreState } from './shared/types';

export function injectStateIntoHtml(html, state: AuthStoreState): string {
  const scriptContent = generateStateScriptContent(state);

  const injectedHtml = html.replace(
    /<\/head>/i,
    `<script>${scriptContent}</script></head>`,
  );

  return injectedHtml;
}

function generateStateScriptContent(state: AuthStoreState): string {
  const jsonString = JSON.stringify(state);
  const scriptTagContent = `window.__INITIAL_STATE__ = ${jsonString};`;
  return scriptTagContent;
}
