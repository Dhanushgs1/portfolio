// GitHub username - replace with actual username
const GITHUB_USERNAME = 'Dhanushgs1';

// DOM elements
const projectsContainer = document.getElementById('projects-container');
const topProjectsContainer = document.getElementById('top-projects-container');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');
const backToTopBtn = document.getElementById('back-to-top');

// Global variables
let allProjects = [];
let topProjects = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    setupEventListeners();
    loadTheme();
});

// Setup event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', filterProjects);
    themeToggle.addEventListener('click', toggleTheme);
    backToTopBtn.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', toggleBackToTop);
}

// Fetch projects from GitHub API
async function fetchProjects() {
    try {
        showLoading();

        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const repos = await response.json();
        
        // Filter out forked repositories and sort by stars
        allProjects = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);

        // Get top 3 AI/ML projects (prioritize Python projects or those with AI/ML keywords)
        topProjects = getTopAIProjects(allProjects);

        displayTopProjects();
        displayProjects(allProjects);

    } catch (error) {
        console.error('Error fetching projects:', error);
        showError('Failed to load projects. Please try again later.');
    }
}

// Get top 3 AI/ML projects
function getTopAIProjects(projects) {
    // Filter projects that might be AI/ML/GenAI related
    const aiProjects = projects.filter(project => {
        const name = project.name.toLowerCase();
        const description = (project.description || '').toLowerCase();
        const language = (project.language || '').toLowerCase();
        
        const aiKeywords = ['ai', 'ml', 'machine learning', 'genai', 'generative ai', 'llm', 'nlp', 'neural', 'deep learning', 'computer vision', 'data science', 'analytics', 'prediction', 'classification', 'regression'];
        
        return language === 'python' || language === 'jupyter notebook' ||
               aiKeywords.some(keyword => name.includes(keyword) || description.includes(keyword));
    });

    // Return top 3 by stars, or first 3 if less than 3
    return aiProjects.slice(0, 3);
}

// Display top projects
function displayTopProjects() {
    topProjectsContainer.innerHTML = '';
    
    if (topProjects.length === 0) {
        topProjectsContainer.innerHTML = '<p>No AI/ML projects found.</p>';
        return;
    }

    topProjects.forEach((project, index) => {
        const projectCard = createProjectCard(project, true);
        projectCard.style.setProperty('--animation-order', index);
        topProjectsContainer.appendChild(projectCard);
    });
}

// Display all projects
function displayProjects(projects) {
    projectsContainer.innerHTML = '';
    
    if (projects.length === 0) {
        projectsContainer.innerHTML = '<p>No projects found.</p>';
        return;
    }

    projects.forEach((project, index) => {
        const projectCard = createProjectCard(project, false);
        projectCard.style.setProperty('--animation-order', index);
        projectsContainer.appendChild(projectCard);
    });
}

// Create project card element
function createProjectCard(project, isTopProject = false) {
    const card = document.createElement('div');
    card.className = `project-card ${isTopProject ? 'top-project' : ''}`;

    const description = project.description ? project.description : 'No description available.';
    const language = project.language ? project.language : 'N/A';
    const stars = project.stargazers_count;

    card.innerHTML = `
        <h4>${project.name}</h4>
        <p>${description}</p>
        <div class="project-meta">
            <span class="project-language">${language}</span>
            <span class="project-stars">⭐ ${stars}</span>
        </div>
        <a href="${project.html_url}" target="_blank" class="project-link">View on GitHub</a>
    `;

    return card;
}

// Filter projects based on search input
function filterProjects() {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredProjects = allProjects.filter(project => {
        const name = project.name.toLowerCase();
        const language = (project.language || '').toLowerCase();
        
        return name.includes(searchTerm) || language.includes(searchTerm);
    });
    
    displayProjects(filteredProjects);
}

// Show loading state
function showLoading() {
    const loadingHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Loading projects...</p>
        </div>
    `;
    projectsContainer.innerHTML = loadingHTML;
    topProjectsContainer.innerHTML = loadingHTML;
}

// Show error state
function showError(message) {
    projectsContainer.innerHTML = `<div class="error">${message}</div>`;
    topProjectsContainer.innerHTML = `<div class="error">${message}</div>`;
}

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    updateThemeIcon(newTheme);
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Update theme toggle icon
function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Back to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function toggleBackToTop() {
    if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
}