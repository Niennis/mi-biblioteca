// Set required env vars before any module import runs env validation
Object.assign(process.env, {
  PORT: "3001",
  DATABASE_URL: "postgresql://test:test@localhost:5432/testdb",
  SUPABASE_URL: "https://test.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  FRONTEND_URL: "http://localhost:5173",
});
