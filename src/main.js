import './style.css';
import dayjs from 'dayjs';

const API_URL = 'https://fsgcleztylvnnfovpxsi.supabase.co'; 
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZ2NsZXp0eWx2bm5mb3ZweHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMjQzOTAsImV4cCI6MjA5NTgwMDM5MH0.ZVI_acgHTPni60OWQsWdCA-wNS2ASKebcB_FW2KvCOY'; 

const articlesList = document.getElementById('articlesList');
const addArticleForm = document.getElementById('addArticleForm');
const sortSelect = document.getElementById('sortSelect');

const fetchArticles = async () => {
  try {
    const orderParam = sortSelect.value; 
    
    const response = await fetch(`${API_URL}/rest/v1/article?select=*&order=${orderParam}`, {
      method: 'GET',
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (!response.ok) throw new Error(`Błąd: ${response.status}`);
    const data = await response.json();
    renderArticles(data);
  } catch (error) {
    console.error('Fetch error:', error);
    articlesList.innerHTML = '<p class="text-red-500 text-center">Błąd ładowania artykułów.</p>';
  }
};

const renderArticles = (articles) => {
  articlesList.innerHTML = ''; 
  
  if (articles.length === 0) {
    articlesList.innerHTML = '<p class="text-center text-gray-500">Brak artykułów w bazie.</p>';
    return;
  }

  articles.forEach(article => {
    const formattedDate = dayjs(article.created_at).format('DD-MM-YYYY');

    const articleCard = document.createElement('div');
    articleCard.className = 'bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500';
    
    const subtitleHtml = article.subtitle ? `<h3 class="text-xl text-gray-600 mb-2">${article.subtitle}</h3>` : '';

    articleCard.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-900">${article.title}</h2>
      ${subtitleHtml}
      <div class="text-sm text-gray-500 mb-4 font-semibold">
        Autor: ${article.author} | Data: ${formattedDate}
      </div>
      <p class="text-gray-700 whitespace-pre-wrap">${article.content}</p>
    `;
    articlesList.appendChild(articleCard);
  });
};

const createNewArticle = async (e) => {
  e.preventDefault(); 

  const newArticle = {
    title: document.getElementById('title').value,
    subtitle: document.getElementById('subtitle').value,
    author: document.getElementById('author').value,
    content: document.getElementById('content').value,
  };

  const customDate = document.getElementById('created_at').value;
  if (customDate) {
    newArticle.created_at = new Date(customDate).toISOString();
  }

  try {
    const response = await fetch(`${API_URL}/rest/v1/article`, {
      method: 'POST',
      headers: {
        'apikey': API_KEY,
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(newArticle)
    });

    if (!response.ok) throw new Error(`Status: ${response.status}`);
    
    addArticleForm.reset();
    
    fetchArticles();
    
  } catch (error) {
    console.error('Fetch POST error:', error);
    alert('Wystąpił błąd podczas dodawania artykułu!');
  }
};

addArticleForm.addEventListener('submit', createNewArticle);
sortSelect.addEventListener('change', fetchArticles);

fetchArticles();