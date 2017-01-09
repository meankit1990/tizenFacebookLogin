.controller('ProgramGuideController',
	[ '$rootScope', '$scope','$state','httpservice','focusService','popupService',
		function($rootScope, $scope, $state,httpservice,focusService,popupService) {
		focusService.elements.programGuide = [];
		$rootScope.showVideoDesc=false;
		$rootScope.fromHeader = "programGuide.list0";
		$rootScope.disableHeaderLogin=false;
		
		$rootScope.loginDisable ="";
		 $scope.firstElement = {
			        "padding-top" : "1.6vw"
			    }
		 var activeColor ="";
		 if (ISLC) {
			 activeColor="#127090";
		}else{
			 activeColor="#e1eadc";
		}
		 var current1 = {
				 
				 "background-color":activeColor
		 }
		 var current2 = {
				 "background-color":"transparent"
		 }
		 
		ApiHelper.programGuide(httpservice,function(success){
			var shows = success.guide;
			var newDate = new Date(shows[0].startTime.toString());
			var res = shows[0].startTime.toString().split(" ");			
// var guideDateFormat = createDate(res[0]);
			var formattedDate = createFormattedDate(res);
			var arrMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
						var guideDateFormat = new Date(formattedDate);
						$scope.guideDate = guideDateFormat.getDate();
						$scope.guideMonth = arrMonth[guideDateFormat.getMonth()];
						$scope.guideYear = 1900 + guideDateFormat.getYear();
						angular.forEach(shows,function(show){
							guideDateFormat = createFormattedDate(show.startTime.toString().split(" "));
							var d = new Date(guideDateFormat);
							var hrs = d.getHours();
							var mins= d.getMinutes();
							hrs = (hrs<10)?"0"+hrs.toString():hrs.toString();
							mins = (mins<10)?"0"+mins.toString():mins.toString();
							show.startTime = hrs + ":"+mins;
							guideDateFormat = createFormattedDate(show.endTime.toString().split(" "));
							d = new Date(guideDateFormat);
							 hrs = d.getHours();
							 mins= d.getMinutes();
								hrs = (hrs<10)?"0"+hrs.toString():hrs.toString();
								mins = (mins<10)?"0"+mins.toString():mins.toString();
							show.endTime = hrs + ":"+mins;
							
							var currentDate = new Date();
							d.setMonth(d.getMonth());
							
							var diffDate = currentDate - d;
							var diffInHours = (diffDate / 1000 / 60 /60);
							if(diffInHours <= 0 && diffInHours > -1 ){
								show.current = current1;
							}else{
								show.current = current2;
							}
						});
						setTimeout(function(){
							$scope.shows = shows;
							$scope.$apply();
							focusService.changeCurrentFocus("programGuide",0);
						},100);
		},function(failure){
			var params ={'message':'Unable to fetch program guide','buttonText':'OK'};
			popupService.showErrorDialog(params);
		});
		function createFormattedDate(dt){
			var timeZone=" UTC";
			var formatDate = createDate(dt[0]);
			formatDate = formatDate + " " + dt[1]+timeZone;
			return formatDate;
		}
		function createDate(dt){
			var arrMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
			var dateString;
			var dtSplit = dt.toString().split("-");
			dateString = arrMonth[dtSplit[1]-1] + " "+ dtSplit[2]+" " + dtSplit[0];
			return dateString;
		}
		
		function createTime(tm){
			var timeSplit = tm.toString().split(":");
			var timeString = timeSplit[0]+ ":" + timeSplit[1];
			return timeString;
		}
	}])