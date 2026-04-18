-- =============================================================
-- BRIXO — Database initialization script
-- =============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- 1. TENANTS
-- =============================================================
CREATE TABLE tenants (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL UNIQUE,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tenants_is_active ON tenants (is_active);

-- =============================================================
-- 2. USERS
-- =============================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    username        VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    authority_level VARCHAR(50)  NOT NULL DEFAULT 'OPERATOR',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, username),
    UNIQUE (tenant_id, email)
);

CREATE INDEX idx_users_tenant_id  ON users (tenant_id);
CREATE INDEX idx_users_email      ON users (email);
CREATE INDEX idx_users_is_active  ON users (is_active);

-- =============================================================
-- 3. ROLES
-- =============================================================
CREATE TABLE roles (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id   UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, name)
);

CREATE INDEX idx_roles_tenant_id ON roles (tenant_id);

-- =============================================================
-- 4. USER_ROLES
-- =============================================================
CREATE TABLE user_roles (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id     UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users (id),
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles (user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);

-- =============================================================
-- 5. PERMISSIONS
-- =============================================================
CREATE TABLE permissions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id   UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    role_id     UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    code        VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (role_id, code)
);

CREATE INDEX idx_permissions_tenant_id ON permissions (tenant_id);
CREATE INDEX idx_permissions_role_id   ON permissions (role_id);

-- =============================================================
-- 6. PRODUCTS
-- =============================================================
CREATE TABLE products (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id     UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    current_stock INTEGER NOT NULL DEFAULT 0,
    minimum_stock INTEGER NOT NULL DEFAULT 0,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, name)
);

CREATE INDEX idx_products_tenant_id     ON products (tenant_id);
CREATE INDEX idx_products_is_active     ON products (is_active);
CREATE INDEX idx_products_current_stock ON products (current_stock);

-- =============================================================
-- 7. INVENTORY_MOVEMENTS
-- =============================================================
CREATE TABLE inventory_movements (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id     UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    product_id    UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('ENTRADA', 'SALIDA', 'AJUSTE')),
    quantity      INTEGER NOT NULL CHECK (quantity > 0),
    reason        TEXT,
    created_by    UUID NOT NULL REFERENCES users (id),
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_movements_tenant_id  ON inventory_movements (tenant_id);
CREATE INDEX idx_movements_product_id ON inventory_movements (product_id);
CREATE INDEX idx_movements_created_at ON inventory_movements (created_at);

-- =============================================================
-- 8. AUDIT_LOGS
-- =============================================================
CREATE TABLE audit_logs (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id     UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES users (id),
    actor_ip      VARCHAR(45),
    event_type    VARCHAR(50) NOT NULL,
    entity        VARCHAR(50) NOT NULL,
    entity_id     UUID,
    action        VARCHAR(50) NOT NULL,
    payload       JSONB,
    occurred_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant_id   ON audit_logs (tenant_id);
CREATE INDEX idx_audit_logs_entity_id   ON audit_logs (entity_id);
CREATE INDEX idx_audit_logs_occurred_at ON audit_logs (occurred_at);
CREATE INDEX idx_audit_logs_event_type  ON audit_logs (event_type);

-- =============================================================
-- SEED DATA
-- =============================================================
INSERT INTO tenants (id, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Store');

INSERT INTO users (id, tenant_id, username, email, password_hash, authority_level)
VALUES (
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'admin',
    'admin@brixo.local',
    '$2b$12$sE2nMPXtPRDJrE9psLdO9Or4Akmb7sV3HW4GVQUMh6GlZDIfCm7q6',
    'OWNER'
);

INSERT INTO products (tenant_id, name, description, current_stock, minimum_stock)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Coca Cola 500ml', 'Bebida refrescante', 25, 5),
    ('00000000-0000-0000-0000-000000000001', 'Pan de molde',    'Pan integral',       10, 3),
    ('00000000-0000-0000-0000-000000000001', 'Leche entera',    'Leche de vaca',      15, 5);
