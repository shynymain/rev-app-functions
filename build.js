const fs = require('fs');
fs.mkdirSync('dist', { recursive: true });
fs.copyFileSync('index.html', 'dist/index.html');
if (fs.existsSync('app.js')) fs.copyFileSync('app.js', 'dist/app.js');
console.log('Build complete: dist/');
