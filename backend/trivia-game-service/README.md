# Trivia Game APIs - Response codes: 200 is success, 40* is failed
## For games
- game model {id, event_id, start_time}
- POST/api/game - Request : {event_id: $, start_time: $}
  - Create a game with event id and start time (format "yyyy-mm-dd hh:MM:ss")
- PUT/api/game - Request : {id: $, event_id?: $,start_time: $}
  - Edit a game, you can edit event id (optional) or start time (This API is created to update start time)
- GET/api/game/by-event/:eventId
  - Return the game(s) of an event
- GET/api/game/:id
  - Get a specific game
## For questions