CREATE DATABASE apolo;
USE apolo;

CREATE TABLE product (
    productId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    stock INT UNSIGNED NOT NULL,
    barCode VARCHAR(13) NOT NULL UNIQUE,
    category ENUM('Bebidas', 'Abarrotes/Secos', 'Café/Infusiones', 'Lácteos', 'Carnes', 'Snacks/Golosinas', 'Higiene/Cuidado Personal', 'Limpieza/hogar', 'Bebés/Mamá', 'Mascotas','otros') NOT NULL,
    registrarionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_product_price CHECK (price > 0),
    CONSTRAINT chk_product_barcode_length CHECK (CHAR_LENGTH(barCode) = 13)
) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE productPriceHistory (
    productPriceHistoryId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    productId INT UNSIGNED NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    registrarionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pph_product FOREIGN KEY (productId)
        REFERENCES product(productId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE stockEntry (
    stockEntryId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    productId INT UNSIGNED NOT NULL,
    supplier VARCHAR(50),
    registrarionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    price DECIMAL(10,2) NOT NULL,
    amount INT NOT NULL,
    
    CONSTRAINT chk_stockEntry_price CHECK (price > 0),
    CONSTRAINT chk_stockEntry_amount CHECK (amount > 0),
    
    CONSTRAINT fk_stock_product FOREIGN KEY (productId)
        REFERENCES product(productId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE sale (
    saleId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    total DECIMAL(10,2) NOT NULL,
    customerName VARCHAR(50),
    registrarionDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_sale_total CHECK (total > 0)
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

-- Tabla para errores de API
CREATE TABLE apiErrors (
  apiErrorId      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  typeError         VARCHAR(100) NOT NULL,
  errorMessage     TEXT NOT NULL,
  stackTrace       TEXT NULL,
  registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para logs de conexión / performance
CREATE TABLE connectionLogs (
  connectionLogId  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ipAddress         VARCHAR(45) NOT NULL,
  httpMethod        ENUM('GET','POST','PUT','DELETE','PATCH') NOT NULL,
  endpoint           VARCHAR(255) NOT NULL,
  statusCode        INT UNSIGNED NOT NULL,
  responseTimeMs   INT UNSIGNED,
  responseSizeBytes INT UNSIGNED,
  request            JSON DEFAULT NULL,
  response           JSON DEFAULT NULL,
  registrationDate  DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  apiErrorId       INT UNSIGNED NULL,

  CONSTRAINT fk_apiError FOREIGN KEY (apiErrorId)
    REFERENCES apiErrors(apiErrorId)
    ON DELETE SET NULL
    ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




-- INDEX extra si buscas por fecha o producto frecuentemente
-- CREATE INDEX idx_sale_customerName ON sale(customerName);
-- CREATE INDEX idx_stockEntry_supplier ON stockEntry(supplier);
-- CREATE INDEX idx_product_category ON product(category);


-- TRIGGERS
-- SHOW TRIGGERS

DELIMITER $$

-- Guarda el historial de precios de los productos
CREATE TRIGGER trg_product_after_update
AFTER UPDATE ON product
FOR EACH ROW
BEGIN
    -- Solo registrar si realmente cambió el precio
    IF NEW.price <> OLD.price THEN
        INSERT INTO productPriceHistory (productId, price)
        VALUES (NEW.productId, NEW.price);
    END IF;
END $$

DELIMITER ;
