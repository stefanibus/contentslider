(function($){

  var defaultSettings = {
      slidetime : 500,
      cycle     : true,
      autoplay  : false,
      delay     : 3000,
      setUrl    : false
    };

	$.fn.contentslider = function(options) {
	
    if(options) {
      $.extend(defaultSettings, options);
    }

		return this.each(function() {
				
  		var firstCall       = true,
		      $this           = $(this),
					$content        = $this.find('.content'),
		      $active         = $content.find('.active'),
		      action          = 'next',
		      timer           = null,
		      numberContent   = $content.find('.area').length,
		      i               = 0;
		  
		  if(options.setUrl && location.hash != '') {
        var i = location.hash.replace('#', '');
        i--;
      }
      $content.find('.area:eq('+i+')').addClass('active');
      

	    if(numberContent > 1) {
  
	      $this.append(
	        '<ul class="paging control"/>'
	      );
	      $content.find('.area').each(function(index){
	        var i = index+1;
	        $this.find('.paging').append(
	          '<li><a href="#">'+i+'</a></li>'
	        );
	      });
	      $this.find('.paging li:eq('+i+')').addClass('active');
            
	      $this.append(
	        '<ul class="change control">' +
            '<li class="prev"><a href="#previous">previous</a></li>' +
            '<li class="next"><a href="#next">next</a></li>'+
          '</ul>'
	      );

	      $this.find('.control a').on('click.changeArea', clickHandler);
	      	      
	      if(!options.cycle) {
          $this.find('.control .prev').addClass('disabled');
	      }
	      
	      if(options.autoplay) {
          autoplay();
	      }
  
	    }
  
  
		  function clickHandler(e) {
		  		      
		    action = 'next';
		    e.preventDefault();
        
		    clearInterval(timer);
        
		    if($(e.target).parent().parent('.paging').length > 0) {
		      action = $this.find('.paging li').index($(e.target).parent());
		    }
		    else if($(this).parent('li').hasClass('prev')) {
		      action = 'prev';
		    }

		    changeArea(action);
  
		  }
		  
		  
		  function autoplay() {
    
        if(options.autoplay) {
        
          if(firstCall == true) {
            timer = setTimeout(function(){changeArea(action)}, options.delay);
            firstCall = false;
          } else {
            action = 'next';
            timer = setInterval(function(){changeArea(action)}, options.delay);
          }
        
        }
        
      }
  
  
		  function changeArea(action) {
		  
		    console.log('change');
		  	     	     
        if(options.autoplay) {
          clearInterval(timer);
        }
            
		    $active = $content.find('.area.active');
		    var $next,
		        activeTo = '-100%',
		        nextTo = 0,
		        indexActiveContent = $content.find('.area').index($active);
    
        $this.addClass('sliding');
		    $this.find('.control a').off('click.changeArea');
        
		    if(typeof(action) == 'number') {
		      if(action == indexActiveContent) {
        
            $this.find('.control a').on('click.changeArea', clickHandler);
            if(options.autoplay) {
              autoplay();
            }
            return
                  
          }
		      else {
  		      $next = $content.find('.area:eq('+action+')');
        
  		      if(action < indexActiveContent) {
  		        activeTo = '100%';
  		        $next.css('left', '-100%');
  		      }
		      }
		    }
		    else if(action == 'prev') {
            
		      if(indexActiveContent == 0) {
		        if(!options.cycle) {
		          $this.find('.control a').on('click.changeArea', clickHandler);
		          return
		        }
		        else {
		          $next = $content.find('.area').last();
		        }
		      }
		      else {
		        $next = $active.prev();
		      }
    
		      activeTo = '100%';
		      $next.css('left', '-100%');
          
		    }
		    else {
		      if(indexActiveContent == $content.find('.area').length-1) {
		        if(!options.cycle) {
		          $this.find('.control a').on('click.changeArea', clickHandler);
		          return
		        }
		        else {
		          $next = $content.find('.area').first();
		        }
		      }
		      else {
		        $next = $active.next('.area');
		      }
                    
		    }
        
        if(options.setUrl) {
          var indexNext = $content.find('.area').index($next);
          location.hash = indexNext+1;
        }
            
		    $this.find('.paging .active').removeClass('active');
		    $this.find('.paging li:eq('+$content.find('.area').index($next)+')').addClass('active');
             
		    $active.animate({
		      left: activeTo
		    }, options.slidetime, function(){
		      $(this).css('left', '100%');
		      $this.find('.control a').on('click.changeArea', clickHandler);
		      $this.find('.control li').removeClass('disabled');
		      $this.removeClass('sliding');
		      
		      if(!options.cycle) {
  		      if($content.find('.area').index($next) == 0) {
    		      $this.find('.control .prev').addClass('disabled');
    		    }
    		    else if($content.find('.area').index($next) == $content.find('.area').length-1) {
    		      $this.find('.control .next').addClass('disabled');
    		    }
  		    }
  		    if(options.autoplay) {
  		      if(!options.cycle && $content.find('.area').index($next) == $content.find('.area').length-1) {
  		        console.log('sdf');
  		        clearInterval(timer);
  		        return
  		      } else {
  		        autoplay();
  		      }
  		    }
		    });
		    $active.removeClass('active'); 

		    $next.animate({
		      left: nextTo + '%'
		    }, options.slidetime+1, function() {
		      $next.addClass('active');
		    });
		            
		  }

		});

	}
  
})(jQuery);