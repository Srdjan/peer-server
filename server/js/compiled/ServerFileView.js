// Generated by CoffeeScript 1.6.1
(function() {
  'View of a single file in the editor (depends on js/img/css etc)';
  var _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.ServerFileView = (function(_super) {

    __extends(ServerFileView, _super);

    function ServerFileView() {
      var _this = this;
      this.setIsEditable = function(isEditable) {
        return ServerFileView.prototype.setIsEditable.apply(_this, arguments);
      };
      this.updateContents = function() {
        return ServerFileView.prototype.updateContents.apply(_this, arguments);
      };
      this.renderAsImage = function() {
        return ServerFileView.prototype.renderAsImage.apply(_this, arguments);
      };
      this.renderAsSourceCodeReadOnly = function() {
        return ServerFileView.prototype.renderAsSourceCodeReadOnly.apply(_this, arguments);
      };
      this.renderAsSourceCodeEditable = function() {
        return ServerFileView.prototype.renderAsSourceCodeEditable.apply(_this, arguments);
      };
      this.renderAsSourceCode = function() {
        return ServerFileView.prototype.renderAsSourceCode.apply(_this, arguments);
      };
      this.render = function() {
        return ServerFileView.prototype.render.apply(_this, arguments);
      };
      return ServerFileView.__super__.constructor.apply(this, arguments);
    }

    ServerFileView.prototype.initialize = function(options) {
      return this.isEditable = options.isEditable;
    };

    ServerFileView.prototype.render = function() {
      if (this.model.get("fileType") !== ServerFile.prototype.fileTypeEnum.IMG) {
        this.renderAsSourceCode();
      } else {
        this.renderAsImage();
      }
      return this;
    };

    ServerFileView.prototype.renderAsSourceCode = function() {
      var editorMode, fileContents, template;
      template = Handlebars.compile($("#source-code-template").html());
      $(this.el).html(template);
      fileContents = $(this.el).find(".file-contents");
      fileContents.text(this.model.get("contents"));
      this.aceEditor = ace.edit(fileContents[0]);
      this.aceEditor.setTheme("ace/theme/tomorrow_night_eighties");
      this.aceEditor.setFontSize("12px");
      editorMode = "ace/mode/html";
      switch (this.model.get("fileType")) {
        case ServerFile.prototype.fileTypeEnum.CSS:
          editorMode = "ace/mode/css";
          break;
        case ServerFile.prototype.fileTypeEnum.JS:
          editorMode = "ace/mode/javascript";
      }
      this.aceEditor.getSession().setMode(editorMode);
      if (this.isEditable) {
        return this.renderAsSourceCodeEditable();
      } else {
        return this.renderAsSourceCodeReadOnly();
      }
    };

    ServerFileView.prototype.renderAsSourceCodeEditable = function() {
      return this.aceEditor.on("change", this.updateContents);
    };

    ServerFileView.prototype.renderAsSourceCodeReadOnly = function() {
      return this.aceEditor.setReadOnly(true);
    };

    ServerFileView.prototype.renderAsImage = function() {
      var template;
      template = Handlebars.compile($("#image-template").html());
      $(this.el).html(template);
      return this.$("img").attr("src", this.model.get("contents"));
    };

    ServerFileView.prototype.updateContents = function() {
      return this.model.save("contents", this.aceEditor.getValue());
    };

    ServerFileView.prototype.setIsEditable = function(isEditable) {
      if (this.isEditable === isEditable) {
        return;
      }
      this.isEditable = isEditable;
      return this.render();
    };

    return ServerFileView;

  })(Backbone.View);

}).call(this);
