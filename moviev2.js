// Global function called when select element is changed
//function onCategoryChanged() {
//    var select = d3.select('#categorySelect').node();
//    // Get current value of select element
//    var category = select.options[select.selectedIndex].value;
//    // Update chart with the selected category of letters
//    updateSort(category);
//}

//GRID SETUP
var w = 1000,
    h = 600,
    z = 50,
    x = w/z,
    y = h/z;


//SVG SETUP
var svg = d3.select('svg')
    .attr('width', w+100)
    .attr('height', h+100);

var chartG = svg.append('g')
    .attr('transform', 'translate(30, 30)');


d3.csv('movie_metadata.csv').then(function(dataset) {

    //DATA SHOWING ALL MOVIES FROM 2010 TO TEST
    movies = dataset;
    
    for (var i = 0; i < movies.length; i++) {
        movies[i].movie_id = i;
    }
    
    var yearInput = 2009;

    //Variable that stores the movies for the year selected 
    filteredMovies = movies.filter(function(d) {
        if (d.title_year == yearInput) {
            return d;
        } else {
            return;
        }
    });
    
    d3.selectAll(".sort")
         //on click actions
        .on("click", function(d) {
        console.log("Working");
        
        selectedValue = this.value;
        // Sort descending by the prob of survival
        filteredMovies.sort( function(a, b){
            return b[selectedValue] - a[selectedValue];
        });
        console.log(filteredMovies);
        
        
        //CLAPPERBOARD
        var clapperboard = chartG.selectAll('.rect')
            .data(filteredMovies, function(d) {
                return d.movie_id;
            })
            .attr('transform', function translate(d, i) {
                return 'translate('+(i%x)*z+','+Math.floor(i/x)*z+')';
            });
        
    });
    
    d3.selectAll('g')
//        .data(filteredMovies, function(d) {
//            return d.movie_id;
//        })
        .attr('class', 'rect')
        .on("mouseover", function(d){
            console.log("hover");
        
        selectedValue = this.value;
        console.log(selectedValue);
    });
    
    function details(d) {
        var feature = d.feature;
        var data = feature.properties.data;

        var width = 300;
        var height = 80;
        var margin = {left:20,right:15,top:40,bottom:40};
        var parse = d3.timeParse("%m");
        var format = d3.timeFormat("%b");

        var div = d3.create("div")
        var svg = div.append("svg")
            .attr("width", width+margin.left+margin.right)
            .attr("height", height+margin.top+margin.bottom);
        
        var title = svg.append("text")
            .style("font-size", "20px")
            .text(feature.properties.title)
            .attr("x", width/2 + margin.left)
            .attr("y", 30)
            .attr("text-anchor","middle");
    
        return div.node();
    }

    
    
    //SCALES
    popularityDomain = [1, 5060];

    popularityScale = d3.scaleLinear()
        .domain(popularityDomain)
        .range([1, 30]);

    userRatingDomain = [6, 1676169];

    userRatingScale = d3.scaleLinear()
        .domain(userRatingDomain)
        .range([6, 30]);

    criticRatingDomain = [2, 10];

    criticRatingScale = d3.scaleLinear()
        .domain(criticRatingDomain)
        .range([2, 30]);

    revenueDomain = [0, 7.61e8];

    revenueScale = d3.scaleLinear()
        .domain(revenueDomain)
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb(255, 250, 175), d3.rgb(255, 90, 40)]);

    
    
    //CLAPPERBOARD
    var clapperboard = chartG.selectAll('.rect')
        .data(filteredMovies, function(d) {
            return d.movie_id;
        });

    var clapperboardEnter = clapperboard.enter()
        .append('g')
        .attr('class', 'rect')
        .attr('transform', function translate(d, i) {
            return 'translate('+(i%x)*z+','+Math.floor(i/x)*z+')';
        });

