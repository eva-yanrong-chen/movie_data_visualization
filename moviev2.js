// Global function called when select element is changed
// function onCategoryChanged() {
//    var select = d3.select('#categorySelect').node();
//    // Get current value of select element
//    var category = select.options[select.selectedIndex].value;
//    // Update chart with the selected category of letters
//    updateSort(category);
// }

//GRID SETUP
var w = 1500,
    h = 800,
    z = 50,
    x = 16,
    y = h/z;


//SVG SETUP
var svg = d3.select('svg')
    .attr('width', w+100)
    .attr('height', h+100)
    // .attr('width', w+30)
    // .attr('height', h+30);

var chartG = svg.append('g')
    // .attr('width', w+30)
    // .attr('height', w+30)
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

    // Slider
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
        });

    var gTime = d3
        .select('div#slider')
        .append('svg')
        .attr('width', 900)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(40, 80)');

    gTime.call(slider);
    
//    // Sort descending by the prob of survival
//    filteredChar.sort( function(a, b){
//        return b.probability_of_survival - a.probability_of_survival;
//    });
    
//    var sortBy = {
//        score: d3.comparator()
//            .order(d3.descending, function(d) { return d.imdb_score; }),
//        revenue: d3.comparator()
//            .order(d3.descending, function(d) { return d.gross; }),
//        popularity: d3.comparator()
//            .order(d3.descending, function(d) { return d.num_voted_users; })
//    };
    
    d3.selectAll(".sort")
        .on("click", function(d) {
        console.log("Working");
        
        selectedValue = this.id;
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
    .range([d3.rgb(255, 250, 175), d3.rgb(252, 206, 110),
        d3.rgb(254, 155, 60), d3.rgb(255, 90, 40)]);

    revenueWidthScale = d3.scaleLinear()
    .domain(revenueDomain)
    .range([1, 27]);

    imdbWidthScale = d3.scaleLinear()
    .domain(imdbScoreDomain)
    .range([2, 27]);

    popularityWidthScale = d3.scaleLinear()
    .domain(popularityDomain)
    .range([6, 27]);

    //LEGEND
    var legend = svg.append('text')
        .text('Legend')
        .attr('fill', '#FFFFFF')
        .attr('transform', 'translate(1107, 80)')

    var legendIcon = svg.append('g')
        .attr('transform', 'translate(1100, 15)');

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



    // clapperboardEnter.append('rect')
    //     .attr('width', 27.08)
    //     .attr('height', 7.22)
    //     .attr('fill', function(d) {
    //         return revenueScale(d.gross);
    //     })
    //     .attr('transform', 'translate(2, 17)');

    updateClapperboard(filteredMovies);
});

function updateClapperboard(filteredMovies) {
    //CLAPPERBOARD
    var clapperboard = chartG.selectAll('.rect')
        .data(filteredMovies, function (d) {
            return d.movie_id;
        })

    var clapperboardEnter = clapperboard.enter()
        .append('g')
        .attr('class', 'rect')
        .attr('transform', function translate(d, i) {
            return 'translate(' + (i % x) * z + ',' + Math.floor(i / x) * z + ')';
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

    // SCATTERPLOT
    //function updateClapperboard(filteredMovies) {

        var votedExtent = d3.extent(filteredMovies, function(d){
                return +d['num_voted_users'];
        });
        var grossExtent = d3.extent(filteredMovies, function(d){
                return +d['gross'];
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
            .attr('transform', 'translate(850, -200)');
        
        var gross_plot = group.selectAll('.gross-plot')
            .data(filteredMovies)
            .enter().append('circle')
            .attr('class', 'gross-plot')
            .attr("cx", function(d) { return xScale(d.num_voted_users);})
            .attr("cy", function(d) { return yScale(d.gross);})
            .attr('transform', 'translate(110,550)')
            .attr("r", function(d) {return 3;});

            gross_plot.append('text')
                .attr('class', "plot-label")
                .attr('transform', 'translate(110,385)')
                .text(function(d) {
                    return d.movie_title;
                });

        var imdb_plot = group.selectAll('.imbd-plot')
            .data(filteredMovies)
            .enter().append('g')
            .attr('class', 'imdb-plot')
    //        .attr("cx", function(d) { return xScale(d.num_voted_users);})
    //        .attr("cy", function(d) { return yScale2(d.imdb_score);})
            .attr('transform', function(d) {
                return 'translate('+xScale(d.num_voted_users)+','+yScale2(d.imdb_score)+')';
            });
            imdb_plot.append('circle')
            .attr("r", function(d) {return 3;})
            .attr('transform', 'translate(110,395)');
            imdb_plot.append('text')
                .attr('class', "plot-label")
                .attr('transform', 'translate(110,385)')
                .text(function(d) {
                    return d.movie_title;
                });

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
                .attr('class', 'title')
                .attr('transform', 'translate(430,550)')
                .text('# of User Reviews');

        group.append('text')
                .attr('class', 'label')
                .attr('transform', 'translate(100,350)')
                .attr("font-weight", "bold")
                .text('Movie Incomes and Ratings Across Popularity');    

        group.append('text')
                .attr('class', 'label')
                .attr('transform', 'translate(20,670) rotate(-90)')
                .text('Gross Income');

        group.append('text')
                .attr('class', 'label')
                .attr('transform', 'translate(20,500) rotate(-90)')
                .text('IMBD Score');
        group.exit.remove();
    //};
};    
var svg = d3.select("svg");

//}



