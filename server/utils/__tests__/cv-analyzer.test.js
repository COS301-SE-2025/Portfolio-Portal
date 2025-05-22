const {
    extractEmail,
    extractPhone,
    extractName,
    extractLinks,
    extractAbout,
    extractSkills,
    extractEducation,
    extractExperience,
    extractCertifications,
    extractReferences,
    processCV
} = require('../cv-analyzer');


// testing email analyzing
describe('extractEmail', () => {
    test('returns email from labeled line', () => {
        const lines = ['Email: user@example.com'];
        expect(extractEmail(lines)).toBe('user@example.com');
    });

    test('returns email from different labeled line', () => {
        const lines = ['Contact: user@example.com'];
        expect(extractEmail(lines)).toBe('user@example.com');
    });

    test('returns email from unlabeled line', () => {
        const lines = ['  user@example.com   '];
        expect(extractEmail(lines)).toBe('user@example.com');
    });

    test('returns null if no email found (no @)', () => {
        const lines = ['nonmatchingemail.com'];
        expect(extractEmail(lines)).toBeNull();
    });

    test('returns null if no email found (no \'.\')', () => {
        const lines = ['nonmatchingemail@com'];
        expect(extractEmail(lines)).toBeNull();
    });

    test('returns null if no email found (no symbols)', () => {
        const lines = ['nonmatchingemailcom'];
        expect(extractEmail(lines)).toBeNull();
    });

    test('no username', () => {
        const lines = ['@gmail.com'];
        expect(extractEmail(lines)).toBeNull();
    });

    test('no domain name', () => {
        const lines = ['user@.com'];
        expect(extractEmail(lines)).toBeNull();
    });

    test('TLD too short', () => {
        const lines = ['user@example.c'];
        expect(extractEmail(lines)).toBeNull();
    });
});
// ==================================================================

// testing phone number
describe('extractPhone', () => {
    test('extracts SA number with +27 format', () => {
        const lines = ['Phone: +27 82 123 4567'];
        expect(extractPhone(lines)).toBe('+27 82 123 4567');
    });

    test('extracts US-style number', () => {
        const lines = ['Phone: +1 202-555-0182'];
        expect(extractPhone(lines)).toBe('+1 202-555-0182');
    });

    test('extracts German number with dashes', () => {
        const lines = ['Phone: +49-89-636-48018'];
        expect(extractPhone(lines)).toBe('+49-89-636-48018');
    });

    test('extracts number with spaces', () => {
        const lines = ['Mobile: 082 123 4567'];
        expect(extractPhone(lines)).toBe('082 123 4567');
    });

    test('extracts with dashes', () => {
        const lines = ['Phone: 012-345-6789'];
        expect(extractPhone(lines)).toBe('012-345-6789');
    });

    test('extracts with parentheses', () => {
        const lines = ['Number: (012) 345 6789'];
        expect(extractPhone(lines)).toBe('(012) 345 6789');
    });

    test('extracts from unlabeled line', () => {
        const lines = ['contact me on 021 345 6789'];
        expect(extractPhone(lines)).toBe('021 345 6789');
    });

    test('extracts from unlabeled line (numb only)', () => {
        const lines = ['012 345 6789'];
        expect(extractPhone(lines)).toBe('012 345 6789');
    });

    test('returns null if no phone number present', () => {
        const lines = ['Email: user@example.com', 'Location: Cape Town'];
        expect(extractPhone(lines)).toBeNull();
    });

    test('returns only first matching phone number', () => {
        const lines = ['Phone: 082 123 4567', 'Number: 083 987 6543'];
        expect(extractPhone(lines)).toBe('082 123 4567');
    });

    test('returns null for incomplete number', () => {
        const lines = ['Phone: +999'];
        expect(extractPhone(lines)).toBeNull();
    });
});
// ==================================================================

