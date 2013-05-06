/**
 * Equivalent of PHP's soundex function in a jQuery plugin.
 * @version : 0.1
 * @author : Vincent Garcia
 * github repo : https://github.com/intraordinaire/jquery_soundex
 *
 * Original function from phpjs
 * Thanks to : http://kevin.vanzonneveld.net
 *             https://github.com/kvz/phpjs/blob/master/functions/strings/soundex.js
 */
(function ($) {
    $.soundex = function (element, options) {
        this.settings = $.extend(true, {}, $.soundex.defaults, options);
        this.element = $(element);
        this.init();
    }
    $.extend($.soundex,
        {
            defaults  : {
                search    : '',
                wrapper : {
                    node : 'span',
                    class   : 'soundexed'
                },
                current_search : null
            },
            prototype : {
                init    : function () {
                    this.formatSearch();
                    for(var i = 0; i < this.settings.search.length; i++)
                    {
                        this.searchWord(this.settings.search[i]);
                        if(this.settings.current_search.length > 0)
                        {
                            this.prepareHighlight();
                        }
                    }
                },                
                searchWord: function(word) {
                    this.settings.current_search = new Array();
                    var text = this.element.text();
                    text = this.formatString(text);
                    var words_array = text.split(' ');
                    for(var i = 0; i < words_array.length; i++)
                    {
                        if($.inArray(words_array[i], this.settings.current_search) == -1 && this.soundex(word) == this.soundex(words_array[i]))
                        {
                            this.settings.current_search.push(words_array[i]);
                        }
                    }
                },
                prepareHighlight: function() {
                    var passed = new Array();
                    var match = '';
                    var html = '';
                    var regex = '';
                    for(var i = 0; i < this.settings.current_search.length; i++)
                    {
                        if(-1 == $.inArray(this.settings.current_search[i], passed))
                        {
                            this.highlightTextNode(this.element.get(0), this.settings.current_search[i]);
                        }
                    }
                    if(html != '')
                    {
                        this.element.html(html);
                    }
                    this.settings.current_search = null;
                },
                highlightTextNode: function (current_node, current_search) {
                    var skip = 0;
                    var new_node = $(document.createElement(this.settings.wrapper.node)).addClass(this.settings.wrapper.class);
                    if (current_node.nodeType == 3) {
                        var pos = $(current_node).text().indexOf(current_search);
                        if (pos >= 0)
                        {
                            new_node.text(current_search);
                            new_node = new_node.clone().wrap('<div></div>').parent();
                            var text = $(current_node).text().replace(current_search, new_node.html());
                            $(current_node).after(text).remove();
                            skip = 1;
                        }
                    }
                    else if (current_node.nodeType == 1 && current_node.childNodes && !/(script|style)/i.test(current_node.tagName)) {
                        for (var i = 0; i < current_node.childNodes.length; ++i) {
                            i += this.highlightTextNode(current_node.childNodes[i], current_search);
                        }
                    }
                    return skip;
                },
                formatSearch : function() {
                    if(typeof this.settings.search === 'string')
                    {
                         this.settings.search = [this.settings.search];
                    }

                    for(var i = 0; i < this.settings.search.length; i++)
                    {
                        this.settings.search[i] = this.formatString(this.settings.search[i]);
                        if(this.settings.search[i].length > 1 && this.settings.search[i].match(/\s/))
                        {
                            var tmp_words = this.settings.search[i].split(' ');
                            this.settings.search[i] = tmp_words[0];
                            for(var j = 1; j < tmp_words.length; j++)
                            {
                                this.settings.search.push(tmp_words[j]);
                            }
                        }
                    }
                },
                formatString: function(string)
                {
                    return string.replace(/\W/g, ' ').replace(/\s+/g, ' ').replace(/(^\s+)|\s+$/, '');
                },
                soundex : function (str) {
                    str = (str + '').toUpperCase();
                    if (!str) {
                        return '';
                    }
                    var sdx = [0, 0, 0, 0],
                        m = {
                            B : 1,
                            F : 1,
                            P : 1,
                            V : 1,
                            C : 2,
                            G : 2,
                            J : 2,
                            K : 2,
                            Q : 2,
                            S : 2,
                            X : 2,
                            Z : 2,
                            D : 3,
                            T : 3,
                            L : 4,
                            M : 5,
                            N : 5,
                            R : 6
                        },
                        i = 0,
                        j, s = 0,
                        c, p;

                    while ((c = str.charAt(i++)) && s < 4) {
                        if (j = m[c]) {
                            if (j !== p) {
                                sdx[s++] = p = j;
                            }
                        } else {
                            s += i === 1;
                            p = 0;
                        }
                    }

                    sdx[0] = str.charAt(0);
                    return sdx.join('');
                }
            }
        });
    $.fn.soundex = function (options) {
        return this.each(function () {
            if (undefined == $(this).data('soundex')) {
                $(this).data('soundex', new $.soundex(this, options));
            }
        });
    }
})(jQuery);