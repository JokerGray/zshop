var jcrop_api,
        boundx,
        boundy,

        // Grab some information about the preview pane
        $preview = $('#preview-pane'),
        $pcnt = $('#preview-pane .preview-container'),
        $pimg = $('#preview-pane .preview-container img'),

        xsize = $pcnt.width(),
        ysize = $pcnt.height();

    var originalImg = $("#target").attr("src");
    var imgObj =  new Image();
    imgObj.src = originalImg;
    imgObj.onload = function(){
        $("#realWidth").val(imgObj.width);
        $("#realHeight").val(imgObj.height);
    };

    console.log('init',[xsize,ysize]);
    $('#target').Jcrop({
      onChange: updatePreview,
      onSelect: updatePreview,
      aspectRatio: xsize / ysize
    },function(){
      // Use the API to get the real image size
      var bounds = this.getBounds();
      boundx = bounds[0];
      boundy = bounds[1];
      // Store the API in the jcrop_api variable
      jcrop_api = this;

      // Move the preview into the jcrop container for css positioning
      $preview.appendTo(jcrop_api.ui.holder);
    });

    function updatePreview(c)
    {
      if (parseInt(c.w) > 0)
      {
        var rx = xsize / c.w;
        var ry = ysize / c.h;

        $pimg.css({
          width: Math.round(rx * boundx) + 'px',
          height: Math.round(ry * boundy) + 'px',
          marginLeft: '-' + Math.round(rx * c.x) + 'px',
          marginTop: '-' + Math.round(ry * c.y) + 'px'
        });
        $('#x1').val(c.x);
        $('#y1').val(c.y);
        $('#x2').val(c.x2);
        $('#y2').val(c.y2);
      }
    };


$("#submitBtn").click(function(){
    console.log(boundx+","+boundy);
    var realW = $("#realWidth").val(),
        realH = $("#realHeight").val();
    var ratio = realW / boundx;
    var x1 = $('#x1').val(),
        x2 = $('#x2').val(),
        y1 = $('#y1').val(),
        y2 = $('#y2').val();
    console.log(x1+","+y1);
    console.log(ratio)    
});
