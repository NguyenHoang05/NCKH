console.log("✅ search-autocomplete.js loaded");

// Global variables
let allBooks = [];
let filteredBooks = [];
let selectedIndex = -1;
let searchTimeout = null;

// Initialize search functionality
async function initializeSearch() {
    console.log('Initializing search functionality...');
    
    try {
        // Load sample books data (replace with Firebase later)
        loadSampleBooks();
        console.log(`Loaded ${allBooks.length} books for search`);
        
        // Setup search event listeners
        setupSearchEventListeners();
        
    } catch (error) {
        console.error('Error initializing search:', error);
    }
}

// Load sample books (replace with Firebase integration)
function loadSampleBooks() {
    allBooks = [
        {
            id: "BK001",
            title: "JavaScript Programming",
            author: "John Doe",
            genre: "Công nghệ",
            shelf: "Tủ A - Kệ 3",
            status: "Còn"
        },
        {
            id: "BK002", 
            title: "Web Development Guide",
            author: "Jane Smith",
            genre: "Công nghệ",
            shelf: "Tủ A - Kệ 2",
            status: "Còn"
        },
        {
            id: "BK003",
            title: "Database Management",
            author: "Mike Johnson",
            genre: "Công nghệ",
            shelf: "Tủ B - Kệ 1",
            status: "Đã mượn"
        },
        {
            id: "BK004",
            title: "Lập trình Python",
            author: "Nguyễn Văn A",
            genre: "Công nghệ",
            shelf: "Tủ A - Kệ 4",
            status: "Còn"
        },
        {
            id: "BK005",
            title: "Machine Learning Basics",
            author: "Dr. Sarah Wilson",
            genre: "Trí tuệ nhân tạo",
            shelf: "Tủ C - Kệ 2",
            status: "Còn"
        },
        {
            id: "BK006",
            title: "React Development",
            author: "Alex Chen",
            genre: "Frontend",
            shelf: "Tủ A - Kệ 5",
            status: "Còn"
        }
    ];
}

// Setup event listeners
function setupSearchEventListeners() {
    const searchInput = document.getElementById('bookSearchInput');
    const searchContainer = document.getElementById('searchContainer');
    
    if (searchInput) {
        // Prevent default form submission
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
    
    // Click outside to close suggestions
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            hideSuggestions();
        }
    });
}

// Handle search input
function handleSearchInput(event) {
    const query = event.target.value.trim();
    
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Debounce search
    searchTimeout = setTimeout(() => {
        if (query.length >= 2) {
            searchBooks(query);
            showSuggestions();
        } else if (query.length === 0) {
            hideSuggestions();
        } else {
            hideSuggestions();
        }
    }, 300);
}

// Search books based on query
function searchBooks(query) {
    const lowerQuery = query.toLowerCase();
    
    filteredBooks = allBooks.filter(book => {
        return (
            book.title.toLowerCase().includes(lowerQuery) ||
            book.author.toLowerCase().includes(lowerQuery) ||
            book.genre.toLowerCase().includes(lowerQuery)
        );
    }).slice(0, 8); // Limit to 8 suggestions
    
    selectedIndex = -1;
    displaySuggestions();
}

