// Curso n8n - JavaScript Functions

// Progress tracking
class CourseProgress {
  constructor() {
    this.progress = this.loadProgress();
  }

  loadProgress() {
    const saved = localStorage.getItem('n8n-course-progress');
    return saved ? JSON.parse(saved) : {
      modules: {
        module1: { completed: 0, total: 4 },
        module2: { completed: 0, total: 3 },
        module3: { completed: 0, total: 3 },
        module4: { completed: 0, total: 3 }
      },
      exercises: {},
      projects: {}
    };
  }

  saveProgress() {
    localStorage.setItem('n8n-course-progress', JSON.stringify(this.progress));
  }

  completeLesson(moduleId, lessonId) {
    if (!this.progress.modules[moduleId].lessons) {
      this.progress.modules[moduleId].lessons = {};
    }
    this.progress.modules[moduleId].lessons[lessonId] = true;
    this.progress.modules[moduleId].completed = Object.keys(this.progress.modules[moduleId].lessons).length;
    this.saveProgress();
    this.updateProgressDisplay();
  }

  completeExercise(exerciseId) {
    this.progress.exercises[exerciseId] = true;
    this.saveProgress();
  }

  updateProgressDisplay() {
    // Update progress bars and counters
    const totalLessons = Object.values(this.progress.modules).reduce((sum, module) => sum + module.total, 0);
    const completedLessons = Object.values(this.progress.modules).reduce((sum, module) => sum + module.completed, 0);
    const overallProgress = (completedLessons / totalLessons) * 100;

    // Update overall progress if element exists
    const overallBar = document.querySelector('.overall-progress-fill');
    const overallText = document.querySelector('.overall-progress-text');
    
    if (overallBar && overallText) {
      overallBar.style.width = overallProgress + '%';
      overallText.textContent = `${completedLessons} de ${totalLessons} lições concluídas (${Math.round(overallProgress)}%)`;
    }
  }
}

// Initialize course progress
const courseProgress = new CourseProgress();

// Notification system
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icon = type === 'success' ? 'fas fa-check-circle' : 
               type === 'warning' ? 'fas fa-exclamation-triangle' : 
               'fas fa-info-circle';
  
  notification.innerHTML = `<i class="${icon}"></i> ${message}`;
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Copy code functionality
function copyCode(button) {
  const codeBlock = button.parentElement.nextElementSibling;
  const code = codeBlock.textContent || codeBlock.innerText;
  
  navigator.clipboard.writeText(code).then(() => {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Copiado!';
    button.style.background = '#28a745';
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = '';
    }, 2000);
    
    showNotification('Código copiado para a área de transferência!');
  }).catch(() => {
    showNotification('Erro ao copiar código', 'error');
  });
}

// Complete task functionality
function completeTask(taskNumber, lessonId) {
  const button = event.target;
  const originalHTML = button.innerHTML;
  
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
  button.disabled = true;
  
  setTimeout(() => {
    button.innerHTML = '<i class="fas fa-check"></i> Concluído!';
    button.style.background = '#28a745';
    button.style.color = 'white';
    
    // Save exercise completion
    courseProgress.completeExercise(`${lessonId}-task-${taskNumber}`);
    
    showNotification(`Exercício ${taskNumber} concluído com sucesso!`);
    
    // Update lesson progress if applicable
    updateLessonProgress();
  }, 1500);
}

// Update lesson progress
function updateLessonProgress() {
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  
  if (progressFill && progressText) {
    // Get current progress from page context
    const currentModule = getCurrentModule();
    const currentLesson = getCurrentLesson();
    
    if (currentModule && currentLesson) {
      const moduleProgress = courseProgress.progress.modules[currentModule];
      const percentage = (moduleProgress.completed / moduleProgress.total) * 100;
      
      progressFill.style.width = percentage + '%';
      progressText.textContent = `${moduleProgress.completed} de ${moduleProgress.total} lições concluídas (${Math.round(percentage)}%)`;
    }
  }
}

