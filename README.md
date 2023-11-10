### A. Client

### 1) cd Frontend

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:4000](http://localhost:4000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

Remember to go to Frontend/src/APIs/ServerAPI/BaseServerApi.js to change the IP of Backend server

## 2) cd p2p

### `npm run dev`

This line will run client's server in port 8080. After that it will create a TCP server on port 3000 for exchanging metadate. It also creates a TCP server for file exchange on port 3001

## B. Server

## 1) cd Backend

### `npm run dev`

This line will run the server on port 8080
Then go to 'cmd' and run 'ipconfig' and give client your IP LAN address