// Display suggestions
function displaySuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;
    
    if (filteredBooks.length === 0) {
        suggestionsContainer.innerHTML = `
            <div style="
                padding: 20px 30px;
                text-align: center;
                color: #666;
                font-style: italic;
            ">
                <div style="font-size: 2rem; margin-bottom: 10px;">🔍</div>
                <div>Không tìm thấy sách phù hợp</div>
                <div style="font-size: 0.9rem; margin-top: 5px;">Thử tìm kiếm với từ khóa khác</div>
            </div>
        `;
        return;
    }
    
    const suggestionsHTML = filteredBooks.map((book, index) => {
        const isSelected = index === selectedIndex;
        return `
            <div 
                class="suggestion-item" 
                data-index="${index}"
                style="
                    padding: 15px 30px;
                    cursor: pointer;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                    transition: all 0.2s ease;
                    background: ${isSelected ? 'rgba(77, 91, 249, 0.1)' : 'transparent'};
                "
                onmouseenter="selectSuggestion(${index})"
                onclick="selectBook('${book.id}', '${book.title}', '${book.author}')"
            >
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="
                        width: 40px;
                        height: 40px;
                        background: linear-gradient(135deg, #4d5bf9, #6a82fb);
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 1.2rem;
                    ">
                        📚
                    </div>
                    <div style="flex: 1;">
                        <div style="
                            font-weight: 600;
                            color: #1a1a1a;
                            font-size: 1rem;
                            margin-bottom: 4px;
                        ">
                            ${highlightText(book.title, document.getElementById('bookSearchInput').value)}
                        </div>
                        <div style="
                            font-size: 0.9rem;
                            color: #666;
                            display: flex;
                            align-items: center;
                            gap: 15px;
                        ">
                            <span>👤 ${book.author}</span>
                            <span>📖 ${book.genre}</span>
                            <span style="
                                padding: 2px 8px;
                                background: ${book.status === 'Còn' ? 'rgba(76,175,80,0.2)' : 'rgba(255,152,0,0.2)'};
                                color: ${book.status === 'Còn' ? '#4CAF50' : '#FF9800'};
                                border-radius: 12px;
                                font-size: 0.8rem;
                                font-weight: 500;
                            ">
                                ${book.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    suggestionsContainer.innerHTML = suggestionsHTML;
}

// Highlight matching text
function highlightText(text, query) {
    if (!query || query.length < 2) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(77, 91, 249, 0.2); padding: 1px 2px; border-radius: 2px;">$1</mark>');
}

// Handle search focus
function handleSearchFocus() {
    const container = document.getElementById('searchContainer');
    if (container) {
        container.style.boxShadow = '0 30px 100px rgba(77,91,249,0.15)';
        container.style.border = '2px solid #4d5bf9';
    }
    
    const query = document.getElementById('bookSearchInput').value.trim();
    if (query.length >= 2) {
        showSuggestions();
    }
}

// Handle search blur
function handleSearchBlur() {
    // Delay hiding to allow clicks on suggestions
    setTimeout(() => {
        const container = document.getElementById('searchContainer');
        if (container) {
            container.style.boxShadow = '0 25px 80px rgba(0,0,0,0.08)';
            container.style.border = '2px solid #e2e8f0';
        }
        hideSuggestions();
    }, 200);
}

// Show suggestions
function showSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    if (suggestions && filteredBooks.length > 0) {
        suggestions.style.display = 'block';
    }
}

// Hide suggestions
function hideSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    if (suggestions) {
        suggestions.style.display = 'none';
        selectedIndex = -1;
    }
}

// Handle keyboard navigation
function handleSearchKeydown(event) {
    const suggestions = document.getElementById('searchSuggestions');
    if (!suggestions || suggestions.style.display === 'none') {
        if (event.key === 'Enter') {
            performSearch();
        }
        return;
    }
    
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, filteredBooks.length - 1);
            updateSelection();
            break;
            
        case 'ArrowUp':
            event.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateSelection();
            break;
            
        case 'Enter':
            event.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < filteredBooks.length) {
                const book = filteredBooks[selectedIndex];
                selectBook(book.id, book.title, book.author);
            } else {
                performSearch();
            }
            break;
            
        case 'Escape':
            hideSuggestions();
            break;
    }
}

// Update selection visual
function updateSelection() {
    const suggestions = document.getElementById('searchSuggestions');
    if (!suggestions) return;
    
    const items = suggestions.querySelectorAll('.suggestion-item');
    items.forEach((item, index) => {
        item.style.background = index === selectedIndex ? 'rgba(77, 91, 249, 0.1)' : 'transparent';
    });
}

// Select suggestion by index
function selectSuggestion(index) {
    selectedIndex = index;
    updateSelection();
}

// Select a book from suggestions
function selectBook(bookId, bookTitle, bookAuthor) {
    const searchInput = document.getElementById('bookSearchInput');
    if (searchInput) {
        searchInput.value = bookTitle;
    }
    
    hideSuggestions();
    
    // Show book details or navigate to book page
    showBookDetails(bookId, bookTitle, bookAuthor);
}

// Show book details (placeholder)
function showBookDetails(bookId, bookTitle, bookAuthor) {
    // Create a modal or show details in a card
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(5px);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            position: relative;
            animation: slideInUp 0.3s ease;
        ">
            <button onclick="this.closest('.book-modal').remove()" style="
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                transition: color 0.3s;
            " onmouseover="this.style.color='#f44336'">×</button>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #4d5bf9, #6a82fb);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 15px;
                    font-size: 2rem;
                ">
                    📚
                </div>
                <h3 style="color: #1a1a1a; font-size: 1.4rem; font-weight: 600; margin: 0;">
                    ${bookTitle}
                </h3>
                <p style="color: #666; margin: 8px 0 0 0;">
                    Tác giả: ${bookAuthor}
                </p>
            </div>
            
            <div style="
                background: rgba(77, 91, 249, 0.1);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
            ">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666; font-weight: 500;">ID Sách:</span>
                    <span style="color: #1a1a1a; font-weight: 600; font-family: monospace;">${bookId}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #666; font-weight: 500;">Trạng thái:</span>
                    <span style="
                        padding: 4px 12px;
                        background: rgba(76,175,80,0.2);
                        color: #4CAF50;
                        border-radius: 12px;
                        font-size: 0.9rem;
                        font-weight: 500;
                    ">Còn</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="this.closest('.book-modal').remove()" style="
                    flex: 1;
                    padding: 12px;
                    background: #f5f5f5;
                    border: none;
                    border-radius: 10px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.3s;
                " onmouseover="this.style.background='#e0e0e0'">Đóng</button>
                <button onclick="requestBook('${bookId}')" style="
                    flex: 1;
                    padding: 12px;
                    background: linear-gradient(135deg, #4d5bf9, #6a82fb);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform 0.3s;
                " onmouseover="this.style.transform='translateY(-2px)'">Yêu cầu mượn</button>
            </div>
        </div>
    `;
    
    modal.className = 'book-modal';
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Request book function
function requestBook(bookId) {
    alert(`Đã gửi yêu cầu mượn sách ID: ${bookId}\n\nYêu cầu sẽ được xử lý bởi thủ thư.`);
    document.querySelector('.book-modal').remove();
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('bookSearchInput');
    const query = searchInput.value.trim();
    
    if (query.length < 2) {
        alert('Vui lòng nhập ít nhất 2 ký tự để tìm kiếm!');
        return;
    }
    
    hideSuggestions();
    
    // Perform actual search
    console.log('Performing search for:', query);
    
    // Show search results (placeholder)
    showSearchResults(query);
}

// Show search results (placeholder)
function showSearchResults(query) {
    const results = filteredBooks.filter(book => {
        const lowerQuery = query.toLowerCase();
        return (
            book.title.toLowerCase().includes(lowerQuery) ||
            book.author.toLowerCase().includes(lowerQuery) ||
            book.genre.toLowerCase().includes(lowerQuery)
        );
    });
    
    if (results.length === 0) {
        alert(`Không tìm thấy sách nào với từ khóa: "${query}"`);
        return;
    }
    
    // Create results modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(5px);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    const resultsHTML = results.map(book => `
        <div style="
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.3s;
        " onclick="selectBook('${book.id}', '${book.title}', '${book.author}')" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #4d5bf9, #6a82fb);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.5rem;
                ">
                    📚
                </div>
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 5px 0; color: #1a1a1a; font-size: 1.1rem;">
                        ${book.title}
                    </h4>
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">
                        Tác giả: ${book.author} • Thể loại: ${book.genre}
                    </p>
                </div>
                <div style="
                    padding: 6px 12px;
                    background: rgba(76,175,80,0.2);
                    color: #4CAF50;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 500;
                ">
                    ${book.status}
                </div>
            </div>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #1a1a1a; font-size: 1.3rem;">
                    Kết quả tìm kiếm: "${query}"
                </h3>
                <button onclick="this.closest('.search-results-modal').remove()" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                    transition: color 0.3s;
                " onmouseover="this.style.color='#f44336'">×</button>
            </div>
            <div style="margin-bottom: 20px; color: #666; font-size: 0.9rem;">
                Tìm thấy ${results.length} kết quả
            </div>
            <div>
                ${resultsHTML}
            </div>
        </div>
    `;
    
    modal.className = 'search-results-modal';
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing search...');
    initializeSearch();
});

// Export functions for global access
window.handleSearchFocus = handleSearchFocus;
window.handleSearchBlur = handleSearchBlur;
window.handleSearchInput = handleSearchInput;
window.handleSearchKeydown = handleSearchKeydown;
window.performSearch = performSearch;
window.selectSuggestion = selectSuggestion;
window.selectBook = selectBook;
window.requestBook = requestBook;
