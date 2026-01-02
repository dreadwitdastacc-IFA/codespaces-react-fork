// Example entry script
const root = document.getElementById('root');
if (root) {
  root.innerHTML = `
    <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:2rem;">
      <h1>Vite demo: main.js</h1>
      <p>This file was created for the example project structure.</p>
      <a href="/nested/index.html">Open nested example</a>
    </div>
  `;
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
