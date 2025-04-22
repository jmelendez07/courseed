package com.api.flux.courseed.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.repositories.CategoryRepository;
import com.api.flux.courseed.projections.dtos.CategoryDto;
import com.api.flux.courseed.projections.mappers.CategoryMapper;
import com.api.flux.courseed.services.interfaces.InterfaceCategoryService;
import com.api.flux.courseed.web.exceptions.CustomWebExchangeBindException;

import reactor.core.publisher.Mono;

@Service
public class CategoryService implements InterfaceCategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public Mono<Page<CategoryDto>> getAllCategories(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        return categoryRepository.findAllBy(pageable)
            .map(categoryMapper::toCategoryDto)
            .collectList()
            .zipWith(categoryRepository.count())
            .map(p -> new PageImpl<>(p.getT1(), pageable, p.getT2()));
    }

    @Override
    public Mono<CategoryDto> getCategoryById(String id) {
        return categoryRepository.findById(id)
            .map(categoryMapper::toCategoryDto)
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "categoryId", 
                    "No hemos podido encontrar la categoría indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            );
    }

    @Override
    public Mono<CategoryDto> getCategoryByName(String name) {
        return categoryRepository.findByName(name)
            .map(categoryMapper::toCategoryDto)
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    name, 
                    "name", 
                    "No hemos podido encontrar la categoría indicada por su nombre. Te sugerimos que verifiques y lo intentes nuevamente."
                ).getWebExchangeBindException()
            ));
    }

    @Override
    public Mono<Boolean> deleteCategory(String id) {
        return categoryRepository.findById(id)
            .flatMap(category -> 
                categoryRepository.deleteById(id)
                    .then(Mono.just(true))
            )
            .switchIfEmpty(Mono.error(
                new CustomWebExchangeBindException(
                    id, 
                    "categoryId", 
                    "No hemos podido encontrar la categoría indicada. Te sugerimos que verifiques la información y lo intentes de nuevo."
                ).getWebExchangeBindException())
            );
    }

    public String standarizeCategory(String categoryName) {
        // Normalizar: quitar espacios extras y convertir a minúsculas para comparación sin distinción de mayúsculas
        String category = categoryName.trim().toLowerCase();
        
        // arquitectura (Rojo)
        if (category.matches(".*(arquitectura y dis[e|e]ño).*")) {
            return "arquitectura";
        }
        
        // artes y humanidades (azul petroleo)
        if (category.matches(".*(artes|artes y humanidades|ciencias humanas|humanidades).*")) {
            return "artes y humanidades";
        }
        
        // ciencias sociales (celeste)
        if (category.matches(".*(centro interdisciplinario de estudios sobre desarrollo|ciencias sociales|ciencias sociales y humanidades).*")) {
            return "ciencias sociales";
        }
        
        // ciencias de la educacion (lila)
        if (category.matches(".*(ciencias de la educacion|educacion).*")) {
            return "ciencias de la educacion";
        }
        
        // ciencias de la salud (fucsia)
        if (category.matches(".*(ciencias de la salud|enfermeria|medicina|odontologia|psicologia|quimica y farmacia).*")) {
            return "ciencias de la salud";
        }
        
        // ciencias (verde claro)
        if (category.matches(".*(ciencias|ciencias basicas).*")) {
            return "ciencias";
        }
        
        // derecho (verde oscuro)
        if (category.matches(".*(ciencias juridicas|derecho|derecho canonico|escuela de negocios leyes y sociedad).*")) {
            return "derecho";
        }
        
        // ciencias politicas (naranja)
        if (category.matches(".*(ciencias politicas y relaciones internacionales|escuela de gobierno alberto lleras camargo|escuela de gobierno y etica publica).*")) {
            return "ciencias politicas";
        }
        
        // comunicacion y lenguaje (gris)
        if (category.matches(".*(comunicacion y lenguaje).*")) {
            return "comunicacion y lenguaje";
        }
        
        // ingenieria (amarillo)
        if (category.matches(".*(diseño e ingenieria|ingenieria).*")) {
            return "ingenieria";
        }
        
        // ambiental (negro)
        if (category.matches(".*(estudios ambientales y rurales|instituto ideeas|instituto pensar|vicerrectoria de investigacion y creacion).*")) {
            return "ambiental";
        }
        
        // filosofia (rojo oscuro)
        if (category.matches(".*(filosof[i|í]a|teolog[i|í]a).*")) {
            return "filosofia";
        }
        
        // nutricion y dietetica (blanco)
        if (category.matches(".*(nutricion y dietetica).*")) {
            return "nutricion y dietetica";
        }
        
        // ciencias economicas (violeta)
        if (category.matches(".*(econom[i|í]a|empresariales|administrativas|negocios|finanzas).*")) {
            return "ciencias economicas";
        }

        // direccion de internacionalizacion (marron)
        if (category.matches(".*(direccion de internacionalizacion).*")) {
            return "direccion de internacionalizacion";
        }
        
        // Si ninguno de los anteriores coincide, devuelve "none"
        return "none";
    }
}
