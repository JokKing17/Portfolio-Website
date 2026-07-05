export const databaseUri =
  process.env.DATABASE_URI || 'mongodb://127.0.0.1/dynamic-developer-portfolio'

export function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URI && process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URI is required in production.')
  }
}
