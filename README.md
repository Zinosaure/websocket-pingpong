# websocket-pingpong
## Installation steps

sudo apt-get update
sudo apt-get upgrade

sudo apt-get install python3-pip
python3.7 -m pip install pip --upgrade
python3.7 -m pip install pipenv

pipenv install --python 3.7
pipenv shell

pip install fastapi 
pip install uvicorn 
pip install uvicorn[standard]
pip install jinja2

cd src/
uvicorn main:app --reload