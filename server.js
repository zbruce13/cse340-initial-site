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
  console.log(`Website running at http://localhost:${port}`);
});
