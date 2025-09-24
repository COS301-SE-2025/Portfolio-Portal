const {
  extractPersonalInfo,
  extractReferencesFirst,
  extractSimpleBlocks,
  extractSectionByHeader,
  processCV,
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

describe("extractExperience", () => {
  test("extracts lines under Experience header until next header", () => {
    const lines = [
      "Experience",
      "Company A — Software Engineer",
      "Jan 2022 – Present",
      "- Built key features",
      "Education",
      "University Y — BSc Computer Science",
    ];

    const { sectionLines, cleanedLines } = extractSectionByHeader(
      lines,
      "experience"
    );

    expect(sectionLines).toEqual([
      "Company A — Software Engineer",
      "Jan 2022 – Present",
      "- Built key features",
    ]);

    const cleaned = cleanedLines.join("\n");
    expect(cleaned).toContain("Education");
    expect(cleaned).toContain("University Y — BSc Computer Science");
    expect(cleaned).not.toContain("Company A — Software Engineer");
  });

  test("works with alternate header keyword 'Work Experience'", () => {
    const lines = [
      "Work Experience",
      "Startup B — Full-Stack Developer",
      "2020 - 2022",
      "• Led migration to cloud",
      "Projects",
      "Realtime Chat App",
    ];

    const { sectionLines } = extractSectionByHeader(lines, "experience");

    expect(sectionLines).toEqual([
      "Startup B — Full-Stack Developer",
      "2020 - 2022",
      "• Led migration to cloud",
    ]);
  });

  test("captures until end-of-file when there is no subsequent header", () => {
    const lines = [
      "Professional Experience",
      "Company Z — Backend Engineer",
      "2018 - 2020",
      "- Designed APIs",
    ];

    const { sectionLines, cleanedLines } = extractSectionByHeader(
      lines,
      "experience"
    );

    expect(sectionLines).toEqual([
      "Company Z — Backend Engineer",
      "2018 - 2020",
      "- Designed APIs",
    ]);
    expect(cleanedLines).toEqual([]);
  });

  test("extractSimpleBlocks returns only the experience block for its section", () => {
    const lines = [
      "Experience",
      "Org C — Data Engineer",
      "Mar 2021 – Present",
      "Education",
      "BSc Information Systems",
      "Skills",
      "Python, SQL, Airflow",
    ];

    const { blocks } = extractSimpleBlocks(lines);

    expect(blocks.experience).toEqual([
      "Org C — Data Engineer",
      "Mar 2021 – Present",
    ]);
    expect(blocks.education).toEqual(["BSc Information Systems"]);
    expect(blocks.skills).toEqual(["Python, SQL, Airflow"]);
  });
});

describe("extractEducation", () => {
  test("extracts lines under Education header until next header", () => {
    const lines = [
      "Education",
      "University X — BSc Computer Science",
      "2017 - 2020",
      "Skills",
      "Python, JavaScript",
    ];

    const { sectionLines, cleanedLines } = extractSectionByHeader(
      lines,
      "education"
    );

    expect(sectionLines).toEqual([
      "University X — BSc Computer Science",
      "2017 - 2020",
    ]);

    const cleaned = cleanedLines.join("\n");
    expect(cleaned).toContain("Skills");
    expect(cleaned).toContain("Python, JavaScript");
    expect(cleaned).not.toContain("University X — BSc Computer Science");
  });

  test("works with alternate header keyword 'Academic Background'", () => {
    const lines = [
      "Academic Background",
      "University Y — MSc Data Science",
      "2021",
      "Projects",
      "Thesis: Forecasting",
    ];

    const { sectionLines } = extractSectionByHeader(lines, "education");

    expect(sectionLines).toEqual(["University Y — MSc Data Science", "2021"]);
  });

  test("works with alternate header keyword 'Qualifications'", () => {
    const lines = [
      "Qualifications",
      "Diploma in Information Technology",
      "2015 - 2016",
      "Experience",
      "Company Z — Intern",
    ];

    const { sectionLines } = extractSectionByHeader(lines, "education");

    expect(sectionLines).toEqual([
      "Diploma in Information Technology",
      "2015 - 2016",
    ]);
  });

  test("captures until end-of-file when there is no subsequent header", () => {
    const lines = ["Degrees", "BEng Electrical Engineering", "2013 - 2017"];

    const { sectionLines, cleanedLines } = extractSectionByHeader(
      lines,
      "education"
    );

    expect(sectionLines).toEqual([
      "BEng Electrical Engineering",
      "2013 - 2017",
    ]);
    expect(cleanedLines).toEqual([]);
  });

  test("extractSimpleBlocks returns the education block alongside others", () => {
    const lines = [
      "Education",
      "BSc Information Systems",
      "Experience",
      "Org C — Data Engineer",
      "Skills",
      "Python, SQL, Airflow",
    ];

    const { blocks } = extractSimpleBlocks(lines);

    expect(blocks.education).toEqual(["BSc Information Systems"]);
    expect(blocks.experience).toEqual(["Org C — Data Engineer"]);
    expect(blocks.skills).toEqual(["Python, SQL, Airflow"]);
  });
});

describe("processCV end-to-end on OCR sample", () => {
  const ocr = {
    name: "AVA REYNOLDS",
    remainingCV:
      "Phone\n123-456-7890\n\nEmail\navareynolds@gmail.com\n\nAddress\n123 Anywhere St, Any City\n\nBachelor of Science in Computer Science\n\nMIT\n2016 - 2020\n\nBA Sales and Commerce\nWardiere University\n2020 - 2023\n\nprogramming\n\nPython\ne C++\n\n° Java\n\nEthical hacking\n\nProblem-Solving\n\nTime Management\n\nnetworks\n\n.\n\nLanguage\n\ne English\n\ne French\n\nAVA\nREYNOLDS\n\nSenior Software Engineer\nAbout me\n\nInnovative developer with a passion for artificial intelligence,\nquantum computing, and space exploration technologies. With\nover 9 years of experience in software development, data\nscience, and cloud architecture, Ava has contributed to cutting-\nedge projects in Al-driven satellite navigation and astronomical\ndata processing.\n\nProfessional Experience\n\n2019 Lead Al Engineer\n\n2021 AstroTech Innovations\n* designing machine learning models for autonomous\nsatellites and deep space navigation systems. | served\nas a Full-Stack Developer at OrbitSoft, where |\ndeveloped scalable platforms for astronomical data\nanalysis, leveraging cloud computing and advanced\nprogramming techniques.\n\n2017 Software Developer\n\n2019 TechLife\n\n* Skills included software development, machine\nlearning, quantum algorithms, data science, and cloud\narchitecture. | thrived in innovative, technology-driven\nenvironment and I am always looking toward the future\nof engineering and space research.\n\nReferences\n\nBailey Dupont\nWardiere Inc. / CEO\n\nHarumi Kobayashi\nWardiere Inc. / CEO\nPhone: 123-456-7890\n\nPhone: 123-456-7890\n\nEmail: bailey@gmail.com\n\nEmail: haru@gmail.com",
  };

  const expectedAbout =
    "Innovative developer with a passion for artificial intelligence,\n" +
    "quantum computing, and space exploration technologies. With\n" +
    "over 9 years of experience in software development, data\n" +
    "science, and cloud architecture, Ava has contributed to cutting-\n" +
    "edge projects in Al-driven satellite navigation and astronomical\n" +
    "data processing.";

  test("returns expected structure and content", () => {
    const res = processCV(ocr);

    expect(res).toEqual(
      expect.objectContaining({
        personal_info: expect.any(Object),
        experience: expect.any(Array),
        education: expect.any(Array),
        skills: expect.any(Array),
        certifications: expect.any(Array),
        languages: expect.any(Array),
        projects: expect.any(Array),
        references: expect.any(Array),
      })
    );

    expect(res.personal_info.name).toBe("AVA REYNOLDS");
    expect(res.personal_info.email).toBe("avareynolds@gmail.com");
    expect(res.personal_info.phone).toBe("123-456-7890");
    expect(res.personal_info.address).toBe("123 Anywhere St, Any City");
    expect(res.personal_info.linkedin).toBe("");
    expect(res.personal_info.website).toBe("");
    expect(res.personal_info.description).toBe(expectedAbout);

    const exp = (res.experience || []).join("\n").toLowerCase();
    expect(exp).toContain("lead al engineer");
    expect(exp).toContain("astrotech innovations");
    expect(exp).toContain("software developer");
    expect(exp).toContain("techlife");

    const edu = (res.education || []).join("\n").toLowerCase();
    expect(edu.length).toBeGreaterThan(0);
    expect(edu).toContain("bachelor of science in computer science");
    expect(edu).toContain("mit");
    expect(edu).toContain("2016 - 2020");
    expect(edu).toContain("ba sales and commerce");
    expect(edu).toContain("wardiere university");
    expect(edu).toContain("2020 - 2023");

    const skills = (res.skills || []).join("\n").toLowerCase();
    expect(skills.length).toBeGreaterThan(0);
    expect(skills).toContain("programming");
    expect(skills).toContain("python");
    expect(skills).toContain("java");
    expect(skills).toContain("c++");
    expect(skills).toContain("ethical hacking");
    expect(skills).toContain("problem-solving");
    expect(skills).toContain("time management");
    expect(skills).toContain("networks");

    const langs = (res.languages || []).join("\n").toLowerCase();
    expect(langs.length).toBeGreaterThan(0);
    expect(langs).toContain("english");
    expect(langs).toContain("french");

    expect(res.certifications).toEqual([]);

    expect(res.projects).toEqual([]);

    const refs = (res.references || []).join("\n");
    expect(refs).toMatch(/Bailey Dupont/);
    expect(refs).toMatch(/Harumi Kobayashi/);
    expect(refs).toMatch(/Wardiere Inc\. \/ CEO/);
    expect(refs).toMatch(/123-456-7890/);
    expect(refs).toMatch(/bailey@gmail\.com/);
    expect(refs).toMatch(/haru@gmail\.com/);
  });
});

describe("processCV end-to-end on OCR sample (Brian Park)", () => {
  const ocr = {
    name: "BRIAN PARK",
    remainingCV:
      "CONTACT\n\n&% +123-456-8888\n™%_brianpark@gmail.com\n\nQ 123 Neptune St,, California\n\nEDUCATION\n\n2029 - 2030\nBORCELLE UNIVERSITY\n\n« Bachelor of Engineering\nMining Engineering\n\n2025 - 2029\n\nBORCELLE UNIVERSITY\n\ne Mining Engineering Masters\n\nSKILLS\n\n* mining\n\ngeological assessment\n\nTeamwork\n\n.\n\nTime Management\n\nEffective Communication\nCritical Thinking\n\nMINING ENGINEER\n\nPROFILE\n\nMining Engineer with a strong background in resource extraction,\ngeological assessment, and project management. Skilled in designing\nsafe and efficient mining operations, optimizing production processes,\nand ensuring compliance with environmental and safety regulations.\nPassionate about sustainable mining practices and delivering cost-\neffective solutions in both open-pit and underground environments.\n\nWORK EXPERIENCE\n\nMystique Mountains Lodge 2030 - PRESENT\nTour Guide\n\n¢ Led daily guided tours for groups of up to 25 guests, covering\nlocal wildlife, cultural history, and scenic landmarks. Delivered\nengaging presentations, ensured guest safety, and\ncoordinated logistics to provide memorable outdoor\nexperiences.\n\n@ = Survival Instructor 2025 - 2029\nTwin Eagles Wilderness\n\n* Conducted hands-on survival training programs focused on\nbushcraft, navigation, and emergency preparedness.\nDesigned and delivered customized courses for students,\ncorporate groups, and adventure travelers, emphasizing safety\nand confidence in remote environments.\n\nREFERENCE\nBenjamin Shah Ketut Susilo\nWardiere Inc. / CTO Wardiere Inc. / CEO\n\nLeadership\n\nPhone: 123-456-7890 Phone: 123-456-7891",
  };

  const expectedProfile =
    "Mining Engineer with a strong background in resource extraction,\n" +
    "geological assessment, and project management. Skilled in designing\n" +
    "safe and efficient mining operations, optimizing production processes,\n" +
    "and ensuring compliance with environmental and safety regulations.\n" +
    "Passionate about sustainable mining practices and delivering cost-\n" +
    "effective solutions in both open-pit and underground environments.";

  test("returns expected structure and content", () => {
    const res = processCV(ocr);

    expect(res).toEqual(
      expect.objectContaining({
        personal_info: expect.any(Object),
        experience: expect.any(Array),
        education: expect.any(Array),
        skills: expect.any(Array),
        certifications: expect.any(Array),
        languages: expect.any(Array),
        projects: expect.any(Array),
        references: expect.any(Array),
      })
    );

    expect(res.personal_info.name).toBe("BRIAN PARK");
    expect(res.personal_info.email).toMatch(/brianpark@gmail\.com/i);
    expect(res.personal_info.phone).toBe("+123-456-8888");
    expect(res.personal_info.address).toBe("Q 123 Neptune St,, California");
    expect(res.personal_info.linkedin).toBe("");
    expect(res.personal_info.website).toBe("");
    expect(res.personal_info.description).toBe(expectedProfile);

    const exp = (res.experience || []).join("\n").toLowerCase();
    expect(exp).toContain("mystique mountains lodge");
    expect(exp).toContain("2030 - present");
    expect(exp).toContain("tour guide");
    expect(exp).toContain("survival instructor");
    expect(exp).toContain("twin eagles wilderness");
    expect(exp).toContain("2025 - 2029");

    const edu = (res.education || []).join("\n").toLowerCase();
    expect(edu.length).toBeGreaterThan(0);
    expect(edu).toContain("borcelle university");
    expect(edu).toContain("bachelor of engineering");
    expect(edu).toContain("mining engineering");
    expect(edu).toContain("mining engineering masters");
    expect(edu).toContain("2029 - 2030");
    expect(edu).toContain("2025 - 2029");

    const skills = (res.skills || []).join("\n").toLowerCase();
    expect(skills.length).toBeGreaterThan(0);
    expect(skills).toContain("mining");
    expect(skills).toContain("geological assessment");
    expect(skills).toContain("teamwork");
    expect(skills).toContain("time management");
    expect(skills).toContain("effective communication");
    expect(skills).toContain("critical thinking");

    expect(res.languages).toEqual([]);
    expect(res.certifications).toEqual([]);
    expect(res.projects).toEqual([]);

    const refs = (res.references || []).join("\n");
    expect(refs).toMatch(/Benjamin Shah/i);
    expect(refs).toMatch(/Ketut Susilo/i);
    expect(refs).toMatch(/Wardiere Inc\. \/ CTO/i);
    expect(refs).toMatch(/Wardiere Inc\. \/ CEO/i);
    expect(refs).toMatch(/123-456-7890/);
    expect(refs).toMatch(/123-456-7891/);
  });
});

describe("processCV end-to-end on OCR sample (Daniel Brooks)", () => {
  const ocr = {
    name: "DANIEL BROOKS",
    remainingCV:
      "CONTACT\n& +123-456-7890\n\ndanielbrooks@gmail.com\n\nQ 123 Anywhere St., Any City\n\nwww.reallygreatsite.com\n\nSKILLS\n\nProject Management\n\nPublic Relations\n\nTeamwork\n\nTime Management\n\nLeadership\n\nEffective Communication\n\nCritical Thinking\n\nDigital Marketing\n\nLANGUAGES\n\n¢ English (Fluent)\n" +
      "e French (Fluent)\n* German (Basic)\n* Spanish (Intermediate)\n\nREFERENCE\n\nEstelle Darcy\nWardiere Inc. / CTO\n\nPhone: 123-456-7890\nEmail: estelledarcy@gmail.com\n\nCORPORATE FINANCE DIRECTOR\n\nPROFILE\n\nResults-driven business executive with extensive experience in finance,\nmanagement, and strategic growth initiatives. Skilled in financial management,\n" +
      "business strategy, leadership, marketing, and accounting, | have successfully led\ncorporate finance teams and advised on high-value business transformations.\nI hold a Masters of Commerce in Finance from the University of Cape Town and an\nMBA in Business Administration from Harvard Business School. My leadership\nstyle blends analytical thinking with strategic vision, ensuring organizational\n" +
      "success in competitive corporate environments.\n\nWORK EXPERIENCE\n\nBorcelle Studio 2030 - PRESENT\nMarketing Manager & Specialist\n\nDevelop and execute comprehensive marketing strategies and\ncampaigns that align with the company's goals and objectives.\nLead, mentor, and manage a high-performing marketing team,\n" +
      "fostering a collaborative and results-driven work environment.\nMonitor brand consistency across marketing channels and materials.\n\nFauget Studio 2025 - 2029\nFinance Director\n\n* Create and manage the marketing budget, ensuring efficient\nallocation of resources and optimizing ROI.\n* Oversee corporate finance operations, budget planning, and risk\n" +
      "management for multinational projects\n\nStudio Shodwe 2024 - 2025\nFinance Director\n\n* Develop and maintain strong relationships with partners, agencies,\nand vendors to support marketing initiatives.\n* Monitor and maintain brand consistency across all marketing\nchannels and materials.\n\nEDUCATION\n\nMaster of Commerce 2029 - 2031\n" +
      "School of business | University of Cape Town\nGPA: 3.8 / 4.0\n\nBachelor of Business Management 2025 - 2029\nSchool of business | Wardiere University\nGPA: 3.8 / 4.0",
  };

  const expectedProfile =
    "Results-driven business executive with extensive experience in finance,\n" +
    "management, and strategic growth initiatives. Skilled in financial management,\n" +
    "business strategy, leadership, marketing, and accounting, | have successfully led\n" +
    "corporate finance teams and advised on high-value business transformations.\n" +
    "I hold a Masters of Commerce in Finance from the University of Cape Town and an\n" +
    "MBA in Business Administration from Harvard Business School. My leadership\n" +
    "style blends analytical thinking with strategic vision, ensuring organizational\n" +
    "success in competitive corporate environments.";

  test("returns expected structure and content", () => {
    const res = processCV(ocr);

    expect(res).toEqual(
      expect.objectContaining({
        personal_info: expect.any(Object),
        experience: expect.any(Array),
        education: expect.any(Array),
        skills: expect.any(Array),
        certifications: expect.any(Array),
        languages: expect.any(Array),
        projects: expect.any(Array),
        references: expect.any(Array),
      })
    );

    expect(res.personal_info.name).toBe("DANIEL BROOKS");
    expect(res.personal_info.email).toBe("danielbrooks@gmail.com");
    expect(res.personal_info.phone).toBe("+123-456-7890");
    expect(res.personal_info.address).toBe("Q 123 Anywhere St., Any City");
    expect(res.personal_info.website).toBe("https://www.reallygreatsite.com");
    expect(res.personal_info.linkedin).toBe("");
    expect(res.personal_info.description).toBe(expectedProfile);

    const exp = (res.experience || []).join("\n").toLowerCase();
    expect(exp.length).toBeGreaterThan(0);
    expect(exp).toContain("borcelle studio");
    expect(exp).toContain("2030 - present");
    expect(exp).toContain("marketing manager & specialist");

    expect(exp).toContain("fauget studio");
    expect(exp).toContain("finance director");
    expect(exp).toContain("2025 - 2029");

    expect(exp).toContain("studio shodwe");
    expect(exp).toContain("2024 - 2025");

    const edu = (res.education || []).join("\n").toLowerCase();
    expect(edu.length).toBeGreaterThan(0);
    expect(edu).toContain("master of commerce");
    expect(edu).toContain("2029 - 2031");
    expect(edu).toContain("university of cape town");
    expect(edu).toContain("gpa: 3.8 / 4.0");

    expect(edu).toContain("bachelor of business management");
    expect(edu).toContain("2025 - 2029");
    expect(edu).toContain("wardiere university");
    expect(edu).toContain("gpa: 3.8 / 4.0");

    const skills = (res.skills || []).join("\n").toLowerCase();
    expect(skills.length).toBeGreaterThan(0);
    expect(skills).toContain("project management");
    expect(skills).toContain("public relations");
    expect(skills).toContain("teamwork");
    expect(skills).toContain("time management");
    expect(skills).toContain("leadership");
    expect(skills).toContain("effective communication");
    expect(skills).toContain("critical thinking");
    expect(skills).toContain("digital marketing");

    const langs = (res.languages || []).join("\n").toLowerCase();
    expect(langs.length).toBeGreaterThan(0);
    expect(langs).toContain("english");
    expect(langs).toContain("french");
    expect(langs).toContain("german");
    expect(langs).toContain("spanish");

    const refs = (res.references || []).join("\n");
    expect(refs).toMatch(/Estelle\s+Darcy/i);
    expect(refs).toMatch(/Wardiere Inc\. \/ CTO/i);
    expect(refs).toMatch(/123-456-7890/);
    expect(refs).toMatch(/estelledarcy@gmail\.com/i);

    expect(res.certifications).toEqual([]);
    expect(res.projects).toEqual([]);
  });
});
