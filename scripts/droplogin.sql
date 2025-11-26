-- DROP TRIGGERS trước
DROP TRIGGER IF EXISTS trg_hash_password ON users;
DROP TRIGGER IF EXISTS trg_generate_user_id ON users;
DROP TRIGGER IF EXISTS trg_update_users_updated_at ON users;

-- DROP FUNCTIONS
DROP FUNCTION IF EXISTS hash_password();
DROP FUNCTION IF EXISTS generate_user_id();
DROP FUNCTION IF EXISTS update_users_updated_at();

-- DROP TABLE
DROP TABLE IF EXISTS users CASCADE;
