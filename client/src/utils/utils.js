export const getDisplayValueFromWeek = week => {
  if (typeof week !== 'string') {
    return '';
  }

  const weekNum =
    week.split('_').length === 2 ? Number(week.split('_')[1]) : '';

  if (weekNum) {
    return `Week ${weekNum}`;
  }

  return '';
};

export const trimPlayerName = name => {
  if (name && typeof name === 'string') {
    return name.split(/\r?\n/g)[0];
  }

  return '';
};
