export const stepOneDays = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
];
export const stepOneMonths = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
];
export const stepOneYears = Array.from({ length: 100 }, (_, i) => 2023 - i);

export const isValidDate = (day: number, month: number, year: number) => {
  if (year < 1 || month < 1 || month > 12) {
    return false;
  }

  const daysInMonth: { [id: number]: number } = {
    1: 31,
    2: year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  };

  if (day < 1 || day > daysInMonth[month]) {
    return false;
  }

  return true;
};

export const getAge = (birthDate: Date) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
