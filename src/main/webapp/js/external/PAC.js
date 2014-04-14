"use strict";
/**
 * A proxy of an abstraction.
 *
 * # Basics
 * It is a proxy for an abstraction that resides in an application server.
 * Using json and text interface, the proxy doesn't have to realize
 * the actual implementation of the abstraction.
 *
 * So, you can reuse all of existing resources like JSP based frameworks
 * (Struts, Spring MVC etc...), java code, libraries, and tools.
 *
 * As it adopts the Interceptor design pattern, you can arbitrarily replace
 * object of http request handling and http response handling.
 * - for example
 *  - request -> POST(JSON, FormData, XML), GET(query string) etc...
 *  - response -> TEXT(JSP that are produced by Struts, Spring MVC etc...), JSON etc...
 *
 * If an AbstractionProxy was received a request event,
 * it sends the event as json to an abstraction that
 * resides in a server.
 *
 * # How to use
 * Unlike Presentation, AbstractionProxy is basically usable for most usages.
 * In following example code, an AbstractionProxy object is defined in a Widget definition.
 * Object.create(Widget, {
 *   ...
 *   myModel: {
 *       // Reuse AbstractionProxy
 *       target: AbstractionProxy,
 *
 *       // Define request-response event mapping.
 *       reqResMap: Maps.putAll(
 *           Id.START, Id.LOAD,
 *           Id.CHANGE, Id.LOAD),
 *
 *       // Map a request into a JSON object.
 *       reqHandler: AbstractionProxy.TO_JSON,
 *
 *       // Map a response into a JSON object.
 *       // If you want to use server side template engines (ex. JSP),
 *       // you should specify "AbstractionProxy.AS_TEXT".
 *       resHandler: AbstractionProxy.AS_JSON,
 *
 *       // Specify a destination url.
 *       url: "/api/blogic001"
 *
 *       // Specify a HTTP method.
 *       method: "POST"
 * });
 */
this.AbstractionProxy = {

    AS_JSON : function (xhr) {
        Assert.notNull(this, xhr, "xhr");
        return JSON.parse(xhr.responseText);
    },

    AS_TEXT : function (xhr) {
        Assert.notNull(this, xhr, "xhr");
        return xhr.responseText;
    },

    FOR_JSON : function (obj, xhr) {
        Assert.notNullAll(this, [
            [ obj, "obj" ],
            [ xhr, "xhr" ]
        ]);
        xhr.setRequestHeader("Content-Type", "application/json");
        return JSON.stringify(obj);
    },

    FOR_TEXT : function (obj, xhr) {
        Assert.notNullAll(this, [
            [ obj, "obj" ],
            [ xhr, "xhr" ]
        ]);
        return obj.toString();
    },

    create : function (arg) {
        Assert.notNullAll(this, [
            [ arg.id, "arg.id" ],
            [ arg.reqResMap, "arg.reqResMap" ],
            [ arg.url, "arg.url" ]
        ]);

        var proxy = Object.create(this, {
            id : { value : arg.id },
            reqResMap : { value : arg.reqResMap },
            url : { value : arg.url },
            httpClient : { value : window.HttpClient },
            isRequesting : { value : false, writable: true },
            reqHandler : { value : arg.reqHandler || AbstractionProxy.FOR_JSON, writable : true },
            resHandler : { value : arg.resHandler || AbstractionProxy.AS_JSON, writable : true },
            control : { value : null, writable : true },
            method : { value : arg.method || "GET", writable : true },
            eventBuilder : { value : null, writable : true }
        });
        proxy.eventBuilder = EventBuilder.create(proxy);
        Object.defineProperties(proxy, this.fields || {});
        for ( var key in arg ) {
            proxy[key] == null && (proxy[key] = arg[key]);
        }
        Object.seal(proxy);

        return proxy;
    },

    initialize : function (control) {
        Assert.notNull(this, control, "control");
        this.control = control;
        for ( var key  in this.reqResMap ) {
            this.event().ref().onPresentation()[key.substring(1)](this.notify);
        }
        this.doInitialize();
    },

    /**
     * For internal usage.
     */
    doInitialize : function () {
    },

    event : function () {
        return this.eventBuilder;
    },

    fetch : function (eventKey, args) {
        Assert.notNull(this, args, "args");
        if ( this.isRequesting == true ) {
            return;
        }
        this.isRequesting = true;
        var me = this;
        this.httpClient.send(this.url, function (event) {
            var xhr = event.target;
            me.isRequesting = false;
            if ( me.httpClient.isSuccess(xhr) ) {
                me.successCallback(eventKey, xhr);
            } else {
                me.failureCallback(eventKey, xhr);
            }
        }, args, this.reqHandler, this.method);
    },

    notify : function (event, args) {
        Assert.notNullAll(this, [
            [ event, "event" ],
            [ args, "args" ]
        ]);
        this.fetch(event, args);
    },

    successCallback : function (event, xhr) {
        Assert.notNull(this, event, "event");
        Assert.notNull(this, xhr, "xhr");
        var responseData = this.resHandler(xhr);
        var resKey = this.reqResMap[Id.getAction(event)].substring(1);
        var on = Id.onAbstraction(this);
        this.event().raise()[resKey](responseData);
    },

    failureCallback : function (event, xhr) {
        Assert.notNull(this, event, "event");
        Assert.notNull(this, xhr, "xhr");
        this.event().raise().failure(xhr.responseText);
    },

    toString : function () {
        return "id: " + this.id + ", url: " + this.url;
    }
};

