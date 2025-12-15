// 1. تعريف المتغيرات والثوابت
const IMAGE_COUNT = 604;
let currentPage = 1; 

const pageImage = document.getElementById('quran-page-image');
const sideMenu = document.getElementById('side-menu');
const subMenuContainer = document.getElementById('sub-menu-container');
const menuContent = document.getElementById('menu-content');

let isMenuVisible = false;
let currentSubMenu = null; 

// 2. دالة بناء اسم ملف الصورة
function getPageFileName(pageNumber) {
    let paddedNumber = String(pageNumber);
    while (paddedNumber.length < 3) {
        paddedNumber = '0' + paddedNumber;
    }
    return 'pages/page_' + paddedNumber + '.png'; 
}

// 3. دالة عرض الصفحة
function showPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= IMAGE_COUNT) {
        currentPage = pageNumber;
        pageImage.src = getPageFileName(pageNumber);
        document.title = 'المصحف - صفحة ' + currentPage;
        window.scrollTo(0, 0); 
    }
}

// 4. دوال التنقل
function nextPage() {
    showPage(currentPage + 1);
}

function previousPage() {
    showPage(currentPage - 1);
}

// 5. دوال إظهار وإخفاء القائمة
function toggleMenu() {
    if (isMenuVisible) {
        sideMenu.classList.add('hidden');
        closeSubMenu(); 
        document.body.focus(); 
    } else {
        sideMenu.classList.remove('hidden');
        const firstMenuItem = menuContent.querySelector('.menu-item');
        if (firstMenuItem) {
            firstMenuItem.focus(); 
        }
    }
    isMenuVisible = !isMenuVisible;
}

function closeSubMenu() {
    subMenuContainer.innerHTML = '';
    currentSubMenu = null;
    menuContent.style.display = 'block'; 
}

// 6. دالة معالجة اختيار القائمة
function handleMenuSelection(action) {
    menuContent.style.display = 'none'; 
    subMenuContainer.innerHTML = ''; 
    
    switch(action) {
        case 'surah':
            showSurahList();
            break;
        case 'juz':
            showJuzList();
            break;
        case 'page':
            showGoToPageDialog();
            break;
    }
}

// 7. دالة عرض قائمة السور
function showSurahList() {
    currentSubMenu = 'surah';
    
    let backButton = '<button class="menu-item" data-action="back" id="back-button">العودة للقائمة الرئيسية</button>';
    subMenuContainer.innerHTML += backButton;
    
    allSurahs.forEach(surah => {
        const button = document.createElement('button');
        button.className = 'list-item';
        button.tabIndex = 0; 
        button.textContent = (surah.id ? surah.id + '. ' : '') + surah.name; 
        
        button.onclick = function() {
            toggleMenu(); 
            showPage(surah.startPage);
        };
        subMenuContainer.appendChild(button);
    });

    const firstSubItem = subMenuContainer.querySelector('.list-item');
    if (firstSubItem) {
        firstSubItem.focus();
    } else {
        document.getElementById('back-button').focus();
    }
    
    document.getElementById('back-button').onclick = function() {
        closeSubMenu();
        menuContent.style.display = 'block';
        menuContent.querySelector('.menu-item').focus(); 
    };
}

// 8. دالة عرض قائمة الأجزاء
function showJuzList() {
    currentSubMenu = 'juz';
    
    let backButton = '<button class="menu-item" data-action="back" id="back-button">العودة للقائمة الرئيسية</button>';
    subMenuContainer.innerHTML += backButton;

    allJuz.forEach(juz => {
        const button = document.createElement('button');
        button.className = 'list-item';
        button.tabIndex = 0; 
        button.textContent = juz.name; 
        
        button.onclick = function() {
            toggleMenu(); 
            showPage(juz.startPage);
        };
        subMenuContainer.appendChild(button);
    });
    
    const firstSubItem = subMenuContainer.querySelector('.list-item');
    if (firstSubItem) {
        firstSubItem.focus();
    } else {
        document.getElementById('back-button').focus();
    }
    
    document.getElementById('back-button').onclick = function() {
        closeSubMenu();
        menuContent.style.display = 'block';
        menuContent.querySelector('.menu-item').focus(); 
    };
}

