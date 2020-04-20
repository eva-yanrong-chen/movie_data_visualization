 //GRID SETUP
var w = 1143,
    h = 800,
    z = 50,
    x = 16,
    y = h/z;


//SVG SETUP
var svg = d3.select('svg')
    .attr('width', w + 250)
    .attr('height', h + 100)

//for movie details
var detailGroup = svg.append('g')
    .attr('transform', 'translate(900, 135)')
    .attr('id', 'detailGroup');

//for clapperboards
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

    console.log(filteredMovies);

    // SLIDER
    var slider = d3
        .sliderTop()
        .min(1916)
        .max(2016)
        .step(1)
        .width(800)
        .default(yearInput)
        .on('onchange', val => {
            yearInput = val;
            // update filteredMovies when the value of the slider changes
            filteredMovies = movies.filter(function (d) {
                if (d.title_year == yearInput) {
                    return d;
                } else {
                    return;
                }
            });
            console.log(filteredMovies);
            updateClapperboard(filteredMovies);
            updateScatterPlot(filteredMovies);
        });

    var gTime = d3
        .select('div#slider')
        .append('svg')
        .attr('width', 900)
        .attr('height', 60)
        .append('g')
        .attr('transform', 'translate(40, 50)');

    gTime.call(slider);
    
    
    //LEGEND
    // var legend = svg.append('text')
    //     .text('Legend')
    //     .attr('fill', '#FFFFFF')
    //     .attr('transform', 'translate(907, 0)')

    var legendIcon = svg.append('g')
        .attr('transform', 'translate(900, 40)');

    legendIcon.append('rect')
        .attr('width', 58)
        .attr('height', 11.6)
        .attr('fill', '#293B4B')
        .attr('transform', 'rotate(-16)');

    legendIcon.append('rect')
        .attr('width', 58)
        .attr('height', 34.79)
        .attr('fill', '#293B4B')
        .attr('transform', 'translate(2.4, 12)');

    legendIcon.append('rect')
        .attr('width', 48)
        .attr('height', 11.6)
        .attr('fill', '#FF5A28')
        .attr('transform', 'rotate(-16)');

    legendIcon.append('rect')
        .attr('width', 30)
        .attr('height', 15)
        .attr('fill', '#981CB7')
        .attr('transform', 'translate(4.4, 14)');

    legendIcon.append('rect')
        .attr('width', 38)
        .attr('height', 15)
        .attr('fill', '#BCE1FF')
        .attr('transform', 'translate(4.4, 31)');

    //LEGEND CALLOUTS
    legendIcon.append('line')
        .attr('x1', 24)
        .attr('y1', 0)
        .attr('x2', 82)
        .attr('y2', 0)
        .attr('stroke-width', 1)
        .attr('stroke', '#FFFFFF');

    legendIcon.append('line')
        .attr('x1', 24)
        .attr('y1', 22)
        .attr('x2', 82)
        .attr('y2', 22)
        .attr('stroke-width', 1)
        .attr('stroke', '#FFFFFF');

    legendIcon.append('line')
        .attr('x1', 24)
        .attr('y1', 38)
        .attr('x2', 82)
        .attr('y2', 38)
        .attr('stroke-width', 1)
        .attr('stroke', '#FFFFFF');

    //LEGEND LABELS
    legendIcon.append('text')
        .text('Gross Revenue')
        .attr('fill', '#FFFFFF')
        .attr('transform', 'translate(90, 4)')
        .attr('font-size', 12);

    legendIcon.append('text')
        .text('Popularity')
        .attr('fill', '#FFFFFF')
        .attr('transform', 'translate(90, 26)')
        .attr('font-size', 12);

    legendIcon.append('text')
        .text('IMDb Score')
        .attr('fill', '#FFFFFF')
        .attr('transform', 'translate(90, 42)')
        .attr('font-size', 12);

    //COLOR LABELS
    legendIcon.append('rect')
        .attr('fill', 'rgb(255, 90, 40)')
        .attr('width', 10)
        .attr('height', 10)
        .attr('transform', 'translate(200, -6)');

    legendIcon.append('rect')
        .attr('fill', 'rgb(253, 181, 82)')
        .attr('width', 10)
        .attr('height', 10)
        .attr('transform', 'translate(200, 14)');

    legendIcon.append('rect')
        .attr('fill', 'rgb(255, 250, 175)')
        .attr('width', 10)
        .attr('height', 10)
        .attr('transform', 'translate(200, 34)');

    legendIcon.append('text')
        .text('Grossed more than $500,000')
        .attr('font-size', 10)
        .attr('fill', '#FFFFFF')
        .attr('transform', 'translate(220, 3)');

    legendIcon.append('text')
        .text('Grossed more than $250,000')
        .attr('font-size', 10)
        .attr('fill', '#FFFFFF')
        .attr('transform', 'translate(220, 23)');

    legendIcon.append('text')
        .text('Grossed less than $250,000')
        .attr('font-size', 10)
        .attr('fill', '#FFFFFF')
        .attr('transform', 'translate(220, 43)');
    
    d3.selectAll(".sort")
         //on click actions
        .on("click", function(d) {
            console.log("Working");
        
            selectedValue = this.id;
            // Sort descending by the prob of survival
            filteredMovies.sort( function(a, b){
                return b[selectedValue] - a[selectedValue];
            });
            console.log(filteredMovies);
            selectedValue.activeElement;
            
            
            //CLAPPERBOARD
            var clapperboard = chartG.selectAll('.rect')
                .data(filteredMovies, function(d) {
                    return d.movie_id;
                })
                .transition()
                .duration(750)
                .ease(d3.easeLinear)
                .attr('transform', function translate(d, i) {
                    return 'translate('+(i%x)*z+','+Math.floor(i/x)*z+')';
                });
        
    });
    
    //SCALES

    // popularityScale = d3.scaleLinear()
    //     .domain(popularityDomain)
    //     .range([1, 27]);

    // userRatingDomain = [6, 1676169];

    // userRatingScale = d3.scaleLinear()
    //     .domain(userRatingDomain)
    //     .range([6, 27]);

    // criticRatingDomain = [2, 10];

    // criticRatingScale = d3.scaleLinear()
    //     .domain(criticRatingDomain)
    //     .range([2, 27]);

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

    popularityDomain = [6, 1676169];
    //popularityDomain = [1, 5060];

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

    imdbScoreDomain = [2, 10];


    // popularityDomain = [1, 5060];

    // revenueScale = d3.scaleLinear()
    //     .domain(revenueDomain)
    //     .interpolate(d3.interpolateHcl)
    //     .range([d3.rgb(255, 250, 175), d3.rgb(255, 90, 40)]);

    revenueColorScale = d3.scaleQuantize()
    .domain(revenueDomain)
    .range([d3.rgb(255, 250, 175), d3.rgb(253, 181, 82), d3.rgb(255, 90, 40)]);

    revenueWidthScale = d3.scaleLinear()
    .domain(revenueDomain)
    .range([1, 27]);

    imdbWidthScale = d3.scaleLinear()
    .domain(imdbScoreDomain)
    .range([2, 27]);

    popularityWidthScale = d3.scaleLinear()
    .domain(popularityDomain)
    .range([6, 27]);


    // clapperboardEnter.append('rect')
    //     .attr('width', 27.08)
    //     .attr('height', 7.22)
    //     .attr('fill', function(d) {
    //         return revenueScale(d.gross);
    //     })
    //     .attr('transform', 'translate(2, 17)');

    updateClapperboard(filteredMovies);
    updateScatterPlot(filteredMovies);
});

