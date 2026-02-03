import './style.css'
import { marked } from 'marked'
import { lessons } from './config'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css' // Premium dark syntax theme
import { renderHand } from './components/CardRenderer'

// Custom Marked Extension for [cards: ...]
marked.use({
  extensions: [{
    name: 'cards',
    level: 'inline',
    start(src) { return src.match(/\[cards:/)?.index; },
    tokenizer(src) {
      // Allow optional size=md: prefix
      // Regex matches: [cards: (optional size=foo:) content]
      const rule = /^\[cards:\s*(?:size=([a-z]+):)?\s*([^\]]+)\]/;
      const match = rule.exec(src);
      if (match) {
        return {
          type: 'cards',
          raw: match[0],
          size: match[1], // Capture group 1 is size (or undefined)
          text: match[2]?.trim() ?? '', // Capture group 2 is content
        };
      }
    },
    renderer(token) {
      return renderHand(token.text, token.size);
    }
  }]
});

const app = document.querySelector<HTMLDivElement>('#app')!

// Initialize Layout
app.innerHTML = `
  <button id="menu-toggle" aria-label="Toggle Menu">☰</button>
  <div id="sidebar-backdrop"></div>
  <aside id="sidebar">
    <h1>Poker Course</h1>
    <nav>
      <ul id="lesson-list"></ul>
    </nav>
    <div class="sidebar-footer">
      <a href="/trainer.html" class="trainer-link-btn">
        <span class="icon">🎮</span>
        <span>Flop Trainer</span>
      </a>
    </div>
  </aside>
  <main>
    <div id="content" class="markdown-body">
      <!-- Content loads here -->
      <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
        <p style="color: var(--text-muted);">Select a lesson to begin</p>
      </div>
    </div>
      </div>
    </div>
  </main>
  <div id="lightbox" aria-hidden="true">
    <img src="" alt="Zoomed Content">
  </div>
`

const lessonListEl = document.getElementById('lesson-list')!
const contentEl = document.getElementById('content')!
const sidebarEl = document.getElementById('sidebar')!
const menuToggleEl = document.getElementById('menu-toggle')!
const backdropEl = document.getElementById('sidebar-backdrop')!
const lightboxEl = document.getElementById('lightbox')!
const lightboxImg = lightboxEl.querySelector('img')!

// Lightbox Logic
function openLightbox(src: string) {
  if (!src) return;
  lightboxImg.src = src;
  lightboxEl.classList.add('visible');
  lightboxEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightboxEl.classList.remove('visible');
  lightboxEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

lightboxEl.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightboxEl.classList.contains('visible')) {
    closeLightbox();
  }
});

// Mobile Sidebar Logic
function toggleSidebar() {
  sidebarEl.classList.toggle('open');
  backdropEl.classList.toggle('visible');
}

function closeSidebar() {
  sidebarEl.classList.remove('open');
  backdropEl.classList.remove('visible');
}

menuToggleEl.addEventListener('click', toggleSidebar);
backdropEl.addEventListener('click', closeSidebar);

// State
let currentLessonId: string | null = null;

// Render Sidebar
function renderSidebar() {
  lessonListEl.innerHTML = lessons.map(lesson => `
    <li>
      <button 
        data-id="${lesson.id}"
        class="${lesson.id === currentLessonId ? 'active' : ''}"
        onclick="window.loadLesson('${lesson.id}')"
      >
        ${lesson.title}
      </button>
    </li>
  `).join('')
}

// Load Lesson Function
async function loadLesson(id: string) {
  const lesson = lessons.find(l => l.id === id)
  if (!lesson) return

  currentLessonId = id
  
  // Update Sidebar Active State
  document.querySelectorAll('nav button').forEach(btn => {
    if (btn.getAttribute('data-id') === id) {
      btn.classList.add('active')
    } else {
      btn.classList.remove('active')
    }
  })

  // Auto close sidebar on mobile
  if (window.innerWidth <= 768) {
    closeSidebar();
  }

  // Show loading?
  contentEl.style.opacity = '0.5';

  try {
    const response = await fetch(lesson.path)
    if (!response.ok) throw new Error('Failed to load lesson')
    
    const markdown = await response.text()
    
    // Parse Markdown
    // marked.parse can be async
    const html = await marked.parse(markdown)
    
    contentEl.innerHTML = html
    contentEl.style.opacity = '1';
    
    // Scroll to top
    document.querySelector('main')?.scrollTo(0, 0)
    
    // Enhance Content
    // 1. Lightbox for Images
    contentEl.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', () => openLightbox(img.src));
    });

    // 2. Responsive Tables (Add data-label from headers)
    contentEl.querySelectorAll('table').forEach(table => {
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent || '');
      table.querySelectorAll('tbody tr').forEach(tr => {
        Array.from(tr.querySelectorAll('td')).forEach((td, index) => {
          if (headers[index]) {
            td.setAttribute('data-label', headers[index]);
          }
        });
      });
    });
    
    // Syntax Highlight
    hljs.highlightAll()
    
    // Update URL without reload (optional)
    // history.pushState({}, '', `?lesson=${id}`)
    
  } catch (err) {
    console.error(err)
    contentEl.innerHTML = `<p style="color: red;">Error loading lesson: ${(err as Error).message}</p>`
    contentEl.style.opacity = '1';
  }
}

// Global exposure for onclick handlers
declare global {
  interface Window {
    loadLesson: (id: string) => void;
  }
}
window.loadLesson = loadLesson

// Init
renderSidebar()

// Auto-load first lesson or from URL
const firstLesson = lessons[0]
if (firstLesson) {
  loadLesson(firstLesson.id)
}