Object.seal(this.AbstractionProxy);
/**
 *  A central repository to manage components.
 *
 *  # Basics
 *  A component can be registered as definition basis, and
 *  the component will be instantiated when it retrieved at first time.
 *  The component instance will be cached in the repository.
 *
 * If you want to refer to other repository managed components,
 * you can refer to them using the "ref" property in the definition.
 *
 * - for example
 * var repository = ComponentRepository.create({ id: "repository1" });
 * repository
 *  .addDefinition({ id: { target: function() { return "ID-1" } } })
 *  .addDefinition({ defaultName: {
 *          target: function(arg) { return arg.id + "-001" },
 *          ref: { id: "id" }
*    });
 *
 * // The value "ID-1-001" will be showed.
 * alert(repository.get("defaultName"));
 *
 * # The specification of the component definition
 *
 * COMPONENT_ID: {
 *  target: TARGET_OBJECT // required. The target object must have a "create" method.
 *  arg: // optional. It is fixed value to pass the "create" method.
 *  { KEY1: VALUE1, KEY2: VALUE2 ... },
 *  ref: // optional. It is used for referring other components. It will be merged into the "arg".
 *  { KEY1: OTHER_COMPONENT_ID1, KEY2: OTHER_COMPONENT_ID2 ... }
 *  scope: request // optional. It specifies component scope. Default is singleton.
 * }
 *
 * # Managing events
 * The central repository also supports hierarchical event propagating mechanism,
 * which can be used to notify an event data to parent repositories that
 * can manage the whole application configuration.
 */
this.ComponentRepository = {

    create : function (arg) {
        Assert.notNull(this, arg.id, "arg.id");

        var repository = Object.create(this, {
            id : { value : arg.id },
            singletons : { value : {} },
            definitions : { value : {} },
            events : { value : {} },
            children : { value : [] },
            routeStack : { value : [] },
            parent : { value : arg.parent }
        });
        Object.defineProperties(repository, this.fields || {});
        for ( var key in arg ) {
            repository[key] == null && (repository[key] = arg[key]);
        }
        Object.seal(repository);
        repository.initialize();

        return repository;
    },

    initialize : function () {
        this.parent != null && this.parent.children.push(this);
    },

    addEventRef : function (id, listener) {
        Assert.notNullAll(this, [
            [id, "id"],
            [listener, "listener"]
        ]);
        this.events[id] || (this.events[id] = []);
        this.events[id].push(listener);

        return this;
    },

    raiseEvent : function (event, caller, arg /* can be null! */) {
        Assert.notNullAll(this, [
            [ event, "event" ],
            [ caller, "caller" ]
        ]);
        var noRefsFound = this.events[event] == null;
        if ( noRefsFound ) {
            return;
        }

        var listeners = this.events[event];
        for ( var key in listeners ) {
            listeners[key].notify(event, arg);
        }

        var parentShouldBeCalled = this.parent != null && this.parent != caller;
        parentShouldBeCalled && this.parent.raiseEvent(event, this, arg);
        for ( var key in this.children ) {
            this.children[key].raiseEvent(event, this, arg);
        }

        return this;
    },

    addDefinition : function (id, def) {
        Assert.notNullAll(this, [
            [ id, "id" ],
            [ def, "def" ]
        ]);

        var targetRequired = def.target == null;
        targetRequired && Assert.doThrow(
            "The definition must have a correct target!: id=" + id + ", definition=" + def);

        var isFactoryFunc = def.target instanceof Function;
        isFactoryFunc && ( def.target = { create: def.target } );

        var isFactoryObject =  def.target instanceof  Object && def.target.create instanceof Function;
        ! isFactoryObject && Assert.doThrow(
            "The definition must have a correct target!: id=" + id + ", definition=" + def);

        this.definitions[id] = def;

        return this;
    },

    get : function (id, arg /* can be null! */) {
        Assert.notNullAll(this, [
            [ id, "id" ]
        ]);

        var recursiveRefFound = this.routeStack.indexOf(id) > -1;
        recursiveRefFound && Assert.doThrow("The recursive reference found: route=" + this.routeStack);

        try {
            this.routeStack.push(id);
            var def = this.definitions[id];
            if ( def != null ) {
                var isSingleton = def.scope === "singleton" || def.scope == null;
                var useCachedInstance = isSingleton && this.singletons[id] != null;
                if ( useCachedInstance ) {
                    return this.singletons[id];
                }

                var mergedArg = {};
                for ( var key in  def.arg ) {
                    mergedArg[key] = def.arg[key];
                }

                for ( var key in def.ref ) {
                    var refId = def.ref[key];
                    var isComposited = refId instanceof Array;
                    if ( isComposited ) {
                        var compositeRefComponent = [];
                        for ( var innerKey in refId ) {
                            var refComponent = this.get(refId[innerKey]);
                            compositeRefComponent.push(refComponent);
                        }
                        mergedArg[key] = compositeRefComponent;
                    } else {
                        var refComponent = this.get(refId);
                        mergedArg[key] = refComponent;
                    }
                }

                for ( var key in arg ) {
                    var passedArg = arg[key];
                    mergedArg[key] = passedArg;
                }

                mergedArg.id = id;
                var component = def.target.create(mergedArg);
                isSingleton && (this.singletons[id] = component);

                return component;
            }

            this.parent == null && Assert.doThrow("target factory not found: id=" + id);
            var component = this.parent.get(id, arg);
            component == null && Assert.doThrow("target factory not found: id=" + id);

            return component;
        } finally {
            this.routeStack.pop();
        }
    },

    toString : function () {
        return "id: " + this.id;
    }
};

