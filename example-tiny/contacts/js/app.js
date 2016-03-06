/*
 * client side
 *
 * Contacts example
 * Backbone
 * Underscore
 *
 * andy-pro 2016
 */
 
(function ($) {
 
    var contacts = [
        { name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 9", address: "9, a street, a town, a city, AB12 3CD", tel: "050-963-72-69", email: "anemail@me.com", type: "family" }
    ];
    
    var Contact = Backbone.Model.extend({
        defaults: {
            photo: "contacts/images/placeholder.png",
            name: "",
            address: "",
            tel: "",
            email: "",
            type: ""
        }
    });

    var Directory = Backbone.Collection.extend({
        model: Contact
    });
    
    var ContactView = Backbone.View.extend({
        tagName: "article",
        className: "contact-container",
        template: _.template($("#contactTemplate").html()),
        
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        
        events: {
            "click button.delete": "deleteContact"
        },
         
        deleteContact: function () {
            var removedType = this.model.get("type").toLowerCase();
         
            this.model.destroy();
         
            this.remove();
         
            if (_.indexOf(directory.getTypes(), removedType) === -1) {
                directory.$el.find("#filter select").children("[value='" + removedType + "']").remove();
            }
        }
    });
    
    var DirectoryView = Backbone.View.extend({
        el: $("#contacts"),
     
        initialize: function () {
            this.collection = new Directory(contacts);
            this.render();
            this.$el.find("#filter").append(this.createSelect());
            this.on("change:filterType", this.filterByType, this);
            this.collection.on("reset", this.render, this);
            this.collection.on("add", this.renderContact, this);
        },
     
        render: function () {
            this.$el.find("article").remove();
            _.each(this.collection.models, function (item) {
                this.renderContact(item);
            }, this);
            console.log(this.collection);
        },
     
        renderContact: function (item) {
            var contactView = new ContactView({
                model: item
            });
            this.$el.append(contactView.render().el);
        },
        
        getTypes: function () {
            return _.uniq(this.collection.pluck("type"), false, function (type) {
                return type.toLowerCase();
            });
        },
         
        createSelect: function () {
            var filter = this.$el.find("#filter"),
                select = $("<select>", {class: "form-control green-wave"});
                
            // console.log(this.getTypes());
         
            _.each(['All'].concat(this.getTypes()), function (item) {
                var option = $("<option/>", {
                    value: item.toLowerCase(),
                    // text: item.toLowerCase()
                    text: item
                }).appendTo(select);
            });
            return select;
        },
        
        events: {
            "change #filter select": "setFilter",
            "click #add": "addContact"
        },
        
        setFilter: function (e) {
            this.filterType = e.currentTarget.value;
            this.trigger("change:filterType");
        },
        
        filterByType: function () {
            var filterType = this.filterType;
            if (filterType === "all") var filtered = contacts;         
            else {
                this.collection.reset(contacts, { silent: true });         
                var filtered = _.filter(this.collection.models, function (item) {
                    return item.get("type") === filterType;
                });
            }
            this.collection.reset(filtered);         
            contactsRouter.navigate("filter/" + filterType);
            console.log(this.filterType);
        },
        
        addContact: function (e) {
            e.preventDefault();
         
            // var newModel = {};
            // $("#addContact").children("input").each(function (i, el) {
                // if ($(el).val() !== "") {
                    // newModel[el.id] = $(el).val();
                // }
            // });         
            var formData = {};
            $("#addContact").children("input").each(function (i, el) {
                if ($(el).val() !== "") {
                    formData[el.id] = $(el).val();
                }
            });
         
            contacts.push(formData);
            console.log(contacts);
         
            if (_.indexOf(this.getTypes(), formData.type) === -1) {
                this.collection.add(new Contact(formData));
                this.$el.find("#filter").find("select").remove().end().append(this.createSelect());
            } else {
                this.collection.add(new Contact(formData));
            }
        }
    });
    
    var ContactsRouter = Backbone.Router.extend({
        routes: {
            "filter/:type": "urlFilter"
        },
     
        urlFilter: function (type) {
            directory.filterType = type;
            directory.trigger("change:filterType");
            console.log(type);
        }
    });
    
    Backbone.history.start();
    
    var contactsRouter = new ContactsRouter();
    
    
    var directory = new DirectoryView();
    
    // console.log(contacts);
 
} (jQuery));