// testing name analyzing
describe('extractName', () => {
    test('returns first line as name', () => {
        const lines = ['Piet Pogempoel', 'Email: user@example.com'];
        expect(extractName(lines)).toBe('Piet Pogempoel');
    });

    test('returns first non-empty line as name', () => {
        const lines = ['   ', '', 'Piet Pogempoel', 'Email: user@example.com'];
        expect(extractName(lines)).toBe('Piet Pogempoel');
    });

    test('extracts name from labeled name', () => {
        const lines = ['Name: Piet Pogempoel'];
        expect(extractName(lines)).toBe('Piet Pogempoel');
    });

    test('extracts name from labeled full name', () => {
        const lines = ['Full Name - Piet Pogempoel'];
        expect(extractName(lines)).toBe('Piet Pogempoel');
    });

    test('returns unknown if all lines are empty', () => {
        const lines = ['  ', '', '\t', '\n'];
        expect(extractName(lines)).toBe('Unknown');
    });

    test('returns "Unknown" if no lines provided', () => {
        const lines = [];
        expect(extractName(lines)).toBe('Unknown');
    });
});
// =================================================================

// testing links
describe('extractLinks', () => {
    test('extract linkedin only', () => {
        const lines = [' ', 'LinkedIn: linkedin.com/in/johndoe', 'nothing herre', ''];
        expect(extractLinks(lines).linkedIn).toBe('linkedin.com/in/johndoe');
        expect(extractLinks(lines).github).toBeNull();
    });

    test('extract github only', () => {
        const lines = ['nothing here', 'GitHub: github.com/johndoe'];
        expect(extractLinks(lines).github).toBe('github.com/johndoe');
        expect(extractLinks(lines).linkedIn).toBeNull();
    });

    test('extract both', () => {
        const lines = ['LinkedIn: linkedin.com/in/johndoe', 'nothing herre', 'GitHub: github.com/johndoe'];
        expect(extractLinks(lines).linkedIn).toBe('linkedin.com/in/johndoe');
        expect(extractLinks(lines).github).toBe('github.com/johndoe');
    });

    test('extract both (unlabeled)', () => {
        const lines = ['djesf', 'sfe linkedin.com/in/johndoe esfsf', 'fs github.com/johndoe sefsef'];
        expect(extractLinks(lines).linkedIn).toBe('linkedin.com/in/johndoe');
        expect(extractLinks(lines).github).toBe('github.com/johndoe');
    });

    test('Invalid links, return null', () => {
        const lines = ['LinkedIn: linkeddoe', 'nothing herre', 'GitHub: github.'];
        expect(extractLinks(lines).linkedIn).toBeNull();
        expect(extractLinks(lines).github).toBeNull();
    });

    test('case-insensitive', () => {
        const lines = ['Visit my LinkedIn: LINKEDIN.com/in/test', 'GitHub: GITHUB.com/user'];
        expect(extractLinks(lines).linkedIn).toBe('LINKEDIN.com/in/test');
        expect(extractLinks(lines).github).toBe('GITHUB.com/user');
    });

    test('no links, return null', () => {
        const lines = ['', 'nothing herre', 'github'];
        expect(extractLinks(lines).linkedIn).toBeNull();
        expect(extractLinks(lines).github).toBeNull();
    });
});
// ================================================================

// testing about
describe('extractAbout', () => {
    test('"About" heading', () => {
        const lines = [
            'About',
            'I am a passionate software developer.',
            'I love red bull.'
        ];
        expect(extractAbout(lines)).toEqual([
            'I am a passionate software developer.',
            'I love red bull.'
        ]);
    });

    test('"About me" heading (extra spaces)', () => {
        const lines = [
            '   About me ',
            'I am a passionate software developer.',
            'I love red bull.'
        ];
        expect(extractAbout(lines)).toEqual([
            'I am a passionate software developer.',
            'I love red bull.'
        ]);
    });

    test('"Profile" heading (with other sections as well)', () => {
        const lines = [
            'Education',
            'BSc Computer Science',
            'Profile',
            'I am a passionate software developer.',
            'I love red bull.',
            'Skills',
            'JavaScript, Python'
        ];
        expect(extractAbout(lines)).toEqual([
            'I am a passionate software developer.',
            'I love red bull.'
        ]);
    });

    test('"Summary" heading (ALSO TEST UPPERCASE)', () => {
        const lines = [
            'SUMMARY',
            'I am a passionate software developer.',
            'I love red bull.'
        ];
        expect(extractAbout(lines)).toEqual([
            'I am a passionate software developer.',
            'I love red bull.'
        ]);
    });

    test('Not labeled', () => {
        const lines = [
            'I am a passionate software developer.',
            'I love red bull.'
        ];
        expect(extractAbout(lines)).toEqual([]);
    });
});
// =================================================================