Object.seal(this.ComponentRepository);
/**
 * A composition of models.
 *
 * It propagates events into child models.
 */
this.CompositeModel = Object.create(this.AbstractionProxy, {

    fields : { value : { models : { value : null, writable : true } } },

    create : { value : function (arg) {
        Assert.notNullAll(this, [ [ arg.id, "id" ], [ arg.models, "arg.models" ] ]);

        arg.reqResMap = {};
        arg.url = {};
        var model = AbstractionProxy.create.call(this, arg);
        model.models = arg.models;

        return model;
    }},

    doInitialize : { value : function () {
        for ( var key in this.models ) {
            var model = this.models[key];
            model.initialize(this.control);
        }
    }},

    notify : { value : function (event, arg) {
        for ( var key in this.models ) {
            var model = this.models[key];
            model.notify(event, arg);
        }
    }}
});

Object.seal(this.CompositeModel);
/**
 * A control to mediate exchanging data among Presentation, Abstraction, and Widgets.
 *
 * It makes up of a "PAC agent".
 */
this.Control = {

    create : function (arg) {
        Assert.notNullAll(this, [
            [ arg.id, "arg.id" ],
            [ arg.widget, "arg.widget" ],
            [ arg.presentation, "arg.presentation" ],
            [ arg.abstraction, "arg.abstraction" ]
        ]);
        var control = Object.create(this, {
            id : { value : arg.id },
            widget : { value : arg.widget },
            presentation : { value : arg.presentation },
            abstraction : { value : arg.abstraction }
        });
        Object.defineProperties(control, this.fields || {});
        for ( var key in arg ) {
            control[key] == null && (control[key] = arg[key]);
        }
        Object.seal(control);

        return control;
    },

    initialize : function () {
        this.abstraction.initialize(this);
        this.presentation.initialize(this);
        this.doInitialize();
    },

    /**
     * For internal usage.
     */
    doInitialize : function () {
    },

    raiseEvent : function (event, target, args) {
        Assert.notNullAll(this, [
            [ event, "event" ],
            [ target, "target" ] ,
            [ args, "args" ]
        ]);
        this.widget.raiseEvent(event, target, args);
    },

    addEventRef : function (id, eventRef) {
        Assert.notNullAll(this, [
            [ id, "id" ],
            [ eventRef, "eventRef" ]
        ]);
        this.widget.addEventRef(id, eventRef);
    },

    removeEventRef : function (id, eventRef) {
        Assert.notNullAll(this, [
            [ id, "id" ],
            [ eventRef, "eventRef" ]
        ]);
        this.widget.removeEventRef(id, eventRef);
    },

    getElement: function() {
        return this.widget.elem;
    },

    toString : function () {
        return "id: " + this.id;
    }
};