// Get current module from URL
function getCurrentModule() {
  const path = window.location.pathname;
  if (path.includes('modulo1')) return 'module1';
  if (path.includes('modulo2')) return 'module2';
  if (path.includes('modulo3')) return 'module3';
  if (path.includes('modulo4') || path.includes('projeto')) return 'module4';
  return null;
}

// Get current lesson from URL
function getCurrentLesson() {
  const path = window.location.pathname;
  const filename = path.split('/').pop().replace('.html', '');
  return filename;
}

// Download simulation
function downloadResource(resourceId) {
  const button = event.target.closest('.download-btn');
  const originalHTML = button.innerHTML;
  
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  button.disabled = true;
  
  // Simulate download delay
  setTimeout(() => {
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = '#28a745';
    
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.style.background = '';
      button.disabled = false;
    }, 2000);
    
    showNotification(`Recurso "${resourceId}" baixado com sucesso!`);
  }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
}

// Search functionality
function searchCourse(query) {
  if (!query || query.length < 2) return;
  
  const searchResults = [
    { title: 'Introdução ao n8n', url: 'modulo1-intro.html', module: 'Módulo 1' },
    { title: 'Instalação do n8n', url: 'modulo1-instalacao.html', module: 'Módulo 1' },
    { title: 'Primeiro Workflow', url: 'modulo2-primeiro-workflow.html', module: 'Módulo 2' },
    { title: 'JavaScript no n8n', url: 'modulo3-javascript.html', module: 'Módulo 3' },
    { title: 'Automação de Email', url: 'projeto1.html', module: 'Projeto 1' }
  ];
  
  const filtered = searchResults.filter(result => 
    result.title.toLowerCase().includes(query.toLowerCase()) ||
    result.module.toLowerCase().includes(query.toLowerCase())
  );
  
  return filtered;
}

// Theme toggler
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains('dark-theme');
  
  if (isDark) {
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  }
}

// Initialize theme from localStorage
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
}

// Certificate generation
function generateCertificate(studentName) {
  const certificate = {
    studentName: studentName,
    courseName: 'Curso Completo de n8n - Automação de Processos',
    completionDate: new Date().toLocaleDateString('pt-BR'),
    verificationCode: generateVerificationCode(),
    courseHours: 40
  };
  
  return certificate;
}

function generateVerificationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'N8N-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  initializeSmoothScrolling();
  courseProgress.updateProgressDisplay();
  
  // Add loading animation to external links
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', function() {
      showNotification('Abrindo link externo...', 'info');
    });
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchQuery = prompt('Pesquisar no curso:');
    if (searchQuery) {
      const results = searchCourse(searchQuery);
      if (results.length > 0) {
        window.location.href = results[0].url;
      } else {
        showNotification('Nenhum resultado encontrado', 'warning');
      }
    }
  }
  
  // Arrow keys for navigation
  if (e.key === 'ArrowLeft' && e.altKey) {
    const prevBtn = document.querySelector('.btn-prev');
    if (prevBtn) window.location.href = prevBtn.href;
  }
  
  if (e.key === 'ArrowRight' && e.altKey) {
    const nextBtn = document.querySelector('.btn-next');
    if (nextBtn) window.location.href = nextBtn.href;
  }
});

// Analytics simulation (in real app, would integrate with Google Analytics)
function trackEvent(eventName, properties = {}) {
  console.log('Event tracked:', eventName, properties);
  
  // Could integrate with analytics service here
  // gtag('event', eventName, properties);
}

// Track page views
trackEvent('page_view', {
  page: window.location.pathname,
  timestamp: new Date().toISOString()
});

// Export for use in other files
window.CourseUtils = {
  progress: courseProgress,
  showNotification,
  copyCode,
  completeTask,
  downloadResource,
  searchCourse,
  toggleTheme,
  generateCertificate,
  trackEvent
};