import { ROLES } from "./users";

// Delegation of Authority Matrix
// Defines which approval chain a PO follows based on its amount
export const doaSlabs = [
  {
    id: "slab1",
    label: "Under 1 Lakh",
    minAmount: 0,
    maxAmount: 100000,
    chain: [ROLES.COO],
    description: "Department Head / COO approval only",
  },
  {
    id: "slab2",
    label: "1 - 10 Lakh",
    minAmount: 100001,
    maxAmount: 1000000,
    chain: [ROLES.COO, ROLES.CFO],
    description: "COO + CFO approval required",
  },
  {
    id: "slab3",
    label: "10 - 50 Lakh",
    minAmount: 1000001,
    maxAmount: 5000000,
    chain: [ROLES.LEGAL, ROLES.COO, ROLES.CFO],
    description: "Legal review + COO + CFO approval",
  },
  {
    id: "slab4",
    label: "Above 50 Lakh",
    minAmount: 5000001,
    maxAmount: Infinity,
    chain: [ROLES.LEGAL, ROLES.COO, ROLES.CFO],
    description: "Legal review + COO + CFO + Founder approval",
  },
];

export function getApprovalChain(amount) {
  const slab = doaSlabs.find(
    (s) => amount >= s.minAmount && amount <= s.maxAmount
  );
  return slab ? slab.chain : doaSlabs[doaSlabs.length - 1].chain;
}

export function getSlabForAmount(amount) {
  return doaSlabs.find(
    (s) => amount >= s.minAmount && amount <= s.maxAmount
  );
}
