import { MessageType } from "./message";

export interface UserSession {
  phoneNumber: string;
  lastInteraction: Date;
  currentFlow: MessageType | null;
  userData: {
    name?: string;
    preferredServices?: string[];
    lastAppointment?: Date;
  };
}
