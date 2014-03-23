
package my.apps.docsearchui.controllers;

import my.apps.docsearchui.config.Configuration;
import my.apps.docsearchui.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("/settings")
public class SettingsController {

    @Autowired(required = true)
    private SettingsService service;

    @RequestMapping( method = RequestMethod.GET )
    public ModelAndView getSettings() {
        List<Configuration> settings = service.getSettings();

        return new ModelAndView("settings")
                .addObject("settings", settings);
    }

    @RequestMapping( method = RequestMethod.POST )
    public ModelAndView updateSettings(@RequestBody Configuration[] settings) {
        List<Configuration> newSettings = service.updateSettings(Arrays.asList(settings));

        return new ModelAndView("settings")
                .addObject("settings", newSettings);
    }
}
