export const ROLES = {
  REQUESTER: "requester",
  LEGAL: "legal",
  COO: "coo",
  CFO: "cfo",
  ADMIN: "admin",
};

export const users = [
  {
    id: "u1",
    name: "Wani Deoras",
    email: "wani.deoras@thesleepcompany.in",
    role: ROLES.REQUESTER,
    title: "Procurement Associate",
    department: "Procurement",
    avatar: "WD",
  },
  {
    id: "u2",
    name: "Sneha Kapoor",
    email: "sneha.kapoor@thesleepcompany.in",
    role: ROLES.LEGAL,
    title: "Legal Counsel",
    department: "Legal",
    avatar: "SK",
  },
  {
    id: "u3",
    name: "Karan Singla",
    email: "karan.singla@thesleepcompany.in",
    role: ROLES.COO,
    title: "Chief Operating Officer",
    department: "Operations",
    avatar: "KS",
  },
  {
    id: "u4",
    name: "Hemal Jain",
    email: "hemal.jain@thesleepcompany.in",
    role: ROLES.CFO,
    title: "Chief Financial Officer",
    department: "Finance",
    avatar: "HJ",
  },
  {
    id: "u5",
    name: "Priya Sharma",
    email: "priya.sharma@thesleepcompany.in",
    role: ROLES.ADMIN,
    title: "System Administrator",
    department: "IT",
    avatar: "PS",
  },
];

export function getUserById(id) {
  return users.find((u) => u.id === id);
}

export function getUsersByRole(role) {
  return users.filter((u) => u.role === role);
}
