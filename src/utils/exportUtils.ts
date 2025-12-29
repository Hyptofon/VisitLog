import { Student, Lesson, Grade } from "@/types";

export function exportToExcel(
  students: Student[],
  lessons: Lesson[],
  grades: Grade[],
  type: "lecture" | "practical" | "laboratory" | "all",
) {
  // Create CSV content
  const filteredLessons = lessons.filter((l) => l.type === type);

  let csv = "Студент,";
  csv += filteredLessons.map((l) => l.date).join(",");
  csv += ",Відвідуваність\n";

  students.forEach((student) => {
    const fullName = `${student.lastName} ${student.firstName} ${student.patronymic}`;
    csv += `"${fullName}",`;

    const studentGrades = filteredLessons.map((lesson) => {
      const grade = grades.find(
        (g) => g.studentId === student.id && g.lessonId === lesson.id,
      );
      if (!grade) return "";
      return grade.attended ? (grade.score !== null ? grade.score : "+") : "-";
    });

    csv += studentGrades.join(",");

    // Calculate attendance
    const totalLessons = filteredLessons.length;
    const attended = grades.filter(
      (g) =>
        g.studentId === student.id &&
        filteredLessons.some((l) => l.id === g.lessonId) &&
        g.attended,
    ).length;
    const attendanceRate = Math.round((attended / totalLessons) * 100);

    csv += `,${attendanceRate}%\n`;
  });

  // Create download
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `журнал_${type === "lecture" ? "лекції" : "практичні"}_${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(
  students: Student[],
  lessons: Lesson[],
  grades: Grade[],
  type: "lecture" | "practical" | "laboratory" | "all",
) {
  // For PDF export, we'll create a printable HTML page
  const filteredLessons = lessons.filter((l) => l.type === type);

  const printWindow = window.open("", "", "height=600,width=800");
  if (!printWindow) return;

  let html = `
    <html>
      <head>
        <title>Журнал - ${type === "lecture" ? "Лекції" : "Практичні"}</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 10px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 4px; text-align: center; }
          th { background-color: #f2f2f2; }
          .student-name { text-align: left; }
          @media print {
            @page { size: landscape; }
          }
        </style>
      </head>
      <body>
        <h2>Журнал відвідування - ${type === "lecture" ? "Лекції" : "Практичні"}</h2>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Студент</th>
              ${filteredLessons.map((l) => `<th>${l.date}</th>`).join("")}
              <th>Відвідуваність</th>
            </tr>
          </thead>
          <tbody>
  `;

  students.forEach((student, idx) => {
    const fullName = `${student.lastName} ${student.firstName} ${student.patronymic}`;
    html += `<tr>`;
    html += `<td>${idx + 1}</td>`;
    html += `<td class="student-name">${fullName}</td>`;

    filteredLessons.forEach((lesson) => {
      const grade = grades.find(
        (g) => g.studentId === student.id && g.lessonId === lesson.id,
      );
      if (!grade) {
        html += `<td></td>`;
      } else {
        html += `<td>${grade.attended ? (grade.score !== null ? grade.score : "+") : "-"}</td>`;
      }
    });

    // Calculate attendance
    const totalLessons = filteredLessons.length;
    const attended = grades.filter(
      (g) =>
        g.studentId === student.id &&
        filteredLessons.some((l) => l.id === g.lessonId) &&
        g.attended,
    ).length;
    const attendanceRate = Math.round((attended / totalLessons) * 100);

    html += `<td>${attendanceRate}%</td>`;
    html += `</tr>`;
  });

  html += `
          </tbody>
        </table>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
