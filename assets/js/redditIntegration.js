(function ($) {

    var redditIntegration = {
        subreddit: 'CyclePDX',
        redditAuthorization: '',
        redditAccessToken: null,

        postToSubreddit: function (title, text, subreddit) {

            if (!subreddit) {
                subreddit = window.redditIntegration.subreddit;
            }

            var url = 'https://reddit.com/api/submit';

            var formData = new FormData();
            formData.append("title", title);
            formData.append("text", text);
            formData.append("sr", subreddit);
            formData.append("kind", 'self');

            $.ajax({
                crossDomain: true,
                processData: false,
                contentType: false,
                url: url,
                data: formData,
                type: 'POST',
                headers: {
                    Authorization: window.redditIntegration.redditAccessToken,
                    Accept: 'application/json',
                },
                beforeSend: function(request) {
                    // request.setRequestHeader("User-Agent","web:biketag.org:v1");
                },
                mimeType: 'multipart/form-data'
            }).done(function (response) {
                debugger;
                console.log(response);
            });

        },

        getRedditTokens: function (success) {
            var self = this;
            fetch('/auth/reddit/getToken', {
                method: 'POST',
                body: JSON.stringify({ hello: 'world' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) { return res.json() })
                .catch(function (error) { 
                    console.error('Error:', error) 
                })
                .then(function (response) {
                    var redditTokens = response.redditTokens;

                    if (redditTokens && typeof redditTokens == 'object') {
                        self.subreddit = redditTokens.subreddit || self.subreddit;
                        self.redditAccessToken = redditTokens.redditAccessToken ? 'Bearer ' + redditTokens.redditAccessToken : self.redditAccessToken;
                        self.redditAuthorization = redditTokens.redditAuthorization ? 'Client-ID ' + redditTokens.redditAuthorization : self.redditAuthorization;

                        return success(response);
                    }
                });
        },

        getUrlParam(param) {
            var searchParams = new URLSearchParams(window.location.search);

            if(!param) {
                return searchParams;
            } else {
                return searchParams.get(param);
            }
        },

        onUploadFormSubmit(theButton) {
            
        },

        init: function () {
            var self = this;
            
            this.getRedditTokens(function (response) {
                console.log('reddit integration initialized.');
            });

            return self;
        }
    };

    window.redditIntegration = redditIntegration.init();
})(jQuery);