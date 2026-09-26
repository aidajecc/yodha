export interface PhaseItem {
  id: number;
  phaseId: string;
  title: string;
  description: string;
}

export const TIMELINE_PHASES: PhaseItem[] = [
  {
    id: 1,
    phaseId: "PHASE 01",
    title: "Early Bird (Closed)",
    description: "Early bird registration ended on September 21."
  },
  {
    id: 2,
    phaseId: "PHASE 02",
    title: "Registration Closed",
    description: "Team registrations officially closed on September 26. Review in progress."
  },
  {
    id: 3,
    phaseId: "PHASE 03",
    title: "Selection Process",
    description: "Teams are shortlisted based on the submitted PPT and idea."
  },
  {
    id: 4,
    phaseId: "PHASE 04",
    title: "Payment & Confirmation",
    description: "Shortlisted teams complete payment to confirm participation."
  },
  {
    id: 5,
    phaseId: "PHASE 05",
    title: "48-Hour Hackathon",
    description: "Build, develop, and refine solutions with mentoring and reviews."
  },
  {
    id: 6,
    phaseId: "PHASE 06",
    title: "Final Judging & Prizes",
    description: "Present your solution, followed by final judging and prize distribution."
  }
];
