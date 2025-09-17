import PDFDocument from "pdfkit"

export function generatePDF({ title, columns, rows, res }) {
  const doc = new PDFDocument({ margin: 40, size: "A4" })

  // Pipe PDF directly to response
  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", `attachment; filename=${title}.pdf`)
  doc.pipe(res)

  // Header
  doc.fontSize(18).text("Mech Corp Manufacturing Pvt ltd", { align: "center" })
  doc.fontSize(14).text(title, { align: "center", underline: true })
  doc.moveDown()

  // Date
  doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: "right" })
  doc.moveDown()

  // Table Headers
  doc.fontSize(12).text(columns.join(" | "), { underline: true })
  doc.moveDown(0.5)

  // Table Rows
  rows.forEach(row => {
    doc.text(row.join(" | "))
  })

  doc.end()
}
