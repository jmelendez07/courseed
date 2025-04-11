package com.api.flux.courseed.services.implementations;

import java.io.InputStream;
import java.io.ObjectInputStream;
import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.api.flux.courseed.persistence.repositories.CourseRepository;
import com.api.flux.courseed.projections.dtos.CourseDto;
import com.api.flux.courseed.projections.mappers.CourseMapper;
import com.api.flux.courseed.services.interfaces.InterfacePredictionService;

import reactor.core.publisher.Mono;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;
import weka.classifiers.Classifier;
import weka.core.DenseInstance;

@Service
public class PredictionService implements InterfacePredictionService {

    private final Classifier classifier;
    private final Instances datasetStructure;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseMapper courseMapper;

    public PredictionService() throws Exception {
        try (InputStream modelStream = new ClassPathResource("model.j48.model").getInputStream();
             ObjectInputStream ois = new ObjectInputStream(modelStream)) {
            this.classifier = (Classifier) ois.readObject();
        }

        InputStream datasetStream = new ClassPathResource("recomended_courses.arff").getInputStream();
        this.datasetStructure = new DataSource(datasetStream).getDataSet();
        this.datasetStructure.setClassIndex(datasetStructure.numAttributes() - 1);
    }
    
    public Mono<List<CourseDto>> recomendedCourses(Principal principal) {
        return courseRepository.findAll()
            .flatMap(course -> {
                try {
                    Instances instances = new Instances(datasetStructure, 0);
                    double[] values = new double[datasetStructure.numAttributes()];

                    // values[0] = ...;
                    // values[1] = ...;

                    instances.add(new DenseInstance(1.0, values));
                    instances.setClassIndex(datasetStructure.numAttributes() - 1);

                    double prediction = classifier.classifyInstance(instances.firstInstance());

                    if (prediction == 1.0) {
                        CourseDto courseDto = courseMapper.toCourseDto(course);
                        return Mono.just(courseDto);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return Mono.empty();
            })
            .collectList();
    }

}
