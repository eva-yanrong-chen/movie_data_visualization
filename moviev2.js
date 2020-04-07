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
    
    var yearInput = 1980;

    //Variable that stores the movies for the year selected 
    filteredMovies = movies.filter(function(d) {
        if (d.title_year == yearInput) {
            return d;
        } else {
            return;
        }
    });
    console.log(filteredMovies);
    
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
        })

    var clapperboardEnter = clapperboard.enter()
        .append('g')
        .attr('class', 'rect')
        .attr('transform', function translate(d, i) {
            return 'translate('+(i%x)*z+','+Math.floor(i/x)*z+')';
        });

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
});



