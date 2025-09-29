const professionalTemplates = [
  {
    title: "Space",
    description: "A futuristic scene that showcases innovation and ambition.",
    image: "/images/space.png",
    href: "/space",
    category: "professional",
    isImmersive: false, // 2D-ish template
  },
  {
    title: "Forest",
    description: "Serene and natural — ideal for calm, grounded presentation.",
    image: "/images/forest.png",
    href: "/forest",
    category: "professional",
    isImmersive: false, // 2D-ish template
  },
  {
    title: "Office",
    description: "Corporate and professional with a sleek modern look.",
    image: "/images/office.png",
    href: "/office",
    category: "professional",
    isImmersive: false, // 2D-ish template
  },
  {
    title: "Cave",
    description: "Man like Cave - Professional Edition",
    image: "/images/cave.png",
    href: "/cavev2",
    category: "professional",
    isImmersive: false, // 2D-ish template
  },
  {
    title: "Lab",
    description: "Professional laboratory environment for scientific presentations.",
    image: "/images/lab.png",
    href: "/labpro",
    category: "professional",
    isImmersive: false, // 2D-ish template
  }
];

const funTemplates = [
  {
    title: "Space",
    description: "A futuristic scene that showcases innovation and ambition - Fully Immersive 3D.",
    image: "/images/space.png",
    href: "/space3d",
    category: "fun",
    isImmersive: true, // Fully immersive 3D template
  },
  {
    title: "Forest",
    description: "Serene and natural — ideal for calm, grounded presentation - Fully Immersive 3D.",
    image: "/images/forest.png",
    href: "/forest3d",
    category: "fun",
    isImmersive: true, // Fully immersive 3D template
  },
  {
    title: "Office",
    description: "Corporate and professional with a sleek modern look - Fully Immersive 3D.",
    image: "/images/office.png",
    href: "/office3d",
    category: "fun",
    isImmersive: true, // Fully immersive 3D template
  },
  {
    title: "Cave",
    description: "Man like Cave - Fully Immersive 3D Edition",
    image: "/images/cave.png",
    href: "/cave",
    category: "fun",
    isImmersive: true, // Fully immersive 3D template
  },
  {
    title: "Lab",
    description: "Waltah White - Fully Immersive 3D Edition",
    image: "/images/lab.png",
    href: "/lab3d",
    category: "fun",
    isImmersive: true, // Fully immersive 3D template
  }
];

// Legacy export for backward compatibility
const templates = [...professionalTemplates, ...funTemplates];

export default templates;
export { professionalTemplates, funTemplates };
