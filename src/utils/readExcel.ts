import ExcelJS from "exceljs";

export const readExcel = async (file: ArrayBuffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file);
  return workbook.getWorksheet(1);
};

export const getAddUserData = async (file: ArrayBuffer) => {
  const worksheet = await readExcel(file);
  if (!worksheet) return [];
  const data: any[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header if needed

    const rowData: { [key: string]: any } = {};
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      rowData[`col${colNumber}`] = cell.value;
    });
    data.push(rowData);
  });

  return data;
};
