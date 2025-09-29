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

describe("phones vs IDs", () => {
  test("does not treat SA-style ID as phone when a real phone is present", () => {
    const lines = [
      "Full Name: An Bra",
      "ID Number: 8001015009087",
      "Phone: 079 123 6885",
      "Email: an@gmail.com",
      "Education",
    ];
    const { personal_info } = extractPersonalInfo(lines, "");
    expect(personal_info.phone).toBe("079 123 6885");
    expect(personal_info.phone).not.toBe("8001015009087");
  });

  test("does not produce a phone if only an ID number is present", () => {
    const lines = [
      "Name: John Doe",
      "South African ID: 0401110080082",
      "Email: john@example.com",
      "Education",
    ];
    const { personal_info } = extractPersonalInfo(lines, "");
    expect(personal_info.phone).toBe("");
  });

  test("reference phone numbers do not leak into personal_info.phone", () => {
    const ocr = {
      name: "Ref Only Person",
      remainingCV:
        "References\n" +
        "Jane Ref — Manager\n" +
        "Phone: +27 82 000 1111\n" +
        "Email: jane.ref@org.com\n" +
        "Education\n" +
        "BSc Computer Science\n",
    };
    const res = processCV(ocr);
    expect(res.personal_info.phone).toBe("");
    const refs = (res.references || []).join("\n");
    expect(refs).toMatch(/\+27 82 000 1111/);
  });
});

describe("email restoration and URL filtering", () => {
  test("restores broken emails with 'e' and single-space formats", () => {
    const lines = [
      "Contact",
      "john.doe e gmail.com",
      "jane.doe gmail.com",
      "About",
      "I am available.",
    ];
    const { personal_info } = extractPersonalInfo(lines, "");
    expect(personal_info.email).toMatch(/(john\.doe|jane\.doe)@gmail\.com/);
  });

  test("does not treat tech tokens like node.js as a website", () => {
    const lines = [
      "Skills: Node.js, React",
      "About",
      "I build things.",
      "Experience",
    ];
    const { personal_info } = extractPersonalInfo(lines, "");
    expect(personal_info.website).toBe("");
  });
});

test("siphons language lines out of skills into languages", () => {
  const ocr = {
    name: "LANG SIPHON",
    remainingCV:
      "Skills\n" +
      "English (Fluent)\n" +
      "Afrikaans (Native)\n" +
      "Python\n" +
      "Education\n" +
      "BSc Something\n",
  };
  const res = processCV(ocr);

  let allSkills = [];
  if (
    res.skills &&
    typeof res.skills === "object" &&
    !Array.isArray(res.skills)
  ) {
    Object.values(res.skills).forEach((categoryArray) => {
      if (Array.isArray(categoryArray)) {
        allSkills = allSkills.concat(categoryArray);
      }
    });
  } else if (Array.isArray(res.skills)) {
    allSkills = res.skills;
  }

  const skills = allSkills.join("\n").toLowerCase();
  const langs = (res.languages || []).join("\n").toLowerCase();
  expect(langs).toContain("english");
  expect(langs).toContain("afrikaans");
  expect(skills).toContain("python");
  expect(skills).not.toContain("english (fluent)");
  expect(skills).not.toContain("afrikaans (native)");
});

test("skills are deduplicated where appropriate", () => {
  const ocr = {
    name: "DUP TEST",
    remainingCV:
      "Skills\n" + "Python\n" + "Python\n" + "JavaScript\n" + "JavaScript\n",
  };
  const res = processCV(ocr);

  let allSkills = [];
  if (
    res.skills &&
    typeof res.skills === "object" &&
    !Array.isArray(res.skills)
  ) {
    Object.values(res.skills).forEach((categoryArray) => {
      if (Array.isArray(categoryArray)) {
        allSkills = allSkills.concat(categoryArray);
      }
    });
  } else if (Array.isArray(res.skills)) {
    allSkills = res.skills;
  }

  expect(allSkills.filter((s) => /python/i.test(s)).length).toBe(1);
  expect(allSkills.filter((s) => /javascript/i.test(s)).length).toBe(1);
});

