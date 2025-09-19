// reportPdf.js
import PDFDocument from "pdfkit";

export function generatePDF({ title, columns, rows, res }) {
  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const buffers = [];

  // Collect PDF chunks
  doc.on("data", buffers.push.bind(buffers));

  // When finished, send once
  doc.on("end", () => {
    const pdfData = Buffer.concat(buffers);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${title.replace(/\s+/g, "_")}.pdf`
    );
    res.send(pdfData);
  });

  // ---------- PDF CONTENT ----------
  doc.fontSize(18).text("Mech Corp Manufacturing Pvt Ltd", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(14).text(title, { align: "center", underline: true });
  doc.moveDown();

  doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, {
    align: "right",
  });
  doc.moveDown(1);

  // Calculate column widths based on available space
  const pageWidth = doc.page.width - 80; // Account for margins
  const colWidths = calculateColumnWidths(columns.length, pageWidth);
  
  // Draw the table
  drawTable(doc, columns, rows, colWidths);

  // End the document
  doc.end();
}

function calculateColumnWidths(numColumns, pageWidth) {
  // Equal width distribution with slight adjustments for readability
  const baseWidth = pageWidth / numColumns;
  return Array(numColumns).fill(baseWidth);
}

function drawTable(doc, columns, rows, colWidths) {
  const startX = 40;
  let currentY = doc.y;
  const rowHeight = 25;
  
  // Draw header
  drawRow(doc, columns, startX, currentY, colWidths, rowHeight, true);
  currentY += rowHeight;
  
  // Draw data rows
  rows.forEach((row, index) => {
    // Check if we need a new page
    if (currentY + rowHeight > doc.page.height - 40) {
      doc.addPage();
      currentY = doc.y;
    }
    
    drawRow(doc, row, startX, currentY, colWidths, rowHeight, false, index % 2 === 0);
    currentY += rowHeight;
  });
  
  // Update doc.y position
  doc.y = currentY;
}

function drawRow(doc, rowData, startX, startY, colWidths, rowHeight, isHeader, isEvenRow = true) {
  let currentX = startX;
  
  // Draw each cell
  rowData.forEach((cellData, colIndex) => {
    const cellWidth = colWidths[colIndex];
    
    // Draw cell background and border
    if (isHeader) {
      doc.rect(currentX, startY, cellWidth, rowHeight)
         .fillAndStroke('#e0e0e0', '#000000');
    } else {
      const fillColor = isEvenRow ? '#ffffff' : '#f9f9f9';
      doc.rect(currentX, startY, cellWidth, rowHeight)
         .fillAndStroke(fillColor, '#cccccc');
    }
    
    // Set text properties
    if (isHeader) {
      doc.fontSize(10).font("Helvetica-Bold").fillColor('#000000');
    } else {
      doc.fontSize(9).font("Helvetica").fillColor('#000000');
    }
    
    // Draw text inside cell with padding
    const cellText = String(cellData || 'N/A');
    const textX = currentX + 3; // Left padding
    const textY = startY + 8; // Vertical centering
    const textWidth = cellWidth - 6; // Account for padding
    
    doc.text(cellText, textX, textY, {
      width: textWidth,
      height: rowHeight - 6,
      align: 'left',
      ellipsis: true
    });
    
    currentX += cellWidth;
  });
}