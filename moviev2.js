// Global function called when select element is changed
//function onCategoryChanged() {
//    var select = d3.select('#categorySelect').node();
//    // Get current value of select element
//    var category = select.options[select.selectedIndex].value;
//    // Update chart with the selected category of letters
//    updateSort(category);
//}

//GRID SETUP
var w = 945,
    h = 585,
    z = 45,
    x = w/z,
    y = h/z;


//SVG SETUP
var svg = d3.select('svg')
    .attr('width', 1200)
    .attr('height', 800)
    // .attr('width', w+30)
    // .attr('height', h+30);

var chartG = svg.append('g')
    .attr('width', w+30)
    .attr('height', w+30)
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
        .attr('transform', 'translate(100, 80)');

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

    revenueDomain = [0, 7.61e8];

    imdbScoreDomain = [2, 10];

    popularityDomain = [6, 1676169];

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
        .attr('transform', 'translate(1024, 40)')

    var legendIcon = svg.append('g')
        .attr('transform', 'translate(1024, 72)');

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
}