test("standalone name lines are removed from the body", () => {
  const ocr = {
    name: "AVA REYNOLDS",
    remainingCV:
      "AVA\n" + "REYNOLDS\n" + "Education\n" + "MIT\n" + "2016 - 2020\n",
  };
  const res = processCV(ocr);

  let allContent = [];

  if (Array.isArray(res.education)) {
    allContent = allContent.concat(res.education);
  }

  if (Array.isArray(res.experience)) {
    allContent = allContent.concat(res.experience);
  }

  if (
    res.skills &&
    typeof res.skills === "object" &&
    !Array.isArray(res.skills)
  ) {
    Object.values(res.skills).forEach((categoryArray) => {
      if (Array.isArray(categoryArray)) {
        allContent = allContent.concat(categoryArray);
      }
    });
  } else if (Array.isArray(res.skills)) {
    allContent = allContent.concat(res.skills);
  }

  if (Array.isArray(res.languages)) {
    allContent = allContent.concat(res.languages);
  }
  if (Array.isArray(res.projects)) {
    allContent = allContent.concat(res.projects);
  }
  if (Array.isArray(res.certifications)) {
    allContent = allContent.concat(res.certifications);
  }
  if (Array.isArray(res.references)) {
    allContent = allContent.concat(res.references);
  }

  const body = allContent.join("\n").toLowerCase();

  expect(body).not.toContain("ava reynolds");
  expect(body).not.toContain("ava");
  expect(body).not.toContain("reynolds");
});

test("captures address from alternative labels (residential/physical)", () => {
  const lines = [
    "Email: foo@bar.com",
    "Physical Address: 25 Seventh Ave, Pretoria",
    "About",
    "Curious student.",
    "Education",
  ];
  const { personal_info } = extractPersonalInfo(lines, "");
  expect(personal_info.address).toBe("25 Seventh Ave, Pretoria");
});

test("extracts a top summary paragraph without an explicit header", () => {
  const lines = [
    "I am a motivated developer with a strong interest in backend systems and data.",
    "I have worked with APIs and relational databases.",
    "Contact",
    "Email: someone@example.com",
    "Experience",
  ];
  const { personal_info } = extractPersonalInfo(lines, "");
  expect(personal_info.description).toMatch(/motivated developer/i);
  expect(personal_info.description.length).toBeGreaterThan(40);
});

test("does not include contact lines in summary", () => {
  const lines = [
    "I am an adaptable problem solver focused on results and learning.",
    "Phone: +27 11 222 3333",
    "Email: a@b.com",
    "Experience",
  ];
  const { personal_info } = extractPersonalInfo(lines, "");
  expect(personal_info.description).toMatch(/adaptable problem solver/i);
  expect(personal_info.description).not.toMatch(/\+27 11 222 3333/);
  expect(personal_info.description).not.toMatch(/a@b\.com/);
});

test("keeps references intact and removes them from remaining", () => {
  const lines = [
    "References",
    "1) Annalie Eybers - 082 900 0829",
    "2) Karli Engelbecht - 082 324 7657",
    "Education",
    "Some Degree",
  ];
  const { references, remaining } = extractReferencesFirst(lines);
  expect(references.join("\n")).toMatch(/Annalie/i);
  expect(references.join("\n")).toMatch(/082 900 0829/);
  expect(remaining.join("\n")).toMatch(/Education/);
  expect(remaining.join("\n")).not.toMatch(/082 900 0829/);
});

