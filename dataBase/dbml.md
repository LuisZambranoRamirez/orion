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
  Perdido
  Comsumo
  Otro
}

Enum HttpMethod {
  GET
  POST
  PUT
  DELETE
  PATCH
}

table productoGainAmountHistory {
  productoGainAmountHistoryId int [pk, increment]
  productNameId varchar(50) [not null, ref: > product.productNameId]
  gainAmount decimal(10,2) [not null]
  registrarionDate timestamp [default: `CURRENT_TIMESTAMP`, not null]
}

table supplier {
  supplierNameId varchar(50) [pk]
  ruc varchar(11) unique
  phone varchar(9)

  Note: 'CHECK (CHAR_LENGTH(phone) = 9) AND CHECK (CHAR_LENGTH(ruc) = 11)'
}

table customer {
  customerNameId varchar(50) [pk]
  phone varchar(9) [unique]

  Note: 'CHECK (CHAR_LENGTH(phone) = 9)'
}

Table product {
  productNameId varchar(50) [pk]
  gainAmount decimal(10,2) [not null]
  stock int [not null]
  reorderLevel int
  barCode varchar(13) [unique]
  saleMode SaleMode [not null]
  category ProductCategory [not null]
  registrarionDate timestamp [default: `CURRENT_TIMESTAMP`, not null]
  
  Note: 'CHECK (gainAmount > 0) and CHAR_LENGTH(barCode) = 13'
}

Table stockEntry {
  stockEntryId int [pk, increment]
  productNameId varchar(50) [not null, ref: > product.productNameId]
  supplierNameId varchar(50) [not null, ref: > supplier.supplierNameId] 
  registrarionDate timestamp [default: `CURRENT_TIMESTAMP`, not null]
  priceUnit decimal(10,2) [not null]
  amount int [not null]

  Note: 'CHECK (priceUnit > 0 AND amount > 0)'
}

Table sale {
  saleId int [pk, increment]
  customerNameId varchar(50) [not null, ref: > customer.customerNameId]
  total decimal(10,2) [not null]
  registrarionDate timestamp [default: `CURRENT_TIMESTAMP`, not null]

  Note: 'CHECK (total >= 0) '
}

Table pay {
  payId int [pk, increment]
  saleId int [not null, ref: > sale.saleId]
  amount decimal(10,2) [not null]
  registrarionDate timestamp [default: `CURRENT_TIMESTAMP`, not null]

  Note: 'CHECK (total > 0)'
}

Table saleDetail {
  saleDetailId int [pk, increment]
  saleId int [not null, ref: > sale.saleId]
  productNameId varchar(50) [not null, ref: > product.productNameId]
  amount int [not null]
  priceUnit decimal(10,2) [not null]

  Note: 'CHECK (amount > 0) AND CHECK (priceUnit > 0)'
}

Table inventoryLoss {
  inventoryLossId int [pk, increment]
  productNameId varchar(50) [not null, ref: > product.productNameId]
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