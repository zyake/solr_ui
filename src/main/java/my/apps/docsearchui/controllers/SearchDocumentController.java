package my.apps.docsearchui.controllers;

import my.apps.docsearchui.data.search.SearchRequest;
import my.apps.docsearchui.data.search.SearchResult;
import my.apps.docsearchui.service.DocumentSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@RequestMapping("/search")
public class SearchDocumentController {

    @Autowired(required = true)
    private DocumentSearchService searchService;

    @RequestMapping( method = RequestMethod.POST, consumes = "application/json")
    public ModelAndView searchDocument(@RequestBody SearchRequest searchRequest, HttpServletResponse response) throws IOException {
        SearchResult searchResult = searchService.searchDocuments(searchRequest);
        response.setHeader("Search-Phrase", searchRequest.getPhrase());
        response.setHeader("Search-Initialized", Boolean.toString(searchRequest.isInitialized()));
        response.setHeader("Content-Count", Integer.toString(searchResult.getDocuments().size()));
        response.setHeader("Content-Found", Integer.toString(searchResult.getNumFound()));
        response.setHeader("Search-Time", Integer.toString(searchResult.getTimeMillsec()));

        ModelAndView modelAndView = new ModelAndView("documents")
                .addObject("documents", searchResult.getDocuments())
                .addObject("query", searchRequest.getPhrase());

        return modelAndView;
    }
}
