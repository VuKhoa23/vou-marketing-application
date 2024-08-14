# Brand management - internal service
- GET/api/brand-management/get-all
    - Get all brands information
- POST/api/brand-management/create - Request : {username: $string, password: $string, category: $string, state: $bool}
    - Create a brand
- POST/api/brand-management/disable/:brandId
    - Disable a brand
- POST/api/brand-management/enable/:brandId
    - Enable a brand