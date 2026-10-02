// Centralized Security & Emergency Freeze Management
export const FREEZE_STORAGE_KEY = 'bank_emergency_freeze';
export const ALERTS_STORAGE_KEY = 'bank_security_alerts';
export const FREEZE_EVENT_NAME = 'security_freeze_updated';

// Helper to normalize username for case-insensitive matching
export const normalizeUsername = (username) => {
  return String(username || '').trim().toLowerCase();
};

// Retrieve all freeze records as a dictionary: { [normalizedUser]: record }
export const getFreezeRecords = () => {
  try {
    return JSON.parse(localStorage.getItem(FREEZE_STORAGE_KEY) || '{}');
  } catch (e) {
    return {};
  }
};

// Retrieve all security alerts as an array
export const getSecurityAlerts = () => {
  try {
    return JSON.parse(localStorage.getItem(ALERTS_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

// Check if a user is currently frozen (case-insensitive)
export const isUserFrozen = (username) => {
  const norm = normalizeUsername(username);
  if (!norm) return false;

  // 1. Check freeze records dictionary
  const records = getFreezeRecords();
  for (const key of Object.keys(records)) {
    if (normalizeUsername(key) === norm && records[key]?.status === 'ACTIVE_FREEZE') {
      return true;
    }
  }

  // 2. Cross-check with bank_security_alerts for consistency
  const alerts = getSecurityAlerts();
  const hasActiveAlert = alerts.some(
    a => normalizeUsername(a.customerName) === norm && a.status === 'FROZEN'
  );

  return hasActiveAlert;
};

// Get active freeze details for a user
export const getUserFreezeDetails = (username) => {
  const norm = normalizeUsername(username);
  if (!norm) return null;
  const records = getFreezeRecords();
  for (const key of Object.keys(records)) {
    if (normalizeUsername(key) === norm) {
      return records[key];
    }
  }
  // Fallback to active alert if present
  const alerts = getSecurityAlerts();
  const activeAlert = alerts.find(
    a => normalizeUsername(a.customerName) === norm && a.status === 'FROZEN'
  );
  if (activeAlert) {
    return {
      incidentId: activeAlert.id,
      username: activeAlert.customerName,
      accountID: activeAlert.accountID,
      reason: activeAlert.reason,
      timestamp: activeAlert.timestamp,
      status: 'ACTIVE_FREEZE'
    };
  }
  return null;
};

// Freeze an account (called by Customer or Bank Staff)
export const freezeAccount = ({ username, accountID, reason, actor = 'CUSTOMER', incidentId }) => {
  const norm = normalizeUsername(username);
  const now = new Date().toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const incId = incidentId || `FRZ-${Math.floor(100000 + Math.random() * 900000)}`;

  const freezeRecord = {
    incidentId: incId,
    username: username,
    normalizedUsername: norm,
    accountID: String(accountID || '1001'),
    reason: reason || 'Suspicious Activity / Compromise',
    timestamp: now,
    actor,
    status: 'ACTIVE_FREEZE'
  };

  // 1. Update freeze dictionary
  const records = getFreezeRecords();
  records[norm] = freezeRecord;
  localStorage.setItem(FREEZE_STORAGE_KEY, JSON.stringify(records));

  // 2. Update alerts list
  const alerts = getSecurityAlerts();
  const newAlert = {
    id: incId,
    customerName: username,
    accountID: String(accountID || '1001'),
    reason: reason || 'Suspicious Activity / Compromise',
    timestamp: now,
    severity: 'CRITICAL',
    status: 'FROZEN',
    actionTaken: actor === 'ADMIN'
      ? 'Branch Officer placed account under Immediate Emergency Freeze.'
      : 'Customer initiated one-click Emergency Freeze. Outgoing debits blocked.'
  };
  alerts.unshift(newAlert);
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));

  // 3. Dispatch events for immediate reactivity
  dispatchFreezeEvent(username, true);
  return freezeRecord;
};

// Unfreeze an account (called after customer OTP or Admin action)
export const unfreezeAccount = ({ username, incidentId, actor = 'CUSTOMER', remarks }) => {
  const norm = normalizeUsername(username);

  // 1. Remove from freeze records
  const records = getFreezeRecords();
  for (const key of Object.keys(records)) {
    if (normalizeUsername(key) === norm) {
      delete records[key];
    }
  }
  localStorage.setItem(FREEZE_STORAGE_KEY, JSON.stringify(records));

  // 2. Update alerts list
  const alerts = getSecurityAlerts();
  const updatedAlerts = alerts.map(a => {
    const matchUser = normalizeUsername(a.customerName) === norm;
    const matchId = incidentId ? a.id === incidentId : false;
    if ((matchUser || matchId) && a.status === 'FROZEN') {
      return {
        ...a,
        status: 'UNFROZEN',
        actionTaken: remarks || (actor === 'ADMIN'
          ? 'Branch Officer authorized emergency unfreeze after identity verification.'
          : 'Customer completed 2FA Identity Verification. Normal banking restored.')
      };
    }
    return a;
  });
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));

  // 3. Dispatch events
  dispatchFreezeEvent(username, false);
};

// Dispatch local and cross-tab events
export const dispatchFreezeEvent = (username, isFrozen) => {
  try {
    window.dispatchEvent(new CustomEvent(FREEZE_EVENT_NAME, {
      detail: { username, isFrozen, timestamp: Date.now() }
    }));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}
};

// React hook / subscriber helper
export const subscribeToFreezeUpdates = (callback) => {
  const handler = () => callback();
  window.addEventListener(FREEZE_EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(FREEZE_EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
};
