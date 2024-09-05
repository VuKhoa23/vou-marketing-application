### Base path: /api/admin
POST/auth/register - Request : {username: $username, password: $password}
POST/auth/login - Request : {username: $username, password: $password}

GET/brand-management/get-all
Get all brands information
POST/brand-management/create - Request : {username: $string, password: $string, category: $string, state: $bool}
Create a brand
POST/brand-management/disable/:brandId
Disable a brand
POST/brand-management/enable/:brandId
Enable a brand