// Generated by CoffeeScript 1.6.1
(function() {

  $(document).ready(function() {
    var _this = this;
    document.getElementById("container").contentWindow.document.location.href = "/client/entryframe.html";
    document.getElementById("container").onload = function(evt) {
      return window.webRTC = new WebRTC(document.getElementById("container").contentWindow.document.documentElement);
    };
    return $(document).on("relativeLinkClicked", function(evt, href) {
      console.log("REQUESTING FILE " + href + "....");
      return window.webRTC.htmlProcessor.requestFile(href, "alink");
    });
  });

}).call(this);