// testing skills section
describe('extractSkills', () => {
    test('comma-separated skills from one line', () => {
        const lines = [
            'Skills',
            'JavaScript, Python, C++'
        ];
        expect(extractSkills(lines)).toEqual(['JavaScript', 'Python', 'C++']);
    });

    test('bullet-separated skills from one line', () => {
        const lines = [
            'Skills',
            'JavaScript • Python • C++'
        ];
        expect(extractSkills(lines)).toEqual(['JavaScript', 'Python', 'C++']);
    });

    test('removes empty entries and trims spaces', () => {
        const lines = [
            'Skills',
            ' JavaScript , ,  Python ,,  '
        ];
        expect(extractSkills(lines)).toEqual(['JavaScript', 'Python']);
    });

    test('No skills section', () => {
        const lines = [
            'Experience',
            'Google - Software Engineer'
        ];
        expect(extractSkills(lines)).toEqual([]);
    });

    test('multiple lines (and other sections)', () => {
        const lines = [
            '   Skills  ',
            '  JavaScript, Python   • C++ ',
            'HTML,        CSS • SQL         ',
            'Experience',
            'Google - Software Engineer'
        ];
        expect(extractSkills(lines)).toEqual(['JavaScript', 'Python', 'C++', 'HTML', 'CSS', 'SQL']);
    });
});
// =================================================================

