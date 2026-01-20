      // Complete translations
        const translations = {
            en: {
                personal: "Personal", experience: "Experience", education: "Education", 
                languages: "Languages", projects: "Projects", download: "Download PDF",
                add: "Add", removePhoto: "Remove Photo", photoHelp: "Photo Settings",
                sizeLabel: "Size", positionLabel: "Position", frameLabel: "Frame",
                name: "Full Name", jobTitle: "Job Title", email: "Email", phone: "Phone", address: "Address",
                company: "Company", role: "Role", desc: "Description", 
                school: "School/University", degree: "Degree", lang: "Language",
                projTitle: "Project Title", projDesc: "Project Description"
            },
            hi: {
                personal: "व्यक्तिगत", experience: "अनुभव", education: "शिक्षा", 
                languages: "भाषाएँ", projects: "प्रोजेक्ट्स", download: "पीडीएफ डाउनलोड",
                add: "जोड़ें", removePhoto: "फोटो हटाएँ", photoHelp: "फोटो सेटिंग्स",
                sizeLabel: "आकार", positionLabel: "स्थिति", frameLabel: "फ़्रेम",
                name: "पूरा नाम", jobTitle: "नौकरी का पद", email: "ईमेल", phone: "फ़ोन", address: "पता",
                company: "कंपनी", role: "भूमिका", desc: "विवरण", 
                school: "स्कूल/विश्वविद्यालय", degree: "डिग्री", lang: "भाषा",
                projTitle: "प्रोजेक्ट शीर्षक", projDesc: "विवरण"
            },
            ur: {
                personal: "ذاتی", experience: "تجربہ", education: "تعلیم", 
                languages: "زبانیں", projects: "پروجیکٹس", download: "پی ڈی ایف ڈاؤن لوڈ",
                add: "شامل کریں", removePhoto: "تصویر ہٹائیں", photoHelp: "تصویر کی ترتیبات",
                sizeLabel: "سائز", positionLabel: "پوزیشن", frameLabel: "فریم",
                name: "مکمل نام", jobTitle: "ملازمت کا عہدہ", email: "ای میل", phone: "فون", address: "پتہ",
                company: "کمپنی", role: "کردار", desc: "تفصیل", 
                school: "اسکول/یونیورسٹی", degree: "ڈگری", lang: "زبان",
                projTitle: "پروجیکٹ کا عنوان", projDesc: "تفصیل"
            },
            fr: {
                personal: "Personnel", experience: "Expérience", education: "Éducation", 
                languages: "Langues", projects: "Projets", download: "Télécharger PDF",
                add: "Ajouter", removePhoto: "Supprimer Photo", photoHelp: "Paramètres Photo",
                sizeLabel: "Taille", positionLabel: "Position", frameLabel: "Cadre",
                name: "Nom Complet", jobTitle: "Poste", email: "Email", phone: "Téléphone", address: "Adresse",
                company: "Entreprise", role: "Rôle", desc: "Description", 
                school: "École/Université", degree: "Diplôme", lang: "Langue",
                projTitle: "Titre Projet", projDesc: "Description"
            }
        };

        let currentLang = 'en';
        let imageData = null;
        let currentPhotoSize = 100;

        function t(key) {
            return translations[currentLang][key] || key;
        }

        function changeLanguage() {
            currentLang = document.getElementById('lang-select').value;
            
            const labels = {
                'personal-label': 'personal', 'experience-label': 'experience',
                'education-label': 'education', 'languages-label': 'languages',
                'projects-label': 'projects', 'photo-help-label': 'photoHelp',
                'size-label': 'sizeLabel', 'position-label': 'positionLabel',
                'frame-label': 'frameLabel', 'remove-photo-span': 'removePhoto',
                'add-exp-btn': 'add', 'add-edu-btn': 'add', 
                'add-lang-btn': 'add', 'add-proj-btn': 'add'
            };

            Object.entries(labels).forEach(([id, key]) => {
                const el = document.getElementById(id);
                if (el) el.textContent = t(key);
            });

            // Update preview headers
            ['experience', 'education', 'languages', 'projects'].forEach(type => {
                const el = document.getElementById(`p-${type}-header`);
                if (el) el.textContent = t(type);
            });

            // Update input placeholders
            const inputs = {
                'name': 'name', 'title': 'jobTitle', 'email': 'email', 
                'phone': 'phone', 'address': 'address'
            };
            Object.entries(inputs).forEach(([id, key]) => {
                const el = document.getElementById(id);
                if (el) el.placeholder = t(key);
            });

            // RTL Support
            const preview = document.getElementById('resume-preview');
            if (currentLang === 'ur') {
                preview.dir = 'rtl';
                preview.style.fontFamily = "'Noto Nastaliq Urdu', serif";
            } else {
                preview.dir = 'ltr';
                preview.style.fontFamily = "'Inter', sans-serif";
            }

            renderPreview();
        }

        function updatePhotoSize() {
            currentPhotoSize = parseInt(document.getElementById('photo-size').value);
            const height = Math.round(currentPhotoSize * 1.2);
            document.getElementById('size-display').textContent = `${currentPhotoSize}×${height}px`;
            document.documentElement.style.setProperty('--photo-width', currentPhotoSize + 'px');
            document.documentElement.style.setProperty('--photo-height', height + 'px');
            
            if (imageData) {
                const preview = document.getElementById('image-preview');
                preview.style.width = currentPhotoSize + 'px';
                preview.style.height = height + 'px';
            }
            renderPreview();
        }

        function updatePhotoPosition() { updatePhotoClasses(); }
        function updatePhotoFrame() { updatePhotoClasses(); }

        function updatePhotoClasses() {
            const pos = document.getElementById('photo-position').value;
            const frame = document.getElementById('photo-frame').value;
            const previewImg = document.getElementById('preview-image');
            previewImg.className = `photo-${pos} frame-${frame}`;
            
            const thumb = document.getElementById('image-preview');
            if (thumb.src) thumb.className = `frame-${frame}`;
        }

        function handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = e => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const size = currentPhotoSize;
                    const height = Math.round(size * 1.2);
                    
                    canvas.width = size;
                    canvas.height = height;
                    
                    const imgRatio = img.width / img.height;
                    const targetRatio = size / height;
                    let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
                    
                    if (imgRatio > targetRatio) {
                        sWidth = img.height * targetRatio;
                        sx = (img.width - sWidth) / 2;
                    } else {
                        sHeight = img.width / targetRatio;
                        sy = (img.height - sHeight) / 2;
                    }
                    
                    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, height);
                    imageData = canvas.toDataURL('image/jpeg', 0.95);
                    applyImage();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function applyImage() {
            const previewImg = document.getElementById('preview-image');
            const thumbImg = document.getElementById('image-preview');
            const clearBtn = document.getElementById('clear-img-btn');
            
            previewImg.src = imageData;
            previewImg.style.display = 'block';
            thumbImg.src = imageData;
            thumbImg.style.display = 'block';
            clearBtn.style.display = 'block';
            updatePhotoClasses();
        }

        function clearImage() {
            imageData = null;
            document.getElementById('preview-image').style.display = 'none';
            document.getElementById('image-preview').style.display = 'none';
            document.getElementById('clear-img-btn').style.display = 'none';
            document.getElementById('image-input').value = '';
        }

        function updateField(field, value) {
            document.getElementById(`p-${field}`).textContent = value || '-';
        }

        function addItem(type) {
            const container = document.getElementById(`${type}-list`);
            const id = Date.now();
            const div = document.createElement('div');
            div.className = 'dynamic-list-item';
            div.id = `item-${id}`;
            
            let html = '';
            if (type === 'experience') {
                html = `
                    <input type="text" class="inp-role" placeholder="${t('role')}" oninput="renderPreview()">
                    <input type="text" class="inp-company" placeholder="${t('company')}" oninput="renderPreview()">
                    <input type="text" class="inp-date" placeholder="2020 - Present" oninput="renderPreview()">
                    <textarea class="inp-desc" placeholder="${t('desc')}" rows="2" oninput="renderPreview()"></textarea>
                `;
            } else if (type === 'education') {
                html = `
                    <input type="text" class="inp-degree" placeholder="${t('degree')}" oninput="renderPreview()">
                    <input type="text" class="inp-school" placeholder="${t('school')}" oninput="renderPreview()">
                    <input type="text" class="inp-year" placeholder="Year" oninput="renderPreview()">
                `;
            } else if (type === 'language') {
                html = `<input type="text" class="inp-lang" placeholder="${t('lang')}" oninput="renderPreview()">`;
            } else if (type === 'project') {
                html = `
                    <input type="text" class="inp-title" placeholder="${t('projTitle')}" oninput="renderPreview()">
                    <textarea class="inp-desc" placeholder="${t('projDesc')}" rows="2" oninput="renderPreview()"></textarea>
                `;
            }
            
            // FIXED: Remove button now correctly says "Remove"
            html += `<button class="danger" onclick="removeItem('item-${id}')" style="width: 100%; margin-top: 8px;">${t('remove')}</button>`;
            div.innerHTML = html;
            container.appendChild(div);
            renderPreview();
        }

        function removeItem(id) {
            document.getElementById(id).remove();
            renderPreview();
        }

        function renderPreview() {
            // Experience
            const expContainer = document.getElementById('p-experience-container');
            let expHtml = '';
            document.querySelectorAll('#experience-list .dynamic-list-item').forEach(item => {
                const role = item.querySelector('.inp-role')?.value || '';
                const company = item.querySelector('.inp-company')?.value || '';
                const date = item.querySelector('.inp-date')?.value || '';
                const desc = item.querySelector('.inp-desc')?.value || '';
                
                if (role || company) {
                    expHtml += `
                        <div class="item">
                            <div class="item-header">${role}${company ? ' at ' + company : ''}${date ? ' | ' + date : ''}</div>
                            ${desc ? `<div class="item-sub">${desc}</div>` : ''}
                        </div>
                    `;
                }
            });
            expContainer.innerHTML = expHtml;

            // Education
            const eduContainer = document.getElementById('p-education-container');
            let eduHtml = '';
            document.querySelectorAll('#education-list .dynamic-list-item').forEach(item => {
                const degree = item.querySelector('.inp-degree')?.value || '';
                const school = item.querySelector('.inp-school')?.value || '';
                const year = item.querySelector('.inp-year')?.value || '';
                
                if (degree || school) {
                    eduHtml += `
                        <div class="item">
                            <div class="item-header">${degree}${school ? ', ' + school : ''}</div>
                            ${year ? `<div class="item-sub">${year}</div>` : ''}
                        </div>
                    `;
                }
            });
            eduContainer.innerHTML = eduHtml;

            // Languages
            const langContainer = document.getElementById('p-language-container');
            let langHtml = '';
            document.querySelectorAll('#language-list .dynamic-list-item').forEach(item => {
                const lang = item.querySelector('.inp-lang')?.value || '';
                if (lang) {
                    langHtml += `<div class="item">${lang}</div>`;
                }
            });
            langContainer.innerHTML = langHtml;

            // Projects
            const projContainer = document.getElementById('p-project-container');
            let projHtml = '';
            document.querySelectorAll('#project-list .dynamic-list-item').forEach(item => {
                const title = item.querySelector('.inp-title')?.value || '';
                const desc = item.querySelector('.inp-desc')?.value || '';
                
                if (title) {
                    projHtml += `
                        <div class="item">
                            <div class="item-header">${title}</div>
                            ${desc ? `<div class="item-sub">${desc}</div>` : ''}
                        </div>
                    `;
                }
            });
            projContainer.innerHTML = projHtml;
        }

        function changeTemplate() {
            const template = document.getElementById('template-select').value;
            const preview = document.getElementById('resume-preview');
            preview.className = template;
        }

        function generatePDF() {
            const element = document.getElementById('resume-preview');
            const opt = {
                margin: 0,
                filename: 'resume.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true,
                    letterRendering: true,
                    allowTaint: true
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait' 
                }
            };
            html2pdf().set(opt).from(element).save();
        }

        // Initialization
        window.onload = function() {
            updatePhotoSize();
            changeLanguage();
            addItem('experience');
            addItem('education');
            addItem('language');
            addItem('project');
        };

        function toggleTheme() {
    const body = document.body;
    const toggleBtn = document.getElementById("theme-toggle");
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
}
function showWhatsNew() {
  // Get the current count from localStorage, default to 0 if not set
  let seenCount = parseInt(localStorage.getItem("whatsNewSeenCount")) || 0;

  // Show the modal only if it has been seen fewer than 2 times
  if (seenCount < 2) {
    document.getElementById("whatsNewModal").style.display = "block";
  }
}

function closeWhatsNew() {
  document.getElementById("whatsNewModal").style.display = "none";

  // Increment the counter and save it back to localStorage
  let seenCount = parseInt(localStorage.getItem("whatsNewSeenCount")) || 0;
  localStorage.setItem("whatsNewSeenCount", seenCount + 1);
}

window.onload = showWhatsNew;
