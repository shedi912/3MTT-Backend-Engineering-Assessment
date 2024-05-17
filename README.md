# Github Profile

This api is a demonstration of how to create a blog related api. Any authenticated user can create, edit, and delete a blog. Also users can read all published blogs

## Features
- User sign Up
- User login
- Displaying a list of published blogs
- View details of published blog
- Adding new blog
- login users can viewing and editing their blogs
- delete a blog

## Installation
To test locally, 
1. clone the repository
2. run: 'npm install' from command line to install all dependencies. 
3. Download and install mongodb community edition

## Configuration
1. create a .env file in the api root folder and passed in the below settings
PORT = 3000
CONNECTION_STRING = 'add your mongodb connection string here'
ACCESS_TOKEN_SECRET = "generate any character that can serve as secret key"
2. Run: 'npm run dev' from the command to startup local http server

## Endpoints
1. https://shedrack-3mtt-backend-assessment.onrender.com/api/users/signup :create a new user account
method: POST
    {
  "email": "example@gmail.com",
  "first_name": "example",
  "last_name": "example lastname",
  "password": "your login password"
}
2. https://shedrack-3mtt-backend-assessment.onrender.com/api/users/signin : login to perform user related task e.g add new blog
method: POST
{
  "email": "example@gmail.com",
  "password": "your login password"
}

3. https://shedrack-3mtt-backend-assessment.onrender.com/api/blog/article/new : Add new article
    method:POST
    Authorization: "Bearer follow by access token"
{
  "title": "My journey in tech part 4",
  "description": "God help all along",
  "author": "Shedrack",
  "tags": "Tech, web development",
  "body": "My journey in tech can be described as a gracefulled one. "
}
4. https://shedrack-3mtt-backend-assessment.onrender.com/api/blog/article/list?page=1&per_page=20&search=author,shedrack&sortby=title,1 : get list of published blogs
method:GET

this endpoint returns totalArticles so frontend can build pagination system
5. https://shedrack-3mtt-backend-assessment.onrender.com/api/blog/article/12 : get artcile 12 details; note 12 is the id of the article you want to retreive the detals
Method: GET

6. https://shedrack-3mtt-backend-assessment.onrender.com/api/blog/article/publish/12: publish an article with an id 12
Method: PUT
Authorization: "Bearer follow by access token"

7. https://shedrack-3mtt-backend-assessment.onrender.com/api/blog/article/update/12 : update details of an article having id 12
Method: PUT
Authorization: "Bearer follow by access token"
{
  "title": "Hello world edited",
  "description": "Gods help all along",
  "author": "Shedrack",
  "tags": "First post",
  "body": "This is a post about hello world. God made the entire world in 6 days and on the 7th day, he rested. and then instructed us to keep that day and make it holy."
  
}

8. https://shedrack-3mtt-backend-assessment.onrender.com/api/blog/article/delete/12: delete an article having id 12
Method: DELETE
Authorization: "Bearer follow by access token"

9. https://shedrack-3mtt-backend-assessment.onrender.com/api/blog/owner_article/list?page=1&per_page=1&state='draft' : Get a list of blogs that belong to the current login user
Method: GET
Authorization: "Bearer follow by access token"

## Usage
Call any of the endpoint that relates to the operation you want to perform.
Note all endpoint except signup, signin, list published blog, and published details, all required that a user must be login and access token included when making call to the endpoints passing authorization token through headers


## License

free for use and to be built upon

## Acknowledgements

ALT School Africa intermediate frontend engineering assessment.
All requirement from them