Object.seal(this.Control);
/**
 *  An abstraction of a whole application
 *
 * It can accommodate all widgets that consist of a SPA(Single Page  Application).
 *
 * You can register widget definitions as follows.
 * Application.create({
 *  // Specify an application id.
 *  id: "app1",
 *
 *  // Specify a container element.
 *  appElem:  document.querySelector("#appContainer"),
 *
 *  // Specify widget definitions.
 *  widgetDef: {
 *      search: SearchWidget,
 *      settings: SettingsWidget
 *  }
 * });
 *
 * An "Application" instance uses single "container" element to maintain widgets.
 * So, all of widgets that were loaded will be stored in the "container" element.
 * - for example
 * <!-- An application container element  -->
 * <div id="appContainer">
 *     <!-- The loaded "search" widget-->
 *     <div id="search">...</div>
 *     <!-- The loaded "setting" widget -->
 *     <div id="setting">...</div>
 * </div>
 *
 * By starting an "Application" instance, each widget can be accessed by a hash URL.
 * - for example
 * http://apphost/webapp#widget1 -> widget1
 * http://apphost/webapp#widget2 -> widget2
 *
 * If a hash url has been already specified, it is used for navigation.
 */
this.Application = {

    create : function (arg) {
        Assert.notNullAll(this, [
            [ arg.id, "arg.id" ],
            [ arg.appElem, "arg.appElem" ],
            [ arg.widgetDef, "arg.widgetDef" ]
        ]);
        var app = Object.create(this, {
            id : { value : arg.id },
            centralRepository : { value : ComponentRepository.create({id: "applicationRepository" }) },
            transitionManager : { value : null, writable : true }
        });
        Object.defineProperties(app, this.fields || {});
        Object.seal(app);
        app.initialize(arg.appElem, arg.widgetDef);

        return app;
    },

    initialize : function (appElem, widgetDef) {
        Assert.notNullAll(this, [
            [appElem, "appElem" ],
            [ widgetDef, "widgetDef" ]
        ]);
        for ( var key in widgetDef ) {
            this.centralRepository.addDefinition(key, {
                target: widgetDef[key]
            });
        }
        this.transitionManager = TransitionManager.create({
            containerElem: appElem,
            repository: this.centralRepository});
    },

    start : function (initWidgetId) {
        Assert.notNull(this, initWidgetId, "initWidgetId");
        var me = this;
        window.addEventListener("hashchange", function (event) {
            var hashIndex = location.hash.lastIndexOf("#");
            var newWidgetId = location.hash.substring(hashIndex + 1);
            me.transitionManager.transit(newWidgetId);
        });

        var hasHash = location.hash != "";
        hasHash && ( initWidgetId = location.hash.substring(1) );
        this.transitionManager.transit(initWidgetId);
    }
};

Object.seal(this.Application);
/**
 * A html visual component.
 *
 * It accommodates all of html elements and some states
 * and acts as both View and Control in MVC frameworks.
 * It also provides some useful methods to manipulate DOM elements.
 *
 * The "elem" field is root element of a Presentation and
 * a Presentation expects all of queried elements exist in the "elem".
 * - for example
 * // This method queries on the "elem" field and bind elements into each fields.
 * this.doQueries({ button : ".button", input: ".input" });
 *
 * To send requests to abstractions and receive responses from abstractions,
 * you can use event method.
 * - for example
 * // To send a request to an abstraction
 * this.event().raise().load({ name: "test" });
 * // To receive a response from an abstraction
 * this.event().onAbstraction().change(this.receive); // register a callback method.
 *
 * Because Presentation has no rendering logic,
 * you must extend it and implement own rendering logic.
 * At least, you should override the "doInitialize" method and
 * register DOM and framework events.
 * - for example
 * // Implements initialization logic
 * doInitialize: { value: function() {
 *  // Load elements into fields.
 *  this.doQueries({ button: ".button" });
 *
 *  // Register a DOM event
 *  this.on(button, "click", this.submit);
 *
 *  // Register a framework event on an abstraction
 *  this.event().onAbstraction().load(this.onLoad);
 *
 *  // Raise a framework event
 *  this.event().rase().load({ text: "completed!" });
 * }}
 */