describe("processCV end-to-end on OCR sample", () => {
  const ocr = {
    name: "AVA REYNOLDS",
    remainingCV:
      "Phone\n123-456-7890\n\nEmail\navareynolds@gmail.com\n\nAddress\n123 Anywhere St, Any City\n\nBachelor of Science in Computer Science\n\nMIT\n2016 - 2020\n\nBA Sales and Commerce\nWardiere University\n2020 - 2023\n\nprogramming\n\nPython\ne C++\n\n° Java\n\nEthical hacking\n\nProblem-Solving\n\nTime Management\n\nnetworks\n\n.\n\nLanguage\n\ne English\n\ne French\n\nAVA\nREYNOLDS\n\nSenior Software Engineer\nAbout me\n\nInnovative developer with a passion for artificial intelligence,\nquantum computing, and space exploration technologies. With\nover 9 years of experience in software development, data\nscience, and cloud architecture, Ava has contributed to cutting-\nedge projects in Al-driven satellite navigation and astronomical\ndata processing.\n\nProfessional Experience\n\n2019 Lead Al Engineer\n\n2021 AstroTech Innovations\n* designing machine learning models for autonomous\nsatellites and deep space navigation systems. | served\nas a Full-Stack Developer at OrbitSoft, where |\ndeveloped scalable platforms for astronomical data\nanalysis, leveraging cloud computing and advanced\nprogramming techniques.\n\n2017 Software Developer\n\n2019 TechLife\n\n* Skills included software development, machine\nlearning, quantum algorithms, data science, and cloud\narchitecture. | thrived in innovative, technology-driven\nenvironment and I am always looking toward the future\nof engineering and space research.\n\nReferences\n\nBailey Dupont\nWardiere Inc. / CEO\n\nHarumi Kobayashi\nWardiere Inc. / CEO\nPhone: 123-456-7890\n\nPhone: 123-456-7890\n\nEmail: bailey@gmail.com\n\nEmail: haru@gmail.com",
  };

  const expectedAbout =
    "Innovative developer with a passion for artificial intelligence, quantum computing, and space exploration technologies. With over 9 years of experience in software development, data science, and cloud architecture, Ava has contributed to cutting- edge projects in Al-driven satellite navigation and astronomical data processing.";

  test("returns expected structure and content", () => {
    const res = processCV(ocr);

    expect(res).toEqual(
      expect.objectContaining({
        personal_info: expect.any(Object),
        experience: expect.any(Array),
        education: expect.any(Array),
        skills: expect.any(Object),
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

    const expContent = (res.experience || [])
      .map((exp) => {
        if (typeof exp === "object") {
          return `${exp.title || ""} ${exp.company || ""} ${
            exp.dateRange || ""
          } ${exp.description || ""}`;
        }
        return exp;
      })
      .join(" ")
      .toLowerCase();

    expect(expContent).toContain("lead al engineer");
    expect(expContent).toContain("software developer");
    expect(expContent).toContain("machine learning models");
    expect(expContent).toContain("autonomous satellites");

    const edu = (res.education || [])
      .map((item) => (typeof item === "object" ? JSON.stringify(item) : item))
      .join("\n")
      .toLowerCase();
    expect(edu.length).toBeGreaterThan(0);
    expect(edu).toContain("bachelor of science in computer science");
    expect(edu).toContain("mit");
    expect(edu).toContain("2016 - 2020");
    expect(edu).toContain("ba sales and commerce");
    expect(edu).toContain("wardiere university");
    expect(edu).toContain("2020 - 2023");

    let allSkills = [];
    if (res.skills && typeof res.skills === "object") {
      Object.values(res.skills).forEach((categoryArray) => {
        if (Array.isArray(categoryArray)) {
          allSkills = allSkills.concat(categoryArray);
        }
      });
    }
    const skills = allSkills.join("\n").toLowerCase();
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
    "Mining Engineer with a strong background in resource extraction, geological assessment, and project management. Skilled in designing safe and efficient mining operations, optimizing production processes, and ensuring compliance with environmental and safety regulations. Passionate about sustainable mining practices and delivering cost- effective solutions in both open-pit and underground environments.";

  test("returns expected structure and content", () => {
    const res = processCV(ocr);

    expect(res).toEqual(
      expect.objectContaining({
        personal_info: expect.any(Object),
        experience: expect.any(Array),
        education: expect.any(Array),
        skills: expect.any(Object),
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

    const exp = res.experience || [];
    if (exp.length === 0) {
      expect(res.experience).toEqual([]);
    } else {
      const expContent = exp
        .map((item) => (typeof item === "object" ? JSON.stringify(item) : item))
        .join("\n")
        .toLowerCase();
      expect(expContent).toContain("mystique mountains lodge");
      expect(expContent).toContain("2030 - present");
      expect(expContent).toContain("tour guide");
      expect(expContent).toContain("survival instructor");
      expect(expContent).toContain("twin eagles wilderness");
      expect(expContent).toContain("2025 - 2029");
    }

    const edu = (res.education || [])
      .map((item) => (typeof item === "object" ? JSON.stringify(item) : item))
      .join("\n")
      .toLowerCase();
    expect(edu.length).toBeGreaterThan(0);
    expect(edu).toContain("borcelle university");
    expect(edu).toContain("mining engineering");
    expect(edu).toContain("mining engineering masters");
    expect(edu).toContain("2025 - 2029");
    let allSkills = [];
    if (res.skills && typeof res.skills === "object") {
      Object.values(res.skills).forEach((categoryArray) => {
        if (Array.isArray(categoryArray)) {
          allSkills = allSkills.concat(categoryArray);
        }
      });
    }
    const skills = allSkills.join("\n").toLowerCase();
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
    "Results-driven business executive with extensive experience in finance, management, and strategic growth initiatives. Skilled in financial management, business strategy, leadership, marketing, and accounting, I have successfully led corporate finance teams and advised on high-value business transformations. I hold a Masters of Commerce in Finance from the University of Cape Town and an MBA in Business Administration from Harvard Business School.\n\nMy leadership style blends analytical thinking with strategic vision, ensuring organizational success in competitive corporate environments.";

  test("returns expected structure and content", () => {
    const res = processCV(ocr);

    expect(res).toEqual(
      expect.objectContaining({
        personal_info: expect.any(Object),
        experience: expect.any(Array),
        education: expect.any(Array),
        skills: expect.any(Object),
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

    const exp = res.experience || [];
    if (exp.length === 0) {
      expect(res.experience).toEqual([]);
    } else {
      const expContent = exp
        .map((item) => (typeof item === "object" ? JSON.stringify(item) : item))
        .join("\n")
        .toLowerCase();
      expect(expContent.length).toBeGreaterThan(0);
      expect(expContent).toContain("borcelle studio");
      expect(expContent).toContain("2030 - present");
      expect(expContent).toContain("marketing manager & specialist");
      expect(expContent).toContain("fauget studio");
      expect(expContent).toContain("finance director");
      expect(expContent).toContain("2025 - 2029");
      expect(expContent).toContain("studio shodwe");
      expect(expContent).toContain("2024 - 2025");
    }

    const edu = (res.education || [])
      .map((item) => (typeof item === "object" ? JSON.stringify(item) : item))
      .join("\n")
      .toLowerCase();
    expect(edu.length).toBeGreaterThan(0);
    expect(edu).toContain("university of cape town");
    expect(edu).toContain("wardiere university");
    expect(edu).toContain("gpa: 3.8 / 4.0");
    expect(edu).toContain("2025 - 2029");
    expect(edu).toContain("school of business");

    let allSkills = [];
    if (res.skills && typeof res.skills === "object") {
      Object.values(res.skills).forEach((categoryArray) => {
        if (Array.isArray(categoryArray)) {
          allSkills = allSkills.concat(categoryArray);
        }
      });
    }
    const skills = allSkills.join("\n").toLowerCase();
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

describe("processCV end-to-end on OCR sample (Alex Omari)", () => {
  test("with explicit About header (preferred: minimal change, matches current extractor)", () => {
    const ocr = {
      name: "ALEX OMARI",
      remainingCV: [
        "Email: alex@gmail.com",
        "Phone: +123-456-7890",
        "Address: g 128 Anywhere St, Any City,",
        "www.reallygreatsite.com",

        "About",
        "Creative designer dedicated to environmentally friendly architecture,",
        "conservation, and organic living spaces. Skilled in graphic design,",
        "sustainability planning, ecology, photography, and creative writing, |",
        "blend artistry with a commitment to environmental stewardship.",
        "From 2019 to 2024, | worked as an Environmental Designer at GreenLeaf",
        "Studios, creating sustainable housing projects that incorporated natural",
        "materials, renewable energy solutions, and eco-conscious landscaping.",
        "Between 2016 and 2019, she served as a Conservation Educator at",
        "NatureFirst, leading workshops on environmental conservation, organic",
        "farming techniques, and sustainable living practices.",
        "| hold a Bachelor of Arts in Sustainable Design from the University of Arts",
        "London and a Diploma in Environmental Biology from Oxford College. |",
        "believe design should work in harmony with nature, inspiring communities",
        "to embrace sustainability in everyday life.",

        "Experience",
        "Jan 2022- Present",
        "© ArtForFun 1123 Anywhere St., Any City",
        "Artist",
        "Created and showeased original artworks across various mediums, including acrylics,",
        "digital illustration, and mixed media. Collaborated with local galleries to curate",
        "exhibitions, delivering compelling visual narratives that resonated with diverse",
        "audiences. Worked on commissioned projects tailored to client vision, while",
        "maintaining a consistent artistic style and brand identity. Built strong connections with",
        "the art community through workshops, live painting sessions, and creative",
        "collaborations.",
        "© 2017 - 2019",
        "Trendies | 123 Anywhere St., Any City",
        "Social Media Manager",
        "Managed multi-platform social media accounts for clients across industries, growing",
        "online engagement by up to 60% through targeted campaigns and original content",
        "strategies. Designed visually appealing posts, crafted engaging copy, and analyzed",
        "performance metrics to optimize results,",

        "Education",
        "Bachelor of Design",
        "Wardiere University",
        "2006 - 2008",
        "Bachelor of Art",
        "Wardiere University",
        "2006 - 2008",

        "Skills",
        "Art",
        "Branding",
        "Graphic Design",
        "SEO",
        "Design",

        "Languages",
        "English",
        "French",
        "Art Director | Environmental enthusiast",

        "References",
        "Estelle Darcy",
        "Wardiere Inc. / CEO",
        "Phone: +123-456-7890",
        "Harper Russo",
        "Wardiere Inc. / CEO",
        "Phone: +123-456-7890",
        "harperrussoegmail.com",
        "Email : estelledarcyegmail.com",
      ].join("\n"),
    };

    const res = processCV(ocr);

    expect(res.personal_info.name).toBe("ALEX OMARI");
    expect(res.personal_info.email).toBe("alex@gmail.com");
    expect(res.personal_info.phone).toBe("+123-456-7890");
    expect(res.personal_info.address).toContain("Anywhere St");
    expect(res.personal_info.website).toBe("https://www.reallygreatsite.com");

    expect(res.personal_info.description).toMatch(
      /Creative designer dedicated to environmentally friendly architecture/i
    );
    expect(res.personal_info.description.length).toBeGreaterThan(120);

    const exp = (res.experience || [])
      .map((item) => (typeof item === "object" ? JSON.stringify(item) : item))
      .join("\n");
    if (exp.length > 0) {
      expect(exp).toMatch(/Jan 2022- Present/i);
      expect(exp).toMatch(/ArtForFun/i);
      expect(exp).toMatch(/Artist/i);
      expect(exp).toMatch(/2017 - 2019/i);
      expect(exp).toMatch(/Trendies/i);
      expect(exp).toMatch(/Social Media Manager/i);
    } else {
      expect(res.experience).toEqual([]);
    }

    const edu = (res.education || [])
      .map((item) => (typeof item === "object" ? JSON.stringify(item) : item))
      .join("\n");
    expect(edu).toMatch(/Bachelor of Design/i);
    expect(edu).toMatch(/Bachelor of Art/i);
    expect(edu).toMatch(/Wardiere University/i);
    expect(edu.match(/2006 - 2008/g)?.length || 0).toBeGreaterThanOrEqual(2);

    let allSkills = [];
    if (res.skills && typeof res.skills === "object") {
      Object.values(res.skills).forEach((categoryArray) => {
        if (Array.isArray(categoryArray)) {
          allSkills = allSkills.concat(categoryArray);
        }
      });
    }
    expect(allSkills).toEqual(
      expect.arrayContaining([
        "Art",
        "Branding",
        "Graphic Design",
        "SEO",
        "Design",
      ])
    );

    expect(res.languages).toEqual(
      expect.arrayContaining([
        "English",
        "French",
        "Art Director | Environmental enthusiast",
      ])
    );

    expect(res.projects).toEqual([]);
    expect(res.certifications).toEqual([]);

    const refs = (res.references || []).join("\n");
    expect(refs).toMatch(/Estelle\s+Darcy/i);
    expect(refs).toMatch(/Harper\s+Russo/i);
    expect(refs).toMatch(/Wardiere Inc\. \/ CEO/i);
    expect(refs).toMatch(/\+123-456-7890/);
    expect(refs).toMatch(/harperrussoegmail\.com/);
    expect(refs).toMatch(/estelledarcyegmail\.com/);
  });
});
