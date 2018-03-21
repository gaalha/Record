var gridButtons = "";
var gridStatus = "";
var table;

$(document).ready(function(){
    prepareButtons();
    initGrid();
});

function prepareButtons(){
    gridStatus = $("#gridStatus").val();
    var bodyButtons = $("#gridButtons").val();
    var tags = $("<div/>");
    tags.append(bodyButtons);

    $("#btnNew").click(function(){
        showDialog() 
    });

    gridButtons = "<center>"+tags.html()+"<center>";
}

function bindButtons(){
    $('#userGrid tbody tr td button').unbind('click').on('click',function(event){
        if(event.preventDefault) event.preventDefault();
        if(event.stopImmediatePropagation) event.stopImmediatePropagation();
        var obj = JSON.parse(Base64.decode($(this).parent().attr("data-row")));
        var action = $(this).attr("data-action");

        if(action=='edit'){ showDialog(obj._id); }
        else if(action=='delete'){ deleteRecord(obj._id); }
    });
}

function drawRowNumbers(selector,table){
    if(typeof(table)=='undefined') return;

    var info = table.page.info();
    var index = info.start + 1;
    $.each($(selector+" tbody tr td:first-child"),function(idx,obj){
        if($(obj).hasClass('dataTables_empty')) return;
        $(obj).addClass('text-center').html(index++);
    });
}

function initGrid(){
    table = $('#userGrid')
        .on('draw.dt',function(e,settings,json,xhr){
            setTimeout(function(){bindButtons();},500);
            drawRowNumbers('#userGrid', table);
        }).DataTable({
        language: {
            url: CONSTANTS.lang.dataTable.url
        },
        ajax: CONSTANTS.routes.user.getList,
        aoColumns: [
            {data: '_id', sortable: false, searchable:false},
            {data: 'name'},
            {data: 'lastName'},
            {data: 'userEmail'},
            {
                sortable:false, searchable:false,
                render:function(data,type,row,meta){
                    return gridButtons.replace("{data}", Base64.encode(JSON.stringify(row)));
                }
            }
        ]
    });
    $('#userGrid').removeClass('display').addClass('table table-bordered table-hover dataTable');
}

function deleteRecord(_id){
    bootbox.confirm({
        message: CONSTANTS.lang.user.deleteQuestion, 
        buttons: {
            confirm: {
                label: CONSTANTS.lang.label.ok,
                className: 'btn-primary'
            },
            cancel: {
                label: CONSTANTS.lang.label.cancel,
                className: 'btn-secondary'
            }
        },
        callback: function(result) {
            if(result){
                $.ajax({
                    url: CONSTANTS.routes.user.delete.replace(':id', _id),
                    type:'DELETE',
                    success:function(data){
                        humane.log(data.message)
                        if(data.success){
                            table.ajax.reload();
                        }
                    }
                });
            }
        }
    });
}

function showDialog(_id){
    var isEditing = !(typeof(_id) === "undefined" || _id === 0);

    dialog = bootbox.dialog({
        title: (isEditing ? CONSTANTS.lang.label.edit : CONSTANTS.lang.label.new),
        message: $("#userFormBody").val(),
        className:"modalSmall"
    });   
    startValidation();

    if(isEditing){
        $("#txtIdHidden").val(_id);
        loadData(_id);
        
        $("#divPassword").hide();

        $("#chkChangePassword").click(function () {
            $("#divPassword").toggle();

            if($("#chkChangePassword").is(':checked')){
                $("#statusChangePassword").val("1");
            }else{
                $("#statusChangePassword").val("0");
            }
        });
    }else{
        $("#statusChangePassword").val("1");
        $("#passSwitch").hide();
    }
}

function loadData(_id){
    var form = $("#userForm");
    var date = $('#txtDate');
    var name= $('#txtName');
    var lastName= $('#txtLastName');
    var userEmail= $('#txtUserEmail');
    $.ajax({
        url: CONSTANTS.routes.user.getDetail.replace(':id', _id),
        type:'GET',
        success:function(data){
            if(data.success == true){
                date.val(data.data.createdAt);
                name.val(data.data.name);
                lastName.val(data.data.lastName);
                userEmail.val(data.data.userEmail);
            }
        }});
}

function startValidation(){
    $('#userForm').validate({
        rules: {
            txtName: {
                required:true,
                minlength: 2,
                maxlength:40,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            txtLastName: {
                required:true,
                minlength: 2,
                maxlength:40,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            txtUserEmail: {
                required:true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            txtPassword: {
                required: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            txtPassword1: {
                required: true,
                equalTo:"#txtPassword",
                normalizer: function(value) {
                    return $.trim(value);
                }
            }
        },
        messages: {
            txtName: {
                required: CONSTANTS.lang.user.required,
                minlength: CONSTANTS.lang.user.minlength,
                maxlength: CONSTANTS.lang.user.maxlength
            },
            txtLastName: {
                required: CONSTANTS.lang.user.required,
                minlength: CONSTANTS.lang.user.minlength,
                maxlength:CONSTANTS.lang.user.maxlength
            },
            txtUserEmail: {required: CONSTANTS.lang.user.required},
            txtPassword: {
                required: CONSTANTS.lang.user.required,
                minlength: CONSTANTS.lang.user.password.minlength
            },
            txtPassword1: {
                required: CONSTANTS.lang.user.required,
                minlength: CONSTANTS.lang.user.password.minlength,
                equalTo: CONSTANTS.lang.user.password.equalTo
            }
        },
        submitHandler: function(form) {
            save();
        }
    });
}

function save(){
    var form = $("#userForm");
    var data = form.serialize();
    $.ajax({
       url: CONSTANTS.routes.user.save,
       type: 'POST',
       data:  data,
       success:function(data){
           humane.log(data.message);
           if(data.success==true){
               table.ajax.reload();
               dialog.modal('hide');
           }
       }
    });
}