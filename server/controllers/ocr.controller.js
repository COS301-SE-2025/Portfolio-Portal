 pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        class CVScanner {
            constructor() {
                this.fileInput = document.getElementById('fileInput');
                this.uploadArea = document.getElementById('uploadArea');
                this.scanButton = document.getElementById('scanButton');
                this.progressBar = document.getElementById('progressBar');
                this.progressFill = document.getElementById('progressFill');
                this.status = document.getElementById('status');
                this.results = document.getElementById('results');
                this.selectedFile = null;
                
                this.initializeEventListeners();
            }

            initializeEventListeners() {
                // File input handling
                this.uploadArea.addEventListener('click', () => this.fileInput.click());
                this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files[0]));
                
                // Drag and drop
                this.uploadArea.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    this.uploadArea.classList.add('dragover');
                });
                
                this.uploadArea.addEventListener('dragleave', () => {
                    this.uploadArea.classList.remove('dragover');
                });
                
                this.uploadArea.addEventListener('drop', (e) => {
                    e.preventDefault();
                    this.uploadArea.classList.remove('dragover');
                    const file = e.dataTransfer.files[0];
                    if (file && file.type === 'application/pdf') {
                        this.handleFileSelect(file);
                    }
                });
                
                this.scanButton.addEventListener('click', () => this.scanPDF());
            }

            handleFileSelect(file) {
                if (file && file.type === 'application/pdf') {
                    this.selectedFile = file;
                    this.scanButton.disabled = false;
                    this.updateStatus(`Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
                    this.uploadArea.innerHTML = `
                        <div class="upload-icon">✅</div>
                        <div class="upload-text">PDF Ready!</div>
                        <div class="upload-subtext">${file.name}</div>
                    `;
                } else {
                    alert('Please select a valid PDF file.');
                }
            }

            updateStatus(message) {
                this.status.textContent = message;
            }

            updateProgress(percentage) {
                this.progressFill.style.width = percentage + '%';
            }

            async scanPDF() {
                if (!this.selectedFile) return;

                this.scanButton.disabled = true;
                this.progressBar.style.display = 'block';
                this.updateProgress(0);
                this.updateStatus('Loading PDF...');

                try {
                    // Convert PDF to images
                    const images = await this.pdfToImages(this.selectedFile);
                    this.updateProgress(30);
                    
                    // Perform OCR on all images
                    let allText = '';
                    for (let i = 0; i < images.length; i++) {
                        this.updateStatus(`Processing page ${i + 1} of ${images.length}...`);
                        const text = await this.performOCR(images[i]);
                        allText += text + '\n\n';
                        this.updateProgress(30 + (i + 1) / images.length * 50);
                    }

                    // Extract structured information
                    this.updateStatus('Extracting CV information...');
                    const extractedInfo = this.extractCVInfo(allText);
                    this.updateProgress(90);
                    
                    // Display results
                    this.displayResults(extractedInfo);
                    this.updateProgress(100);
                    this.updateStatus('CV scanning completed!');
                    
                } catch (error) {
                    console.error('Error scanning PDF:', error);
                    this.updateStatus('Error scanning PDF. Please try again.');
                    this.results.innerHTML = `<p style="color: #e74c3c;">Error: ${error.message}</p>`;
                } finally {
                    this.scanButton.disabled = false;
                    setTimeout(() => {
                        this.progressBar.style.display = 'none';
                    }, 2000);
                }
            }

            async pdfToImages(file) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const images = [];

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const scale = 2.0; // Higher scale for better OCR
                    const viewport = page.getViewport({ scale });
                    
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise;

                    images.push(canvas);
                }

                return images;
            }

            async performOCR(canvas) {
                const { data: { text } } = await Tesseract.recognize(canvas, 'eng', {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            // Update progress for OCR
                        }
                    }
                });
                return text;
            }

            extractCVInfo(text) {
                const lines = text.split('\n').filter(line => line.trim().length > 0);
                
                const info = {
                    name: '',
                    contact: {
                        address: '',
                        mobile: '',
                        email: '',
                        linkedin: '',
                        github: ''
                    },
                    profile: '',
                    education: [],
                    experience: [],
                    skills: '',
                    certifications: [],
                    references: []
                };

                // Extract name (enhanced robust detection)
                info.name = this.extractNameRobust(lines, text);
                
                // Extract contact information
                info.contact = this.extractContact(text);
                
                // Extract sections
                info.profile = this.extractSection(text, ['profile', 'summary', 'about', 'objective']);
                info.education = this.extractEducation(text);
                info.experience = this.extractExperience(text);
                info.skills = this.extractSkills(text);
                info.certifications = this.extractCertifications(text);
                info.references = this.extractReferences(text);

                return info;
            }

            extractNameRobust(lines, fullText) {
                const candidates = [];
                
                // Common name patterns and indicators
                const commonTitles = ['mr', 'mrs', 'ms', 'dr', 'prof', 'professor'];
                const commonSuffixes = ['jr', 'sr', 'ii', 'iii', 'iv', 'phd', 'md', 'esq'];
                const skipKeywords = [
                    'curriculum', 'vitae', 'cv', 'resume', 'aspiring', 'age', 'address', 
                    'contact', 'objective', 'profile', 'summary', 'about', 'personal',
                    'information', 'details', 'email', 'phone', 'mobile', 'cell',
                    'telephone', 'linkedin', 'github', 'website', 'portfolio', 'born',
                    'nationality', 'citizen', 'passport', 'id', 'number', 'code',
                    'university', 'college', 'school', 'education', 'degree', 'bachelor',
                    'master', 'qualification', 'certificate', 'diploma', 'experience',
                    'work', 'employment', 'position', 'job', 'role', 'company', 'skills',
                    'technical', 'programming', 'software', 'language', 'project',
                    'reference', 'available', 'request', 'date', 'location', 'city',
                    'province', 'country', 'south', 'africa', 'gauteng', 'western',
                    'cape', 'kwazulu', 'natal', 'street', 'road', 'avenue', 'drive'
                ];

                // Method 1: Look for name-like patterns in first 20 lines
                for (let i = 0; i < Math.min(20, lines.length); i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    const words = line.split(/\s+/).filter(w => w.length > 0);
                    const lineScore = this.scoreNameCandidate(line, words, skipKeywords, commonTitles, commonSuffixes);
                    
                    if (lineScore > 0) {
                        candidates.push({
                            text: line,
                            score: lineScore + (20 - i) * 0.5, // Prefer earlier lines
                            position: i
                        });
                    }
                }

                // Method 2: Look for patterns like "Name: John Doe" or "Full Name: John Doe"
                const namePatterns = [
                    /(?:name|full\s*name|candidate\s*name|applicant)\s*[:]\s*([A-Z][a-zA-Z\s'.'-]{2,40})/i,
                    /(?:^|\n)\s*([A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\s*(?:\n|$)/,
                    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s*(?:\n|,|\s{3,})/
                ];

                for (const pattern of namePatterns) {
                    const match = fullText.match(pattern);
                    if (match && match[1]) {
                        const candidate = match[1].trim();
                        const words = candidate.split(/\s+/);
                        const score = this.scoreNameCandidate(candidate, words, skipKeywords, commonTitles, commonSuffixes);
                        
                        if (score > 0) {
                            candidates.push({
                                text: candidate,
                                score: score + 3, // Bonus for explicit name format
                                position: -1
                            });
                        }
                    }
                }

                // Method 3: Look for names in header/title position (larger font size indicators)
                const headerPatterns = [
                    /^([A-Z][A-Z\s]+[A-Z])$/m, // All caps names
                    /^([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)+)$/m // Title case at line start
                ];

                for (const pattern of headerPatterns) {
                    const matches = fullText.match(new RegExp(pattern.source, 'gm'));
                    if (matches) {
                        for (const match of matches) {
                            const candidate = match.trim();
                            const words = candidate.split(/\s+/);
                            const score = this.scoreNameCandidate(candidate, words, skipKeywords, commonTitles, commonSuffixes);
                            
                            if (score > 0) {
                                candidates.push({
                                    text: candidate,
                                    score: score + 2, // Bonus for header format
                                    position: -1
                                });
                            }
                        }
                    }
                }

                // Method 4: Context-based detection (before contact info)
                const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                if (emailMatch) {
                    const emailIndex = fullText.indexOf(emailMatch[0]);
                    const textBeforeEmail = fullText.substring(0, emailIndex);
                    const linesBeforeEmail = textBeforeEmail.split('\n').slice(-5); // Last 5 lines before email
                    
                    for (const line of linesBeforeEmail) {
                        const candidate = line.trim();
                        if (!candidate) continue;
                        
                        const words = candidate.split(/\s+/);
                        const score = this.scoreNameCandidate(candidate, words, skipKeywords, commonTitles, commonSuffixes);
                        
                        if (score > 0) {
                            candidates.push({
                                text: candidate,
                                score: score + 1.5, // Bonus for being near contact info
                                position: -1
                            });
                        }
                    }
                }

                // Sort candidates by score and return the best one
                candidates.sort((a, b) => b.score - a.score);
                
                // Filter out duplicates and very similar candidates
                const uniqueCandidates = [];
                for (const candidate of candidates) {
                    const isDuplicate = uniqueCandidates.some(existing => 
                        this.similarity(candidate.text.toLowerCase(), existing.text.toLowerCase()) > 0.8
                    );
                    if (!isDuplicate) {
                        uniqueCandidates.push(candidate);
                    }
                }

                if (uniqueCandidates.length > 0) {
                    // Clean up the best candidate
                    return this.cleanNameCandidate(uniqueCandidates[0].text);
                }

                return 'Name not found';
            }

            scoreNameCandidate(text, words, skipKeywords, commonTitles, commonSuffixes) {
                const lowerText = text.toLowerCase();
                let score = 0;

                // Immediately disqualify if contains skip keywords
                if (skipKeywords.some(keyword => lowerText.includes(keyword))) {
                    return 0;
                }

                // Disqualify if it looks like contact info
                if (/[@]|www\.|http|\.com|\.co\.|phone|tel:|cell:|mobile:|address:|street|road|avenue|drive/i.test(text)) {
                    return 0;
                }

                // Disqualify if it contains numbers (except Roman numerals)
                if (/\d/.test(text) && !/\b[IVX]+\b/.test(text)) {
                    return 0;
                }

                // Must be reasonable length
                if (text.length < 4 || text.length > 50) {
                    return 0;
                }

                // Must have 2-4 words for full name
                if (words.length < 2 || words.length > 4) {
                    return 0;
                }

                // All words should be alphabetic (with some exceptions)
                if (!words.every(word => /^[A-Za-z'.'-]+$/.test(word))) {
                    return 0;
                }

                // Start scoring
                score = 5; // Base score

                // Bonus for proper capitalization
                const properCase = words.every(word => {
                    // Handle titles and suffixes
                    const lowerWord = word.toLowerCase();
                    if (commonTitles.includes(lowerWord) || commonSuffixes.includes(lowerWord)) {
                        return true;
                    }
                    // Regular names should be title case
                    return /^[A-Z][a-z]/.test(word);
                });

                if (properCase) score += 3;

                // Bonus for 2-3 words (typical name length)
                if (words.length >= 2 && words.length <= 3) score += 2;

                // Bonus for common name patterns
                if (words.length === 2 && words.every(w => w.length >= 2)) score += 2;
                if (words.length === 3 && words[1].length <= 3) score += 1; // Middle initial

                // Penalty for very short or very long words
                const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
                if (avgWordLength < 2 || avgWordLength > 12) score -= 2;

                // Bonus for titles
                if (commonTitles.some(title => lowerText.startsWith(title + ' '))) score += 1;

                // Penalty for all caps (unless it's a header)
                if (text === text.toUpperCase() && text.length > 10) score -= 1;

                // Bonus for mixed case
                if (text !== text.toUpperCase() && text !== text.toLowerCase()) score += 1;

                return Math.max(0, score);
            }

            cleanNameCandidate(name) {
                // Remove common prefixes and suffixes
                let cleaned = name.trim();
                
                // Remove titles
                cleaned = cleaned.replace(/^(Mr\.?|Mrs\.?|Ms\.?|Dr\.?|Prof\.?|Professor)\s+/i, '');
                
                // Remove trailing suffixes
                cleaned = cleaned.replace(/\s+(Jr\.?|Sr\.?|II|III|IV|PhD|MD|Esq\.?)$/i, '');
                
                // Clean up extra spaces
                cleaned = cleaned.replace(/\s+/g, ' ').trim();
                
                // Title case the result
                cleaned = cleaned.replace(/\b\w+/g, word => 
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );

                return cleaned;
            }

            similarity(str1, str2) {
                const longer = str1.length > str2.length ? str1 : str2;
                const shorter = str1.length > str2.length ? str2 : str1;
                const editDistance = this.levenshteinDistance(longer, shorter);
                return (longer.length - editDistance) / longer.length;
            }

            levenshteinDistance(str1, str2) {
                const matrix = [];
                
                for (let i = 0; i <= str2.length; i++) {
                    matrix[i] = [i];
                }
                
                for (let j = 0; j <= str1.length; j++) {
                    matrix[0][j] = j;
                }
                
                for (let i = 1; i <= str2.length; i++) {
                    for (let j = 1; j <= str1.length; j++) {
                        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                            matrix[i][j] = matrix[i - 1][j - 1];
                        } else {
                            matrix[i][j] = Math.min(
                                matrix[i - 1][j - 1] + 1,
                                matrix[i][j - 1] + 1,
                                matrix[i - 1][j] + 1
                            );
                        }
                    }
                }
                
                return matrix[str2.length][str1.length];
            }

            extractContact(text) {
                const contact = {
                    address: '',
                    mobile: '',
                    email: '',
                    linkedin: '',
                    github: ''
                };

                // Email
                const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                if (emailMatch) contact.email = emailMatch[0];

                // Phone/Mobile - improved regex for South African numbers
                const phoneMatches = text.match(/(?:\(\+27\)|027|\+27)\s*[\d\s\-\(\)]{8,12}/g) || 
                                   text.match(/0\d{2}\s*\d{3}\s*\d{4}/g) ||
                                   text.match(/\+27\s*\d{2}\s*\d{3}\s*\d{4}/g);
                if (phoneMatches) contact.mobile = phoneMatches[0].replace(/\s+/g, ' ').trim();

                // LinkedIn
                const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|linkedin:?\s*)([a-zA-Z0-9\-]+)/i);
                if (linkedinMatch) contact.linkedin = `linkedin.com/in/${linkedinMatch[1]}`;

                // GitHub - improved to catch username in parentheses
                const githubMatch = text.match(/GitHub\(Username:\s*([a-zA-Z0-9\-_]+)\)/i) || 
                                   text.match(/(?:github\.com\/|github:?\s*)([a-zA-Z0-9\-_]+)/i);
                if (githubMatch) contact.github = `github.com/${githubMatch[1]}`;

                // Address - look for city, province, country patterns
                const addressMatch = text.match(/Address:\s*([^,\n]+,\s*[^,\n]+,\s*[^,\n]+)/i) ||
                                   text.match(/([A-Za-z\s]+,\s*[A-Za-z\s]+,\s*South Africa)/i) ||
                                   text.match(/\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln)[^,\n]*(?:,\s*[A-Za-z\s]+)*,?\s*\d{4}/);
                if (addressMatch) contact.address = addressMatch[1] || addressMatch[0];

                return contact;
            }

            extractSection(text, keywords) {
                const lines = text.split('\n');
                let sectionStart = -1;
                let sectionEnd = -1;

                // Find section start
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].toLowerCase().trim();
                    if (keywords.some(keyword => line.includes(keyword))) {
                        sectionStart = i + 1;
                        break;
                    }
                }

                if (sectionStart === -1) return '';

                // Find section end (next section header or end of text)
                const sectionHeaders = ['education', 'experience', 'skills', 'certifications', 'references', 'projects'];
                for (let i = sectionStart; i < lines.length; i++) {
                    const line = lines[i].toLowerCase().trim();
                    if (sectionHeaders.some(header => line === header || line.startsWith(header))) {
                        sectionEnd = i;
                        break;
                    }
                }

                if (sectionEnd === -1) sectionEnd = Math.min(sectionStart + 10, lines.length);

                return lines.slice(sectionStart, sectionEnd)
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .join('\n');
            }

            extractEducation(text) {
                const education = [];
                const lines = text.split('\n');
                let inEducationSection = false;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].toLowerCase().trim();
                    
                    if (line.includes('education') || line.includes('qualification')) {
                        inEducationSection = true;
                        continue;
                    }
                    
                    if (inEducationSection && ['experience', 'skills', 'certifications'].some(s => line.includes(s))) {
                        break;
                    }
                    
                    if (inEducationSection && lines[i].trim()) {
                        education.push(lines[i].trim());
                    }
                }

                return education.slice(0, 10); // Limit to avoid too much data
            }

            extractExperience(text) {
                const experience = [];
                const lines = text.split('\n');
                let inExperienceSection = false;
                let inProjectsSection = false;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].toLowerCase().trim();
                    
                    // Check for experience section
                    if (line.includes('experience') && !line.includes('academic')) {
                        inExperienceSection = true;
                        inProjectsSection = false;
                        continue;
                    }
                    
                    // Check for projects section (can be work experience for students)
                    if (line.includes('projects') || line.includes('academic projects')) {
                        inProjectsSection = true;
                        inExperienceSection = false;
                        continue;
                    }
                    
                    // Stop at next major section
                    if ((inExperienceSection || inProjectsSection) && 
                        ['skills', 'certifications', 'references', 'additional information'].some(s => line.includes(s))) {
                        break;
                    }
                    
                    // Add content from either experience or projects section
                    if ((inExperienceSection || inProjectsSection) && lines[i].trim()) {
                        // Skip the education content that was mistakenly categorized
                        const trimmedLine = lines[i].trim();
                        if (!trimmedLine.toLowerCase().includes('program design') && 
                            !trimmedLine.toLowerCase().includes('operating systems') &&
                            !trimmedLine.toLowerCase().includes('cos110')) {
                            experience.push(trimmedLine);
                        }
                    }
                }

                return experience.slice(0, 25); // Increased limit for project descriptions
            }

            extractSkills(text) {
                const skillsSection = this.extractSection(text, ['skills', 'technologies', 'technical skills']);
                return skillsSection || 'Skills not found';
            }

            extractCertifications(text) {
                const certifications = [];
                const lines = text.split('\n');
                let inCertificationSection = false;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].toLowerCase().trim();
                    
                    if (line.includes('certification') || line.includes('certificate')) {
                        inCertificationSection = true;
                        continue;
                    }
                    
                    if (inCertificationSection && ['references', 'projects'].some(s => line.includes(s))) {
                        break;
                    }
                    
                    if (inCertificationSection && lines[i].trim()) {
                        certifications.push(lines[i].trim());
                    }
                }

                return certifications.slice(0, 10);
            }

            extractReferences(text) {
                const references = [];
                const lines = text.split('\n');
                let inReferenceSection = false;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].toLowerCase().trim();
                    
                    if (line.includes('reference')) {
                        inReferenceSection = true;
                        continue;
                    }
                    
                    if (inReferenceSection && lines[i].trim()) {
                        references.push(lines[i].trim());
                    }
                }

                return references.slice(0, 10);
            }

            formatOutput(info) {
                let output = '';
                
                // Name and contact
                output += `Name: ${info.name}\n`;
                if (info.contact.address) output += `${info.contact.address}\n`;
                if (info.contact.mobile) output += `Mobile: ${info.contact.mobile}\n`;
                if (info.contact.email) output += `Email: ${info.contact.email}\n`;
                if (info.contact.linkedin) output += `LinkedIn: ${info.contact.linkedin}\n`;
                if (info.contact.github) output += `GitHub: ${info.contact.github}\n`;
                
                // Profile
                if (info.profile) {
                    output += '\nProfile\n';
                    output += info.profile + '\n';
                }
                
                // Education
                if (info.education.length > 0) {
                    output += '\nEducation\n';
                    info.education.forEach(edu => {
                        output += edu + '\n';
                    });
                }
                
                // Experience
                if (info.experience.length > 0) {
                    output += '\nExperience\n';
                    info.experience.forEach(exp => {
                        output += exp + '\n';
                    });
                }
                
                // Skills
                if (info.skills) {
                    output += '\nSkills\n';
                    output += info.skills + '\n';
                }
                
                // Certifications
                if (info.certifications.length > 0) {
                    output += '\nCertifications\n';
                    info.certifications.forEach(cert => {
                        output += cert + '\n';
                    });
                }
                
                // References
                if (info.references.length > 0) {
                    output += '\nReferences\n';
                    info.references.forEach(ref => {
                        output += ref + '\n';
                    });
                }
                
                return output;
            }

            displayResults(info) {
                const formattedOutput = this.formatOutput(info);
                
                this.results.innerHTML = `
                    <div class="extracted-content">${formattedOutput}</div>
                    <button class="copy-button" onclick="copyToClipboard('${formattedOutput.replace(/'/g, "\\'")}')">
                        📋 Copy to Clipboard
                    </button>
                `;
            }
        }

        // Copy function needs to be global for the button onclick
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = '✅ Copied!';
                button.style.background = '#27ae60';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '#3498db';
                }, 2000);
            });
        }

        // Initialize the CV Scanner when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new CVScanner();
        });