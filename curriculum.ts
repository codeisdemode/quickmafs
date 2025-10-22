export interface Course {
  name: string;
  description: string;
}

export const COURSES: Course[] = [
  {
    name: "Pre-Algebra",
    description: "Building the foundations with integers, fractions, and order of operations.",
  },
  {
    name: "Algebra I",
    description: "Solving linear equations, inequalities, and working with polynomials.",
  },
  {
    name: "Algebra II",
    description: "Diving into matrices, complex numbers, and logarithmic functions.",
  },
  {
    name: "Pre-Calculus",
    description: "Exploring trigonometry, vectors, and limits to prepare for calculus.",
  },
  {
    name: "Calculus I",
    description: "Mastering derivatives and their applications in optimization and related rates.",
  },
  {
    name: "Calculus II",
    description: "Conquering integrals, sequences, and series.",
  },
];
