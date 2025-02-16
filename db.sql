CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'technician', 'student', 'lab_manager') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN approved BOOLEAN DEFAULT FALSE;

CREATE TABLE equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lab VARCHAR(100) NOT NULL,  -- Which lab owns this item
    status ENUM('available', 'in use', 'maintenance') DEFAULT 'available',
    unique_code VARCHAR(255) UNIQUE NOT NULL, -- For barcode/QR code scanning
    last_maintenance DATE DEFAULT NULL,
    next_maintenance DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    reminder_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
);

ALTER TABLE equipment ADD COLUMN current_lab VARCHAR(100) NOT NULL;

CREATE TABLE asset_transfers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    equipment_id INT NOT NULL,
    from_lab VARCHAR(100) NOT NULL,
    to_lab VARCHAR(100) NOT NULL,
    transfer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
);
