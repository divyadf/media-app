// delete data
$('.delete').click(function() {
    id= this.id;
    $.ajax({
        type: 'POST',
        url: '/users/delete_by_id',
        data: {"id":id},
        success: function(data){
            console.log(data)
            window.location.reload()
        },
        error: function(){
            alert('No data');
        }
    });
});




            
           