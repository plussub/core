var IMDB_RESULT = {
    title_popular: [{id: 'ttpopularA', title: 'popularA'}, {id: 'ttpopularB', title: 'popularB'}],
    title_exact: [{id: 'ttexactA', title: 'exactA'}, {id: 'ttexactB', title: 'exactB'}],
    title_substring: [{id: 'ttsubA', title: 'subA'}, {id: 'ttsubB', title: 'subB'}],
    title_approx: [{id: 'ttapproxA', title: 'approxA'}, {id: 'ttapproxB', title: 'approxB'}]
};

var EXTENDED_IMDB_RESULTS= {
    ttpopularA: {
        movie_results: [],
        tv_results: [{
            first_air_date: "2010-06-06",
            origin_country: "US",
            poster_path: "/urlTo_ttpopularA"
        }]
    },
    ttpopularB: {
        movie_results: [{
            release_date: "2011-06-06",
            poster_path: "/urlTo_ttpopularB"
        }],
        tv_results: [],

    },
    ttexactA: {
        movie_results: [],
        tv_results: [{
            first_air_date: "2022-12-12",
            poster_path: "/urlTo_ttexactA"
        }]
    },
    ttexactB: {
        movie_results: [{
            release_date: "2023-06-06",
            poster_path: "/urlTo_ttexactB"
        }],
        tv_results: [],
    },
    ttsubA: {
        movie_results: [],
        tv_results: [{
            first_air_date: "2014-12-12",
            poster_path: "/urlTo_ttsubA"
        }]
    },
    ttsubB: {
        movie_results: [{
            release_date: "2025-06-06",
            poster_path: "/urlTo_ttsubB"
        }],
        tv_results: [],
    },
    ttapproxA: {
        movie_results: [],
        tv_results: [{
            first_air_date: "2016-12-12",
            origin_country: "US",
            poster_path: "/urlTo_ttapproxA"
        }]
    },
    ttapproxB: {
        movie_results: [{
            release_date: "2017-06-06",
            poster_path: "/urlTo_ttapproxB"
        }],
        tv_results: [],
    }
};

exports.IMDB_RESULT = IMDB_RESULT;
exports.EXTENDED_IMDB_RESULTS = EXTENDED_IMDB_RESULTS;
