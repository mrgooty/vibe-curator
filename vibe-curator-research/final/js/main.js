// Main JavaScript for Vibe-Curator Research Report
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCollapsibleSections();
    initializeTabs();
    initializeScrollEffects();
    initializeSyntaxHighlighting();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                
                // Update active nav link
                updateActiveNavLink(this);
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        updateActiveNavLinkOnScroll();
        updateNavbarBackground();
    });
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function updateNavbarBackground() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}

// Collapsible sections functionality
function initializeCollapsibleSections() {
    const collapsibleTitles = document.querySelectorAll('.collapsible');
    
    collapsibleTitles.forEach(title => {
        title.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const content = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (content) {
                // Toggle active class on title
                this.classList.toggle('active');
                
                // Toggle content visibility
                if (content.classList.contains('active')) {
                    content.classList.remove('active');
                    content.style.maxHeight = '0';
                    if (icon) icon.style.transform = 'rotate(0deg)';
                } else {
                    content.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    if (icon) icon.style.transform = 'rotate(90deg)';
                }
            }
        });
    });

    // Auto-expand first section in each category
    const firstCollapsibles = document.querySelectorAll('.research-subsection:first-child .collapsible');
    firstCollapsibles.forEach(title => {
        title.click();
    });
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabContainer = this.closest('.tabs');
            
            if (tabContainer) {
                // Remove active class from all buttons and contents in this container
                tabContainer.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                tabContainer.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            }
        });
    });
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.summary-card, .pattern-card, .tip-card, .research-subsection');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Syntax highlighting initialization
function initializeSyntaxHighlighting() {
    // Prism.js will automatically highlight code blocks
    // This function can be extended for custom highlighting features
    
    // Add copy button to code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const pre = block.parentElement;
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copy code';
        
        copyButton.addEventListener('click', function() {
            const text = block.textContent;
            navigator.clipboard.writeText(text).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.style.color = 'var(--success-500)';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.style.color = '';
                }, 2000);
            });
        });
        
        pre.style.position = 'relative';
        pre.appendChild(copyButton);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Search functionality (if needed)
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const debouncedSearch = debounce(performSearch, 300);
        searchInput.addEventListener('input', debouncedSearch);
    }
}

function performSearch(event) {
    const query = event.target.value.toLowerCase();
    const searchableElements = document.querySelectorAll('h2, h3, h4, h5, p, li');
    
    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        const parent = element.closest('.research-subsection, .summary-card, .pattern-card');
        
        if (text.includes(query) || query === '') {
            if (parent) parent.style.display = '';
            element.style.display = '';
        } else {
            if (parent) parent.style.display = 'none';
        }
    });
}

// Print functionality
function initializePrint() {
    const printButton = document.getElementById('print-button');
    if (printButton) {
        printButton.addEventListener('click', function() {
            // Expand all collapsible sections before printing
            const collapsibleContents = document.querySelectorAll('.collapsible-content');
            collapsibleContents.forEach(content => {
                content.classList.add('active');
                content.style.maxHeight = 'none';
            });
            
            // Print the page
            window.print();
        });
    }
}

// Table of contents generation
function generateTableOfContents() {
    const toc = document.getElementById('table-of-contents');
    if (!toc) return;
    
    const headings = document.querySelectorAll('h2, h3, h4');
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        // Create ID if it doesn't exist
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        a.className = `toc-link toc-${heading.tagName.toLowerCase()}`;
        
        li.appendChild(a);
        tocList.appendChild(li);
    });
    
    toc.appendChild(tocList);
}

// Export functionality
function initializeExport() {
    const exportButton = document.getElementById('export-button');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            // This could be extended to export as PDF or other formats
            const content = document.querySelector('.main-content').innerHTML;
            const blob = new Blob([content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'vibe-curator-research-report.html';
            a.click();
            URL.revokeObjectURL(url);
        });
    }
}

// Theme toggle (if dark mode is implemented)
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializePrint();
    generateTableOfContents();
    initializeExport();
    initializeThemeToggle();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + P for print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        const printButton = document.getElementById('print-button');
        if (printButton) printButton.click();
    }
    
    // Ctrl/Cmd + F for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    }
});

// Performance monitoring
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page Load Performance:', {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            totalTime: perfData.loadEventEnd - perfData.fetchStart
        });
    });
}

// Initialize performance monitoring in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    initializePerformanceMonitoring();
}