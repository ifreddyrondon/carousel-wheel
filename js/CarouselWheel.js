var CarouselWheel = Backbone.View.extend({

	indexes: {
		current: null,
		prev: null,
		next: null,
		last: null,
	},

	indexesData: {
		prev: null,
		next: null,
		current: null,
	},

	$parent: null,

	events : {
		'click .vertical-carousel-element-container' : 'changeElement',
		'click .horizontal-carousel-element-container' : 'changeElement',
		'click #vertical-carousel-up-arrow' : 'changeElement',
		'click #vertical-carousel-down-arrow' : 'changeElement',
		'click #horizontal-carousel-left-arrow' : 'changeElement',
		'click #horizontal-carousel-right-arrow' : 'changeElement'
	},

	initialize: function(obj){

		this.obj = obj;
		this.properties = obj.properties;
        this.id = obj.properties.id;

        if(obj.properties.$el) {
			this.$el = obj.properties.$el;
            if (this.$el.length === 0)
                console.error('Element ' + this.$el.selector + ' not found');
        }

        if(!obj.properties.content || (obj.properties.content.length - 1) < 0)
        	throw 'Content not found';
        
        this.content = obj.properties.content;
        this.parsingContent();
        this.indexes.last = this.content.length - 1;

        if(obj.properties.first)

        	if(obj.properties.first > this.indexes.last)
        		throw 'The "first" property must be less than or equal to the number of elements in the data';
        	else
        		this.indexes.current = obj.properties.first;

        else if(obj.properties.shuffle){
        	this.content = _.shuffle(this.content);
        	this.indexes.current = 0;

        } else
			this.indexes.current = 0;

		this.setPrevAndNextIndexes();
		this.setIndexesData();
		this.render();

		if(this.indexes.last === 0){
			$('.prev').hide();
			$('.next').hide();
		
		} else if(this.indexes.last == 1){
			this.$el.hide();
			throw 'This component just work with 1 or more than 2 data elements';
		}

		if(obj.properties.autoScroll){

			if(obj.properties.autoScrollTime)
				this.properties.autoScrollTime = obj.properties.autoScrollTime;
			else
				this.properties.autoScrollTime = 5000;
        	
        	this.autoScroll();
		}		

		if(obj.properties.keyboard)
			$(document).bind("keyup", _.bind(this.logKey, this));	
	},

	logKey: function(evt) {
    	var key = evt.which;

    	if(key == 37 || key == 38 || key == 39 || key == 40){
    		this.changeElement(evt);
    		evt.preventDefault();
    	}
  	},

	setPrevAndNextIndexes: function(currentIndex){

		if(this.indexes.current === 0){
			this.indexes.prev = this.indexes.last;
    		this.indexes.next = this.indexes.current + 1;
		
		} else if(this.indexes.current + 1 > this.indexes.last){
			this.indexes.prev = this.indexes.current - 1;
			this.indexes.next = 0;
		
		} else {
			this.indexes.prev = this.indexes.current - 1;
    		this.indexes.next = this.indexes.current + 1;
		}
		
	},

	calculatePrevAndNextIndexes: function(currentIndex){
		
		var indexes = {
			current: currentIndex,
			prev: null,
			next: null
		};

		if(currentIndex === 0){
			indexes.prev = this.indexes.last;
    		indexes.next = currentIndex + 1;
		
		} else if(currentIndex + 1 > this.indexes.last){
			indexes.prev = currentIndex - 1;
			indexes.next = 0;
		
		} else {
			indexes.prev = currentIndex - 1;
    		indexes.next = currentIndex + 1;
		}

		return indexes;
	},

	setIndexesData: function(){
		this.indexesData.current = this.content[this.indexes.current];
		this.indexesData.prev = this.content[this.indexes.prev];
		this.indexesData.next = this.content[this.indexes.next];
	},

	processKey: function(evt){
		console.log('tecla');
	},

	changeElement: function(evt){
		var target = $(evt.currentTarget);

		if(!target.hasClass('current-vertical') && !target.hasClass('current-horizontal')){
			var indexOfContainer;
			if(this.properties.orientation == 'horizontal')
				indexOfContainer = $(".horizontal-carousel-element-container").index(evt.currentTarget);
			else
				indexOfContainer = $(".vertical-carousel-element-container").index(evt.currentTarget);

			var index;
			if (indexOfContainer === 0 || target.attr('id') == 'vertical-carousel-down-arrow' || target.attr('id') == 'horizontal-carousel-right-arrow' || evt.which == 40 || evt.which == 39) 
				index = this.indexes.prev;
			else
				index = this.indexes.next;

			var indexes = this.calculatePrevAndNextIndexes(index);
			_.extend(this.indexes, indexes);	
			this.setIndexesData();
			this.render();

			if(indexOfContainer === 0 || target.attr('id') == 'vertical-carousel-down-arrow' || target.attr('id') == 'horizontal-carousel-right-arrow' || evt.which == 40 || evt.which == 39){
				if(this.properties.orientation == 'horizontal'){
					$('.prev-horizontal').addClass('horizontal-animation-show-from-up');
					$('.current-horizontal').addClass('horizontal-animation-to-current-from-prev');
					$('.next-horizontal').addClass('horizontal-animation-to-next');	
				} else {
					$('.prev-vertical').addClass('vertical-animation-show-from-up');
					$('.current-vertical').addClass('vertical-animation-to-current-from-prev');
					$('.next-vertical').addClass('vertical-animation-to-next');	
				}
			
			} else {
				if(this.properties.orientation == 'horizontal'){
					$('.prev-horizontal').addClass('horizontal-animation-to-prev');
					$('.current-horizontal').addClass('horizontal-animation-to-current-from-next');
					$('.next-horizontal').addClass('horizontal-animation-show-from-down');
				} else {
					$('.prev-vertical').addClass('vertical-animation-to-prev');
					$('.current-vertical').addClass('vertical-animation-to-current-from-next');
					$('.next-vertical').addClass('vertical-animation-show-from-down');
				}
			}
		}
	},

	parsingContent: function(){
		var self = this;

		_.each(this.content, function(data){
			if(data.body && data.header && data.img)
				data.type = 'img-header-body';
			else if(data.body && data.header)
				data.type = 'header-body';
			else if(data.body && data.img)
				data.type = 'img-body';
			else if(data.body)
				data.type = 'body';
			else if(data.header && data.img)
				data.type = 'img-header';
			else if(data.header)
				data.type = 'header';
			else if(data.img)
				data.type = 'img';
			else if(data.component)
				data.type = 'component';
		});
	},

	templateChooser: function(data){
		
		switch(data.type) {
			case 'img-header-body':
		    	return Handlebars.compile($('#carousel-img-header-body-template').html())(data);
			case 'header-body':
		    	return Handlebars.compile($('#carousel-header-body-template').html())(data);
		    case 'img-body':
		    	return Handlebars.compile($('#carousel-img-text-template').html())(data);
		    case 'img-header':
		    	return Handlebars.compile($('#carousel-img-text-template').html())(data);
		    case 'header':
		    	return Handlebars.compile($('#carousel-header-template').html())(data);
		    case 'body':
		        return Handlebars.compile($('#carousel-body-template').html())(data);
		    case 'img':
		        return Handlebars.compile($('#carousel-img-template').html())(data);
		    default:
		        return null;
		}
	},

	render: function(){
		var CarouselTemplate;
		if(this.properties.orientation == 'horizontal')
			CarouselTemplate = $("#horizontal-carousel-template").html();
		else
			CarouselTemplate = $("#vertical-carousel-template").html();

		this.$el.html(Handlebars.compile(CarouselTemplate));

		if(this.properties.orientation == 'horizontal'){
			$('.prev-horizontal').html(this.templateChooser(this.indexesData.prev));
			$('.current-horizontal').html(this.templateChooser(this.indexesData.current));
			$('.next-horizontal').html(this.templateChooser(this.indexesData.next));
		
		} else {
			$('.prev-vertical').html(this.templateChooser(this.indexesData.prev));
			$('.current-vertical').html(this.templateChooser(this.indexesData.current));
			$('.next-vertical').html(this.templateChooser(this.indexesData.next));
		}

		if(this.properties.border)
			$('#carousel-wheel-wrapper').css('border','1px solid black');
		if(this.properties.width)
			$('#carousel-wheel-wrapper').css('max-width',this.properties.width);
		if(this.properties.backgroundColor)
			$('#carousel-wheel-wrapper').css('background-color',this.properties.backgroundColor);
		if(this.properties.backgroundCardsColor){
			if(this.properties.orientation == 'horizontal')
				$('.horizontal-carousel-element-container').css('background-color',this.properties.backgroundCardsColor);
			else
				$('.vertical-carousel-element-container').css('background-color',this.properties.backgroundCardsColor);
		}
		if(this.properties.arrows){
			if(this.properties.orientation == 'horizontal'){
				$('#horizontal-carousel-left-arrow').css('display','block');
				$('#horizontal-carousel-right-arrow').css('display','block');
				$('#vertical-carousel-up-arrow').css('display','none');
				$('#vertical-carousel-down-arrow').css('display','none');
			} else {
				$('#horizontal-carousel-left-arrow').css('display','none');
				$('#horizontal-carousel-right-arrow').css('display','none');
				$('#vertical-carousel-up-arrow').css('display','block');
				$('#vertical-carousel-down-arrow').css('display','block');
			}
		}
		if(this.properties.animationTime){
			$('.animated').css('-webkit-animation-duration',this.properties.animationTime);
			$('.animated').css('-moz-animation-duration',this.properties.animationTime);
			$('.animated').css('-o-animation-duration',this.properties.animationTime);
			$('.animated').css('animation-duration',this.properties.animationTime);
		}
	},

	autoScroll: function(){
		var self = this;

		this.timer = window.setInterval(function(){
			if(self.properties.autoScroll){
				if(self.properties.orientation == 'horizontal')
					$('.horizontal-carousel-element-container').trigger('click');
				else
					$('.vertical-carousel-element-container').trigger('click');
			}
		}, this.properties.autoScrollTime);
	},

	stopScroll: function () {
        this.properties.autoScroll = false;
        clearInterval(this.timer);
    },

});