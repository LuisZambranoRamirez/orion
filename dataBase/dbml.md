# Modelo de Base de Datos - Apolo

Este es el esquema de la base de datos en formato **DBML**, compatible con [dbdiagram.io](https://dbdiagram.io/d).

```dbml
Project apolo {
  database_type: "MySQL"
}

Table product {
  productId int [pk, increment, not null]
  name varchar(50) [not null, unique]
  price decimal(6,2) [not null]
  stock int [not null]
  barCode varchar(13) [not null, unique]
  category enum('alimentos','bebidas','aseo','otros') [not null]
  registrarionDate timestamp [not null, default: `CURRENT_TIMESTAMP`]

  Note: 'CHECK (price > 0), CHECK (CHAR_LENGTH(barCode) = 13)'
}

Table productPriceHistory {
  productPriceHistoryId int [pk, increment, not null]
  productId int [not null]
  price decimal(6,2) [not null]
  registrarionDate timestamp [not null, default: `CURRENT_TIMESTAMP`]

  Note: 'CHECK (price > 0)'
}

Table stockEntry {
  stockEntryId int [pk, increment, not null]
  productId int [not null]
  supplier varchar(50)
  registrarionDate timestamp [not null, default: `CURRENT_TIMESTAMP`]
  price decimal(6,2) [not null]
  amount int [not null]

  Note: 'CHECK (price > 0), CHECK (amount > 0)'
}

Table sale {
  saleId int [pk, increment, not null]
  total decimal(6,2) [not null]
  customerName varchar(50)
  registrarionDate timestamp [not null, default: `CURRENT_TIMESTAMP`]

  Note: 'CHECK (total > 0)'
}

Table saleDetail {
  saleDetailId int [pk, increment, not null]
  saleId int [not null]
  productId int [not null]
  amount int [not null]
  priceUnit decimal(6,2) [not null]

  Note: 'CHECK (amount > 0), CHECK (priceUnit > 0)'
}

Ref: product.productId < productPriceHistory.productId
Ref: product.productId < stockEntry.productId
Ref: product.productId < saleDetail.productId
Ref: sale.saleId < saleDetail.saleId
