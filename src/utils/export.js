import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function exportCSV(data, filename = "FitnessReport.csv") {
  if (!Array.isArray(data) || data.length === 0) {
    console.error("CSV Export: No data provided");
    return;
  }

  const header = Object.keys(data[0]).join(",");
  const rows = data.map(row =>
    Object.values(row)
      .map(v => (v == null ? "" : String(v).replace(/"/g, '""')))
      .join(",")
  );

  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const exportPDF = (
  workoutData = [],
  nutritionData = [],
  fromDate = "",
  toDate = "",
  user = {}
) => {
  try {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Fitness Report", pageWidth / 2, 40, { align: "center" });

    let currentY = 70;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("User Profile", 40, currentY);
    currentY += 20;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const userFields = [
      { label: "Name", value: user?.name || "-" },
      { label: "Email", value: user?.email || "-" },
      { label: "Gender", value: user?.gender || "-" },
      { label: "Contact", value: user?.contact || "-" },
      { label: "Bio", value: user?.bio || "-" },
    ];

    userFields.forEach(field => {
      doc.setFont("helvetica", "bold");
      doc.text(`${field.label}: `, 50, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(`${field.value}`, 150, currentY);
      currentY += 18;
    });

    currentY += 10;

    if (workoutData.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Workout Report", 40, currentY);
      currentY += 10;

      const workoutHeaders = Object.keys(workoutData[0]);
      const workoutRows = workoutData.map(row => Object.values(row));

      autoTable(doc, {
        startY: currentY,
        head: [workoutHeaders],
        body: workoutRows,
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 40, right: 40 },
        styles: { fontSize: 11 },
      });

      currentY = doc.lastAutoTable.finalY + 20;
    }

    if (nutritionData.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Nutrition Report", 40, currentY);
      currentY += 10;

      const nutritionHeaders = Object.keys(nutritionData[0]);
      const nutritionRows = nutritionData.map(row => Object.values(row));

      autoTable(doc, {
        startY: currentY,
        head: [nutritionHeaders],
        body: nutritionRows,
        theme: "grid",
        headStyles: {
          fillColor: [39, 174, 96],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 40, right: 40 },
        styles: { fontSize: 11 },
      });
    }

    const fileLabel =
      fromDate && toDate
        ? `Fitness_Report_${fromDate}_to_${toDate}.pdf`
        : "Fitness_Report.pdf";

    doc.save(fileLabel);
  } catch (error) {
    console.error("PDF Export Error:", error);
  }
};