//    clapperboard.merge(clapperboardEnter)
//        .transisition()
//        .duration(750)
//        .attr('transform', function(d, i) {
//            return 'translate('+(i%x)+z+','+Math.floor(i/x)*z+')';
//        });

    clapperboardEnter.append('rect')
        .attr('width', 30)
        .attr('height', 6)
        .attr('fill', '#293B4B')
        .attr('transform', 'rotate(-16)');

    clapperboardEnter.append('rect')
        .attr('width', 30)
        .attr('height', 18)
        .attr('fill', '#293B4B')
        .attr('transform', 'translate(2, 6)');

    clapperboardEnter.append('rect')
        .attr('width', function(d) {
            return popularityScale(d.num_user_for_reviews);
        })
        .attr('height', 6)
        .attr('fill', '#2879D9')
        .attr('transform', 'rotate(-16)');

    clapperboardEnter.append('rect')
        .attr('width', function(d) {
            return userRatingScale(d.num_voted_users);
        })
        .attr('height', 4)
        .attr('fill', '#981CB7')
        .attr('transform', 'translate(3, 7)');

    clapperboardEnter.append('rect')
        .attr('width', function(d) {
            return userRatingScale(d.imdb_score);
        })
        .attr('height', 4)
        .attr('fill', '#BCE1FF')
        .attr('transform', 'translate(3, 12)');

    clapperboardEnter.append('rect')
        .attr('width', 30)
        .attr('height', 8)
        .attr('fill', function(d) {
            return revenueScale(d.gross);
        })
        .attr('transform', 'translate(2, 17)');




    // SCATTERPLOT
    var xScale = d3.scaleLinear().range([0, 300]);
    var yScale = d3.scaleLinear().range([0, 150])
    var yScale2 = d3.scaleLinear().range([150, 0])

    var votedExtent = d3.extent(filteredMovies, function(d){
            return +d['num_voted_users'];
    });
    var grossExtent = d3.extent(filteredMovies, function(d){
            return +d['gross'];
    });

    var scoreExtent = d3.extent(filteredMovies, function(d){
            return +d['imdb_score'];
    });

    xScale.domain(votedExtent);
    yScale.domain(grossExtent);
    yScale2.domain(scoreExtent);

    var xAxis = d3.axisBottom(xScale);
    var yAxisTop = d3.axisLeft(yScale);
    var yAxisBottom = d3.axisLeft(yScale2);

    graph.selectAll('circle')
    .data(filteredMovies)
    .enter().append('circle')
    .attr("cx", function(d) { return xScale(d.num_voted_users);})
    .attr("cy", function(d) { return yScale(d.gross);})
    .attr('transform', 'translate(110,550)')
    .attr("r", function(d) {return 3;});

    graph.selectAll('cir')
    .data(filteredMovies)
    .enter().append('circle')
    .attr("cx", function(d) { return xScale(d.num_voted_users);})
    .attr("cy", function(d) { return yScale2(d.imdb_score);})
    .attr("r", function(d) {return 3;})
    .attr('transform', 'translate(110,395)')
    .append('text')
        .attr('y', -10)
        .text(function(d) {
            return d.movie_title;
        });

    graph.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(100,390)')
        .call(yAxisBottom);

    graph.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(100,540)')
        .call(xAxis);

    graph.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(100,545)')
        .call(yAxisTop);

    graph.append('text')
            .attr('class', 'title')
            .attr('transform', 'translate(430,550)')
            .text('# of User Reviews');

    graph.append('text')
            .attr('class', 'label')
            .attr('transform', 'translate(100,350)')
            .attr("font-weight", "bold")
            .text('Movie Incomes and Ratings Across Popularity');    

    graph.append('text')
            .attr('class', 'label')
            .attr('transform', 'translate(20,670) rotate(-90)')
            .text('Gross Income');

    graph.append('text')
            .attr('class', 'label')
            .attr('transform', 'translate(20,500) rotate(-90)')
            .text('IMBD Score');
});

var graph = d3.select("svg");