// testing education
describe('extractEducation', () => {
    test('one education entry with degree and institution', () => {
        const lines = [
            'Education',
            'BSc Computer Science - University of Pretoria',
            'Graduated: December 2025',
            'Final year project: 3D portfolio generator'
        ];

        expect(extractEducation(lines)).toEqual([
            {
                degree: 'BSc Computer Science',
                institution: 'University of Pretoria',
                field: '',
                startDate: '',
                endDate: 'December 2025',
                extra: ['Final year project: 3D portfolio generator']
            }
        ]);
    });

    test('multiple education entries', () => {
        const lines = [
            'Education',
            'BSc Computer Science - University of Pretoria',
            'Graduated: December 2025',
            '              ',
            'High School Diploma - PBHS',
            'Matriculated: 2020',
            'Subjects: IT, Accounting',
            'Played hockey.'
        ];

        expect(extractEducation(lines)).toEqual([
            {
                degree: 'BSc Computer Science',
                institution: 'University of Pretoria',
                field: '',
                startDate: '',
                endDate: 'December 2025',
                extra: []
            },
            {
                degree: 'High School Diploma',
                institution: 'PBHS',
                field: '',
                startDate: '',
                endDate: '2020',
                extra: ['Subjects: IT, Accounting', 'Played hockey.']
            }
        ]);
    });

    test('begin and end date range (and other sections)', () => {
        const lines = [
            'Experience',
            'A lot',
            ' ',
            'Education',
            'BSc Computer Science - University of Pretoria',
            'Feb 2023 - Nov 2025',
            'Graduated with distinction',
            '',
            'Skills',
            'A lot'
        ];

        expect(extractEducation(lines)).toEqual([
            {
                degree: 'BSc Computer Science',
                institution: 'University of Pretoria',
                field: '',
                startDate: 'Feb 2023',
                endDate: 'Nov 2025',
                extra: ['Graduated with distinction']
            }
        ]);
    });

    test('mixed lines and bad formatting', () => {
        const lines = [
            'Education',
            'This has nothing to do with education',
            'BSc Computer Science - UP',
            'Graduated: 2025'
        ];

        expect(extractEducation(lines)).toEqual([
            {
                degree: 'BSc Computer Science',
                institution: 'UP',
                field: '',
                startDate: '',
                endDate: '2025',
                extra: []
            }
        ]);
    });

    test('date range before degree line', () => {
        const lines = [
            'Education',
            'Feb 2020 - 2023',
            'BSc Computer Science - UP',
            'Graduated with honours'
        ];

        expect(extractEducation(lines)).toEqual([
            {
                degree: 'BSc Computer Science',
                institution: 'UP',
                field: '',
                startDate: 'Feb 2020',
                endDate: '2023',
                extra: ['Graduated with honours']
            }
        ]);
    });

    test('graduated before degree line', () => {
        const lines = [
            'Education',
            'Graduated: 2023',
            'BSc Computer Science - UP',
            'Graduated with honours'
        ];

        expect(extractEducation(lines)).toEqual([
            {
                degree: 'BSc Computer Science',
                institution: 'UP',
                field: '',
                startDate: '',
                endDate: '2023',
                extra: ['Graduated with honours']
            }
        ]);
    });

    test('line contains dash but is not degree-institution', () => {
        const lines = [
            'Education',
            'BSc CS - UP',
            'Note: Final-year distinction Top 5% of class',
            'Graduated: 2025'
        ];

        expect(extractEducation(lines)).toEqual([
            {
                degree: 'BSc CS',
                institution: 'UP',
                field: '',
                startDate: '',
                endDate: '2025',
                extra: ['Note: Final-year distinction Top 5% of class']
            }
        ]);
    });

    test('No education found', () => {
        const lines = [
            'Experience',
            'A lot'
        ];

        expect(extractEducation(lines)).toEqual([]);
    });
});
// =================================================================

// testing experience analyzing
describe('extractExperience', () => {
    test('single entry with title and company', () => {
        const lines = [
            '   Experience   ',
            '  Software Engineer - Google',
            'June 2023 - August 2023',
            'Worked on search features'
        ];

        expect(extractExperience(lines)).toEqual([
            {
                title: 'Software Engineer',
                company: 'Google',
                startDate: 'June 2023',
                endDate: 'August 2023',
                extra: ['Worked on search features']
            }
        ]);
    });

    test('multiple entries (and other sections)', () => {
        const lines = [
            'Experience',
            'Dev - Company A',
            'Jan 2020 - Mar 2021',
            '• A',
            '• B',
            ' ',
            'Engineer - Company B',
            'Apr 2021 - Present',
            '• C',
            'Education',
            'education blah blh',
            'Jun 2024 - Dec 2024'
        ];

        expect(extractExperience(lines)).toEqual([
            {
                title: 'Dev',
                company: 'Company A',
                startDate: 'Jan 2020',
                endDate: 'Mar 2021',
                extra: ['A', 'B']
            },
            {
                title: 'Engineer',
                company: 'Company B',
                startDate: 'Apr 2021',
                endDate: 'present',
                extra: ['C']
            }
        ]);
    });

    test('ignores lines before experience section', () => {
        const lines = [
            'Summary',
            'Hard worker',
            'Experience',
            'PM - Test Corp',
            'Managed projects'
        ];

        expect(extractExperience(lines)).toEqual([
            {
                title: 'PM',
                company: 'Test Corp',
                startDate: '',
                endDate: '',
                extra: ['Managed projects']
            }
        ]);
    });

    test('date before', () => {
        const lines = [
            '   Experience   ',
            'June 2023 - August 2023',
            '  Software Engineer - Google',
            'Worked on search features'
        ];

        expect(extractExperience(lines)).toEqual([
            {
                title: 'Software Engineer',
                company: 'Google',
                startDate: 'June 2023',
                endDate: 'August 2023',
                extra: ['Worked on search features']
            }
        ]);
    });

    test('dashes in the extra section', () => {
        const lines = [
            '   Experience   ',
            '  Software Engineer - Google',
            'Worked on - search features'
        ];

        expect(extractExperience(lines)).toEqual([
            {
                title: 'Software Engineer',
                company: 'Google',
                startDate: 'June 2023',
                endDate: 'August 2023',
                extra: ['Worked on - search features']
            }
        ]);
    });

    test('No experience', () => {
        const lines = [
            'Education',
            'Some Degree - Some Uni'
        ];

        expect(extractExperience(lines)).toEqual([]);
    });
});
// =================================================================

