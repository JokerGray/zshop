var document = self.document = {parentNode: null, nodeType: 9, toString: function() {return "FakeDocument"}};
var window = self.window = self;
var fakeElement = Object.create(document);
fakeElement.nodeType = 1;
fakeElement.toString=function() {return "FakeElement"};
fakeElement.parentNode = fakeElement.firstChild = fakeElement.lastChild = fakeElement;
fakeElement.ownerDocument = document;

document.head = document.body = fakeElement;
document.ownerDocument = document.documentElement = document;
document.getElementById = document.createElement = function() {return fakeElement;};
document.createDocumentFragment = function() {return this;};
document.getElementsByTagName = document.getElementsByClassName = function() {return [fakeElement];};
document.getAttribute = document.setAttribute = document.removeChild = 
  document.addEventListener = document.removeEventListener = 
  function() {return null;};
document.cloneNode = document.appendChild = function() {return this;};
document.appendChild = function(child) {return child;};

importScripts("http://code.jquery.com/jquery-2.1.4.min.js");

var apikey = "test";
onmessage = function (e) {
    let index = e.data.index;
    console.log("子线程: 开始第" + index + "批云信重试...");

    apikey = e.data.apikey;
    let param = {};
    let res = reqAjaxAsync("user/nimRetryTopTen", JSON.stringify(param)).done(function(res) {
            if(res.code == 1) {
            }

            postMessage("结束 - " + index);
        });
};


function reqAjaxAsync(cmd, data, async) {
    if (typeof $ === 'undefined'){
        alert('网络访问出现问题');
        return;
    }

    var defer = $.Deferred();
    $.ajax({
        type: "POST",
        url: "/zxcity_restful/ws/rest",
        dataType: "json",
        async: async || true, //默认为异步
        data: {
            "cmd": cmd,
            "data": data || "",
            "version": "1"
        },
        beforeSend: function(request) {
            request.setRequestHeader("apikey", apikey);
        },
        success: function(data) {
            defer.resolve(data);
        },
        error: function(err) {
            console.log(err.status + ":" + err.statusText);
        }
    });
    return defer.promise();
}