package my.apps.docsearchui.controllers;

import my.apps.docsearchui.domain.Facet;
import my.apps.docsearchui.service.DocumentSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
@RequestMapping("/facets")
public class GetFacetsController {

    @Autowired(required = true)
    private DocumentSearchService searchService;

    @RequestMapping( method = RequestMethod.GET )
    public ModelAndView getFacets() {
        List<Facet> facets = searchService.getFacets();

        return new ModelAndView("facets", "facets", facets);
    }
}
