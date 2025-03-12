const { existsSync, readFileSync } = require('fs');
const path = require('path');

exports.loadQuery = (queryFileName) => {
  const sqlPath = path.join(__dirname, '..', 'queries', `${queryFileName}.sql`);

  if (!existsSync(sqlPath)) {
    return null;
  }

  return readFileSync(sqlPath, 'utf8');
};
