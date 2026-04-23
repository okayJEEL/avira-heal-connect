interface DoctorEmailData {
  doctorName: string;
  patientName: string;
  patientType: string;
  mobile: string;
  email?: string;
  age: string;
  gender: string;
  maritalStatus: string;
  address: string;
  specialization: string;
  date: string;
  timeSlot: string;
  reason: string;
  fee: number;
  consultationType: string;
  videoCallLink?: string | null;
  appointmentId: string;
}

export function generateDoctorEmailHTML(data: DoctorEmailData): string {
  const portalUrl = "https://avirahospital.in/staff-login";
  const logoUrl = "https://i.ibb.co/ZRjCdVqB/final-logo.png";
  const consultLabel = data.consultationType === "video" ? "📹 Video Consultation" : "🏥 In-Person (OPD)";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

<!-- Header -->
<tr><td style="background:linear-gradient(135deg,#2563EB,#1d4ed8);padding:28px 32px;text-align:center;">
  <img src="${logoUrl}" alt="Avira Hospital" width="56" height="56" style="border-radius:50%;margin-bottom:10px;display:block;margin-left:auto;margin-right:auto;"/>
  <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">Avira Hospital</h1>
  <p style="color:#bfdbfe;margin:4px 0 0;font-size:13px;">New Patient Appointment Assigned</p>
</td></tr>

<!-- Greeting -->
<tr><td style="padding:24px 32px 8px;">
  <p style="margin:0 0 8px;font-size:16px;color:#1e293b;"><strong>Dear ${data.doctorName},</strong></p>
  <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">
    A new appointment has been booked under your care. Please review the patient details below and confirm the appointment from your doctor panel.
  </p>
</td></tr>

<!-- Appointment Details -->
<tr><td style="padding:16px 32px 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
    <tr><td style="background:#93c5fd;padding:10px 16px;">
      <strong style="color:#1e3a5f;font-size:14px;">📋 Appointment Details</strong>
    </td></tr>
    <tr><td style="padding:16px;background:#fffbeb;">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#334155;">
        <tr><td style="padding:4px 0;width:45%;"><strong>Appointment ID:</strong></td><td style="padding:4px 0;">${data.appointmentId}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Consultation:</strong></td><td style="padding:4px 0;">${consultLabel}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Specialization:</strong></td><td style="padding:4px 0;">${data.specialization}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Date:</strong></td><td style="padding:4px 0;">${data.date}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Time Slot:</strong></td><td style="padding:4px 0;">${data.timeSlot}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Reason / Concern:</strong></td><td style="padding:4px 0;">${data.reason}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Consultation Fee:</strong></td><td style="padding:4px 0;">₹${data.fee}</td></tr>
      </table>
    </td></tr>
  </table>
</td></tr>

<!-- Patient Information -->
<tr><td style="padding:16px 32px 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
    <tr><td style="background:#93c5fd;padding:10px 16px;">
      <strong style="color:#1e3a5f;font-size:14px;">👤 Patient Information</strong>
    </td></tr>
    <tr><td style="padding:16px;background:#eff6ff;">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#334155;">
        <tr><td style="padding:4px 0;width:45%;"><strong>Name:</strong></td><td style="padding:4px 0;">${data.patientName}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Patient Type:</strong></td><td style="padding:4px 0;">${data.patientType}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Mobile:</strong></td><td style="padding:4px 0;">${data.mobile}</td></tr>
        ${data.email ? `<tr><td style="padding:4px 0;"><strong>Email:</strong></td><td style="padding:4px 0;">${data.email}</td></tr>` : ''}
        <tr><td style="padding:4px 0;"><strong>Age / Gender:</strong></td><td style="padding:4px 0;">${data.age} / ${data.gender}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Marital Status:</strong></td><td style="padding:4px 0;">${data.maritalStatus}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Address:</strong></td><td style="padding:4px 0;">${data.address}</td></tr>
      </table>
    </td></tr>
  </table>
</td></tr>

${data.consultationType === "video" && data.videoCallLink ? `
<!-- Video Call Link -->
<tr><td style="padding:16px 32px 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ecfdf5;border:1px solid #86efac;border-radius:8px;overflow:hidden;">
    <tr><td style="padding:18px;text-align:center;">
      <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#166534;">🎥 Video Consultation Link</p>
      <p style="margin:0 0 12px;font-size:12px;color:#15803d;">Use this link to start the video consultation at the scheduled time.</p>
      <a href="${data.videoCallLink}" style="display:inline-block;background:#16a34a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Start Video Call</a>
      <p style="margin:10px 0 0;font-size:11px;color:#166534;word-break:break-all;">${data.videoCallLink}</p>
    </td></tr>
  </table>
</td></tr>` : ''}

<!-- Action Required -->
<tr><td style="padding:20px 32px 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#bbf7d0;border:1px solid #86efac;border-radius:8px;overflow:hidden;">
    <tr><td style="padding:20px;text-align:center;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#166534;">⚡ Action Required</p>
      <p style="margin:0 0 16px;font-size:13px;color:#15803d;">Please review and confirm or reschedule this appointment from your doctor panel.</p>
      <a href="${portalUrl}" style="display:inline-block;background:#2f855a;color:#ffffff;padding:12px 28px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Open Doctor Panel</a>
    </td></tr>
  </table>
</td></tr>

<!-- Footer -->
<tr><td style="padding:24px 32px;text-align:center;">
  <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">Status: <strong style="color:#f59e0b;">⏳ Pending Approval</strong></p>
  <p style="margin:0;font-size:11px;color:#cbd5e1;">Avira Hospital &bull; Anand, Gujarat &bull; 02692 354 201</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