this.Presentation = {

    create : function (arg) {
        Assert.notNullAll(this, [
            [ arg.rootQuery, "arg.rootQuery" ],
            [ arg.id, "arg.id" ]
        ]);

        var presentation = Object.create(this, {
            elem : { value : null, writable: true },
            rootQuery: { value: arg.rootQuery },
            id : { value : arg.id },
            control : { value : null, writable : true },
            eventBuilder : { value : null, writable : true }
        });
        presentation.eventBuilder = EventBuilder.create(presentation);
        Object.defineProperties(presentation, this.fields || {});
        for ( var key in arg ) {
            presentation[key] == null && (presentation[key] = arg[key]);
        }
        Object.seal(presentation);

        return presentation;
    },

    initialize : function (control) {
        Assert.notNull(this, control, "control");
        this.control = control;
        this.elem = this.query(this.rootQuery, control.getElement());
        this.doInitialize();
    },

    /**
     * For internal usage.
     */
    doInitialize : function () {
    },

    getById : function (id) {
        Assert.notNull(this, id, "id");
        var elemById = this.elem.getElementById(id);
        Assert.notNull(this, elemById, "elemById", "id=" + id);
        return elemById;
    },

    query : function (query, target /* can be null! */) {
        Assert.notNull(this, query, "query");
        target == null && (target = this.elem);
        var queriedElem = target.querySelector(query);
        Assert.notNull(this, queriedElem, "queriedElem", "query=" + query);
        return queriedElem;
    },

    queryAll : function (query, target /* can be null */) {
        Assert.notNull(this, query, "query");
        target == null && (target = this.elem);
        var queriedElem = target.querySelectorAll(query);
        Assert.notNull(this, queriedElem, "queriedElem", "query=" + query);
        return queriedElem;
    },

    forEachNode : function (nodeList, func) {
        Assert.notNullAll(this, [
            [ nodeList, "nodeList" ],
            [ func, "func" ]
        ]);
        Array.prototype.slice.call(nodeList).forEach(func, this);
    },

    on : function (elem, event, callback) {
        Assert.notNullAll(this, [
            [ elem, "elem" ],
            [ event, "event" ],
            [ callback, "callback" ]
        ]);
        var me = this;
        elem.addEventListener(event, function (event) {
            return callback.call(me, event)
        });
    },

    onQuery: function(query, event, callback) {
        var elem = this.query(query);
        this.on(elem, event, callback);
    },

    event : function () {
        return this.eventBuilder;
    },

    notify : function (event, arg) {
        this.event().handle(event, arg);
    },

    doQueries : function (queryMap) {
        Assert.notNullAll(this, [
            [ queryMap, "queryMap" ]
        ]);
        for ( var key in queryMap ) {
            var query = queryMap[key];
            this[key] = this.query(query);
        }
    },

    toString : function () {
        return "id: " + this.id;
    }
};

Object.seal(this.Presentation);/**
 * A composition of presentations
 *
 * It propagates events into child presentations.
 */
this.CompositePresentation = Object.create(this.Presentation, {

    fields : { value : { views : { value : null, writable : true } } },

    create : { value : function (arg) {
        Assert.notNullAll(this, [ [ arg.id, "arg.id" ], [ arg.views, "arg.views" ] ]);

        var presentation = Presentation.create.call(this, arg);
        presentation.views = arg.views;

        return presentation;
    }},

    initialize : { value: function (control) {
        Assert.notNull(this, control, "control");
        this.control = control;
        this.doInitialize();
    }},

    doInitialize : { value : function () {
        for ( var key in this.views ) {
            var view = this.views[key];
            view.initialize(this.control);
        }
    }},

    notify : { value : function (event, arg) {
        for ( var key in this.views ) {
            var view = this.views[key];
            view.notify(event, arg);
        }
    }}
});

Object.seal(this.CompositePresentation);
/**
 * A widget transition manager in the SPA(Single Page Application) model.
 *
 * Registering widgets into a central repository, the manager will
 * turn on and off the widgets by a widget id.
 */
this.TransitionManager = {

    create : function (arg) {
        Assert.notNullAll(this, [
            [ arg.containerElem, "arg.containerElem" ],
            [ arg.repository, "arg.repository" ]
        ]);
        var manager = Object.create(this, {
            currentId : { value : null, writable : true },
            containerElem : { value : arg.containerElem },
            idToElemMap : { value : [] },
            repository : { value : arg.repository },
            templateRootPath : { value : "template/" },
            templateSuffix : { value : ".html" },
            httpClient : { value : window.HttpClient, writable : true },
            isTransiting: { value: false, writable: true },
            errorHandler : { value : arg.errorHandler || function () {
            } }
        });
        Object.defineProperties(manager, this.fields || {});
        for ( var key in arg ) {
            manager[key] == null && (manager[key] = arg[key]);
        }
        Object.seal(manager);
        return manager;
    },

    transit : function (id) {
        Assert.notNull(this, id, "id");
        if ( this.isTransiting ) {
            return;
        }
        if ( this.idToElemMap[id] != null ) {
            this.doTransit(id, {});
            return;
        }

        this.isTransiting = true;
        var templatePath = this.templateRootPath + id + this.templateSuffix;
        var me = this;
        this.httpClient.send(templatePath, function (event) {
            me.isTransiting = false;
            var xhr = event.target;
            if ( me.httpClient.isSuccess(xhr) ) {
                var newElem = document.createElement("DIV");
                document.getElementById(id) != null  && Assert.doThrow(
                    "duplicated id found!: id=" + id);

                newElem.id = id;
                newElem.style.display = "none";
                newElem.innerHTML = xhr.responseText;

                me.idToElemMap[id] = newElem;
                me.containerElem.appendChild(newElem);
                me.doTransit(id, newElem);
            } else {
                me.errorHandler(xhr);
            }
        });
    },

    doTransit : function (id, newElem) {
        Assert.notNullAll(this, [
            [ id, "id" ],
            [ newElem, "newElem" ]
        ]);
        if ( this.currentId != null ) {
            var prevWidgetElem = this.idToElemMap[this.currentId];
            var prevWidget = this.repository.get(this.currentId,
                { elem: prevWidgetElem, parentRepository: this.repository });
            prevWidgetElem.style.display = "none";
        }
        this.currentId = id;
        this.idToElemMap[id].style.display = "block";
        var currentWidget = this.repository.get(id,
            { elem: newElem, parentRepository: this.repository });
        currentWidget.initialize();
    },

    toString : function () {
        return "TransitionManager [ currentId: " + this.currentId + ", idToElemMap: " + this.idToElemMap + " ]";
    }
};

