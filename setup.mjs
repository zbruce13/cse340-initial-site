
import fs from 'node:fs';
import path from 'node:path';

const files = {
  'package.json': JSON.stringify({
    name: 'cse340-initial-site',
    version: '1.0.0',
    private: true,
    type: 'module',
    scripts: {
      start: 'node server.js',
      dev: 'nodemon server.js'
    },
    dependencies: {
      dotenv: '^16.4.7',
      ejs: '^3.1.10',
      express: '^4.21.2'
    },
    devDependencies: {
      nodemon: '^3.1.9'
    }
  }, null, 2),

  '.gitignore': `node_modules/
.env
`,
  '.env': `NODE_ENV=development
PORT=3000
`,

  'server.js': `
import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = process.env.PORT || 3000;
const dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(dirname, 'src', 'views'));

app.get('/', async (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/organizations', async (req, res) => {
  res.render('organizations', { title: 'Organizations' });
});

app.get('/projects', async (req, res) => {
  res.render('projects', { title: 'Service Projects' });
});

app.get('/categories', async (req, res) => {
  res.render('categories', { title: 'Service Project Categories' });
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(\`Website running at http://localhost:\${port}\`);
});
`,

  'src/views/partials/header.ejs': `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Discover community service opportunities.">
  <title><%= title %> | Service Network</title>
  <link rel="stylesheet" href="/css/main.css">
</head>
<body>
<header class="site-header">
  <a class="brand" href="/">Service Network</a>
  <nav aria-label="Main navigation">
    <a href="/">Home</a>
    <a href="/organizations">Organizations</a>
    <a href="/projects">Projects</a>
    <a href="/categories">Categories</a>
  </nav>
</header>
<main class="container">
`,

  'src/views/partials/footer.ejs': `
</main>
<footer class="site-footer">
  <p>&copy; <%= new Date().getFullYear() %> Service Network. Connecting communities through service.</p>
</footer>
</body>
</html>
`,

  'src/views/home.ejs': `
<%- include('partials/header') %>
<section class="hero">
  <p class="eyebrow">Make a difference together</p>
  <h1>Welcome to the Service Network</h1>
  <p>Connect with community organizations, discover service projects, and find meaningful ways to help others.</p>
  <a class="button-link" href="/projects">Explore service projects</a>
</section>
<section class="section">
  <h2>Find your way to serve</h2>
  <div class="card-grid">
    <article class="card">
      <h3>Organizations</h3>
      <p>Meet community partners creating positive change.</p>
      <a href="/organizations">Meet our partners</a>
    </article>
    <article class="card">
      <h3>Service Projects</h3>
      <p>Discover ways to share your time and talents.</p>
      <a href="/projects">Explore projects</a>
    </article>
    <article class="card">
      <h3>Categories</h3>
      <p>Find a service area that matches your interests.</p>
      <a href="/categories">Browse categories</a>
    </article>
  </div>
</section>
<%- include('partials/footer') %>
`,

  'src/views/organizations.ejs': `
<%- include('partials/header') %>
<section class="page-intro">
  <p class="eyebrow">Working together</p>
  <h1><%= title %></h1>
  <p>Meet our sample community partners.</p>
</section>
<section class="card-grid">
  <article class="card">
    <img src="/images/brightfuture.svg" alt="Bright Future Education logo">
    <h2>Bright Future Education</h2>
    <p>Supporting learners through tutoring, mentoring, and educational resources.</p>
  </article>
  <article class="card">
    <img src="/images/greenharvest.svg" alt="Green Harvest Community logo">
    <h2>Green Harvest Community</h2>
    <p>Encouraging environmental care through cleanups and community gardens.</p>
  </article>
  <article class="card">
    <img src="/images/unityserve.svg" alt="Unity Serve Network logo">
    <h2>Unity Serve Network</h2>
    <p>Connecting volunteers with local community support opportunities.</p>
  </article>
</section>
<%- include('partials/footer') %>
`,

  'src/views/projects.ejs': `
<%- include('partials/header') %>
<section class="page-intro">
  <p class="eyebrow">Take action</p>
  <h1><%= title %></h1>
  <p>Here are some sample opportunities to serve your community.</p>
</section>
<section class="card-grid">
  <article class="card">
    <h2>Park Cleanup</h2>
    <p>Help clean parks and care for shared outdoor spaces.</p>
    <span class="tag">Environmental</span>
  </article>
  <article class="card">
    <h2>Community Tutoring</h2>
    <p>Help learners develop skills and confidence.</p>
    <span class="tag">Educational</span>
  </article>
  <article class="card">
    <h2>Food and Essentials Drive</h2>
    <p>Collect essential items for people in need.</p>
    <span class="tag">Community Service</span>
  </article>
</section>
<%- include('partials/footer') %>
`,

  'src/views/categories.ejs': `
<%- include('partials/header') %>
<section class="page-intro">
  <p class="eyebrow">Find your passion</p>
  <h1><%= title %></h1>
  <p>Explore different ways to make a meaningful difference.</p>
</section>
<section class="card-grid">
  <article class="card">
    <span class="number">01</span>
    <h2>Environmental</h2>
    <p>Care for nature through cleanups, recycling, and community gardens.</p>
  </article>
  <article class="card">
    <span class="number">02</span>
    <h2>Educational</h2>
    <p>Support learning through tutoring, mentoring, and reading programs.</p>
  </article>
  <article class="card">
    <span class="number">03</span>
    <h2>Community Service</h2>
    <p>Strengthen neighborhoods through volunteer projects and community support.</p>
  </article>
  <article class="card">
    <span class="number">04</span>
    <h2>Health and Wellness</h2>
    <p>Encourage healthier communities through wellness and support activities.</p>
  </article>
</section>
<%- include('partials/footer') %>
`,

  'public/css/main.css': `
:root {
  font-family: Arial, Helvetica, sans-serif;
  color: #24332e;
  background: #f5f8f6;
  line-height: 1.6;
  --green: #176b4d;
  --dark-green: #104c37;
  --light-green: #e5f2eb;
  --border: #d7e3dc;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a { color: var(--green); }
a:hover { color: var(--dark-green); }
a:focus-visible { outline: 3px solid #a85e00; outline-offset: 4px; }

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
  padding: 20px max(5%, calc((100% - 1100px) / 2));
  background: white;
  border-bottom: 1px solid var(--border);
}

.brand {
  color: var(--dark-green);
  font-size: 1.3rem;
  font-weight: 800;
  text-decoration: none;
}

nav { display: flex; flex-wrap: wrap; gap: 18px; }
nav a { font-weight: bold; text-decoration: none; }

.container {
  width: min(1100px, 90%);
  margin: 0 auto;
  padding: 40px 0 60px;
  flex: 1;
}

.hero {
  padding: clamp(28px, 6vw, 70px);
  background: var(--light-green);
  border-radius: 22px;
}

h1, h2, h3 { color: var(--dark-green); line-height: 1.25; }
h1 { font-size: clamp(2rem, 5vw, 3.2rem); margin-top: 0; }
.eyebrow { color: var(--green); font-weight: bold; text-transform: uppercase; letter-spacing: .12em; font-size: .8rem; }

.button-link {
  display: inline-block;
  margin-top: 12px;
  padding: 12px 20px;
  border-radius: 8px;
  background: var(--green);
  color: white;
  font-weight: bold;
  text-decoration: none;
}

.button-link:hover { background: var(--dark-green); color: white; }
.section, .page-intro { margin: 32px 0; }

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.card {
  padding: 24px;
  background: white;
  border: 1px solid var(--border);
  border-radius: 15px;
  box-shadow: 0 5px 18px rgb(25 60 43 / 5%);
}

.card img { display: block; width: 100%; max-width: 240px; height: auto; margin-bottom: 18px; }
.card h2, .card h3 { margin-top: 0; }
.number { color: var(--green); font-weight: 800; }
.tag { display: inline-block; background: var(--light-green); color: var(--dark-green); border-radius: 999px; padding: 4px 10px; font-weight: bold; font-size: .85rem; }

.site-footer {
  padding: 24px 5%;
  background: #173b2e;
  color: white;
  text-align: center;
}

@media (max-width: 760px) {
  .site-header { align-items: flex-start; flex-direction: column; }
  nav { gap: 12px 18px; }
  .container { padding-top: 25px; }
  .card-grid { grid-template-columns: 1fr; }
}
`,

  'public/images/brightfuture.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 100">
  <rect width="240" height="100" rx="16" fill="#e5f2eb"/>
  <circle cx="42" cy="42" r="22" fill="#176b4d"/>
  <path d="M42 24 L47 37 L61 37 L50 46 L54 60 L42 51 L30 60 L34 46 L23 37 L37 37 Z" fill="white"/>
  <text x="75" y="40" font-family="Arial" font-size="15" font-weight="bold" fill="#104c37">Bright Future</text>
  <text x="75" y="59" font-family="Arial" font-size="12" fill="#104c37">Education</text>
</svg>
`,

  'public/images/greenharvest.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 100">
  <rect width="240" height="100" rx="16" fill="#edf4df"/>
  <circle cx="42" cy="42" r="22" fill="#426b32"/>
  <path d="M42 57 C20 43 30 25 48 29 C54 41 49 51 42 57 Z" fill="white"/>
  <path d="M42 57 C42 43 53 33 61 37 C60 48 51 56 42 57 Z" fill="#bde3a3"/>
  <text x="75" y="40" font-family="Arial" font-size="15" font-weight="bold" fill="#355427">Green Harvest</text>
  <text x="75" y="59" font-family="Arial" font-size="12" fill="#355427">Community</text>
</svg>
`,

  'public/images/unityserve.svg': `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 100">
  <rect width="240" height="100" rx="16" fill="#e8effb"/>
  <circle cx="42" cy="42" r="22" fill="#294e8d"/>
  <circle cx="34" cy="36" r="6" fill="white"/>
  <circle cx="50" cy="36" r="6" fill="white"/>
  <path d="M26 53 Q34 39 42 53 Q50 39 58 53" fill="none" stroke="white" stroke-width="5" stroke-linecap="round"/>
  <text x="75" y="40" font-family="Arial" font-size="15" font-weight="bold" fill="#243f70">Unity Serve</text>
  <text x="75" y="59" font-family="Arial" font-size="12" fill="#243f70">Network</text>
</svg>
`
};

for (const [filename, content] of Object.entries(files)) {
  const fullPath = path.resolve(filename);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trimStart(), 'utf8');
  console.log(`Created: ${filename}`);
}

console.log('\\nSetup files created successfully!');
console.log('Next, run: npm install');
console.log('Then run: npm run dev');
