window.onload = function() {
	
	$('img').on("click",null,function(){
	
		genie.splitImage( event );
	});

	var genie = {
	
		settings:{
			rowHeight:1,
			firstStageSpeed:0.5,
			horizontalPosition: 500,
			verticalPosition: 500
		},
		
		containerDiv : null,
		height : null,
		width : null,
		
		curve : CustomEase.create("curve", "M0,0,C0.083,0.294,0.214,0.596,0.468,0.82,0.588,0.926,0.752,1,1,1"),
		
		splitImage : function( e ){

			height = e.target.height;
			width = e.target.width;
			containerDiv = $(e.target).parent();
			var imageSrc = e.target.src;
			
			var rows = height / this.settings.rowHeight;
			var htm = '';
			var i = 0;
			
			for(;i<rows; i++){
				htm += '<div class="row row_' + i + '" style="width:' + width + 'px; height: ' + this.settings.rowHeight + 'px; background-image:url(' + imageSrc + '); background-position: 0px -' + i*this.settings.rowHeight + 'px"></div>'
			}
			
			$(containerDiv).html(htm);
			
			this.colapse();
		
		},
	
		colapse : function() {
		
			var b = $(containerDiv).children();
			var inverted_b = $(b.get().reverse());
			var i;
			var tweenStartTime;
			
			//setup timelines
			var masterTimeLine = new TimelineMax({paused:true});
			var squezeTimeLine = new TimelineMax();
			var movementTimeline = new TimelineMax();
			var verticalMoveTimeLine = new TimelineMax();
			
			//Generate the squeezing effect
			i = b.length - 1;
			tweenStartTime = 0;
			
			for(;i>=0; i--){
				var bezierRatio = this.curve.getRatio(i/b.length);
				
				squezeTimeLine.add( 
					TweenLite.to(
						inverted_b[i], 
						this.settings.firstStageSpeed, 
						{scaleX:0.01,scaleY:bezierRatio * 5, transformOrigin:"50 50"}
						),
						bezierRatio * 0.7
					);
				
				console.log("index is " + i);
				console.log("curve ratio is " + i/inverted_b.length);
			}
					
			//Generate movement
			i = b.length - 1;
			tweenStartTime = 0;
			var V_pos = this.settings.verticalPosition;
			
			for(;i>=0; i--){
				V_pos = V_pos + 1;
				tweenStartTime = tweenStartTime + 0.002 * this.settings.firstStageSpeed;
				movementTimeline.add( 
					TweenLite.to(b[i], this.settings.firstStageSpeed, {
						x:this.settings.horizontalPosition, 
						y:V_pos, 
						transformOrigin:"50 50"})
				,tweenStartTime );
			}
			
			//Add embedded timeslines to master timeline
			masterTimeLine.add(squezeTimeLine,0);
			masterTimeLine.add(movementTimeline,0.5);
			
			masterTimeLine.play();
		}
	}


}