import type { AuditResult } from './types';
import { runAudit } from './auditEngine';
import { saveAudit } from './storage';

export function performAudit(url: string): AuditResult {
  const result = runAudit(url);
  saveAudit(result);
  return result;
}