// testing certificates
describe('extractCertifications', () => {
    test('single certificate', () => {
        const lines = [
            'Certifications',
            'AWS Certified Solutions Architect'
        ];

        expect(extractCertifications(lines)).toEqual([
            'AWS Certified Solutions Architect'
        ]);
    });

    test('multiple certifications', () => {
        const lines = [
            'Certifications',
            'AWS Certified Solutions Architect',
            'Google Cloud Associate Engineer',
            'Certified Ethical Hacker'
        ];

        expect(extractCertifications(lines)).toEqual([
            'AWS Certified Solutions Architect',
            'Google Cloud Associate Engineer',
            'Certified Ethical Hacker'
        ]);
    });

    test('blank lines in section', () => {
        const lines = [
            '    Certifications ',
            '',
            '    AWS Certified Solutions Architect ',
            '    ',
            'Certified Scrum Master        ',
            '                ',
            ''
        ];

        expect(extractCertifications(lines)).toEqual([
            'AWS Certified Solutions Architect',
            'Certified Scrum Master'
        ]);
    });

    test('no certificates', () => {
        const lines = [
            'Experience',
            'Software Engineer - Google'
        ];

        expect(extractCertifications(lines)).toEqual([]);
    });

    test('other sections', () => {
        const lines = [
            'Certifications',
            'AWS Certified Solutions Architect - 2023',
            'Certified Scrum Master - Coursera',
            'Experience',
            'Software Engineer - Google'
        ];

        expect(extractCertifications(lines)).toEqual([
            'AWS Certified Solutions Architect - 2023',
            'Certified Scrum Master - Coursera'
        ]);
    });
});
// =================================================================

// testing references
describe('extractReferences', () => {
    test('single reference with name, phone and email (labeled)', () => {
        const lines = [
            'References',
            'Piet Pogempoel',
            'Phone: 082 123 4567',
            'piet@gmail.com'
        ];

        expect(extractReferences(lines)).toEqual([
            {
                name: 'Piet Pogempoel',
                phone: '082 123 4567',
                email: 'piet@gmail.com'
            }
        ]);
    });

    test('single reference with name, phone and email (unlabeled)', () => {
        const lines = [
            '     References  ',
            'Piet Pogempoel',
            '               ',
            ' 082 123 4567',
            '    piet@gmail.com',
            ''
        ];

        expect(extractReferences(lines)).toEqual([
            {
                name: 'Piet Pogempoel',
                phone: '082 123 4567',
                email: 'piet@gmail.com'
            }
        ]);
    });

    test('multiple', () => {
        const lines = [
            'References',
            'Piet Pogempoel',
            'Phone: 082 123 4567',
            'piet@gmail.com',
            '',
            'Jan Jan',
            '082 222 3333',
            'jan@gmail.com'
        ];

        expect(extractReferences(lines)).toEqual([
            {
                name: 'Piet Pogempoel',
                phone: '082 123 4567',
                email: 'piet@gmail.com'
            },
            {
                name: 'Jan Jan',
                phone: '082 222 3333',
                email: 'jan@gmail.com'
            }
        ]);
    });

    test('no contact info', () => {
        const lines = [
            '     References  ',
            'Piet Pogempoel',
        ];

        expect(extractReferences(lines)).toEqual([
            {
                name: 'Piet Pogempoel'
            }
        ]);
    });

    test('no references', () => {
        const lines = [
            'Experience',
            'Developer - SomeCompany'
        ];

        expect(extractReferences(lines)).toEqual([]);
    });
});
// =================================================================

