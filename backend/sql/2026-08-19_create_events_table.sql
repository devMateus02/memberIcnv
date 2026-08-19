-- Agenda de eventos: tabela criada manualmente via Workbench (o projeto ainda não tem
-- sistema de migration, então este arquivo fica só como registro).

CREATE TABLE events (
  id char(36) NOT NULL,
  name varchar(200) NOT NULL,
  description text,
  image_url text,
  event_time time NOT NULL,
  start_date date NOT NULL,
  end_date date DEFAULT NULL,
  status enum('scheduled','cancelled','postponed','moved_up') NOT NULL DEFAULT 'scheduled',
  created_by char(36) DEFAULT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_events_start_date (start_date),
  CONSTRAINT fk_events_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
