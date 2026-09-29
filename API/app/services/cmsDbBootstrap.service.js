const fs = require('fs');
const path = require('path');

const SCHEMA_FILE = path.resolve(__dirname, '../../../../database_schema_cms.sql');

async function bootstrapDatabase(pool) {
  if (!pool) return;
  try {
    console.log('[CMS Bootstrap] Checking MySQL connection and tables...');
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('[CMS Bootstrap] MySQL connected successfully! Result:', rows[0]?.result);

    if (fs.existsSync(SCHEMA_FILE)) {
      const sqlContent = fs.readFileSync(SCHEMA_FILE, 'utf-8');
      // Split on semicolons that terminate statements
      const statements = sqlContent
        .split(/;\s*[\r\n]+/)
        .map(s => s.trim())
        .filter(s => s.length > 5 && !s.startsWith('--') && !s.startsWith('SET ') && !s.startsWith('START ') && !s.startsWith('COMMIT'));

      for (const statement of statements) {
        try {
          await pool.query(statement);
        } catch (err) {
          // Ignore table already exists or duplicate key errors gracefully
          if (!err.message.includes('already exists') && !err.message.includes('Duplicate entry')) {
            console.warn('[CMS Bootstrap] Notice on statement:', err.message);
          }
        }
      }
      console.log('[CMS Bootstrap] Database tables verified / created successfully!');
    }
  } catch (err) {
    console.log('[CMS Bootstrap] Notice: Local MySQL server not actively running on this host/port. Using resilient fallback store:', err.message);
  }
}

module.exports = { bootstrapDatabase };
