const {
    extractEmail,
    extractPhone,
    extractName,
    extractLinks,
    extractAbout,
    extractCertifications,
    extractSkills,
    extractEducation,
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