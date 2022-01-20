from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates


app = FastAPI()
app.mount("/public", StaticFiles(directory="public"), name="public")
templates = Jinja2Templates(directory="application/templates")


@app.get("/", response_class=HTMLResponse)
async def get(request: Request):
    return templates.TemplateResponse("base_template.html", {"request": request})
