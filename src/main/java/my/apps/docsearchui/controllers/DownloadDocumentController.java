package my.apps.docsearchui.controllers;

import my.apps.docsearchui.data.resource.Resource;
import my.apps.docsearchui.service.DocumentSearchService;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
@RequestMapping("/download")
public class DownloadDocumentController {

    @Autowired(required = true)
    private DocumentSearchService searchService;

    @RequestMapping( method = RequestMethod.GET )
    public void downloadDocument(@RequestParam("id") String id, @RequestParam("query") String query,
                                 HttpServletResponse response) throws IOException {
        Resource resource = searchService.loadDocument(id, query);

        response.setContentType(resource.getContentType());
        response.setHeader("Content-Disposition", "attachment; filename=\"" + resource.getFilename() + "\"");
        IOUtils.copy(resource.getInputStream(), response.getOutputStream());
    }
}