Object.seal(this.TransitionManager);
/**
 * A widget to manage underlying controls.
 *
 * Widget is an unit of reusable component,
 * which manages all of components
 * that make up of a widget.
 *
 * Widget is used for functional "transition" basis
 * (ex. a search screen to a settings screen etc...)
 * so Widget is similar with  traditional web page.
 *
 * Components that can be registered in Widget
 * are classified in the following two categories.
 * - Component: a general purpose component
 * - Control: a central control point of an UI component
 *
 * You can define components and controls as follows.
 * // As Widget will be called by TransitionManager,
 * // you should extend Widget.
 * MyWidget = Object.create(Widget, {
 *  fields: {  value: {
 *      // Define components.
 *      // The specification of the component definition is
 *      // as same as ComponentRepository has.
 *      componentDefs: {value: {
 *          myModel: {
 *              target: AbstractionProxy,
 *              ...
 *           },
 *           myView: {
 *              target: MyPresentation,
 *              ...
 *           }
 *      }},
 *
 *      // Define controls.
 *      // The specification of the control definition is
 *      // as same as ComponentRepository has.
 *      // The only difference is that controls are used for
 *      // event notification points.
 *      controlDefs: { value: {
 *          myControl: {
 *              target: Control,
 *              ...
 *          }
 *      }}
 *  }}
 * });
 *
 * All of components that reside in a widget communicate
 * with each other using widget event mechanism.
 * Because a widget has a hierarchy repository structure,
 * the event that was raised by a component may be
 * propagated to parent repositories and other widgets.
 */
this.Widget = {

    create : function (arg) {
        Assert.notNullAll(this, [
            [ arg.id, "arg.id" ],
            [ arg.elem , "arg.elem" ]
        ]);
        var widget = Object.create(this, {
            id : { value : arg.id },
            elem : { value : arg.elem },
            controls : { value : [] },
            components : { value : [] },
            initialized : { value : false, writable: true },
            repository : { value :
                ComponentRepository.create({
                    id: arg.id + "Repository",
                    parent: arg.parentRepository })
            }
        });
        Object.defineProperties(widget, this.fields || {});
        for ( var key in arg ) {
            widget[key] == null && (widget[key] = arg[key]);
        }
        Object.seal(widget);

        this.controlDefs && widget.defineControls(this.controlDefs);
        this.componentDefs && widget.defineComponents(this.componentDefs);

        return widget;
    },

    initialize : function () {
        if ( this.initialized ) {
            return;
        }
        var me = this;
        this.initialized = true;
        for (var key in this.controls ) {
            this.repository.get(this.controls[key], this).initialize();
        }
        this.doInitialize();
    },

    /**
     * For internal usage.
     */
    doInitialize : function () {
    },

    defineComponents : function (def) {
        Assert.notNull(this, def, "def");
        for ( var id in def ) {
            this.components.push(id);
            this.repository.addDefinition(id, def[id]);
        }

        return this;
    },

    getComponent : function (id, args) {
        Assert.notNullAll(this, [
            [ id, "id" ],
            [ args, "args" ]
        ]);
        this.components.indexOf(id) == -1 && this.doThrow(id + " is not component!");
        return this.repository.get(id, args);
    },

    defineControls : function (def) {
        Assert.notNull(this, def, "def");
        for ( var id in def ) {
            this.controls.push(id);
            var componentDef = def[id];
            componentDef.arg == null && (componentDef.arg = {});
            componentDef.arg.widget = this;
            this.repository.addDefinition(id, componentDef);
        }

        return this;
    },

    getControl : function (id) {
        Assert.notNull(this, id, "id");
        this.controls.indexOf(id) == -1 && Assert.doThrow(id + " is not control!");
        return this.repository.get(id, this);
    },

    raiseEvent : function (event, target, args) {
        Assert.notNullAll(this, [
            [ event, "event" ],
            [ target, "target" ],
            [ args, "args" ]
        ]);
        this.repository.raiseEvent(event, target, args);
    },

    addEventRef : function (id, eventRef) {
        Assert.notNullAll(this, [
            [ id, "id" ],
            [ eventRef, "eventRef" ]
        ]);
        this.repository.addEventRef(id, eventRef);
    },

    toString : function () {
        return "id: " + this.id;
    }
};

