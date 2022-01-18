var name;
var to_be_updated;
        $(document).ready(function() {
            $('#myTable').DataTable();
            });
        // edit data
        $('.update').click(function() {
            id= this.id;
                $.ajax({
                    type: 'POST',
                    url: '/users/find_by_id',
                    data: {"id":id},
                    success: function(data){
                        console.log(data)    
                        
                        //to_be_updated = data[0].title;
                            $("#update_id").attr("value", data[0]._id)
                            $("#update_title").attr("value", data[0].title);
                            $("#update_published_date").attr("value", data[0].published_date);
                            $("#update_description").val(data[0].description);
                            $("#update_url").val(data[0].url);
                            $("#update_url_to_image").val(data[0].url_to_image);
                            
                            $('#Modal').modal({show: true});
                        },
                    error: function(){
                        alert('No data');
                    }
                    });
            });




            
            // update data
                  $(function(){
                      $('#update_table').on('click', function(e){
                        var data = $('#update_news').serialize();
                        console.log(JSON.stringify(data));
                        e.preventDefault();
                        $.ajax({
                          url: '/users/update_news',
                          type:'PUT',
                          data : data,
                          success: function(data){
                            console.log(data);
                            window.location.reload()
                        },
                        error: function(){
                          alert('No data');
                        }
                      });
                  });
                  });