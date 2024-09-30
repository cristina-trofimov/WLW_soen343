## Steps to follow for installation

1. Please ensure that you have both _Python_ and _Node.js_ installed on your machine.
2. Clone the repo to your local device

The commands presented in this document are for windows users. For Mac users, please replace `python` with `python3` and `pip` with `pip3`. <br>
If your `pip` command is not working try `python -m pip install`

### Backend

There are two main directories in the project, `backend` and `frontend`. They are both places in the `\root` directory of the project.

⚠️The first two steps are for activating the venv for a clean environment. <br>
⚠️These steps should be done in the `\root` directory of the project to ensure an isolated environment for the whole project.

1. Create a virtual environment : 
```
python -m venv venv
```
2. Activate the virtual environment : 
```
venv\Scripts\activate
```
3. Navigate to the backend directory : 
```
cd backend
```
4. Command to run the installation of the necessary python modules : 
```
pip install -r requirements.txt
```
5. Navigate to the [Redux instalation](https://github.com/MicrosoftArchive/) github repo and download the the Redis application corresponding to your OS. Make sure to add the Redux directory to your PATH environment variable during installation. <i>The port for the Redux server is set to `6379`</i>. If it is different for you, please set it to the correct port when installing the Redis server.
6. To verify that the Redis server is running, open a new terminal and run the command `redis-cli`. If the server is running, you should see command input with the host and the corresponding port. If there are any issues, it is most likely that your environment variables are not set correctly.
7. To verify that the Redis server is responsive write `PING` and press enter. If the server is running correctly, you should see `PONG` as a response.
8. To exit the Redis server, write 
```
exit
``` 
9. To run the backend : 
```
python app.py
```

### Frontend

1. Navigate to the frontend directory : 
```
cd frontend
```
2. Run 
```
npm install
```
3. Install necessary packages : 
```
npm install react-router-dom
```
```
npm install --save-dev @types/react-router-dom
```
```
npm install axios
```
```
npm install @mantine/core @mantine/hooks
```

4. To run the frontend : 
```
npm run dev
```


## Code Organization

### Frontend

The directory `frontend/public` will be the directpry that stores any images, svgs, etc.
The directory `frontend/src/components` will store all the components that are used in the frontend.
The directory `frontend/src/api` will store the api calls that are made to the backend. These function will ten be called in the components.

- when implementing an api call funtion the backend api endpoints and their correcponding implementation can be found in the `backend/main.py` file. 


## Extra Information

### Backend

### Frontend

1. Install the `ES7+ React/Redux/React-Native snippets` extention in VSCode to use snippets for faster development. When creating a new component, you can use the `rfce` snippet to create a functional component with the necessary imports.
