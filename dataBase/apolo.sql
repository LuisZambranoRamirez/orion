CREATE DATABASE apolo;
USE apolo;

CREATE TABLE customer (
    customerNameId VARCHAR(50) PRIMARY KEY,
    phone VARCHAR(9) UNIQUE,

    CONSTRAINT chk_customer_phone_length CHECK (CHAR_LENGTH(phone) = 9)
 ) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE product (
    productId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    gainAmount DECIMAL(10,2) NOT NULL,
    stock INT UNSIGNED NOT NULL,
    barCode VARCHAR(13) UNIQUE,
    saleMode ENUM('Unidad', 'Granel', 'Unidad/Granel') NOT NULL,
    category ENUM('Bebidas', 'Abarrotes/Secos', 'Café/Infusiones', 'Lácteos', 'Carnes', 'Snacks/Golosinas', 'Higiene/Cuidado Personal', 'Limpieza/hogar', 'Bebés/Mamá', 'Mascotas','otros') NOT NULL,
    registrarionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_product_barcode_length CHECK (CHAR_LENGTH(barCode) = 13),
    CONSTRAINT chk_gain_amount_non_negative CHECK (gainAmount > 0)
) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE stockEntry (
    stockEntryId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    productId INT UNSIGNED NOT NULL,
    supplier VARCHAR(50),
    registrarionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    priceUnit DECIMAL(10,2) NOT NULL,
    amount INT NOT NULL,
    
    CONSTRAINT chk_stockEntry_price CHECK (priceUnit > 0),
    CONSTRAINT chk_stockEntry_amount CHECK (amount > 0),
    
    CONSTRAINT fk_stock_product FOREIGN KEY (productId)
        REFERENCES product(productId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE sale (
    saleId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customerNameId VARCHAR(50) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    registrarionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_sale_total CHECK (total >= 0) 
) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE saleDetail (
    saleDetailId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    saleId INT UNSIGNED NOT NULL,
    productId INT UNSIGNED NOT NULL,
    amount INT NOT NULL,
    priceUnit DECIMAL(10,2) NOT NULL,
    
    CONSTRAINT chk_saleDetail_amount CHECK (amount > 0),
    CONSTRAINT chk_saleDetail_priceUnit CHECK (priceUnit > 0),

    
    CONSTRAINT fk_sd_sale FOREIGN KEY (saleId)
        REFERENCES sale(saleId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_sd_product FOREIGN KEY (productId)
        REFERENCES product(productId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE inventoryLoss (
    inventoryLossId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    productId INT UNSIGNED NOT NULL,
    amount INT UNSIGNED NOT NULL,
    reason ENUM('Daño', 'Vencimiento', 'Robo', 'Perdido','Otro') NOT NULL,
    observation VARCHAR(255),
    registrarionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_inventoryLoss_amount CHECK (amount > 0),

    CONSTRAINT fk_inventoryLoss_product FOREIGN KEY (productId)
        REFERENCES product(productId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4;

-- Tabla para errores de API
CREATE TABLE apiError (
  apiErrorId      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  typeError         VARCHAR(100) NOT NULL,
  errorMessage     TEXT NOT NULL,
  stackTrace       TEXT NULL,
  registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para logs de conexión / performance
CREATE TABLE connectionLog (
  connectionLogId  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ipAddress         VARCHAR(45) NOT NULL,
  httpMethod        ENUM('GET','POST','PUT','DELETE','PATCH') NOT NULL,
  endpoint           VARCHAR(255) NOT NULL,
  statusCode        INT UNSIGNED NOT NULL,
  responseTimeMs   INT UNSIGNED,
  responseSizeBytes INT UNSIGNED,
  requestBody            JSON DEFAULT NULL,
  responseBody           JSON DEFAULT NULL,
  registrationDate  DATETIME DEFAULT CURRENT_TIMESTAMP,

  apiErrorId      INT UNSIGNED NULL UNIQUE,

    CONSTRAINT fk_apiErrorId_connectionLog FOREIGN KEY (apiErrorId)
    REFERENCES apiError(apiErrorId)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  
  CONSTRAINT chck_status_code_limit_is_599 CHECK (statusCode <= 599)

  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INDEX extra si buscas por fecha o producto frecuentemente
-- CREATE INDEX idx_sale_customerName ON sale(customerName);
-- CREATE INDEX idx_stockEntry_supplier ON stockEntry(supplier);
-- CREATE INDEX idx_product_category ON product(category);
