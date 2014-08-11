var VerticalCarousel = Backbone.View.extend({

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
		'click .vertical-carousel-element-container' : 'changeElement'
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
			$('#vertical-carousel-wrapper').hide();
			throw 'This component just work with 1 or more than 2 data elements';
		}

		if(obj.properties.autoScroll){

			if(obj.properties.autoScrollTime)
				this.properties.autoScrollTime = obj.properties.autoScrollTime;
			else
				this.properties.autoScrollTime = 5000;
        	
        	this.autoScroll();
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

	changeElement: function(evt){
		var target = $(evt.currentTarget);

		if(!target.hasClass('current')){
			var indexOfContainer = $(".vertical-carousel-element-container").index(evt.currentTarget);
			var index;
			if (indexOfContainer === 0) 
				index = this.indexes.prev;
			else
				index = this.indexes.next;

			var indexes = this.calculatePrevAndNextIndexes(index);
			_.extend(this.indexes, indexes);	
			this.setIndexesData();
			this.render();

			if(indexOfContainer === 0){
				$('.prev').addClass('animation-show-from-up');
				$('.current').addClass('animation-to-current-from-prev');
				$('.next').addClass('animation-to-next');
			
			} else {
				$('.prev').addClass('animation-to-prev');
				$('.current').addClass('animation-to-current-from-next');
				$('.next').addClass('animation-show-from-down');
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
		    	return Handlebars.compile($('#vertical-carousel-img-header-body-template').html())(data);
			case 'header-body':
		    	return Handlebars.compile($('#vertical-carousel-header-body-template').html())(data);
		    case 'img-body':
		    	return Handlebars.compile($('#vertical-carousel-img-text-template').html())(data);
		    case 'img-header':
		    	return Handlebars.compile($('#vertical-carousel-img-text-template').html())(data);
		    case 'header':
		    	return Handlebars.compile($('#vertical-carousel-header-template').html())(data);
		    case 'body':
		        return Handlebars.compile($('#vertical-carousel-body-template').html())(data);
		    case 'img':
		        return Handlebars.compile($('#vertical-carousel-img-template').html())(data);
		    default:
		        return null;
		}
	},

	render: function(){
		
		var VerticalCarouselTemplate = $("#vertical-carousel-template").html();
		this.$el.html(Handlebars.compile(VerticalCarouselTemplate));

		$('.prev').html(this.templateChooser(this.indexesData.prev));
		$('.current').html(this.templateChooser(this.indexesData.current));
		$('.next').html(this.templateChooser(this.indexesData.next));


		if(this.properties.width)
			$('#vertical-carousel-wrapper').css('max-width',this.properties.width);
		if(this.properties.backgroundColor)
			$('#vertical-carousel-wrapper').css('background-color',this.properties.backgroundColor);
		if(this.properties.backgroundCardsColor)
			$('.vertical-carousel-element-container').css('background-color',this.properties.backgroundCardsColor);
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
			if(self.properties.autoScroll)
				$('.vertical-carousel-element-container').trigger('click');
		}, this.properties.autoScrollTime);
	},

	stopScroll: function () {
        this.properties.autoScroll = false;
        clearInterval(this.timer);
    },

});