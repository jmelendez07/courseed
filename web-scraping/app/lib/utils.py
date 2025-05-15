import re
from pathlib import Path
from urllib.request import urlretrieve
import uuid
from html.parser import HTMLParser

class HTMLCleaner(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []

    def handle_data(self, data):
        self.text.append(data)

    def get_clean_text(self):
        return ''.join(self.text).strip()

def clean_html(raw_html: str) -> str:
    cleaner = HTMLCleaner()
    cleaner.feed(raw_html)
    return cleaner.get_clean_text()

def uploadFile(file_url: str, folder_name: str):
        try:
            base_path = Path(__file__).resolve().parent.parent.parent.parent / "backend" / "uploads" / folder_name
            base_path.mkdir(parents=True, exist_ok=True)

            file_extension = file_url.split(".")[-1]
            file_name = f"{uuid.uuid4()}.{file_extension}"
            file_path = base_path / file_name

            urlretrieve(file_url, file_path)

            relative_path = str(Path("uploads") / folder_name / file_name).replace("\\", "/")
            return relative_path
        except Exception as e:
            print(f"Error uploading file: {e}")
            return None


def standarize_modality(modality):
    if not modality or modality.strip() == "":
        return "sin modalidad"
    
    modality_lower = modality.strip().lower()
    
    if any(keyword in modality_lower for keyword in [
        "hibrid", "blended", "mixt", "semipresencial", 
        "presencial con sesiones remotas", "presencial - sesiones remotas", 
        "presencial y virtual"
    ]):
        return "hibrido"
    
    if any(keyword in modality_lower for keyword in [
        "presencial", "asistencia personal", "campus ternera", "edad mínima"
    ]):
        return "presencial"
    
    if any(keyword in modality_lower for keyword in [
        "virtual", "online", "teams", "zoom", "webex", 
        "remota con sesiones"
    ]):
        return "virtual"
    
    if any(keyword in modality_lower for keyword in [
        "distancia", "remot", "a distancia", 
        "último modulo presencial", "último fin de semana presencial"
    ]):
        return "a distancia"
    
    return "sin modalidad"

def standarize_duration(duration):
    if not duration or duration.strip() == "":
        return 40

    pattern = re.compile(r"(\d+(?:\.\d+)?)\s*(horas|hrs|h)", re.IGNORECASE)
    match = pattern.search(duration)
    
    if match:
        hours = match.group(1)
        return int(float(hours))
    
    return 20

def standarize_category(category):
    category = category.strip().lower()
    
    if re.search(r"(arquitectura y dis[e|e][n|ñ]o)", category):
        return "arquitectura"
    
    if re.search(r"(artes|artes y humanidades|ciencias humanas|humanidades)", category):
        return "artes y humanidades"
    
    if re.search(r"(centro interdisciplinario de estudios sobre desarrollo|ciencias sociales|ciencias sociales y humanidades)", category):
        return "ciencias sociales"
    
    if re.search(r"(ciencias de la educacion|educacion)", category):
        return "ciencias de la educacion"
    
    if re.search(r"(ciencias de la salud|enfermeria|medicina|odontologia|psicologia|quimica y farmacia)", category):
        return "ciencias de la salud"
    
    if re.search(r"(ciencias|ciencias basicas)", category):
        return "ciencias"
    
    if re.search(r"(ciencias juridicas|derecho|derecho canonico|escuela de negocios leyes y sociedad)", category):
        return "derecho"
    
    if re.search(r"(ciencias politicas y relaciones internacionales|escuela de gobierno alberto lleras camargo|escuela de gobierno y etica publica)", category):
        return "ciencias politicas"
    
    if re.search(r"(comunicacion y lenguaje)", category):
        return "comunicacion y lenguaje"
    
    if re.search(r"(diseño e ingenieria|ingenieria)", category):
        return "ingenieria"
    
    if re.search(r"(estudios ambientales y rurales|instituto ideeas|instituto pensar|vicerrectoria de investigacion y creacion)", category):
        return "ambiental"
    
    if re.search(r"(filosof[i|í]a|teolog[i|í]a)", category):
        return "filosofia"
    
    if re.search(r"(nutricion y dietetica)", category):
        return "nutricion y dietetica"
    
    if re.search(r"(econom[i|í]a|empresariales|administrativas|negocios|finanzas)", category):
        return "ciencias economicas"
    
    if re.search(r"(direccion de internacionalizacion)", category):
        return "direccion de internacionalizacion"
    
    return "sin categoría"