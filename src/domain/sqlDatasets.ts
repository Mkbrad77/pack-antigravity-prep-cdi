/**
 * Jeux de donnees SQL realistes pour l'entrainement aux entretiens Data Engineer.
 * 4 domaines metiers avec defauts volontaires (doublons, valeurs NULL, dates incoherentes, anomalies).
 * Concu pour tourner en memoire via SQLite / DuckDB.
 */

export interface SqlDatasetDefinition {
  id: 'ecommerce' | 'streaming_events' | 'hr_payroll' | 'banking_fraud';
  name: string;
  description: string;
  tables: string[];
  schemaSql: string;
  seedSql: string;
}

export const ECOMMERCE_DATASET: SqlDatasetDefinition = {
  id: 'ecommerce',
  name: 'E-Commerce & Logistique (Retail)',
  description: 'Clients, commandes, articles et produits. Contient des doublons d\'emails, statuts NULL et quantites negatives.',
  tables: ['customers', 'products', 'orders', 'order_items'],
  schemaSql: `
    CREATE TABLE customers (
      customer_id INTEGER PRIMARY KEY,
      email TEXT,
      first_name TEXT,
      last_name TEXT,
      country TEXT,
      signup_date TEXT,
      is_active INTEGER
    );

    CREATE TABLE products (
      product_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      cost_price REAL NOT NULL,
      list_price REAL NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE orders (
      order_id INTEGER PRIMARY KEY,
      customer_id INTEGER,
      order_date TEXT,
      status TEXT,
      total_amount REAL,
      shipping_fee REAL
    );

    CREATE TABLE order_items (
      item_id INTEGER PRIMARY KEY,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      discount_pct REAL NOT NULL DEFAULT 0.0
    );
  `,
  seedSql: `
    -- Clients (avec doublons email, casse heterogene et NULL)
    INSERT INTO customers VALUES
      (1, 'alex.martin@example.com', 'Alexandre', 'Martin', 'France', '2025-01-15', 1),
      (2, 'sarah.lefevre@example.com', 'Sarah', 'Lefevre', 'France', '2025-02-01', 1),
      (3, 'thomas.bernard@tech.fr', 'Thomas', 'Bernard', 'belgique', '2025-03-10', 1),
      (4, 'claire.dubois@mail.com', 'Claire', 'Dubois', NULL, '2025-04-05', 0),
      (5, 'lucas.petit@domain.org', 'Lucas', 'Petit', 'FRANCE', '2025-05-12', 1),
      (6, 'sarah.lefevre@example.com', 'Sarah', 'Lefevre', 'France', '2025-06-20', 1), -- Doublon email
      (7, 'emma.moreau@example.com', 'Emma', 'Moreau', 'Suisse', '2024-11-30', 1),
      (8, 'julien.roux@mail.com', 'Julien', 'Roux', 'France', '2025-07-01', 1),
      (9, NULL, 'Anonyme', 'Utilisateur', 'Canada', '2025-08-14', 0), -- Email NULL
      (10, 'antoine.richard@tech.fr', 'Antoine', 'Richard', 'France', '2025-09-02', 1);

    -- Produits
    INSERT INTO products VALUES
      (101, 'Clavier Mecanique Pro', 'Peripheriques', 45.0, 89.99, '2024-10-01'),
      (102, 'Souris Ergonomique Sans Fil', 'Peripheriques', 20.0, 49.90, '2024-10-01'),
      (103, 'Ecran 27 pouces 4K', 'Ecrans', 180.0, 329.00, '2024-11-15'),
      (104, 'Casque Audio a Reduction de Bruit', 'Audio', 75.0, 159.00, '2024-12-01'),
      (105, 'Hub USB-C 8-en-1', 'Accessoires', 15.0, 39.99, '2025-01-10'),
      (106, 'Webcam HD 1080p', 'Video', 25.0, 59.90, '2025-01-20'),
      (107, 'Support PC Portable Aluminium', 'Accessoires', 12.0, 29.90, '2025-02-05'),
      (108, 'Cable HDMI 2.1 Tresse', 'Accessoires', 4.0, 14.99, '2025-02-10');

    -- Commandes (avec dates incoherentes, montants negatifs et statuts NULL)
    INSERT INTO orders VALUES
      (1001, 1, '2025-09-10', 'completed', 139.89, 4.99),
      (1002, 2, '2025-09-11', 'completed', 329.00, 0.0),
      (1003, 3, '2025-09-12', 'pending', 59.90, 4.99),
      (1004, 1, '2025-09-15', 'completed', 49.90, 0.0),
      (1005, 5, '2025-09-18', 'cancelled', 89.99, 4.99),
      (1006, 999, '2025-09-20', 'completed', 159.00, 0.0), -- Client orphelin (999 inconnu)
      (1007, 2, '2025-09-22', NULL, 39.99, 4.99), -- Statut NULL
      (1008, 7, '2025-09-25', 'completed', 418.99, 0.0),
      (1009, 8, '2025-09-28', 'refunded', 159.00, 4.99),
      (1010, 1, '2025-10-01', 'completed', 29.90, 0.0),
      (1011, 4, '2025-10-02', 'completed', -50.00, 0.0), -- Montant aberrant negatif
      (1012, 10, '2028-12-31', 'completed', 89.99, 0.0), -- Date future incoherente
      (1013, 2, '2025-10-05', 'completed', 208.90, 4.99),
      (1014, 5, '2025-10-08', 'completed', 74.89, 4.99);

    -- Lignes de commande (avec doublons et quantites negatives)
    INSERT INTO order_items VALUES
      (1, 1001, 101, 1, 89.99, 0.0),
      (2, 1001, 102, 1, 49.90, 0.0),
      (3, 1002, 103, 1, 329.00, 0.0),
      (4, 1003, 106, 1, 59.90, 0.0),
      (5, 1004, 102, 1, 49.90, 0.0),
      (6, 1005, 101, 1, 89.99, 0.0),
      (7, 1006, 104, 1, 159.00, 0.0),
      (8, 1007, 105, 1, 39.99, 0.0),
      (9, 1008, 103, 1, 329.00, 0.0),
      (10, 1008, 101, 1, 89.99, 0.0),
      (11, 1009, 104, 1, 159.00, 0.0),
      (12, 1010, 107, 1, 29.90, 0.0),
      (13, 1011, 108, -2, 14.99, 0.0), -- Quantite negative
      (14, 1012, 101, 1, 89.99, 0.0),
      (15, 1013, 104, 1, 159.00, 0.0),
      (16, 1013, 102, 1, 49.90, 0.0),
      (17, 1014, 105, 1, 39.99, 0.1),
      (18, 1014, 108, 2, 14.99, 0.0);
  `,
};

