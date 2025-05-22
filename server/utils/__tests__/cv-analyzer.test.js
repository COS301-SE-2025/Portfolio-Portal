const {
    extractEmail,
    extractPhone,
    extractName,
    extractLinks,
    extractAbout,
    extractSkills,
    extractEducation,
    extractCertifications,
    extractExperience,
    extractReferences
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
});
// =================================================================