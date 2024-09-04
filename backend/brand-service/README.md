# Brand
## Auth API
| Method | Route     | Input _______________________                                                           | Output _______________________                          | Error                                          | Description              
|--------|-----------|-----------------------------------------------------------------|-------------------------------------------------------|------------------------------------------------|--------------------------|
| POST   | /api/brand/auth/login | {<br>"name": String<br>"password": String<br>} | {<br>"accessToken": Token <br> "tokenType": "Bearer " <br> "message": "Success" <br>} - *HTTP Status: 200* | 400 BAD REQUEST WITH MESSAGE | Login brand |

## Brand API
- GET/api/brand/find-all
- GET/api/brand/get-game
- POST/api/brand/create-game - Request{
    "event_id": 2,
    "start_time": "2024-09-15 10:01:01",
    "type": "trivia"
}

- POST/api/brand/create-question-with-answers - Request{
    "questionDTORequest": {
        "game_id": "66d476957adffaa3e8a00015",
        "title": "What is the capital of France?"
    },
    "answers": [
        {
            "content": "Paris",
            "truthy": true
        },
        {
            "content": "London",
            "truthy": false
        },
        {
            "content": "Berlin",
            "truthy": false
        }
    ]
}


## Event API
- GET/api/brand/event/find-all
- GET/api/brand/event/update/search/findByNameContaining?name={$name}&page={$page}&size={$size}
- POST/api/brand/event/add?brandId={brandId} - Request: {eventImage: multipart file, eventDTO: {name: string, startDate: Date, endDate: Date, isTrivia: bool, isShaking: bool}, voucherImage: multipart file, voucherDTO: {id: string, voucherQuantities: int, value: int, description: string, endDate: Date}}
- GET/api/brand/event/events-and-vouchers?brandId={brandId}
- GET/api/brand/event/find?id={id}
- POST/api/brand/event/find-by-ids - Request {
    "ids": [1, 2, 7]
}
