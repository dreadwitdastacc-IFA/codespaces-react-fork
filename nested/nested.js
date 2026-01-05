const el = document.getElementById('nested-root');
if (el) {
  el.innerHTML = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:2rem;">
      <h2>Nested module</h2>
      <p>This is the nested example served from <strong>/nested/nested.js</strong>.</p>
    </div>
  `;
}

console.log('nested module loaded');

if (import.meta.hot) {
  import.meta.hot.accept();
}
