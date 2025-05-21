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

    test('returns null if no email found', () => {
        const lines = ['nonmatchingemail.com'];
        expect(extractEmail(lines)).toBeNull();
    });

    test('returns null if no email found', () => {
        const lines = ['nonmatchingemail@com'];
        expect(extractEmail(lines)).toBeNull();
    });

    test('returns null if no email found', () => {
        const lines = ['nonmatchingemailcom'];
        expect(extractEmail(lines)).toBeNull();
    });
});