import { PrismaClient, UserRole, ResourceType, ResourceStatus, QuizDifficulty } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding BusiLearn database...");

  // ─── CAMPUS ─────────────────────────────────────────────────────────────────
  const campus = await db.campus.upsert({
    where: { slug: "arapai-campus" },
    update: {},
    create: {
      title: "Arapai Campus",
      slug: "arapai-campus",
      location: "Arapai, Soroti, Uganda",
      description: "Busitema University Arapai Campus — Faculty of Agriculture and Natural Resources",
    },
  });
  console.log("✅ Campus created:", campus.title);

  // ─── DEPARTMENTS ────────────────────────────────────────────────────────────
  const deptAgriculture = await db.department.upsert({
    where: { slug: "faculty-of-agriculture" },
    update: {},
    create: {
      title: "Faculty of Agriculture",
      slug: "faculty-of-agriculture",
      description: "Covers agribusiness, agricultural engineering, and related disciplines.",
      campusId: campus.id,
    },
  });

  const deptEducation = await db.department.upsert({
    where: { slug: "faculty-of-education" },
    update: {},
    create: {
      title: "Faculty of Education",
      slug: "faculty-of-education",
      description: "Covers primary and secondary education programs.",
      campusId: campus.id,
    },
  });
  console.log("✅ Departments created");

  // ─── COURSES ────────────────────────────────────────────────────────────────
  const courseAgribusiness = await db.course.upsert({
    where: { code: "AGR101" },
    update: {},
    create: {
      title: "Agribusiness Management",
      code: "AGR101",
      slug: "agribusiness-management",
      description: "Combines agricultural science with business management principles.",
      campusId: campus.id,
      departmentId: deptAgriculture.id,
    },
  });

  const courseAgrEngineering = await db.course.upsert({
    where: { code: "AEG101" },
    update: {},
    create: {
      title: "Agricultural Engineering",
      code: "AEG101",
      slug: "agricultural-engineering",
      description: "Focuses on engineering principles applied to agricultural systems.",
      campusId: campus.id,
      departmentId: deptAgriculture.id,
    },
  });

  const coursePrimEdu = await db.course.upsert({
    where: { code: "PED101" },
    update: {},
    create: {
      title: "Primary Education",
      code: "PED101",
      slug: "primary-education",
      description: "Prepares students to teach at primary school level.",
      campusId: campus.id,
      departmentId: deptEducation.id,
    },
  });
  console.log("✅ Courses created");

  // ─── COURSE UNITS ────────────────────────────────────────────────────────────
  // Agribusiness units
  const agr_units = [
    { title: "Introduction to Agribusiness", code: "AGR101-U1" },
    { title: "Agricultural Marketing", code: "AGR101-U2" },
    { title: "Farm Management", code: "AGR101-U3" },
  ];
  const createdAgrUnits = [];
  for (const unit of agr_units) {
    const u = await db.courseUnit.upsert({
      where: { id: `agr-unit-${unit.code}` },
      update: {},
      create: { id: `agr-unit-${unit.code}`, title: unit.title, code: unit.code, courseId: courseAgribusiness.id },
    });
    createdAgrUnits.push(u);
  }

  // Agricultural Engineering units
  const aeg_units = [
    { title: "Engineering Mathematics", code: "AEG101-U1" },
    { title: "Soil and Water Engineering", code: "AEG101-U2" },
    { title: "Farm Machinery", code: "AEG101-U3" },
  ];
  const createdAegUnits = [];
  for (const unit of aeg_units) {
    const u = await db.courseUnit.upsert({
      where: { id: `aeg-unit-${unit.code}` },
      update: {},
      create: { id: `aeg-unit-${unit.code}`, title: unit.title, code: unit.code, courseId: courseAgrEngineering.id },
    });
    createdAegUnits.push(u);
  }

  // Primary Education units
  const ped_units = [
    { title: "Child Psychology", code: "PED101-U1" },
    { title: "Curriculum Development", code: "PED101-U2" },
    { title: "Teaching Methods", code: "PED101-U3" },
  ];
  const createdPedUnits = [];
  for (const unit of ped_units) {
    const u = await db.courseUnit.upsert({
      where: { id: `ped-unit-${unit.code}` },
      update: {},
      create: { id: `ped-unit-${unit.code}`, title: unit.title, code: unit.code, courseId: coursePrimEdu.id },
    });
    createdPedUnits.push(u);
  }
  console.log("✅ Course units created (9 total)");

  // ─── CATEGORIES ──────────────────────────────────────────────────────────────
  const catPastPapers = await db.category.upsert({
    where: { slug: "past-papers" },
    update: {},
    create: { title: "Past Papers", slug: "past-papers" },
  });
  const catNotes = await db.category.upsert({
    where: { slug: "lecture-notes" },
    update: {},
    create: { title: "Lecture Notes", slug: "lecture-notes" },
  });
  const catVideos = await db.category.upsert({
    where: { slug: "videos" },
    update: {},
    create: { title: "Videos", slug: "videos" },
  });
  const catAssignments = await db.category.upsert({
    where: { slug: "assignments" },
    update: {},
    create: { title: "Assignments", slug: "assignments" },
  });
  console.log("✅ Categories created");

  // ─── USERS ───────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const lecturerPassword = await bcrypt.hash("Lecturer@123", 10);
  const studentPassword = await bcrypt.hash("Student@123", 10);

  const adminUser = await db.user.upsert({
    where: { email: "admin@busilearn.ac.ug" },
    update: {},
    create: {
      name: "Admin User",
      firstName: "Admin",
      lastName: "User",
      email: "admin@busilearn.ac.ug",
      password: adminPassword,
      role: UserRole.ADMIN,
      isVerified: true,
      campusId: campus.id,
    },
  });

  const lecturerUser = await db.user.upsert({
    where: { email: "lecturer@busilearn.ac.ug" },
    update: {},
    create: {
      name: "Lecturer User",
      firstName: "Lecturer",
      lastName: "User",
      email: "lecturer@busilearn.ac.ug",
      password: lecturerPassword,
      role: UserRole.LECTURER,
      isVerified: true,
      campusId: campus.id,
      courseId: courseAgribusiness.id,
      departmentId: deptAgriculture.id,
    },
  });

  const studentUser = await db.user.upsert({
    where: { email: "student@busilearn.ac.ug" },
    update: {},
    create: {
      name: "Student User",
      firstName: "Student",
      lastName: "User",
      email: "student@busilearn.ac.ug",
      password: studentPassword,
      role: UserRole.STUDENT,
      isVerified: true,
      campusId: campus.id,
      courseId: courseAgribusiness.id,
      departmentId: deptAgriculture.id,
      yearOfStudy: 1,
    },
  });
  console.log("✅ Users created (Admin, Lecturer, Student)");

  // ─── RESOURCES ───────────────────────────────────────────────────────────────
  const resourcesData = [
    {
      title: "AGR101 Past Paper 2023",
      slug: "agr101-past-paper-2023",
      type: ResourceType.PAST_PAPER,
      courseId: courseAgribusiness.id,
      categoryId: catPastPapers.id,
    },
    {
      title: "AGR101 Lecture Notes - Unit 1",
      slug: "agr101-lecture-notes-unit-1",
      type: ResourceType.NOTES,
      courseId: courseAgribusiness.id,
      categoryId: catNotes.id,
    },
    {
      title: "AEG101 Past Paper 2023",
      slug: "aeg101-past-paper-2023",
      type: ResourceType.PAST_PAPER,
      courseId: courseAgrEngineering.id,
      categoryId: catPastPapers.id,
    },
    {
      title: "AEG101 Lecture Notes - Engineering Math",
      slug: "aeg101-lecture-notes-engineering-math",
      type: ResourceType.NOTES,
      courseId: courseAgrEngineering.id,
      categoryId: catNotes.id,
    },
    {
      title: "PED101 Past Paper 2023",
      slug: "ped101-past-paper-2023",
      type: ResourceType.PAST_PAPER,
      courseId: coursePrimEdu.id,
      categoryId: catPastPapers.id,
    },
    {
      title: "PED101 Lecture Notes - Child Psychology",
      slug: "ped101-lecture-notes-child-psychology",
      type: ResourceType.NOTES,
      courseId: coursePrimEdu.id,
      categoryId: catNotes.id,
    },
  ];

  for (const r of resourcesData) {
    await db.resource.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        title: r.title,
        slug: r.slug,
        type: r.type,
        fileUrl: "https://example.com/placeholder.pdf",
        status: ResourceStatus.APPROVED,
        courseId: r.courseId,
        categoryId: r.categoryId,
        campusId: campus.id,
        userId: lecturerUser.id,
      },
    });
  }
  console.log("✅ Resources created (6 total)");

  // ─── QUIZ ────────────────────────────────────────────────────────────────────
  const quiz = await db.quiz.upsert({
    where: { id: "busilearn-quiz-1" },
    update: {},
    create: {
      id: "busilearn-quiz-1",
      title: "Agribusiness Fundamentals Quiz",
      description: "Test your knowledge of basic agribusiness concepts.",
      difficulty: QuizDifficulty.EASY,
      timeLimit: 30,
      passMark: 60,
      isPublished: true,
      courseId: courseAgribusiness.id,
      createdById: lecturerUser.id,
    },
  });

  const quizQuestions = [
    {
      questionText: "What does GDP stand for?",
      options: ["Gross Domestic Product", "General Development Plan", "Growth and Development Policy", "Global Distribution Protocol"],
      correctAnswer: "Gross Domestic Product",
      explanation: "GDP stands for Gross Domestic Product, a measure of economic output.",
    },
    {
      questionText: "Which of the following is a cash crop?",
      options: ["Maize", "Coffee", "Cassava", "Sweet Potato"],
      correctAnswer: "Coffee",
      explanation: "Coffee is primarily grown for sale/export, making it a cash crop.",
    },
    {
      questionText: "What is the primary goal of farm management?",
      options: ["Maximize land use", "Maximize profit", "Reduce labor", "Increase crop variety"],
      correctAnswer: "Maximize profit",
      explanation: "Farm management aims to maximize profit through efficient resource use.",
    },
    {
      questionText: "Which sector does agribusiness belong to?",
      options: ["Primary sector only", "Secondary sector only", "Both primary and secondary", "Tertiary sector"],
      correctAnswer: "Both primary and secondary",
      explanation: "Agribusiness spans both production (primary) and processing (secondary) sectors.",
    },
    {
      questionText: "What is a cooperative in agriculture?",
      options: [
        "A government farm",
        "A group of farmers sharing resources",
        "A type of pesticide",
        "An irrigation system",
      ],
      correctAnswer: "A group of farmers sharing resources",
      explanation: "A cooperative is a farmer-owned business that pools resources for mutual benefit.",
    },
  ];

  for (let i = 0; i < quizQuestions.length; i++) {
    const q = quizQuestions[i];
    await db.quizQuestion.upsert({
      where: { id: `quiz1-q${i + 1}` },
      update: {},
      create: {
        id: `quiz1-q${i + 1}`,
        quizId: quiz.id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: 1,
      },
    });
  }
  console.log("✅ Quiz created with 5 questions");

  // ─── Q&A ─────────────────────────────────────────────────────────────────────
  const q1 = await db.question.upsert({
    where: { id: "busilearn-q1" },
    update: {},
    create: {
      id: "busilearn-q1",
      title: "How do I calculate gross margin in agribusiness?",
      content: "I am struggling to understand how to calculate gross margin for my farm business plan. Can someone explain with an example?",
      tags: ["agribusiness", "finance", "gross-margin"],
      userId: studentUser.id,
      courseId: courseAgribusiness.id,
    },
  });

  const q2 = await db.question.upsert({
    where: { id: "busilearn-q2" },
    update: {},
    create: {
      id: "busilearn-q2",
      title: "What are the key principles of soil conservation?",
      content: "Can someone summarize the main soil conservation techniques taught in Agricultural Engineering?",
      tags: ["agricultural-engineering", "soil", "conservation"],
      userId: studentUser.id,
      courseId: courseAgrEngineering.id,
    },
  });

  await db.answer.upsert({
    where: { id: "busilearn-a1" },
    update: {},
    create: {
      id: "busilearn-a1",
      content: "Gross margin = Total Revenue - Variable Costs. For example, if you sell crops worth UGX 5,000,000 and your variable costs (seeds, fertilizer, labor) are UGX 2,000,000, your gross margin is UGX 3,000,000.",
      questionId: q1.id,
      userId: lecturerUser.id,
      isAccepted: true,
      upVotes: 5,
    },
  });

  await db.answer.upsert({
    where: { id: "busilearn-a2" },
    update: {},
    create: {
      id: "busilearn-a2",
      content: "Key soil conservation principles include: 1) Contour farming to reduce runoff, 2) Cover cropping to protect topsoil, 3) Crop rotation to maintain soil fertility, 4) Terracing on slopes, and 5) Minimum tillage to preserve soil structure.",
      questionId: q2.id,
      userId: lecturerUser.id,
      isAccepted: true,
      upVotes: 3,
    },
  });
  console.log("✅ Q&A created (2 questions, 2 answers)");

  // ─── ANNOUNCEMENT ────────────────────────────────────────────────────────────
  await db.announcement.upsert({
    where: { id: "busilearn-ann1" },
    update: {},
    create: {
      id: "busilearn-ann1",
      title: "Welcome to BusiLearn — Arapai Campus!",
      content: "We are excited to launch BusiLearn, the official digital learning platform for Busitema University, Arapai Campus. Access past papers, lecture notes, quizzes, and more. Your Campus, Your Resources, Your Success.",
      isPublic: true,
      campusId: campus.id,
      createdById: adminUser.id,
    },
  });
  console.log("✅ Announcement created");

  console.log("\n🎉 Seeding complete! BusiLearn is ready.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
