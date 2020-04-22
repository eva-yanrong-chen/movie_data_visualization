# movie_data_visualization
Movie data visualization project for CS4460

This code creates a visualization tool using the D3.js JavaScript library. The visualization explores the IMDb movie dataset, IMDb 5000. The dataset contains information for the top 5000 movies under the IMDb database, with release years ranging from 1916 to 2016, giving us full coverage of a century’s worth of data.

The visualization consists of two main components, a grid of clapperboards where one clapperboard represents one movie and a scatterplot showing a comparison between IMDb score and popularity over gross revenue for each movie. The scatterplot is actually made up of two plots, sharing the same x axis of the number of user reviewsThe colored bars on the clapperboard represent three movie attributes we decided to highlight in our visualization, IMDb score, gross revenue, and the number of users that reviewed the movie which we labeled as popularity. Movies shown are filtered by year and users can toggle the slider to update the clapperboard grid and scatterplot to show movie data from the selected year. Additionally, users can select data points using hover and click interactions to show details of a movie and highlight where the movie stands in the scatterplot.The user also has the option to sort the clapperboards based on one of the three attributes.

To Use:
Download all files from the movie_data_visualization folder onto your local computer. To run the webpage, you must use Python to open a local server from the movie_data_visualization folder on your local drive.