export const STREAMING_EVENTS_DATASET: SqlDatasetDefinition = {
  id: 'streaming_events',
  name: 'Evenements Produit & Streaming (Product Analytics)',
  description: 'Sessions utilisateurs, evenements clickstream et abonnements SaaS. Contient des doublons de flux, dates inversees et late arrival.',
  tables: ['user_sessions', 'events_stream', 'subscriptions'],
  schemaSql: `
    CREATE TABLE user_sessions (
      session_id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      device TEXT,
      ip_address TEXT,
      platform TEXT
    );

    CREATE TABLE events_stream (
      event_id INTEGER PRIMARY KEY,
      session_id TEXT,
      user_id INTEGER NOT NULL,
      event_type TEXT,
      event_timestamp TEXT NOT NULL,
      page_url TEXT,
      duration_sec REAL
    );

    CREATE TABLE subscriptions (
      sub_id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      plan_name TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      monthly_price REAL NOT NULL,
      is_active INTEGER NOT NULL
    );
  `,
  seedSql: `
    -- Sessions (avec session orpheline et end_time < start_time)
    INSERT INTO user_sessions VALUES
      ('sess-001', 101, '2025-10-01 08:30:00', '2025-10-01 08:45:00', 'mobile', '192.168.1.10', 'iOS'),
      ('sess-002', 102, '2025-10-01 09:00:00', '2025-10-01 09:30:00', 'desktop', '192.168.1.11', 'macOS'),
      ('sess-003', 101, '2025-10-01 12:00:00', '2025-10-01 11:45:00', 'mobile', '192.168.1.10', 'iOS'), -- Fin avant debut
      ('sess-004', 103, '2025-10-01 14:10:00', '2025-10-01 14:40:00', 'desktop', '10.0.0.5', 'Windows'),
      ('sess-005', 104, '2025-10-01 16:00:00', NULL, 'tablet', '172.16.0.2', 'Android'), -- Session non terminee
      ('sess-006', 102, '2025-10-02 10:00:00', '2025-10-02 10:25:00', 'desktop', '192.168.1.11', 'macOS'),
      ('sess-007', 105, '2025-10-02 11:30:00', '2025-10-02 11:50:00', 'mobile', '82.64.12.1', 'Android');

    -- Flux d'evenements (avec doublons Kafka, casse heterogene et desordre chronologique)
    INSERT INTO events_stream VALUES
      (1, 'sess-001', 101, 'page_view', '2025-10-01 08:30:05', '/home', 5.2),
      (2, 'sess-001', 101, 'click', '2025-10-01 08:31:00', '/pricing', 12.0),
      (3, 'sess-001', 101, 'click', '2025-10-01 08:31:00', '/pricing', 12.0), -- Doublon reseau exact
      (4, 'sess-001', 101, 'signup_start', '2025-10-01 08:35:00', '/signup', 45.0),
      (5, 'sess-002', 102, 'PAGE_VIEW', '2025-10-01 09:00:10', '/dashboard', 8.0), -- Casse majuscule
      (6, 'sess-002', 102, 'export_csv', '2025-10-01 09:15:00', '/reports', 3.5),
      (7, 'sess-004', 103, 'page_view', '2025-10-01 14:10:15', '/docs/api', 20.0),
      (8, 'sess-004', 103, NULL, '2025-10-01 14:15:00', '/docs/faq', 15.0), -- Type d'evenement NULL
      (9, 'sess-005', 104, 'page_view', '2025-10-01 16:00:05', '/login', 4.0),
      (10, 'sess-orphan', 999, 'heartbeat', '2025-10-01 17:00:00', '/ping', 1.0), -- Session orpheline
      (11, 'sess-006', 102, 'page_view', '2025-10-02 10:00:05', '/home', 6.0),
      (12, 'sess-006', 102, 'checkout_success', '2025-10-02 10:20:00', '/checkout/thankyou', 2.0),
      (13, 'sess-007', 105, 'page_view', '2025-10-02 11:30:10', '/home', 10.0),
      (14, 'sess-007', 105, 'search', '2025-10-02 11:32:00', '/search?q=pipeline', 15.5);

    -- Abonnements (avec cas de changement d'offre SCD2 et chevauchement)
    INSERT INTO subscriptions VALUES
      (1, 101, 'Free', '2025-01-01', '2025-09-30', 0.0, 0),
      (2, 101, 'Pro', '2025-10-01', NULL, 29.0, 1),
      (3, 102, 'Enterprise', '2025-02-15', NULL, 199.0, 1),
      (4, 103, 'Pro', '2025-03-01', '2025-08-31', 29.0, 0),
      (5, 104, 'Free', '2025-05-10', NULL, 0.0, 1),
      (6, 105, 'Starter', '2025-06-01', '2025-10-15', 9.99, 1), -- Incoherence : end_date passee mais is_active = 1
      (7, 105, 'Pro', '2025-10-10', NULL, 29.0, 1); -- Chevauchement de 5 jours
  `,
};