// 9. دالة مربع حوار الانتقال للصفحة
function showGoToPageDialog() {
    currentSubMenu = 'page';
    
    subMenuContainer.innerHTML = `
        <div class="dialog-box">
            <label style="display:block; margin-bottom: 10px;">أدخل رقم الصفحة (1-${IMAGE_COUNT}):</label>
            <input type="number" id="page-input" class="menu-item" placeholder="رقم الصفحة" style="text-align: left;">
            <button id="go-button" class="menu-item">اذهب</button>
            <button id="cancel-button" class="menu-item">إلغاء</button>
        </div>
    `;
    
    const input = document.getElementById('page-input');
    const goButton = document.getElementById('go-button');
    const cancelButton = document.getElementById('cancel-button');
    
    input.focus(); 

    goButton.onclick = function() {
        const pageNum = parseInt(input.value);
        if (pageNum >= 1 && pageNum <= IMAGE_COUNT) {
            toggleMenu();
            showPage(pageNum);
        } else {
            alert('رقم الصفحة غير صالح.');
            input.focus();
        }
    };
    
    cancelButton.onclick = function() {
        closeSubMenu();
        menuContent.style.display = 'block';
        menuContent.querySelector('.menu-item').focus(); 
    };
}


// 10. تهيئة التطبيق
window.onload = function() {
    showPage(currentPage);
    setupKeyHandling(); 
    
    document.querySelectorAll('#menu-content .menu-item').forEach(button => {
        button.addEventListener('click', function() {
            handleMenuSelection(this.getAttribute('data-action'));
        });
    });
};

// ==========================================================
// 11. دالة التعامل مع ضغطات الريموت (التنقل اليدوي داخل القائمة)
// ==========================================================

function setupKeyHandling() {
    const scrollAmount = window.innerHeight * 0.4; 
    
    const KEY_CODE_BACK = 461; 
    const KEY_CODE_ESCAPE = 27; 
    const KEY_CODE_UP = 38;
    const KEY_CODE_DOWN = 40;
    const KEY_CODE_LEFT = 37;
    const KEY_CODE_RIGHT = 39;
    const KEY_CODE_OK = 13;

    document.addEventListener('keydown', function(event) {
        
        const keyCode = event.keyCode;
        
        // ===================================
        // A. منطق التحكم بالرجوع/الإلغاء
        // ===================================
        if (keyCode === KEY_CODE_BACK || keyCode === KEY_CODE_ESCAPE || keyCode === 8) {
            
            if (isMenuVisible) {
                event.preventDefault();
                // إذا كانت قائمة فرعية، اضغط على زر الرجوع/الإلغاء
                if (currentSubMenu) {
                    const backButton = document.getElementById('cancel-button') || document.getElementById('back-button');
                    if (backButton) {
                        backButton.click();
                        return;
                    }
                }
                // إذا كانت قائمة رئيسية، أغلق القائمة
                toggleMenu();
                return;
            }
            return;
        }

        // ===================================
        // B. منطق التحكم بالأسهم داخل القائمة (التحكم اليدوي)
        // ===================================
        
        if (isMenuVisible && (keyCode === KEY_CODE_UP || keyCode === KEY_CODE_DOWN)) {
            
            event.preventDefault(); // نمنع التمرير الافتراضي للنافذة
            
            const focusableElements = Array.from(
                (currentSubMenu ? subMenuContainer : menuContent).querySelectorAll('.menu-item, .list-item')
            ).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0); // فلترة العناصر المرئية
            
            if (focusableElements.length === 0) return;

            const currentIndex = focusableElements.indexOf(document.activeElement);
            let nextIndex = currentIndex;
            
            // تحديد العنصر التالي بناءً على ضغطة السهم
            if (keyCode === KEY_CODE_DOWN) {
                nextIndex = (currentIndex + 1) % focusableElements.length;
            } else if (keyCode === KEY_CODE_UP) {
                nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
            }
            
            // نقل التركيز
            if (nextIndex !== currentIndex) {
                focusableElements[nextIndex].focus();
                
                // التمرير التلقائي للعنصر الذي تم التركيز عليه داخل الحاوية الفرعية
                if (currentSubMenu) {
                    focusableElements[nextIndex].scrollIntoView({behavior: "smooth", block: "nearest"});
                }
            }
            return; // ننهي الدالة هنا لأننا عالجنا التنقل يدوياً
        }
        
        // ===================================
        // C. منطق التنقل في وضع القراءة (الأسهم يمين/يسار/أعلى/أسفل للتمرير)
        // ===================================
        
        if (!isMenuVisible) {
            switch (keyCode) {
                case KEY_CODE_RIGHT: 
                case KEY_CODE_LEFT: 
                    event.preventDefault(); 
                    (keyCode === KEY_CODE_RIGHT ? previousPage() : nextPage());
                    break;
                case KEY_CODE_UP: 
                    event.preventDefault();
                    window.scrollBy(0, -scrollAmount);
                    break;
                case KEY_CODE_DOWN: 
                    event.preventDefault();
                    window.scrollBy(0, scrollAmount);
                    break;
                
                case KEY_CODE_OK: 
                    event.preventDefault();
                    toggleMenu();
                    break;
            }
        }
        
    });
}