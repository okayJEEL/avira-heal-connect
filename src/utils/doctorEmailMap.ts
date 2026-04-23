// Maps doctor id -> doctor's email (where appointment notifications are sent)
export const DOCTOR_EMAIL_MAP: Record<string, string> = {
  "dr-vivek": "dr.vivek@avirahospital.com",
  "dr-preeti": "dr.preeti@avirahospital.com",
};

export function getDoctorEmail(doctorId: string): string | null {
  return DOCTOR_EMAIL_MAP[doctorId] || null;
}