export const HR_PAYROLL_DATASET: SqlDatasetDefinition = {
  id: 'hr_payroll',
  name: 'Ressources Humaines & Organisation (Payroll)',
  description: 'Employes, departements, historique salarial et hierarchie de managers. Ideal pour CTE recursives, RANK, DENSE_RANK et LAG/LEAD.',
  tables: ['departments', 'employees', 'salary_history', 'job_positions'],
  schemaSql: `
    CREATE TABLE departments (
      department_id INTEGER PRIMARY KEY,
      dept_name TEXT NOT NULL,
      location TEXT NOT NULL,
      budget REAL NOT NULL
    );

    CREATE TABLE job_positions (
      position_id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      min_salary REAL NOT NULL,
      max_salary REAL NOT NULL
    );

    CREATE TABLE employees (
      employee_id INTEGER PRIMARY KEY,
      full_name TEXT NOT NULL,
      department_id INTEGER,
      position_id INTEGER,
      manager_id INTEGER,
      hire_date TEXT NOT NULL,
      termination_date TEXT,
      current_salary REAL
    );

    CREATE TABLE salary_history (
      history_id INTEGER PRIMARY KEY,
      employee_id INTEGER NOT NULL,
      effective_date TEXT NOT NULL,
      salary REAL NOT NULL,
      change_reason TEXT
    );
  `,
  seedSql: `
    -- Departements
    INSERT INTO departments VALUES
      (10, 'Data & AI Platform', 'Paris', 850000.0),
      (20, 'Software Engineering', 'Lyon', 1200000.0),
      (30, 'Product & Design', 'Paris', 450000.0),
      (40, 'Finance & Legal', 'Bordeaux', 300000.0),
      (50, 'Marketing & Growth', 'Remote', 400000.0);

    -- Postes
    INSERT INTO job_positions VALUES
      (1, 'VP Engineering / CTO', 110000.0, 160000.0),
      (2, 'Staff Data Engineer', 75000.0, 95000.0),
      (3, 'Senior Data Engineer', 60000.0, 75000.0),
      (4, 'Data Engineer', 45000.0, 60000.0),
      (5, 'Junior Data Engineer / Alternant', 20000.0, 38000.0),
      (6, 'Lead AI Engineer', 70000.0, 90000.0),
      (7, 'AI Research Engineer', 55000.0, 75000.0),
      (8, 'Product Manager', 50000.0, 70000.0);

    -- Employes (avec hierarchie manager_id, ex-aequo salariaux et cas limites)
    INSERT INTO employees VALUES
      (1, 'Sophie Laurent', 10, 1, NULL, '2021-03-01', NULL, 135000.0), -- Directrice / CEO / CTO
      (2, 'Marc Dubois', 10, 2, 1, '2021-09-15', NULL, 85000.0),
      (3, 'Amina Benali', 10, 3, 2, '2022-04-01', NULL, 72000.0),
      (4, 'Guillaume Mercier', 10, 4, 3, '2023-01-10', NULL, 52000.0),
      (5, 'Camille Roussel', 10, 4, 3, '2023-06-01', NULL, 52000.0), -- Ex-aequo salaire DE
      (6, 'Auren Moyo', 10, 5, 3, '2024-09-01', NULL, 28000.0), -- Alternant DE
      (7, 'David Kim', 10, 6, 1, '2022-01-10', NULL, 82000.0),
      (8, 'Elena Vasileva', 10, 7, 7, '2023-03-15', NULL, 65000.0),
      (9, 'Nicolas Fabre', 20, 3, 1, '2022-06-01', NULL, 68000.0),
      (10, 'Chloe Blanc', 30, 8, 1, '2023-02-01', NULL, 58000.0),
      (11, 'Julien Morin', 10, 4, 2, '2022-08-01', '2024-05-30', 50000.0), -- Demissionne
      (12, 'Jean Dupont', NULL, 4, 2, '2024-01-15', NULL, NULL), -- Sans departement et salaire NULL
      (13, 'Jean Dupont', 20, 4, 9, '2024-02-01', NULL, 48000.0); -- Homonyme exact

    -- Historique des salaires (pour LAG/LEAD et augmentations successives)
    INSERT INTO salary_history VALUES
      (1, 1, '2021-03-01', 120000.0, 'Embauche initiale'),
      (2, 1, '2023-01-01', 135000.0, 'Promotion VP Engineering'),
      (3, 2, '2021-09-15', 78000.0, 'Embauche initiale'),
      (4, 2, '2023-07-01', 85000.0, 'Revalorisation Staff'),
      (5, 3, '2022-04-01', 62000.0, 'Embauche initiale'),
      (6, 3, '2024-01-01', 72000.0, 'Passage Senior'),
      (7, 4, '2023-01-10', 48000.0, 'Embauche initiale'),
      (8, 4, '2024-03-01', 52000.0, 'Ajustement annuel'),
      (9, 5, '2023-06-01', 50000.0, 'Embauche initiale'),
      (10, 5, '2024-06-01', 52000.0, 'Ajustement annuel'),
      (11, 7, '2022-01-10', 74000.0, 'Embauche initiale'),
      (12, 7, '2023-09-01', 82000.0, 'Revalorisation Lead AI');
  `,
};

