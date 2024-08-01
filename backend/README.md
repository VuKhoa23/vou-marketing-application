# Admin

# Brand
## Auth API
| Method | Route     | Input _______________________                                                           | Output _______________________                          | Error                                          | Description              
|--------|-----------|-----------------------------------------------------------------|-------------------------------------------------------|------------------------------------------------|--------------------------|
| POST   | /api/brand/auth/register | {<br>"name": String<br>"password": String<br>"confirmation": String<br>"category": String<br>"longitude": String<br>"latitude": String<br>} | "Brand registered successfully!!" <br> - *HTTP Status: 200* | 400 BAD REQUEST WITH MESSAGE | Register brand |
| POST   | /api/brand/auth/login | {<br>"name": String<br>"password": String<br>} | {<br>"accessToken": Token <br> "tokenType": "Bearer " <br> "message": "Success" <br>} - *HTTP Status: 200* | 400 BAD REQUEST WITH MESSAGE | Login brand |

# User
