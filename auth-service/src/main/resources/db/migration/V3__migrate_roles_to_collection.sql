-- Migrate roles from TEXT[] to user_roles table
-- Step 1: Create the user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role)
);

-- Step 2: Migrate existing roles data
-- For each user with roles, insert into user_roles table
INSERT INTO user_roles (user_id, role)
SELECT id, unnest(roles)
FROM users
WHERE roles IS NOT NULL AND array_length(roles, 1) > 0;

-- Step 3: Drop the old roles column
ALTER TABLE users DROP COLUMN IF EXISTS roles;
