if ($("#beginTime") != undefined) {
  $("#beginTime").datetimepicker({
    format: 'yyyy-mm-dd',
    minView: 'month',
    language: 'zh-CN',
    autoclose: true,
    pickerPosition: 'top-right',
    startDate: new Date()
  }).on("click", function () {
    $("#beginTime").datetimepicker("setEndDate", $("#endTime").val());
  });
  $("#endTime").datetimepicker({
    format: 'yyyy-mm-dd',
    minView: 'month',
    language: 'zh-CN',
    autoclose: true,
    pickerPosition: 'top-right',
    startDate: new Date()
  }).on("click", function () {
    $("#endTime").datetimepicker("setStartDate", $("#beginTime").val());
  });
}

$("#numberTotal,#amountMin,#amount").keyup(function () {
  var value = $(this).val();
  if (!validateNumber(value)) {
    $(this).val("");
  }
});

function validateNumber(obj) {
  //			obj = parseInt(obj);
  //			console.log(obj);
  var reg = new RegExp("^([1-9][0-9]*)$");
  return reg.test(obj);
}

function num(obj) {
  var res = new RegExp("^([0-9]*)$")
  return res.test(obj)
}

$("#couponLevel").keyup(function () {
  var value = $(this).val();
  if (!num(value)) {
    $(this).val("");
  }
});


//代金券和优惠券满多少设置校验
function setMin() {
  var amount = $('#price1').val();
  var amountMin = $('#amount-Min1').val();
  //判断满减值不为空
  if (validateNumber(amount) && validateNumber(amountMin)) {
    //满值必须大于减值
    if (!(amount * 1 < amountMin * 1)) {
      $('#amount-Min1').val('');
      $('#amount-Min1').focus();
      top.layer.alert('满金额必须大于减金额!', {
        icon: 2
      });
    } else {
      $('#amount').val(amount);
      $('#amountMin').val(amountMin);
    }
  }
}