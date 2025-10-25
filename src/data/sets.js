import raw from './sets.json';

const data = Array.isArray(raw.data)
  ? raw.data.map(({ id, name, printedTotal, total, releaseDate }) => ({ id, name, printedTotal, total, releaseDate }))
  : [];

export default { data };
