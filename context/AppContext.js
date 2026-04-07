"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { users, ROLES } from "@/data/users";
import { initialPurchaseOrders, PO_STATUS } from "@/data/purchaseOrders";
import { initialAuditLogs } from "@/data/auditLogs";
import { getApprovalChain } from "@/data/doaMatrix";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(users[0]); // Wani (Requester)
  const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [poCounter, setPoCounter] = useState(49);

  const switchRole = useCallback((userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  }, []);

  const addAuditLog = useCallback((poId, action, details, before, after) => {
    const log = {
      id: `al-${Date.now()}`,
      poId,
      userId: currentUser.id,
      action,
      details,
      timestamp: new Date().toISOString(),
      before,
      after,
    };
    setAuditLogs((prev) => [...prev, log]);
    return log;
  }, [currentUser]);

  const addPurchaseOrder = useCallback((poData) => {
    const num = poCounter;
    setPoCounter((c) => c + 1);
    const chain = getApprovalChain(poData.amount);
    const firstStep = chain[0];

    let initialStatus;
    if (firstStep === ROLES.LEGAL) initialStatus = PO_STATUS.PENDING_LEGAL;
    else if (firstStep === ROLES.COO) initialStatus = PO_STATUS.PENDING_COO;
    else initialStatus = PO_STATUS.PENDING_CFO;

    const approvals = {};
    chain.forEach((role) => {
      approvals[role] = { userId: null, date: null, status: "pending" };
    });

    const newPO = {
      id: `po-${String(num).padStart(3, "0")}`,
      poNumber: `TSC/PO/2026/${String(num).padStart(4, "0")}`,
      vendorId: poData.vendorId,
      vendorName: poData.vendorName,
      department: poData.department,
      amount: poData.amount,
      description: poData.description,
      paymentTerms: poData.paymentTerms,
      deliveryDate: poData.deliveryDate,
      status: initialStatus,
      requesterId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: poData.attachments || [],
      approvalChain: chain,
      approvals,
      signed: false,
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    addAuditLog(newPO.id, "created", `PO submitted for ${poData.vendorName}`, null, initialStatus);
    return newPO;
  }, [poCounter, currentUser, addAuditLog]);

  const approvePO = useCallback((poId) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id !== poId) return po;
        const role = currentUser.role;
        const chain = po.approvalChain;
        const roleIndex = chain.indexOf(role);
        if (roleIndex === -1) return po;

        const updatedApprovals = { ...po.approvals };
        updatedApprovals[role] = {
          userId: currentUser.id,
          date: new Date().toISOString(),
          status: "approved",
        };

        let newStatus;
        const nextRole = chain[roleIndex + 1];
        if (!nextRole) {
          // Last in chain
          if (role === ROLES.CFO) {
            newStatus = PO_STATUS.CFO_APPROVED; // awaiting signature
          } else {
            newStatus = PO_STATUS.APPROVED;
          }
        } else if (nextRole === ROLES.COO) {
          newStatus = PO_STATUS.PENDING_COO;
        } else if (nextRole === ROLES.CFO) {
          newStatus = PO_STATUS.PENDING_CFO;
        } else {
          newStatus = PO_STATUS.PENDING_LEGAL;
        }

        addAuditLog(poId, "approved", `${currentUser.name} (${currentUser.title}) approved`, po.status, newStatus);

        return {
          ...po,
          status: newStatus,
          approvals: updatedApprovals,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [currentUser, addAuditLog]);

  const rejectPO = useCallback((poId, reason) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id !== poId) return po;
        const role = currentUser.role;
        const updatedApprovals = { ...po.approvals };
        updatedApprovals[role] = {
          userId: currentUser.id,
          date: new Date().toISOString(),
          status: "rejected",
          rejectionNote: reason,
        };

        addAuditLog(poId, "rejected", `Rejected by ${currentUser.name}: ${reason}`, po.status, PO_STATUS.REJECTED);

        return {
          ...po,
          status: PO_STATUS.REJECTED,
          approvals: updatedApprovals,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [currentUser, addAuditLog]);

  const requestClarification = useCallback((poId, note) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id !== poId) return po;
        const role = currentUser.role;
        const updatedApprovals = { ...po.approvals };
        updatedApprovals[role] = {
          ...updatedApprovals[role],
          status: "clarification",
          clarificationNote: note,
        };

        addAuditLog(poId, "clarification_requested", `${currentUser.name} requested clarification: ${note}`, po.status, PO_STATUS.CLARIFICATION_REQUESTED);

        return {
          ...po,
          status: PO_STATUS.CLARIFICATION_REQUESTED,
          clarificationRequestedBy: currentUser.id,
          approvals: updatedApprovals,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [currentUser, addAuditLog]);

  const respondToClarification = useCallback((poId, response) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id !== poId) return po;

        // Find which role requested clarification and restore to pending for that role
        const clarifyingRole = Object.entries(po.approvals).find(
          ([, v]) => v.status === "clarification"
        );
        if (!clarifyingRole) return po;

        const [role] = clarifyingRole;
        const updatedApprovals = { ...po.approvals };
        updatedApprovals[role] = {
          ...updatedApprovals[role],
          status: "pending",
          clarificationResponse: response,
        };

        let newStatus;
        if (role === ROLES.LEGAL) newStatus = PO_STATUS.PENDING_LEGAL;
        else if (role === ROLES.COO) newStatus = PO_STATUS.PENDING_COO;
        else newStatus = PO_STATUS.PENDING_CFO;

        addAuditLog(poId, "clarification_responded", `${currentUser.name} responded: ${response}`, po.status, newStatus);

        return {
          ...po,
          status: newStatus,
          clarificationRequestedBy: null,
          approvals: updatedApprovals,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [currentUser, addAuditLog]);

  const signPO = useCallback((poId) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id !== poId) return po;
        addAuditLog(poId, "signed", `E-signature applied via Leegality by ${currentUser.name}. Document ID: LEG-2026-${String(Date.now()).slice(-5)}`, PO_STATUS.CFO_APPROVED, PO_STATUS.APPROVED);
        return {
          ...po,
          status: PO_STATUS.APPROVED,
          signed: true,
          signedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, [currentUser, addAuditLog]);

  // Computed: POs visible to current role
  const getVisiblePOs = useCallback(() => {
    const role = currentUser.role;
    switch (role) {
      case ROLES.REQUESTER:
        return purchaseOrders.filter((po) => po.requesterId === currentUser.id);
      case ROLES.LEGAL:
        return purchaseOrders.filter(
          (po) => po.approvalChain.includes("legal") &&
            (po.status === PO_STATUS.PENDING_LEGAL || po.approvals.legal?.status === "approved" || po.approvals.legal?.status === "clarification")
        );
      case ROLES.COO:
        return purchaseOrders.filter(
          (po) => po.approvalChain.includes("coo") &&
            (po.status === PO_STATUS.PENDING_COO || po.approvals.coo?.status === "approved" || po.approvals.coo?.status === "rejected" || po.approvals.coo?.status === "clarification" || po.status === PO_STATUS.CLARIFICATION_REQUESTED)
        );
      case ROLES.CFO:
        return purchaseOrders.filter(
          (po) => po.approvalChain.includes("cfo") &&
            (po.status === PO_STATUS.PENDING_CFO || po.status === PO_STATUS.CFO_APPROVED || po.approvals.cfo?.status === "approved")
        );
      case ROLES.ADMIN:
        return purchaseOrders;
      default:
        return [];
    }
  }, [currentUser, purchaseOrders]);

  // Can current user act on this PO?
  const canActOnPO = useCallback((po) => {
    const role = currentUser.role;
    if (role === ROLES.REQUESTER) {
      return po.status === PO_STATUS.CLARIFICATION_REQUESTED && po.requesterId === currentUser.id;
    }
    if (role === ROLES.ADMIN) return false;

    const approval = po.approvals[role];
    if (!approval) return false;

    // Check if it's this role's turn
    if (role === ROLES.LEGAL && po.status === PO_STATUS.PENDING_LEGAL) return true;
    if (role === ROLES.COO && po.status === PO_STATUS.PENDING_COO) return true;
    if (role === ROLES.CFO && (po.status === PO_STATUS.PENDING_CFO || po.status === PO_STATUS.CFO_APPROVED)) return true;

    return false;
  }, [currentUser]);

  const getLogsForPO = useCallback((poId) => {
    return auditLogs.filter((log) => log.poId === poId);
  }, [auditLogs]);

  // Stats
  const stats = {
    totalPending: purchaseOrders.filter((po) =>
      [PO_STATUS.PENDING_LEGAL, PO_STATUS.PENDING_COO, PO_STATUS.PENDING_CFO, PO_STATUS.CFO_APPROVED].includes(po.status)
    ).length,
    approvedThisMonth: purchaseOrders.filter((po) => po.status === PO_STATUS.APPROVED).length,
    totalValuePending: purchaseOrders
      .filter((po) => [PO_STATUS.PENDING_LEGAL, PO_STATUS.PENDING_COO, PO_STATUS.PENDING_CFO, PO_STATUS.CFO_APPROVED].includes(po.status))
      .reduce((sum, po) => sum + po.amount, 0),
    avgApprovalDays: 2.3,
    clarificationsPending: purchaseOrders.filter((po) => po.status === PO_STATUS.CLARIFICATION_REQUESTED).length,
    rejectedThisMonth: purchaseOrders.filter((po) => po.status === PO_STATUS.REJECTED).length,
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        users,
        purchaseOrders,
        addPurchaseOrder,
        approvePO,
        rejectPO,
        requestClarification,
        respondToClarification,
        signPO,
        getVisiblePOs,
        canActOnPO,
        auditLogs,
        getLogsForPO,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