Object.seal(this.Widget);
/**
 * An Assert class to validate arguments
 */
this.Assert = {

    notNull : function (obj, elem, param, msg) {
        elem == null && this.doThrow(
                "parameter \"" + param + "\" is null!: message=[ " + msg + " ], target=[ " + obj + " ]");
    },

    notNullAll : function (obj, elemDef) {
        for ( var i = 0 ; i < elemDef.length ; i++ ) {
            var elem = elemDef[i];
            this.notNull(obj, elem[0], elem[1], elem[2]);
        }
    },

    doThrow : function (msg) {
        throw new Error(msg);
    }
};

Object.seal(this.Assert);
/**
 * A event builder class that can define view and model events by fluent interface.
 *
 * - for example
 *
 * EventBuilder.create(target)
 *  .ref().onAbstraction().load(this.load)
 *  .ref().onAbstraction().start(this.start)
 *  .raise().start({});
 */
this.EventBuilder = {

    REF_INVOKER : {

        target : null,
        id : null,
        builder : null,

        load : function (handler) {
            this.target.control.addEventRef(this.id.load(), this.target);
            this.builder.eventMap[this.id.load()] = handler;
            return this.builder;
        },

        start : function (handler) {
            this.target.control.addEventRef(this.id.start(), this.target);
            this.builder.eventMap[this.id.start()] = handler;
            return this.builder;
        },

        change : function (handler) {
            this.target.control.addEventRef(this.id.change(), this.target);
            this.builder.eventMap[this.id.change()] = handler;
            return this.builder;
        },

        failure : function (handler) {
            this.target.control.addEventRef( this.id.failure(), this.target);
            this.builder.eventMap[this.id.failure()] = handler;
            return this.builder;
        },

        other : function (handler) {
            this.target.control.addEventRef(this.id.other(),  this.target);
            this.builder.eventMap[this.id.other()] = handler;
            return this.builder;
        }
    },

    RAISE_INVOKER : {

        target : null,
        id : null,
        builder : null,

        load : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.load(), this.target, args);
            return this.builder;
        },

        start : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.start(), this.target, args);
            return this.builder;
        },

        change : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.change(), this.target, args);
            return this.builder;
        },

        failure : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.failure(), this.target, args);
            return this.builder;
        },

        other : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.other(), this.target, args);
            return this.builder;
        }
    },

    create : function (target) {
        Assert.notNullAll(this, [
            [ target, "target"]
        ]);
        Assert.notNull(this, target, "target");

        var builder = Object.create(this,
            { target : { value : target }, eventMap : { value : [] } });
        Object.seal(builder);

        return builder;
    },

    ref : function () {
        var me = this;
        return {

            target : this.target,

            onAbstraction : function () {
                return Object.create(EventBuilder.REF_INVOKER,
                    { target : { value : this.target }, builder : { value : me },
                        id : { value : Id.onAbstraction(this.target) } });
            },

            onPresentation : function () {
                return Object.create(EventBuilder.REF_INVOKER,
                    { target : { value : this.target }, builder : { value : me },
                        id : { value : Id.onPresentation(this.target) } });
            },

            on : function (event) {
                Assert.notNullAll(this, [
                    [ event, "event"]
                ]);
                return Object.create(EventBuilder.REF_INVOKER,
                    { target : { value : this.target }, builder : { value : me },
                        id : { value : Id.on(event) } });
            }
        };
    },

    raise : function () {
        var me = this;
        var raise = Object.create(EventBuilder.RAISE_INVOKER, {
            target : { value : this.target }, builder : { value : me },
            id : { value : Id.onThis(this.target) }
        });
        Object.seal(raise);

        return raise;
    },

    handle : function (id, arg) {
        if ( this.eventMap[id] != null ) {
            this.eventMap[id].call(this.target, arg, id);
        } else {
            this.eventMap[Id.other()] && this.eventMap[Id.other()].call(this.target, arg, id);
        }
    }
};

Object.seal(this.EventBuilder);
/**
 * VERY simple http client.
 */