export const BANKING_FRAUD_DATASET: SqlDatasetDefinition = {
  id: 'banking_fraud',
  name: 'Transactions Bancaires & Detection de Fraude (Fintech)',
  description: 'Comptes bancaires, transactions par carte et rapports de conformite. Parfait pour fenetres glissantes, dedoublonnage technique et anomalies.',
  tables: ['bank_accounts', 'transactions', 'fraud_reports'],
  schemaSql: `
    CREATE TABLE bank_accounts (
      account_id INTEGER PRIMARY KEY,
      customer_id INTEGER NOT NULL,
      account_type TEXT NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      opened_at TEXT NOT NULL,
      balance REAL NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE transactions (
      tx_id INTEGER PRIMARY KEY,
      account_id INTEGER NOT NULL,
      tx_timestamp TEXT NOT NULL,
      tx_type TEXT NOT NULL,
      amount REAL NOT NULL,
      merchant_name TEXT,
      merchant_category TEXT,
      is_flagged_fraud INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE fraud_reports (
      report_id INTEGER PRIMARY KEY,
      tx_id INTEGER NOT NULL,
      report_date TEXT NOT NULL,
      confirmed_fraud INTEGER NOT NULL,
      resolution TEXT
    );
  `,
  seedSql: `
    -- Comptes bancaires
    INSERT INTO bank_accounts VALUES
      (201, 501, 'checking', 'EUR', '2023-01-15', 3420.50, 'active'),
      (202, 501, 'savings', 'EUR', '2023-02-01', 12500.00, 'active'),
      (203, 502, 'checking', 'EUR', '2023-06-10', 150.20, 'active'),
      (204, 503, 'checking', 'USD', '2023-08-20', -45.00, 'overdrawn'), -- Compte debiteur
      (205, 504, 'checking', 'EUR', '2024-01-05', 8900.00, 'active'),
      (206, 505, 'checking', 'EUR', '2024-03-12', 0.00, 'suspended');

    -- Transactions (avec transactions tres rapprochees, montants suspects et retries reseau)
    INSERT INTO transactions VALUES
      (10001, 201, '2025-10-15 09:12:00', 'card_payment', 14.50, 'Boulangerie Paris', 'Food', 0),
      (10002, 201, '2025-10-15 12:30:00', 'card_payment', 48.00, 'Restaurant Le Bistro', 'Food', 0),
      (10003, 201, '2025-10-15 14:02:10', 'card_payment', 950.00, 'Apple Store Opera', 'Electronics', 0),
      (10004, 201, '2025-10-15 14:03:00', 'card_payment', 950.00, 'Apple Store Opera', 'Electronics', 1), -- Retentative suspecte 50s apres
      (10005, 201, '2025-10-15 14:03:45', 'card_payment', 950.00, 'Apple Store Opera', 'Electronics', 1), -- 3e tentative frauduleuse
      (10006, 203, '2025-10-16 08:00:00', 'atm_withdrawal', 50.00, 'DAB BNP Paris', 'Cash', 0),
      (10007, 203, '2025-10-16 08:05:00', 'atm_withdrawal', 50.00, 'DAB BNP Paris', 'Cash', 0),
      (10008, 203, '2025-10-16 08:05:00', 'atm_withdrawal', 50.00, 'DAB BNP Paris', 'Cash', 0), -- Doublon d'id technique ou double debit
      (10009, 204, '2025-10-16 18:20:00', 'online_payment', 120.00, 'Amazon US', 'Retail', 0),
      (10010, 205, '2025-10-17 10:15:00', 'wire_transfer', 3500.00, 'Virement Notaire', 'Transfer', 0),
      (10011, 205, '2025-10-17 10:18:00', 'wire_transfer', 3500.00, 'Virement Notaire', 'Transfer', 0), -- Doublon de virement
      (10012, 201, '2025-10-18 11:00:00', 'refund', -48.00, 'Restaurant Le Bistro', 'Food', 0), -- Remboursement montant negatif
      (10013, 202, '2025-10-19 09:00:00', 'interest', 25.40, 'Interets Mensuels', 'Bank', 0);

    -- Rapports de fraude
    INSERT INTO fraud_reports VALUES
      (1, 10004, '2025-10-15', 1, 'Carte bloquee suite alerte temps reel'),
      (2, 10005, '2025-10-15', 1, 'Transaction rejetee et rembourses'),
      (3, 10008, '2025-10-16', 0, 'Fausse alerte : retrait double confirme par client');
  `,
};

export const ALL_SQL_DATASETS: SqlDatasetDefinition[] = [
  ECOMMERCE_DATASET,
  STREAMING_EVENTS_DATASET,
  HR_PAYROLL_DATASET,
  BANKING_FRAUD_DATASET,
];

export function getDatasetById(id: string): SqlDatasetDefinition | undefined {
  return ALL_SQL_DATASETS.find((d) => d.id === id);
}
