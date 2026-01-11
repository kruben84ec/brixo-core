CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO products (name, stock) VALUES
('Coca Cola 500ml', 25),
('Pan de molde', 10),
('Leche entera', 15);