// test processCV
describe('processCV', () => {
    test('extracts the CV as a whole', () => {
        const text = `
Name: Johnathan D. Doe
123 Example Street, Pretoria, 0002
Mobile: +27 82 123 4567
Email: johndoe123@example.com
LinkedIn: linkedin.com/in/johndoe
GitHub: github.com/johndoe

profile
I am John Doe, blah blah blah. Personal description.
This is a new line, blah nla blah.

Education
BSc Computer Science - University of Pretoria
Graduated: December 2023
Final Year Project: Develop a real time portfolio generator
I learned a lot

High school diploma - pbhs
matriculated: 2022
accounting, it, biology

Experience
Software Engineering Intern - Amazon
June 2023 - August 2023
• Developed internal dashboard using React and Node.js
• Automated data collection scripts with Python

Student Assistant - University of Pretoria
February 2022 - November 2022
• Assisted students in Computer Science 101 practicals
• Marked assignments and provided debugging support

Skills
Java, JavaScript, Python, C++
React, Node.js, MongoDB
Version Control (Git/GitHub)
Strong problem-solving and debugging skills

Certifications
AWS Cloud Practitioner - 2023
Google IT Automation with Python - Coursera

References
Piet Pogempoel
Mobile: +27 82 123 4567
emai: piet@gmail.com

Jan Jansen
082 123 4567
jan@yahoo.com
        `;

        const result = processCV(text);

        expect(result.name).toBe('Johnathan D. Doe');
        expect(result.email).toBe('johndoe123@example.com');
        expect(result.phone).toBe('+27 82 123 4567');
        expect(result.links).toEqual({
            linkedIn: 'linkedin.com/in/johndoe',
            github: 'github.com/johndoe'
        });

        expect(result.about).toEqual([
            'I am John Doe, blah blah blah. Personal description.',
            'This is a new line, blah nla blah.'
        ]);

        expect(result.skills).toEqual([
            'Java', 'JavaScript', 'Python', 'C++',
            'React', 'Node.js', 'MongoDB',
            'Version Control (Git/GitHub)',
            'Strong problem-solving and debugging skills'
        ]);

        expect(result.education).toEqual([
            {
                degree: 'BSc Computer Science',
                institution: 'University of Pretoria',
                field: '',
                startDate: '',
                endDate: 'December 2023',
                extra: [
                    'Final Year Project: Develop a real time portfolio generator',
                    'I learned a lot'
                ]
            },
            {
                degree: 'High school diploma',
                institution: 'pbhs',
                field: '',
                startDate: '',
                endDate: '2022',
                extra: ['accounting, it, biology']
            }
        ]);

        expect(result.experience).toEqual([
            {
                title: 'Software Engineering Intern',
                company: 'Amazon',
                startDate: 'June 2023',
                endDate: 'August 2023',
                extra: [
                    'Developed internal dashboard using React and Node.js',
                    'Automated data collection scripts with Python'
                ]
            },
            {
                title: 'Student Assistant',
                company: 'University of Pretoria',
                startDate: 'February 2022',
                endDate: 'November 2022',
                extra: [
                    'Assisted students in Computer Science 101 practicals',
                    'Marked assignments and provided debugging support'
                ]
            }
        ]);

        expect(result.certifications).toEqual([
            'AWS Cloud Practitioner - 2023',
            'Google IT Automation with Python - Coursera'
        ]);

        expect(result.references).toEqual([
            {
                name: 'Piet Pogempoel',
                phone: '+27 82 123 4567',
                email: 'piet@gmail.com'
            },
            {
                name: 'Jan Jansen',
                phone: '082 123 4567',
                email: 'jan@yahoo.com'
            }
        ]);
    });
});
// =================================================================