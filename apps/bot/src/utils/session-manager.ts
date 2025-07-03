import { UserSession } from "../types/session";

class SessionManager {
  private sessions = new Map<string, UserSession>();

  getSession(phoneNumber: string): UserSession {
    if (!this.sessions.has(phoneNumber)) {
      this.sessions.set(phoneNumber, {
        phoneNumber,
        lastInteraction: new Date(),
        currentFlow: null,
        userData: {},
      });
    }

    const session = this.sessions.get(phoneNumber)!;
    session.lastInteraction = new Date();
    return session;
  }

  updateSession(phoneNumber: string, updates: Partial<UserSession>): void {
    const session = this.getSession(phoneNumber);
    Object.assign(session, updates);
  }

  clearOldSessions(): void {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 horas

    for (const [phoneNumber, session] of this.sessions) {
      if (session.lastInteraction < cutoff) {
        this.sessions.delete(phoneNumber);
      }
    }
  }
}

export const sessionManager = new SessionManager();
