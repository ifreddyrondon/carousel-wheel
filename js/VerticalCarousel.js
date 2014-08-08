// TODO: hacer cuando son solo 2 o 1 componente
//		 cuando comience en 0		 

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

        if(!obj.data || (obj.data.elements.length - 1) < 0)
        	throw 'Data not found';
        
        this.data = obj.data;
        this.indexes.last = this.data.elements.length - 1;

        if(obj.properties.first)

        	if(obj.properties.first > this.indexes.last)
        		throw 'The "first" property must be less than or equal to the number of elements in the data';
        	else
        		this.indexes.current = obj.properties.first;
        else
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
		this.indexesData.current = this.data.elements[this.indexes.current];
		this.indexesData.prev = this.data.elements[this.indexes.prev];
		this.indexesData.next = this.data.elements[this.indexes.next];
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

	render: function(){
		var template = Handlebars.compile($("#vertical-carousel-template").html());

		_.each(this.indexesData, function(data){
			if(data.body && data.header && data.img)
				console.log('todo');
			else if(data.body && data.header)
				console.log('body and header');
			else if(data.body && data.img)
				console.log('body and img');
			else if(data.body)
				console.log('body');
			else if(data.header && data.img)
				console.log('header and img');
			else if(data.header)
				console.log('header');
			else if(data.img)
				console.log('img');
		});


		var html = template({elements: this.indexesData});
		this.$el.html(html);

		if(this.properties.backgroundColor)
			$('.vertical-carousel-element-container').css('background-color',this.properties.backgroundColor);
	}

});


var data = {
	elements: [
		{
			img:'necessary/img/poster_1.jpg',
			header: 'asdasdas',
			body: 'adsasd'
		},
		{
			img:'necessary/img/poster_2.jpg',
		},
		{
			body: 'adsasd'
		},
		{
			img:'necessary/img/poster_3.jpg',
			body: 'adsasd'
		},
		{
			header: 'asdasdas',
		},
		{
			img:'necessary/img/poster_4.jpg',
			header: 'adsasd'
		},
		{
			img:'necessary/img/poster_5.jpg',
			header: 'asdasdas',
			body: 'adsasd'
		},
		{
			header: '0',
			body: 'You can do it'
		},
		{
			header: '1',
			body: 'You can do it'
		},
		{
			header: '2',
			body: 'You can do it'
		},
		{
			header: '3',
			body: 'You can do it'
		},
		{
			header: '4',
			body: 'You can do it'
		},
		{
			header: '5',
			body: 'You can do it'
		},
		{
			header: '6',
			body: 'You can do it'
		},
		{
			header: '7',
			body: 'You can do it'
		},
		{
			img:'necessary/img/poster_1.jpg',
		},
		{
			img:'necessary/img/poster_2.jpg',
		},
		{
			img:'necessary/img/poster_3.jpg',
		},
		{
			img:'necessary/img/poster_4.jpg',
		},
		{
			img:'necessary/img/poster_5.jpg',
		},
		{
			img:'necessary/img/poster_6.jpg',
		},
	]
};


new VerticalCarousel({
	properties: {
		$el : $('#vertical_carousel'),
		// backgroundColor: '#ff00ff'
		// first : 3
	},
	data: data
});