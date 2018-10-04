(function () {

    var oRole = sessionStorage.getItem("roleInfo");
    var scSysPermissions = JSON.parse(oRole).scSysPermissions;
    if (scSysPermissions.length > 0){
        scSysPermissions.forEach(function(ele) {
            if (ele.percode == 'pad_statistics'){
                var sHtml = template('statisticTpl', { 'permissionsList': ele.twoScSysPermission });
                $("#statisticNav").html(sHtml);
            }
        }, this);
    }
    
    $("#statisticNav").delegate(".nav-item a", "click", function(){
        var dataHref = $(this).attr("data-href");
        if (dataHref) {
            window.parent.location = './html/' + dataHref + '.html'
        }
    });


})(jQuery);
