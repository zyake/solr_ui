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
import java.net.URLEncoder;

@Controller
@RequestMapping("/download")
public class DownloadDocumentController {

    @Autowired(required = true)
    private DocumentSearchService searchService;

    @RequestMapping( method = RequestMethod.GET )
    public void downloadDocument(@RequestParam("id") String id, @RequestParam("query") String query,
                                 HttpServletResponse response) throws IOException {
        Resource resource = searchService.loadDocument(id, query);

        response.setContentType(resource.getContentType() + ";charset=utf-8");

        String contentDisposition = "attachment; filename*=utf-8'ja'"+URLEncoder.encode(resource.getFilename(), "UTF8");
        response.setHeader("Content-Disposition", contentDisposition);
        IOUtils.copy(resource.getInputStream(), response.getOutputStream());
    }
}
