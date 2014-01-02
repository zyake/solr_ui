package my.apps.docsearchui.controllers;

import my.apps.docsearchui.data.search.SearchResult;
import my.apps.docsearchui.service.DocumentSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/search")
public class SearchDocumentController {

    @Autowired(required = true)
    private DocumentSearchService searchService;

    @RequestMapping( method = RequestMethod.GET )
    public ModelAndView searchDocument(@RequestParam("query") String query,
                                       @RequestParam("start") int start, @RequestParam("rows") int rows,
                                       @RequestParam(value = "fq", required = false) String[] fqueries,
                                       HttpServletResponse response) {
        SearchResult searchResult = searchService.searchDocuments(query, start, rows, fqueries);
        response.setHeader("Content-Count", Integer.toString(searchResult.getDocuments().size()));
        response.setHeader("Content-Found", Integer.toString(searchResult.getNumFound()));
        response.setHeader("Search-Time", Integer.toString(searchResult.getTimeMillsec()));

        ModelAndView modelAndView = new ModelAndView("documents")
        .addObject("documents", searchResult.getDocuments())
        .addObject("query", query);

        return modelAndView;
    }
}
