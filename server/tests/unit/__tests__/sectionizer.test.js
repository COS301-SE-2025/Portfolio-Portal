const {
  extractPersonalInfo,
  extractReferencesFirst,
} = require("../../../app/utils/sectionizer");

describe("extractPersonalInfo", () => {
  test("extracts labeled name (fallback), email, phone, linkedin, website, address, and about description", () => {
    const lines = [
      "Full name: Eric Booyens",
      "Email: test@example.com",
      "Phone: +27 82 123 4567",
      "LinkedIn: linkedin.com/in/eric",
      "Website: https://eric.dev",
      "Address: 12 Main Road, Cape Town",
      "About",
      "Hardworking software engineer with 3 years experience.",
      "Experience",
    ];

    const { personal_info, remaining } = extractPersonalInfo(lines, "");

    expect(personal_info.name).toBe("Eric Booyens");
    expect(personal_info.email).toBe("test@example.com");
    expect(personal_info.phone).toBe("+27 82 123 4567");
    expect(personal_info.linkedin).toBe("https://linkedin.com/in/eric");
    expect(personal_info.website).toBe("https://eric.dev");
    expect(personal_info.address).toBe("12 Main Road, Cape Town");
    expect(personal_info.description).toBe(
      "Hardworking software engineer with 3 years experience."
    );

    const remainingJoined = remaining.join("\n").toLowerCase();
    expect(remainingJoined).not.toContain("hardworking software engineer");
    expect(remainingJoined).not.toContain("test@example.com");
    expect(remainingJoined).not.toContain("linkedin.com/in/eric");
    expect(remainingJoined).not.toContain("https://eric.dev");
    expect(remainingJoined).toContain("experience");
  });

  test("keeps OCR-provided name even if a labeled name exists", () => {
    const lines = [
      "Full name: Another Person",
      "Email: user@example.com",
      "Phone: 021 555 1234",
      "About",
      "Curious builder.",
      "Education",
    ];

    const { personal_info } = extractPersonalInfo(lines, "OCR Name");
    expect(personal_info.name).toBe("OCR Name");
    expect(personal_info.description).toBe("Curious builder.");
    expect(personal_info.email).toBe("user@example.com");
    expect(personal_info.phone).toBe("021 555 1234");
  });

  test("address via proximity heuristic near contact lines (top window), no explicit label", () => {
    const lines = [
      "Email: alpha@example.com",
      "Phone: 021 555 1234",
      "76 Loop Street, Cape Town 8001",
      "About",
      "Driven learner.",
      "Education",
    ];

    const { personal_info } = extractPersonalInfo(lines, "");
    expect(personal_info.address).toBe("76 Loop Street, Cape Town 8001");
    expect(personal_info.description).toBe("Driven learner.");
  });

  test("does not pick address when it only appears deep in the document (beyond top window)", () => {
    const lines = [
      "Email: beta@example.com",
      "Phone: +27 11 000 1234",
      "About",
      "Motivated individual.",
      "Education",
      ...Array.from({ length: 30 }, (_, i) => `filler line ${i + 1}`),
      "123 Faraway Road, Johannesburg 2000",
    ];

    const { personal_info } = extractPersonalInfo(lines, "");
    expect(personal_info.address).toBe("");
    expect(personal_info.description).toBe("Motivated individual.");
  });

  test("linkedin extracted and first non-LinkedIn non-GitHub URL becomes website; GitHub is ignored", () => {
    const lines = [
      "Email: gamma@example.com",
      "Phone: +27 21 123 4567",
      "LinkedIn: www.linkedin.com/in/gamma",
      "Personal site: eric.dev",
      "GitHub: https://github.com/eric",
      "About",
      "Makes things.",
      "Experience",
    ];

    const { personal_info } = extractPersonalInfo(lines, "");

    expect(personal_info.linkedin).toBe("https://www.linkedin.com/in/gamma");
    expect(personal_info.website).toBe("https://eric.dev");
  });

  test("handles unlabeled email/phone and no links gracefully", () => {
    const lines = [
      "about",
      "Team player and quick learner.",
      "Reach me at team.player@example.co.za",
      "+27821234567",
      "experience",
    ];

    const { personal_info } = extractPersonalInfo(lines, "");
    expect(personal_info.email).toBe("team.player@example.co.za");
    expect(personal_info.phone).toBe("+27821234567");
    expect(personal_info.linkedin).toBe("");
    expect(personal_info.website).toBe("");
    expect(personal_info.description).toBe("Team player and quick learner.");
  });

  test("falls back to labeled name when OCR name is empty", () => {
    const lines = [
      "Name: Thandi Ndlovu",
      "Email: thandi@example.com",
      "Phone: 072 000 1111",
      "About",
      "Product-focused engineer.",
      "Experience",
    ];
    const { personal_info } = extractPersonalInfo(lines, "");
    expect(personal_info.name).toBe("Thandi Ndlovu");
  });
});

describe("extractReferencesFirst", () => {
  test("captures lines under 'References' until next header and removes them from remaining", () => {
    const lines = [
      "References",
      "Jane Smith — Tech Lead, Company Z",
      "Email: jane.smith@companyz.com",
      "Phone: +27 83 000 1111",
      "Experience",
      "Company X — Software Engineer",
    ];

    const { references, remaining } = extractReferencesFirst(lines);

    expect(references).toEqual([
      "Jane Smith — Tech Lead, Company Z",
      "Email: jane.smith@companyz.com",
      "Phone: +27 83 000 1111",
    ]);

    const remainingJoined = remaining.join("\n").toLowerCase();
    expect(remainingJoined).toContain("experience");
    expect(remainingJoined).toContain("company x — software engineer");
    expect(remainingJoined).not.toContain("jane.smith@companyz.com");
    expect(remainingJoined).not.toContain("+27 83 000 1111");
  });

  test("works with alternate header keyword 'Referees'", () => {
    const lines = [
      "Referees",
      "Mr A — Manager, Org Y",
      "Email: a@orgy.org",
      "Phone: +27 82 222 3333",
      "Education",
      "BSc Computer Science",
    ];

    const { references, remaining } = extractReferencesFirst(lines);

    expect(references).toEqual([
      "Mr A — Manager, Org Y",
      "Email: a@orgy.org",
      "Phone: +27 82 222 3333",
    ]);

    const remainingJoined = remaining.join("\n").toLowerCase();
    expect(remainingJoined).toContain("education");
    expect(remainingJoined).toContain("bsc computer science");
    expect(remainingJoined).not.toContain("a@orgy.org");
  });

  test("captures until end-of-file when there is no subsequent header", () => {
    const lines = ["References", "Available upon request"];
    const { references, remaining } = extractReferencesFirst(lines);
    expect(references).toEqual(["Available upon request"]);
    expect(remaining).toEqual([]);
  });

  test("returns empty when no references header is present", () => {
    const lines = ["Experience", "Company X — Engineer", "Education", "BSc IT"];
    const { references, remaining } = extractReferencesFirst(lines);
    expect(references).toEqual([]);
    expect(remaining).toEqual(lines);
  });
});
