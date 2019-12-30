# Seat Saver gRPC

This is an example project that demonstrates how the details of creating and using gRPC under Node.js.

##Installation

**Step 1:** Clone the project from this GitHub repository as follows:

`git clone https://github.com/reselbob/seat-saver-grpc.git`

**Step 2:** Navigate to the project directory:

`cd seat-saver-grpc`

**Step 3:** Install the code dependencies and then start the gRPC server

`npm install`

`export MONGODB_URL=<the_mongodb_url>`

`npm start`

 The application requires
that the location of the MongoDB be assigned according to its URL. That URL needs to be assigned to the 
environment variable, `MONGODB_URL`. Should a valid URL not be assigned to `MONGODB_URL`, the application will NOT
start up.

The application will seed test data when in the MongoDB database when it initializes. Thus, the application might
take a few minutes to start up initially.

**Step 4:** After the application starts, run the unit tests

`npm test`

## Types
The project is a gRPC API that allows users to RESERVE, BUY or RELEASE a seat in a particular venue. The gRPC
API exposes the following functions:

```grpc
GetVenues(Authentication) returns (stream Venue) {}
GetVenue(VenueRequest) returns (Venue) {}
GetSeats(VenueRequest) returns (stream Seat) {}
GetSeat(SeatRequest) returns (Seat) {}
ReserveSeat(SeatStatusRequest) returns (Seat) {}
ReleaseSeat(SeatStatusRequest) returns (Seat) {}
BuySeat(SeatStatusRequest) returns (Seat) {}
Ping(PingRequest) returns (PingResponse) {}
PingStream(PingRequest) returns (stream PingResponse) {}
```

You view the definitions of the types in the proto file found [here](./proto/seatsaver.proto).

