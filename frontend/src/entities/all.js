import { User } from "./User";
import { EmergencyContact } from "./EmergencyContact";
import { Alert } from "./Alert";
import { Resource } from "./Resource";
import { CommunityReport } from "./CommunityReport";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export { User, EmergencyContact, Alert, Resource, CommunityReport };
