import { useRef } from "react";
import { format } from "date-fns";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import aviraLogo from "@/assets/avira-logo.png";

interface AppointmentSlipProps {
  appointmentId: string;
  doctorName: string;
  specialization: string;
  appointmentDate: Date;
  timeSlot: string;
  patientName: string;
  age: string;
  gender: string;
  mobile: string;
  address: string;
  reason: string;
  fee: number;
  patientType: string;
  consultationType?: "opd" | "video";
  videoCallLink?: string;
}

const AppointmentSlip = ({
  appointmentId,
  doctorName,
  specialization,
  appointmentDate,
  timeSlot,
  patientName,
  age,
  gender,
  mobile,
  address,
  reason,
  fee,
  patientType,
  consultationType = "opd",
  videoCallLink,
}: AppointmentSlipProps) => {
  const slipRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const printContent = slipRef.current;
    if (!printContent) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Avira-Appointment-${appointmentId}</title>
          <style>
            body { margin: 0; font-family: 'Segoe UI', Arial, sans-serif; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>${printContent.outerHTML}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  const handlePrint = () => {
    const printContent = slipRef.current;
    if (!printContent) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Appointment Slip - ${appointmentId}</title>
          <style>
            body { margin: 0; font-family: 'Segoe UI', Arial, sans-serif; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>${printContent.outerHTML}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  const issueDate = format(new Date(), "dd MMMM yyyy");
  const apptDate = format(appointmentDate, "dd/MM/yyyy");

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Action Buttons */}
      <div className="flex justify-center gap-3 mb-6">
        <Button onClick={handleDownloadPDF} className="gap-2">
          <Download className="w-4 h-4" /> Download as PDF
        </Button>
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" /> Print
        </Button>
      </div>

      {/* Slip */}
      <div
        ref={slipRef}
        style={{
          width: "210mm",
          maxWidth: "100%",
          margin: "0 auto",
          background: "#fff",
          fontFamily: "'Segoe UI', Arial, sans-serif",
          color: "#1a1a1a",
          boxSizing: "border-box",
        }}
      >
        {/* Top blue bar */}
        <div style={{ height: "8px", background: "linear-gradient(90deg, #0369a1, #38bdf8)" }} />

        {/* Logo & Hospital Name */}
        <div style={{ textAlign: "center", padding: "24px 20px 12px" }}>
          <img
            src={aviraLogo}
            alt="Avira Hospital"
            crossOrigin="anonymous"
            style={{ height: "70px", marginBottom: "8px" }}
          />
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#0c4a6e", letterSpacing: "1px" }}>
            AVIRA HOSPITAL
          </div>
          <div style={{ fontSize: "13px", color: "#0369a1", fontWeight: 500 }}>
            Medicine & Skin Care
          </div>
          <div style={{ fontSize: "12px", color: "#0ea5e9", fontStyle: "italic", marginTop: "2px" }}>
            Care You Can Trust
          </div>
        </div>

        {/* Title Bar */}
        <div
          style={{
            background: "linear-gradient(90deg, #0369a1, #0284c7)",
            color: "#fff",
            textAlign: "center",
            padding: "10px 0",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "2px",
            margin: "0 20px",
            borderRadius: "4px",
          }}
        >
          APPOINTMENT CONFIRMATION SLIP
        </div>

        {/* Content */}
        <div style={{ padding: "20px 28px 16px" }}>
          {/* ID & Date */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "2px solid #bae6fd",
              paddingBottom: "10px",
              marginBottom: "16px",
              fontSize: "13px",
            }}
          >
            <div>
              <strong>Appointment ID:</strong> {appointmentId}
            </div>
            <div>
              <strong>Date of Issue:</strong> {issueDate}
            </div>
          </div>

          {/* Doctor Details */}
          <SectionBox title="Doctor Details" icon="👨‍⚕️">
            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
              <div>
                <Label>Doctor Name</Label>
                <Value>{doctorName}</Value>
              </div>
              <div>
                <Label>Specialization</Label>
                <Value>{specialization}</Value>
              </div>
            </div>
          </SectionBox>

          {/* Appointment Details */}
          <SectionBox title="Appointment Details" icon="📅">
            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
              <div>
                <Label>Appointment Date</Label>
                <Value>{apptDate}</Value>
              </div>
              <div>
                <Label>Time Slot</Label>
                <Value>{timeSlot}</Value>
              </div>
            </div>
            <div style={{ marginTop: "4px", fontSize: "12px", color: "#64748b" }}>
              Consultation Type: {consultationType === "video" ? "📹 Video Consultation" : "OPD"}
            </div>
            {consultationType === "video" && videoCallLink && (
              <div style={{
                marginTop: "10px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "6px",
                padding: "10px 14px",
              }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#166534", marginBottom: "4px" }}>
                  🎥 Video Call Link
                </div>
                <a
                  href={videoCallLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "13px",
                    color: "#0369a1",
                    fontWeight: 600,
                    wordBreak: "break-all",
                    textDecoration: "underline",
                  }}
                >
                  {videoCallLink}
                </a>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                  Join at your scheduled time. Share this link with your doctor if needed.
                </div>
              </div>
            )}
          </SectionBox>

          {/* Patient Details */}
          <SectionBox title="Patient Details" icon="👤">
            <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
              <div>
                <Label>Patient Name</Label>
                <Value>{patientName}</Value>
              </div>
              <div>
                <Label>Age / Gender</Label>
                <Value>{age || "—"} / {gender || "—"}</Value>
              </div>
            </div>
            <div style={{ marginTop: "6px" }}>
              <Label>Mobile Number</Label>
              <Value>{mobile}</Value>
            </div>
            {address && address.trim() !== " -  - " && (
              <div style={{ marginTop: "6px" }}>
                <Label>Address</Label>
                <Value>{address}</Value>
              </div>
            )}
          </SectionBox>

          {/* Reason */}
          {reason && (
            <SectionBox title="Reason for Visit" icon="📝">
              <div style={{ fontSize: "13px" }}>{reason}</div>
            </SectionBox>
          )}

          {/* Fee */}
          <div
            style={{
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "6px",
              padding: "10px 16px",
              marginBottom: "14px",
              fontSize: "13px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              <strong>Consultation Fee:</strong> ₹{fee} ({patientType} Patient)
            </span>
            <span style={{ color: "#64748b", fontSize: "12px" }}>Payable at hospital</span>
          </div>

          {/* Instructions */}
          <div
            style={{
              background: "#f0f9ff",
              borderRadius: "6px",
              padding: "12px 16px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #0369a1, #0284c7)",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: 700,
                marginBottom: "8px",
                display: "inline-block",
              }}
            >
              📋 Important Instructions
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#334155", lineHeight: "1.8" }}>
              <li>Please arrive 15 minutes before your appointment.</li>
              <li>Bring previous medical records if applicable.</li>
              <li>For cancellation or rescheduling, contact hospital reception.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            background: "linear-gradient(90deg, #0c4a6e, #0369a1)",
            color: "#fff",
            padding: "12px 28px",
            fontSize: "11px",
            lineHeight: "1.7",
          }}
        >
          <div>📍 210, R.S.Platinum Building, Bhalej Road, Ganesh Colony, Anand, Gujarat, 388001</div>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <span>📞 02692 354 201</span>
            <span>🌐 www.avirahospital.com</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ height: "8px", background: "linear-gradient(90deg, #0369a1, #38bdf8)" }} />
      </div>
    </div>
  );
};

const SectionBox = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
  <div
    style={{
      border: "1px solid #e0f2fe",
      borderRadius: "6px",
      marginBottom: "14px",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}
  >
    <div
      style={{
        background: "linear-gradient(90deg, #e0f2fe, #f0f9ff)",
        padding: "7px 14px",
        fontSize: "13px",
        fontWeight: 700,
        color: "#0c4a6e",
        borderBottom: "1px solid #e0f2fe",
      }}
    >
      {icon} {title}
    </div>
    <div style={{ padding: "12px 14px" }}>{children}</div>
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "1px" }}>{children}</div>
);

const Value = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: "14px", fontWeight: 500 }}>{children}</div>
);

export default AppointmentSlip;
