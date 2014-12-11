var app = app || {};

(function() {
    var source = $("#tweet-template").html();
    app.tweet_template = Handlebars.compile(source);
})();

app.show_tweets = function(response, highlight_snippet) {
    var html = '';
    $('.loading').hide();
    $('.results-h4').show();
    $.each(response.tweets, function(i, tweet_info) {
        tweet_info.tweet_text = highlight_snippet(tweet_info.tweet_text);
        html += app.tweet_template(tweet_info);
    });
    $('.tweet-wrap').append($(html));
};

app.show_loading = function() {
    $('.tweet').remove();
    $('.loading').show();
};

app.update_input = function(e, query) {
    $('.search_input').val('');
    $('.search_input', $(e.currentTarget).parent()).val(query);
};

app.init_click_handlers = function() {
    var all_terms_search = function(data) {
        data.query_type = 'adv';
        data.query_field = "all_terms";
        app.show_loading();
        var promise = $.ajax({
            url: "/search/",
            type: "POST",
            data: data
        });
        promise.success(function(response) {
            app.show_tweets(response, function(text) {
                var terms = data.query.split(" ");
                $.each(terms, function(i, v) {
                    text = text.replace(new RegExp(v, 'ig'), "<span class='highlight_term'>" + v + "</span>");
                });
                return text;
            });
        });
        promise.error(function() {
            
        });
    };
    $('body').on('click', '.try_sample_all_terms', function(e) {
        var data = {};
        data.query = $('.sample_val', $(e.currentTarget).parent()).val();
        app.update_input(e, data.query);
        all_terms_search(data);
    });
    $('body').on('click', '.all_terms', function(e) {
        var data = {};
        data.query = $('.search_input', $(e.currentTarget).parent()).val();
        app.update_input(e, data.query);
        all_terms_search(data);
    });
    var exact_phrase_search = function(data) {
        data.query_type = 'adv';
        data.query_field = "exact_phrase";
        app.show_loading();
        var promise = $.ajax({
            url: "/search/",
            type: "POST",
            data: data
        });
        promise.success(function(response) {
            app.show_tweets(response, function(text) {
                text = text.replace(new RegExp(data.query, 'ig'), "<span class='highlight_term'>" + data.query + "</span>");
                return text;
            });
        });
        promise.error(function() {
            
        });
    };
    $('body').on('click', '.try_sample_exact_phrase', function(e) {
        var data = {};
        data.query = $('.sample_val', $(e.currentTarget).parent()).val();
        app.update_input(e, data.query);
        exact_phrase_search(data);
    });
    $('body').on('click', '.exact_phrase', function(e) {
        var data = {};
        data.query = $('.search_input', $(e.currentTarget).parent()).val();
        app.update_input(e, data.query);
        exact_phrase_search(data);
    });
    var any_terms_search = function(data) {
        data.query_type = 'adv';
        data.query_field = "any_terms";
        app.show_loading();
        var promise = $.ajax({
            url: "/search/",
            type: "POST",
            data: data
        });
        promise.success(function(response) {
            app.show_tweets(response, function(text) {
                var terms = data.query.split(" ");
                $.each(terms, function(i, v) {
                    text = text.replace(new RegExp(v, 'ig'), "<span class='highlight_term'>" + v + "</span>");
                });
                return text;
            });
        });
        promise.error(function() {
            
        });
    };
    $('body').on('click', '.try_sample_any_terms', function(e) {
        var data = {};
        data.query = $('.sample_val', $(e.currentTarget).parent()).val();
        app.update_input(e, data.query);
        any_terms_search(data);
    });
    $('body').on('click', '.any_terms', function(e) {
        var data = {};
        data.query = $('.search_input', $(e.currentTarget).parent()).val();
        app.update_input(e, data.query);
        any_terms_search(data);
    });
    var none_terms_search = function(data) {
        data.query_type = 'adv';
        data.query_field = "none_terms";
        app.show_loading();
        var promise = $.ajax({
            url: "/search/",
            type: "POST",
            data: data
        });
        promise.success(function(response) {
            app.show_tweets(response, function(text) {
                var terms = data.query_mandatory_terms.split(" ");
                $.each(terms, function(i, v) {
                    text = text.replace(new RegExp(v, 'ig'), "<span class='highlight_term'>" + v + "</span>");
                });
                return text;
            });
        });
        promise.error(function() {
            
        });
    };
    $('body').on('click', '.try_sample_none_terms', function(e) {
        var data = {};
        data.query = $('.sample_val', $(e.currentTarget).parent()).val();
        data.query_mandatory_terms = $('.sample_val', $('.any_terms').parent()).val();
        app.update_input(e, data.query);
        $('.search_input', $('.any_terms').parent()).val(data.query_mandatory_terms);
        none_terms_search(data);
    });
    $('body').on('click', '.none_terms', function(e) {
        var data = {};
        data.query = $('.search_input', $(e.currentTarget).parent()).val();
        data.query_mandatory_terms = $('.search_input', $('.any_terms').parent()).val();
        app.update_input(e, data.query);
        $('.search_input', $('.any_terms').parent()).val(data.query_mandatory_terms);
        none_terms_search(data);
    });
    var hash_tags_search = function(data) {
        data.query_type = 'adv';
        data.query_field = "hash_tags";
        app.show_loading();
        var promise = $.ajax({
            url: "/search/",
            type: "POST",
            data: data
        });
        promise.success(function(response) {
            app.show_tweets(response, function(text) {
                var terms = data.query.split(" ");
                $.each(terms, function(i, v) {
                    text = text.replace(new RegExp('#' + v, 'ig'), "<span class='highlight_term'>" + '#' + v + "</span>");
                });
                return text;
            });
        });
        promise.error(function() {
            
        });
    };
    $('body').on('click', '.try_sample_hash_tags', function(e) {
        var data = {};
        data.query = $('.sample_val', $(e.currentTarget).parent()).val();
        app.update_input(e, data.query);
        hash_tags_search(data);
    });
    $('body').on('click', '.hash_tags', function(e) {
        var data = {};
        data.query = $('.search_input', $(e.currentTarget).parent()).val();
        app.update_input(e, data.query);
        hash_tags_search(data);
    });
    
};

app.init_click_handlers();
