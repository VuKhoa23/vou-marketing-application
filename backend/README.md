# Admin
## Authentication
- POST/api/admin/auth/register - Request : {username: $username, password: $password}
- POST/api/amdin/auth/login - Request : {username: $username, password: $password}
# Brand
## Auth API
| Method | Route     | Input _______________________                                                           | Output _______________________                          | Error                                          | Description              
|--------|-----------|-----------------------------------------------------------------|-------------------------------------------------------|------------------------------------------------|--------------------------|
| POST   | /api/brand/auth/register | {<br>"name": String<br>"password": String<br>"confirmation": String<br>"category": String<br>"longitude": String<br>"latitude": String<br>} | "Brand registered successfully!!" <br> - *HTTP Status: 200* | 400 BAD REQUEST WITH MESSAGE | Register brand |
| POST   | /api/brand/auth/login | {<br>"name": String<br>"password": String<br>} | {<br>"accessToken": Token <br> "tokenType": "Bearer " <br> "message": "Success" <br>} - *HTTP Status: 200* | 400 BAD REQUEST WITH MESSAGE | Login brand |

## Brand API
- GET/api/brand/findAll

## Event API
- GET/api/brand/event/findAll
- POST/api/brand/event/add - Request: {brandId: long, fileURL: multipart file, name: string, voucherQuantities: int, startDate: Date, endDate: Date}
- POST/api/brand/event/update - Request: {eventId: long, fileURL: multipart file, name: string, voucherQuantities: int, startDate: Date, endDate: Date}
- GET/api/brand/event/update/search/findByNameContaining?name={$name}&page={$page}&size={$size}
- POST/api/brand/event/add?brandId={brandId} - Request: {eventImage: multipart file, eventDTO: {name: string, startDate: Date, endDate: Date, isTrivia: bool, isShaking: bool}, voucherImage: multipart file, voucherDTO: {id: string, voucherQuantities: int, value: int, description: string, endDate: Date}}

## Voucher API
- GET/api/brand/event/findAll
- POST/api/brand/event/add - Request: {brandId: long, fileURLQR: multipart file, fileURL: multipart file, name: string, voucherQuantities: int, startDate: Date, endDate: Date}

# User
