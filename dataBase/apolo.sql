CREATE DATABASE apolo;
USE apolo;

CREATE TABLE supplier (
    supplierNameId VARCHAR(50) PRIMARY KEY,
    ruc varchar(11) unique,
    phone VARCHAR(9),
    
    CONSTRAINT chk_supplier_phone_format CHECK (
        CHAR_LENGTH(phone) = 9 AND phone REGEXP '^[0-9]{9}$'
    ) 
    CONSTRAINT chk_ruc CHECK(
        CHAR_LENGTH(ruc) = 11 AND ruc REGEXP '^[0-9]{11}$'
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE customer (
    customerNameId VARCHAR(50) PRIMARY KEY,
    phone VARCHAR(9) UNIQUE,

    CONSTRAINT chk_customer_phone_format CHECK (
        CHAR_LENGTH(phone) = 9 AND phone REGEXP '^[0-9]{9}$'
    )
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE product (
    productNameId VARCHAR(50) PRIMARY KEY,
    gainAmount DECIMAL(10,2) NOT NULL,
    stock INT UNSIGNED NOT NULL,
    barCode VARCHAR(13) UNIQUE,
    saleMode ENUM('Unidad', 'Granel', 'Unidad/Granel') NOT NULL,
    category ENUM('Bebidas', 'Abarrotes/Secos', 'Café/Infusiones', 'Lácteos', 'Carnes', 'Snacks/Golosinas', 'Higiene/Cuidado Personal', 'Limpieza/hogar', 'Bebés/Mamá', 'Mascotas','otros') NOT NULL,
    registrationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_product_barcode_length CHECK (barCode IS NULL OR CHAR_LENGTH(barCode) = 13),
    CONSTRAINT chk_gain_amount_non_negative CHECK (gainAmount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE productoGainAmountHistory (
  productoGainAmountHistoryId INT AUTO_INCREMENT PRIMARY KEY,
  productNameId VARCHAR(50) NOT NULL,
  gainAmount DECIMAL(10,2) NOT NULL,
  registrationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_productoGainAmountHistory_product FOREIGN KEY (productNameId) 
    REFERENCES product(productNameId)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE stockEntry (
    stockEntryId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    productNameId VARCHAR(50) NOT NULL,
    supplierNameId VARCHAR(50) NOT NULL,
    registrationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    priceUnit DECIMAL(10,2) NOT NULL,
    amount INT NOT NULL,
    
    CONSTRAINT chk_stockEntry_price CHECK (priceUnit > 0),
    CONSTRAINT chk_stockEntry_amount CHECK (amount > 0),
    
    CONSTRAINT fk_stock_product FOREIGN KEY (productNameId)
        REFERENCES product(productNameId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_stock_supplier FOREIGN KEY (supplierNameId)
        REFERENCES supplier(supplierNameId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sale (
    saleId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customerNameId VARCHAR(50) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    registrationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_sale_total CHECK (total >= 0) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE saleDetail (
    saleDetailId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    saleId INT UNSIGNED NOT NULL,
    productNameId VARCHAR(50) NOT NULL,
    amount INT NOT NULL,
    priceUnit DECIMAL(10,2) NOT NULL,
    
    CONSTRAINT chk_saleDetail_amount CHECK (amount > 0),
    CONSTRAINT chk_saleDetail_priceUnit CHECK (priceUnit > 0),

    
    CONSTRAINT fk_sd_sale FOREIGN KEY (saleId)
        REFERENCES sale(saleId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_sd_product FOREIGN KEY (productNameId)
        REFERENCES product(productNameId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE inventoryLoss (
    inventoryLossId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    productNameId VARCHAR(50) NOT NULL,
    amount INT UNSIGNED NOT NULL,
    reason ENUM('Daño', 'Vencimiento', 'Robo', 'Perdido', 'Comsumo', 'Otro') NOT NULL,
    observation VARCHAR(255),
    registrationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_inventoryLoss_amount CHECK (amount > 0),

    CONSTRAINT fk_inventoryLoss_product FOREIGN KEY (productNameId)
        REFERENCES product(productNameId)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE pay (
  payId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  saleId INT UNSIGNED NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  registrationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT chk_pay_amount CHECK (amount > 0),

  CONSTRAINT fk_pay_sale FOREIGN KEY (saleId)
    REFERENCES sale(saleId)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

-- TRIGGERS
-- SHOW TRIGGERS

DELIMITER $$

-- Guarda el historial de precios de los productos
CREATE TRIGGER trg_product_after_update
AFTER UPDATE ON product
FOR EACH ROW
BEGIN
    -- Solo registrar si realmente cambió el precio
    IF NEW.gainAmount <> OLD.gainAmount THEN
        INSERT INTO productoGainAmountHistory (productNameId, gainAmount)
        VALUES (NEW.productNameId, NEW.gainAmount);
    END IF;
END $$

CREATE TRIGGER tgr_pay_before
BEFORE INSERT ON pay 
FOR EACH ROW
BEGIN    
    DECLARE total_pagado DECIMAL(10,2);
    DECLARE total_venta DECIMAL(10,2);

    -- Obtener la suma de los pagos existentes para esa venta
    SELECT IFNULL(SUM(amount), 0) INTO total_pagado
    FROM pay
    WHERE saleId = NEW.saleId;

    -- Obtener el total de la venta
    SELECT total INTO total_venta
    FROM sale
    WHERE saleId = NEW.saleId;

    -- Verificar si al sumar el nuevo pago se excede el total de la venta
    IF (total_pagado + NEW.amount) > total_venta THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El pago excede el total de la venta.';
    END IF;
END $$ 

DELIMITER ;