# Queries and mutations

A list of example queries following [GraphQL Formatter](https://jsonformatter.org/graphql-formatter) format.


## Queries

### products

```graphql
#Fetch products with selected fields
query {
  products {
    id
    name
    sku
    price
    amountInStock
    manufacturer {
      id
      name
      contact {
        email
      }
    }
  }
}
```

### product(id: ID!)

```graphql
# Fetch single product by id, with selected fields
query {
  product(id: "68d1ab2bb14ea9bd7bbb9197") {
    id
    name
    sku
    price
    amountInStock
    manufacturer {
      id
      name
      contact {
        name
        email
      }
    }
  }
}
```

### totalStockValue

```graphql
# Fetch total stock value of all products
query {
  totalStockValue
}
```

### totalStockValueByManufacturer

```graphql
# Fetch total stock value by manufacturer
query {
  totalStockValueByManufacturer {
    manufacturer
    totalValue
  }
}
```

### lowStockProducts

```graphql
# Fetch products with stock lower than 10
query {
  lowStockProducts {
    id
    name
    sku
    price
    amountInStock
    manufacturer {
      id
      name
    }
  }
}
```

### criticalStockProducts

```graphql
# Fetch critical stock products (stock lower than 5)
query {
  criticalStockProducts {
    name
    sku
    price
    amountInStock
    manufacturer {
      name
      contact {
        name
        phone
        email
      }
    }
  }
}
```

### manufacturers

```graphql
#Fetch manufacturers with selected fields
query {
  manufacturers {
    id
    name
    description
    country
    address
    website
    contact {
      name
      phone
      email
    }
  }
}
```

## Mutations

### addProduct

```graphql
#Add product
mutation {
  addProduct(input: {
    name: "Test product"
    sku: "EX900"
    description: "Description for testprodukt"
    price: 199.99
    category: "Electronics"
    manufacturer: "68d1ab2bb14ea9bd7bbb9186"
    amountInStock: 50
  }) {
    id
    name
    sku
    price
    amountInStock
    category
    manufacturer {
      id
      name
    }
  }
}
```

### updateProduct

```graphql
#Update product
mutation {
  updateProduct(id: "68d3a592a1c7de459c33624b",
    input: {
      sku: "EX900",
      name: "Test product: edit",
      manufacturer: "68d1ab2bb14ea9bd7bbb9186"
    }) {
    name
    price
    sku
    description
    category
    amountInStock
    manufacturer {
      id
      name
    }
  }
}
```

### deleteProduct

```graphql
# Delete product
mutation {
  deleteProduct(id: "68d242b47a8c33ae958b2e08")
}
```