this.HttpClient = {

    send : function (url, loaded, data/* can be null! */, reqCallback /* can be null! */, method /* can be null! */) {
        Assert.notNullAll(this, [
            [ url, "url" ],
            [ loaded, "loaded" ]
        ]);
        var method = method || "GET";
        var reqCallback = reqCallback || function () {
            return data;
        }
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", loaded);
        xhr.open(method, url, true);
        xhr.send(reqCallback(data, xhr));

        return xhr;
    },

    isSuccess : function (xhr) {
        Assert.notNull(this, xhr, "xhr");
        // Status Code = 0 is used for phantomjs testing.
        var isSuccess = xhr.status == 0 || xhr.status == 200;
        return isSuccess;
    }
};

Object.seal(this.HttpClient);
/**
 * A builder object to create event id.
 *
 * You can build event id that refers to other components in the same control.
 * Using the id object, you can remove string id literal from your code.
 *
 * - for example
 * this.referEvent(this.id, Id.onAbstraction(this).load());
 *
 * In the former example, you can determine the id of the abstraction
 * that resides in the same control on the presentation.
 * And the format of the id string is following.
 * ${WIDGET_ID}.${CONTROL_ID}.[${PRESENTATION_ID} | ${ABSTRACTION_ID}].${ACTION_CODE}
 */
this.Id = {

    idString : "",

    LOAD: ".load",

    START: ".start",

    CHANGE: ".change",

    FAILURE: ".failure",

    OTHER: ".other",

    onAbstraction : function (target) {
        Assert.notNull(this, target, "target");

        var id = Object.create(this, {
            target : { value : target },
            idString : { value : "", writable : true, configurable : true } });

        if ( Presentation.isPrototypeOf(target) ) {
            id.idString = target.control.widget.id;
            id.idString += "." + target.control.id;
            id.idString += "." + target.control.abstraction.id;
        } else if ( AbstractionProxy.isPrototypeOf(target) ) {
            id.idString += target.control.widget.id;
            id.idString += ("." + target.control.id);
            id.idString += ("." + target.control.abstraction.id);
        } else if ( Control.isPrototypeOf(target) ) {
            id.idString = target.widget.id;
            id.idString += ("." + target.id);
            id.idString += ("." + target.abstraction.id);
        } else {
            Assert.doThrow("invalid target:" + target);
        }

        return id;
    },

    onPresentation : function (target) {
        Assert.notNull(this, target, "target");

        var id = Object.create(this, {
            target : { value : target },
            idString : { value : "", writable : true, configurable : true } });

        if ( Presentation.isPrototypeOf(target) ) {
            id.idString = target.control.widget.id;
            id.idString += ("." + target.control.id);
            id.idString += ("." + target.control.presentation.id);
        } else if ( AbstractionProxy.isPrototypeOf(target) ) {
            id.idString = target.control.widget.id;
            id.idString += ("." + target.control.id);
            id.idString += ("." + target.control.presentation.id);
        } else if ( Control.isPrototypeOf(target) ) {
            id.idString = target.widget.id;
            id.idString += ("." + target.id);
            id.idString += ("." + target.presentation.id);
        } else {
            Assert.doThrow("invalid target:" + target);
        }
        return id;
    },

    onThis : function (target) {
        Assert.notNull(this, target, "target");

        if ( Presentation.isPrototypeOf(target) ) {
            return Id.onPresentation(target);
        } else if ( AbstractionProxy.isPrototypeOf(target) ) {
            return Id.onAbstraction(target);
        } else {
            Assert.doThrow("invalid target:" + target);
        }
    },

    load : function () {
        return this.idString + this.LOAD;
    },

    start : function () {
        return this.idString + this.START;
    },

    change : function () {
        return this.idString + this.CHANGE;
    },

    failure : function () {
        return this.idString + this.FAILURE;
    },

    other : function () {
        return this.idString + this.OTHER;
    },

    checkAction : function (target, event) {
        Assert.notNullAll(this, [
            [ target, "target" ],
            [ event, "event" ]
        ]);
        return target.endWith(event.idString);
    },

    on : function (idStr) {
        Assert.notNull(this, idStr, "idStr");

        var id = Object.create(this, {
            idString : { value : "", writable : true, configurable : true } });
        id.idString = idStr;

        return id;
    },

    getAction : function (event) {
        var separatorIndex = event.lastIndexOf(".");
        if ( separatorIndex < 0 ) {
            Assert.doThrow("separator couldn't find!: event=" + event);
        }
        return event.substring(separatorIndex);
    },

    toString : function () {
        return "idString: " + this.idString + ", target: " + this.target;
    }
};

Object.seal(this.Id);
/**
 * Very simple map utility.
 */
this.Maps = {

    putAll: function() {
        arguments.length % 2 != 0 && Assert.doThrow(
            "\"arguments\" must be multiple of two!: arguments=" + arguments);

        var map = {};
        for ( var key = 0 ; key < arguments.length ; key +=2 ) {
            map[arguments[key]] = arguments[key + 1];
        }

        return map;
    }
};

Object.seal(this.Maps);