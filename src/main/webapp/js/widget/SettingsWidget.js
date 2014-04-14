var SETTINGS_URL = "/solr_ui/apps/settings";

SettingsWidget = Object.create(Widget, {
    componentDefs : { value : {
        settingsForm : {
            target : SettingsForm,
            arg : { rootQuery : ".settingsForm" }
        },
        settingsRetrieveModel : {
            target : AbstractionProxy,
            arg : {
                reqResMap : Maps.putAll(Id.START, Id.LOAD),
                resHandler : AbstractionProxy.AS_TEXT,
                url : SETTINGS_URL
            }
        },
        settingsUpdateModel : {
            target : AbstractionProxy,
            arg : {
                reqResMap : Maps.putAll(Id.LOAD, Id.LOAD),
                resHandler : AbstractionProxy.AS_TEXT,
                method : "POST",
                url : SETTINGS_URL
            }
        },
        compositeModel : {
            target : CompositeModel,
            ref : { models : [ "settingsRetrieveModel", "settingsUpdateModel" ] }
        }
    }},
    controlDefs : { value : {
        settingsControl : {
            target : Control,
            ref : { presentation : "settingsForm", abstraction : "compositeModel" }
        }}
    }
});