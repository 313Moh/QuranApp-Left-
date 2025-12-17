const IMAGE_COUNT = 604;
let currentPage = 1;

const pageImage = document.getElementById('quran-page-image');
const sideMenu = document.getElementById('side-menu');
const subMenuContainer = document.getElementById('sub-menu-container');
const menuContent = document.getElementById('menu-content');
const focusTrap = document.getElementById('tv-focus-trap');

let isMenuVisible = false;
let currentSubMenu = null;

// ================================
// حبس المؤشر (حل مشكلة التلفزيون)
// ================================
function lockFocus() {
    if (!isMenuVisible && document.activeElement !== focusTrap) {
        focusTrap.focus();
    }
}
setInterval(lockFocus, 200);

// ================================
function getPageFileName(pageNumber) {
    return 'pages/page_' + String(pageNumber).padStart(3, '0') + '.png';
}

function showPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= IMAGE_COUNT) {
        currentPage = pageNumber;
        pageImage.src = getPageFileName(pageNumber);
        window.scrollTo(0, 0);
    }
}

function nextPage() { showPage(currentPage + 1); }
function previousPage() { showPage(currentPage - 1); }

// ================================
function toggleMenu() {
    isMenuVisible = !isMenuVisible;
    sideMenu.classList.toggle('hidden', !isMenuVisible);

    if (isMenuVisible) {
        menuContent.querySelector('.menu-item')?.focus();
    } else {
        closeSubMenu();
        focusTrap.focus();
    }
}

function closeSubMenu() {
    subMenuContainer.innerHTML = '';
    currentSubMenu = null;
    menuContent.style.display = 'block';
}

// ================================
window.onload = () => {
    showPage(currentPage);
    setupKeyHandling();

    document.querySelectorAll('.menu-item').forEach(btn => {
        btn.onclick = () => handleMenuSelection(btn.dataset.action);
    });
};

// ================================
// التحكم بالريموت (السيطرة الكاملة)
// ================================
function setupKeyHandling() {
    const scrollAmount = window.innerHeight * 0.4;

    document.addEventListener('keydown', e => {
        const key = e.keyCode;

        // منع المتصفح من استخدام الأسهم
        if ([37,38,39,40,13].includes(key)) {
            e.preventDefault();
            e.stopPropagation();
        }

        // BACK
        if (key === 461 || key === 27 || key === 8) {
            if (isMenuVisible) toggleMenu();
            return;
        }

        // وضع القراءة
        if (!isMenuVisible) {
            if (key === 39) previousPage();
            if (key === 37) nextPage();
            if (key === 38) window.scrollBy(0, -scrollAmount);
            if (key === 40) window.scrollBy(0, scrollAmount);
            if (key === 13) toggleMenu();
        }
    }, true);

}