function updateClapperboard(filteredMovies) {
    var bool = "false";
    //CLAPPERBOARD
    var clapperboard = chartG.selectAll('.rect')
        .data(filteredMovies, function (d) {
            return d.movie_id;
        });

    var clapperboardEnter = clapperboard.enter()
        .append('g')
        .attr('class', 'rect')
        .attr('transform', function translate(d, i) {
            return 'translate('+(i % x) * z +',' + Math.floor(i / x) * z +')';
        })
        .on("mouseover", function(d){
            //@Rachel the hovering code is here!!
            //Delete this comment when you're done
            //Changing all previous plot's opacity back to 0.2
            if(bool == "false"){

            d3.selectAll(".gross-plot").attr("style", 'opacity:0.2; fill:#42c5f5');
            d3.selectAll(".imdb-plot").attr("style", 'opacity:0.2; fill:#42c5f5');

            //Change the hovered dot's opacity to 1
            d3.selectAll("#id" + d.movie_id).attr('style', 'opacity:1; fill:yellow')

            selectedTitle = detailGroup.append('text')
                .attr('id', 'selectedTitle');
            d3.select('#selectedTitle')
                .text(d.movie_title);
            selectedScore = detailGroup.append('text')
                .attr('id', 'selectedScore')
                .attr('transform', 'translate(0, 25)');
            d3.select('#selectedScore')
                .text('IMDb Score : '+d.imdb_score);
            selectedRev = detailGroup.append('text')
                .attr('id', 'selectedRev')
                .attr('transform', 'translate(0, 45)');
            d3.select('#selectedRev')
                .text('Gross Revenue : $'+d.gross);
            selectedPop = detailGroup.append('text')
                .attr('id', 'selectedPop')
                .attr('transform', 'translate(0, 65)');
            d3.select('#selectedPop')
                .text('Popularity : '+d.num_voted_users);  

            }
            
        })
        .on('click', function(d) {
            // Use D3 to select element, change opacity
            if(bool == "false") {
            d3.selectAll('.rect').attr('style', 'opacity: 100%')
            d3.selectAll("#id" + d.movie_id).attr('style', 'opacity:1; fill:yellow; outline-style:solid; outline-color:purple; outline-width:medium')
            d3.select(this).attr('style','stroke: #FFFFFF;');
                bool = "true";
            } else {
                d3.selectAll(".gross-plot").attr("style", 'opacity:0.2; fill:#42c5f5');
                d3.selectAll(".imdb-plot").attr("style", 'opacity:0.2; fill:#42c5f5');
                d3.selectAll('.rect').attr('style', 'opacity: 100%')
                bool = "false";
            }
        });


    clapperboardEnter.append('rect')
        .attr('width', 27.08)
        .attr('height', 5.42)
        .attr('fill', '#293B4B')
        .attr('transform', 'rotate(-16)');

    clapperboardEnter.append('rect')
        .attr('width', 27.08)
        .attr('height', 16.25)
        .attr('fill', '#293B4B')
        .attr('transform', 'translate(2, 6)');

    clapperboardEnter.append('rect')
        .attr('width', function (d) {
            return revenueWidthScale(d.gross);
        })
        .attr('height', 5.42)
        .attr('fill', function (d) {
            return revenueColorScale(d.gross);
        })
        .attr('transform', 'rotate(-16)');

    clapperboardEnter.append('rect')
        .attr('width', function (d) {
            return popularityWidthScale(d.num_voted_users);
        })
        .attr('height', 6)
        .attr('fill', '#981CB7')
        .attr('transform', 'translate(3, 7)');

    clapperboardEnter.append('rect')
        .attr('width', function (d) {
            return imdbWidthScale(d.imdb_score);
        })
        .attr('height', 6)
        .attr('fill', '#BCE1FF')
        .attr('transform', 'translate(3, 14)');

    clapperboard.exit().remove();

};
    
