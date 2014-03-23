SettingsWidgetFactory = function(id, elem, repository) {
    var SETTINGS_URL = "/solr_ui/apps/settings";
    var widget = Widget.create(id, elem, repository)
    .defineComponents({
        settingsForm: function(id, elem) { return SettingsForm.create(elem.querySelector(".settingsForm"), id); },
        settingsRetrieveModel: function(id) {
            var reqResMap = {};
            reqResMap[Id.start()] = Id.load();
            var model =  AbstractionProxy.create(id, reqResMap, SETTINGS_URL);
            model.resHandler = AbstractionProxy.AS_TEXT;

            return model;
        },

        settingsUpdateModel: function(id) {
            var reqResMap = {};
            reqResMap[Id.load()] = Id.load();
            var model =  AbstractionProxy.create(id, reqResMap, SETTINGS_URL);
            model.resHandler = AbstractionProxy.AS_TEXT;
            model.method = "POST";

            return model;
        },

        compositeModel: function(id) {
            return CompositeModel.create(id, [this.get("settingsRetrieveModel"), this.get("settingsUpdateModel")]);
        }
    })
    .defineControls({
        settingsControl: function(id, widget) {
            var settingsForm = this.get("settingsForm", widget.elem);
            var model = this.get("compositeModel");

            return Control.create(id, widget, settingsForm, model);
        }
    });

    return widget;
}