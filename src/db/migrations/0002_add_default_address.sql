-- Create a guest user
INSERT INTO "User" (id, name, email, password, role)
VALUES ('guest', 'Guest User', 'guest@example.com', 'no-password', 'USER')
ON CONFLICT (id) DO NOTHING;

-- Create a default shipping address
INSERT INTO "Address" (id, userId, street, city, state, postalCode, country)
VALUES ('default', 'guest', 'Default Street', 'Default City', 'Default State', '00000', 'Default Country')
ON CONFLICT (id) DO NOTHING; 