function updateScatterPlot(filteredMovies) {
    
    // Remove all old group plots before starting to draw new ones
    svg.selectAll('.group').remove();

    // SCATTERPLOT
    var votedExtent = d3.extent(filteredMovies, function(d){
            return +d['num_voted_users']/1000;
    });
    var grossExtent = d3.extent(filteredMovies, function(d){
            return +d['gross']/1000000;
    });

    var scoreExtent = d3.extent(filteredMovies, function(d){
            return +d['imdb_score'];
    });
    
    var xScale = d3.scaleLinear().domain(votedExtent).range([0, 300]);
    var yScale = d3.scaleLinear().domain(grossExtent).range([0, 150]);
    var yScale2 = d3.scaleLinear().domain(scoreExtent).range([150, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxisTop = d3.axisLeft(yScale);
    var yAxisBottom = d3.axisLeft(yScale2);
    
    var group = svg.append('g')
        .attr('transform', 'translate(850, -120)')
        .attr('class', 'group');
    
    var gross_plot = group.selectAll('.gross-plot')
        .data(filteredMovies)
        .enter()
        .append('circle')
        .attr('class', 'gross-plot')
        .attr('id', function(d) { return "id"+d.movie_id})
        .attr("cx", function(d) { return xScale(d.num_voted_users)/1000;})
        .attr("cy", function(d) { return yScale(d.gross)/1000000;})
        .attr('transform', 'translate(110,550)')
        .attr("r", function(d) {return 3;});


    var imdb_plot = group.selectAll('.imbd-plot')
        .data(filteredMovies)
        .enter()
        .append('g')
        .attr('class', 'imdb-plot')
        .attr('id', function(d) { return "id"+d.movie_id})
//        .attr("cx", function(d) { return xScale(d.num_voted_users);})
//        .attr("cy", function(d) { return yScale2(d.imdb_score);})
        .attr('transform', function(d) {
            return 'translate('+xScale(d.num_voted_users)/1000+','+yScale2(d.imdb_score)+')';
        });
        
    imdb_plot.append('circle')
        //.attr('class', 'imdb-plot-circle')
        .attr("r", function(d) {return 3;})
        .attr('transform', 'translate(110,395)');
        

    group.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(100,390)')
        .call(yAxisBottom);

    group.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(100,540)')
        .call(xAxis);

    group.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(100,545)')
        .call(yAxisTop);

    group.append('text')
            .attr('class', 'label')
            .attr('transform', 'translate(300,580)')
            .text('# of User Reviews (k)');

    group.append('text')
            .attr('class', 'label')
            .attr('transform', 'translate(120,370)')
            .attr("font-weight", "bold")
            .text('Movie Incomes and Ratings Across Popularity');    

    group.append('text')
            .attr('class', 'label')
            .attr('transform', 'translate(50,670) rotate(-90)')
            .text('Gross Income (mil)');

    group.append('text')
            .attr('class', 'label')
            .attr('transform', 'translate(50,500) rotate(-90)')
            .text('IMDb Score');
};

var svg = d3.select("svg");

//}






