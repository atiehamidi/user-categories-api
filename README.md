# User Categories API

A simple REST API built with Express.js, TypeScript, and SQLite for managing user categories.

## 🛠️ Technologies Used
- TypeScript
- Express.js
- SQLite3

## 📋 Prerequisites
- Node.js (v14 or higher)
- npm

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/atiehhamidi/user-categories-api.git
   cd user-categories-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

## 📦 API Endpoints 

### POST /users
Create a new user with an email and categories.

Request Body:
json
{

    "email": "test@example.com",
    "categories": [1, 2, 3]
}

Response:
json
{
    "message": "User created successfully"
}

### GET /users/:email
Get a user by email.

Request:
bash
GET /users/test@example.com

Response:
json    
{
    "email": "test@example.com",
    "categories": [1, 2, 3]
}

## 🔑 Running Tests

To run the tests:

bash
npm test

## 📦 Project Structure

src/
├── server.ts # Main server file
├── server.test.ts # Test file
└── types.ts # TypeScript types 

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push to your fork and create a pull request.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
