
# Frontend Modular Form Creator Assignment


## Running the app:

Run Backend via docker:

`docker compose up -d`

Run frontend:

`npm run dev`

Frontend is avaiable at `http://localhost:5173/`


## Side notes: 

- I'm not sure if this was intended but neither in the task description nor in the API specification  it wasnt specified that "Options" fiels in Project Details is actually Team Members which accept only specified string values and not ANY array of strings. I found the correct values in the backend code and later in the storybook example, but at first I was a bit confused why my random strings gave me an error response.
