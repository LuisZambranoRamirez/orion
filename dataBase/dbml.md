# Modelo de Base de Datos - Apolo

Este es el esquema de la base de datos en formato **DBML**, compatible con [dbdiagram.io](https://dbdiagram.io/d).

Project apolo {
  database_type: "MySQL"
}

Enum SaleMode {
  Unidad
  Granel
  "Unidad/Granel"
}

Enum ProductCategory {
  Bebidas
  "Abarrotes/Secos"
  "Café/Infusiones"
  Lácteos
  Carnes
  "Snacks/Golosinas"
  "Higiene/Cuidado Personal"
  "Limpieza/hogar"
  "Bebés/Mamá"
  Mascotas
  otros
}

Enum InventoryLossReason {
  Daño
  Vencimiento
  Robo
  Otro
}

Enum HttpMethod {
  GET
  POST
  PUT
  DELETE
  PATCH
}

Table product {
  productId int [pk, increment]
  name varchar(50) [not null, unique]
  price decimal(10,2) [not null]
  gainAmount decimal(10,2) [not null]
  stock int [not null]
  barCode varchar(13) [unique]
  saleMode SaleMode [not null]
  category ProductCategory [not null]
  registrarionDate timestamp [default: `CURRENT_TIMESTAMP`, not null]
  
  Note: 'CHECK (price > 0) and CHAR_LENGTH(barCode) = 13'
}

Table productPriceHistory {
  productPriceHistoryId int [pk, increment]
  productId int [not null, ref: > product.productId]
  price decimal(10,2) [not null]
  registrarionDate timestamp [default: `CURRENT_TIMESTAMP`, not null]
}

Table stockEntry {
  stockEntryId int [pk, increment]
  productId int [not null, ref: > product.productId]
  supplier varchar(50)
  registrarionDate timestamp [default: `CURRENT_TIMESTAMP`, not null]
  priceUnit decimal(10,2) [not null]
  amount int [not null]

  Note: 'CHECK (priceUnit > 0 AND amount > 0)'
}

Table sale {
  saleId int [pk, increment]
  customerName varchar(50) [not null]
  amountPaid decimal(10,2) [not null, default: 0]
  total decimal(10,2) [not null]
  registrarionDate timestamp [default: `CURRENT_TIMESTAMP`, not null]

  Note: 'CHECK (total > 0)'
}

Table saleDetail {
  saleDetailId int [pk, increment]
  saleId int [not null, ref: > sale.saleId]
  productId int [not null, ref: > product.productId]
  amount int [not null]
  priceUnit decimal(10,2) [not null]

  Note: 'CHECK (amount > 0 AND priceUnit > 0)'
}

Table inventoryLoss {
  inventoryLossId int [pk, increment]
  productId int [not null, ref: > product.productId]
  amount int [not null]
  reason InventoryLossReason [not null]
  observation varchar(255)
  registrarionDate timestamp [default: `CURRENT_TIMESTAMP`, not null]

  Note: 'CHECK (amount > 0)'
}

Table apiError {
  apiErrorId int [pk, increment]
  typeError varchar(100) [not null]
  errorMessage text [not null]
  stackTrace text
  registrationDate datetime [default: `CURRENT_TIMESTAMP`]
}

Table connectionLog {
  connectionLogId int [pk, increment]
  ipAddress varchar(45) [not null]
  httpMethod HttpMethod [not null]
  endpoint varchar(255) [not null]
  statusCode int [not null]
  responseTimeMs int
  responseSizeBytes int
  requestBody json
  responseBody json
  registrationDate datetime [default: `CURRENT_TIMESTAMP`]
  apiErrorId int [unique, ref: > apiError.apiErrorId]

  Note: 'CHECK (statusCode <= 599)'
}
