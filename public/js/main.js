var slideIndex = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}    
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
  setTimeout(showSlides, 2000); // Change image every 2 seconds
}


        var socket = io.connect();

        socket.on('chat', function (data) {
            var msg = data.nick+':'+data.message;
            $('textarea').val($('textarea').val()+msg+'\n'); 
        });

        socket.on('userlist', (data)=>{
            data.map((item)=>{
                $('#activeuser').append(`UserId: <strong>${item}<strong><br/>`)
            })
            let total = data.length;
            document.getElementById('listu').innerHTML= total
            $('b').val(total);
        })

        // Handle UI
        $(function() {
            // Set nickname
            $('#nick').on('click', function() {
                socket.emit('nick', $('#nickText').val());
            });
            // Send chat message
            $('#chat').on('click', function() {
                socket.emit('chat', {
                    message:$('#chatText').val()
                });
            });
        });

        var uiusers = sessionStorage.getItem('users');
        console.log(uiusers)
    