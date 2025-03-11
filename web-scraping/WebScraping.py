from app.scraping.targets.Utb import Utb 
from app.scraping.targets.UniAndes import UniAndes
from app.scraping.targets.AutonomaDeOccidente import AutonomaDeOccidente
from app.scraping.targets.Javeriana import Javeriana
from app.scraping.targets.UniAtlantico import UniAtlantico
from app.scraping.targets.UniMagdalena import UniMagdalena
from app.scraping.targets.UniTecnar import UniTecnar
from app.persistence.Database import Database

class WebScraping: 
    @staticmethod
    def main():
        # utb = Utb(url="https://www.utb.edu.co/cursos-diplomados-y-talleres")
        # utb.scrape()

        # uniAndes = UniAndes(url="https://educacioncontinua.uniandes.edu.co/es/programas/nuestros-cursos")
        # uniAndes.scrape()

        # uao = AutonomaDeOccidente(url="https://estudiarvirtual.uao.edu.co/categoria/autogestionado/")
        # uao.scrape()

        javeriana = Javeriana(url="https://educacionvirtual.javeriana.edu.co/prg-api/searchpuj/general-search-program")
        javeriana.scrape()

        # uniAtlantico = UniAtlantico(url="https://www.uniatlantico.edu.co/departamento-de-extension-y-proyeccion-social/diplomados/")
        # uniAtlantico.scrape()

        # uniMagdalena = UniMagdalena(url="https://bloque10.unimagdalena.edu.co/diplomados")
        # uniMagdalena.scrape()

        # uniTecnar = UniTecnar(url="https://www.unitecnar.edu.co/educacion-continuada")
        # uniTecnar.scrape()
        

if __name__ == "__main__":
    Database.connect()
    WebScraping.main()
    Database.disconnect()
