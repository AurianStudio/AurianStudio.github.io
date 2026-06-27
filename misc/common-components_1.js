(function($){
    "use strict";
   function CComponent(){
        this.toolElements = {};
        this.lang = $('html').attr('lang');
        this.app = '';
   }

   CComponent.prototype = {
       /**
        * @param {Number} val - number which needs to be formatted 
        * @param {Number} precision - the precision of the number  
        * @param {String} thousandSeparator - char for thousand separation
        * @param {String} decimalSeparator - char for decimal separator
        * @param {String} prefix - char for which should preceed number
        * @param {String} suffix - char after number
        * @returns {String} formatted number 
        * 
        */
       formatNumber: function(val, precision, thousandSeparator, decimalSeparator, prefix, suffix) {
            val = (this.lang == 'en') ? ('' + val) : ('' + val).replace(/,/,'.'); 
            val = isNaN(val = parseFloat(val)) ? 0 : val; //check it it's number
            val = val.toFixed(precision !== undefined ? precision : 2).split('.');//get number precision
            val[0] = val[0].replace(/(\d)(?=(\d{3})+\b)/g, '$1' + thousandSeparator); //add thousands separator
            return (prefix || '') + val.join(decimalSeparator) + (suffix || ''); // add currency and decimal separator
        },
        /**
         * @param {String} name - name of the cookie
         * @param {String} value - value of the cookie
         * @param {Number} days - number of days 
         */
        setCookie: function(name, value, days){
            var cookieDate = new Date();
            cookieDate.setDate(cookieDate.getDate() + days);            
            document.cookie = name+"=" + value + ";expires=" + cookieDate.toUTCString() + ";path=/";
        },
        /**
         * @param {String} name - name of the cookie
         * @returns {String} value of the cookie
         */
        getCookie: function(name){
            var cookieName = name + "=";
            var values = decodeURIComponent(document.cookie).split(';');
            for(var i = 0; i < values.length; i++) {
                var value = values[i].replace(/^\s+|\s+$/g,"");
                if(value.indexOf(cookieName) == 0){ 
                    return value.substring(cookieName.length, value.length);
                };
            }
            return "";
        },
        /**
         * @param {String} name - name of the cookie
         */
        deleteCookie: function(name){
            document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/';
        },

        /**
         * @param {Object} values - key-values pairs 
         * @returns {String} string key-values pairs
         */
        createValues: function(values){
            var valuesString = '';

            $.each(values, function(key, value){
                if(valuesString != ''){ valuesString += ',' };
    
                valuesString += key + ':' + value.toString(16);
            });

            return valuesString;
        },
        /**
         * @param {String} valuesString - string key-values pairs
         * @returns {Object} - key-values pairs
         */
        getValues: function(valuesString){
           
            var values = {};
            var saved = valuesString.split(',');
   
           for(var i = 0; i < saved.length; i++){
                var value = saved[i].split(':');
                values[value[0]] = parseInt(value[1],16);    
            
            }
            return values;
        },
        /**
         *  @param {String} storage "local" | "session"  
         *  @param {String} name keyname for starage
         *  @param {String} value values to be saved
         */
        setStorage: function(storage, name, value){
            if(storage === 'local') {
                localStorage.setItem(name, value);
            } else if(storage === 'session') {
                sessionStorage.setItem(name, value);
            }

        },
        
        /**
         *  @param {String} storage "local" | "session"  
         *  @param {String} name keyname for starage
         *  @returns {String} stored value 
         */
        getStorage: function(storage, name){
            var value = "";
            if(storage === 'local') {
                value = localStorage.getItem(name);
            } else if(storage === 'session') {
                value = sessionStorage.getItem(name);
            }           
            return value;
        }


   };

   $.ccom = new CComponent(); 

    CComponent.prototype.CAccordion = function(accordion, triggers, pannels, settings){
        return new Accordion(accordion, triggers, pannels, settings);
    };

    CComponent.prototype.CCheckbox = function(checkbox, value, callback) {
        return new Checkbox(checkbox, value, callback);
    };

    CComponent.prototype.CRadiobutton = function(radiobutton, value, callback) {
        return new Radiobutton(radiobutton, value, callback);
    };

    CComponent.prototype.CModal = function(revealId, attributes){
        return new Modal(revealId, attributes);
    };

    CComponent.prototype.CDropdown = function(element, options, idx, label, concatenate, callback){
       return new Dropdown(element, options, idx, label, concatenate, callback);
    };

    CComponent.prototype.CTooltip = function(links, lang){
        return new Tooltip(links, lang);
    };

    CComponent.prototype.CAutocomplete = function(input, settings, search){
        return new Autocomplete(input, settings, search);
    };

    CComponent.prototype.CComboboxAutocomplete = function(input, settings, search){
        return new ComboboxAutocomplete(input, settings, search);
    };
   
    CComponent.prototype.CInput = function(element, value, settings, callback) {
       return new Input(element, value, settings, callback);
    };

    CComponent.prototype.CSlider = function (element, value, settings, callback) {
        return new Slider(element, value, settings, callback);
    };

    CComponent.prototype.CSliderGroup = function(input, slider, value, settings, callback) {
        return new SliderGroup(input, slider, value, settings, callback);
    };

    CComponent.prototype.CSpinbutton = function(element, value, settings, callback) {
       return new Spinbutton(element, value, settings, callback);
    };

    CComponent.prototype.CRating = function(element, values, callback) {
        return new Rating(element, values, callback);
    };

    CComponent.prototype.CTabsView = function(tabs) {
        return new TabsView(tabs);
    };

    CComponent.prototype.CTabsToAccordion = function(tabs, settings) {
        return new TabsToAccordion(tabs, settings);
    };

    CComponent.prototype.CStepView = function(stepView, startBtn, progress, referenceLinks, skipSteps, labels, settings, callbackStart, callbackIntro, callbackStep, callbackView) {
        return new StepView(stepView, startBtn, progress, referenceLinks, skipSteps, labels, settings, callbackStart, callbackIntro, callbackStep, callbackView);
    };


    CComponent.prototype.CFilterView = function(filterView, selectedOption, settings, srText) {
        return new FilterView(filterView, selectedOption, settings, srText);
    };

    /**
     * 
     * @param {JQuery} accordion - wrapper element for triggers  
     * @param {JQuery} triggers - optional, by default $('.mobile-accordion-trigger')
     * @param {JQuery} panels - optional, by default $('.mobile-accordion-content')
     * @param {Object} settings - optional
     *      settings:
            *  expandOnlyOne - default true, collups all others section when one is expended
            *  scroll - default true, scroll to the begining of the expanded section 
            *  firstOpen - default true, expand the first section on load
     */
   var Accordion = function(accordion, triggers, panels, settings){
        this.accordion = accordion;
        this.triggers = triggers || this.accordion.find('.mobile-accordion-trigger');
        this.panels = panels || this.accordion.find('.mobile-accordion-content');
        this.settings = settings || {};
        this.settings.expandOnlyOne = (this.settings.expandOnlyOne !== undefined ? this.settings.expandOnlyOne : true);
        this.settings.scroll = (this.settings.scroll !== undefined ? this.settings.scroll : true);
        this.settings.firstOpen = (this.settings.firstOpen !== undefined ? this.settings.firstOpen : true);
        // if there no mobile class, it's regular accordion, not layout
        if((this.accordion.hasClass('custom-accordion'))){
            this.init();
        }
        this.switchMobile = function(isMobile){
            
          if (isMobile) {
              this.panels.attr('hidden', '');
              this.triggers.attr('aria-expanded', 'false');
              this.panels.each(function(){
                  $(this).attr('aria-labelledby', $(this).attr('id')+'Label');
                  $(this).attr('role', 'region');
              });
              if(this.settings.firstOpen){
                this.triggers.eq(0).click(); // open the first one
              }

          } else {
              this.panels.removeAttr('hidden');
              this.panels.removeAttr('aria-labelledby');
          }
      }
        this.registerEvents();
   };

    Accordion.prototype = {
        init: function(){
            this.panels.attr('hidden', '');
            this.triggers.attr('aria-expanded', 'false');
            this.panels.each(function(){
                $(this).attr('aria-labelledby', $(this).attr('id')+'Label');
                $(this).attr('role', 'region');
            });
            this.triggers.each(function(){
                var buttonId =  $(this).attr('id');
                $(this).attr('aria-controls', buttonId.slice(0, buttonId.indexOf('Label')));
            });
            if(this.settings.firstOpen){
                this.triggers.eq(0).click(); // open the first one
            }
        },
        registerEvents: function() {

            this.triggers.on('click', this, this.accordionClick);
            this.triggers.on('keydown', this, this.accordionNavigation);
            this.triggers.on('focus', this, this.accordionFocus);
            this.triggers.on('blur', this, this.accordionBlur);
        }, 
        accordionNavigation: function(event) {
            var that = event.data;
            var key = event.key;
            var ctrlModifier;
            var isExpanded = $(this).attr('aria-expanded') == 'true';

            if(event.key) {
                ctrlModifier = event.ctrlKey && (key == 'PageUp' || key == 'PageDown');
            } 

            if(event.key) {
                if(key == 'ArrowUp' || key == 'ArrowDown' || ctrlModifier) {
                    var index = that.triggers.index($(this));
                    var direction = (key == 'PageDown' || key == 'ArrowDown') ? 1 : -1;
                    var length = that.triggers.length;
                    var newIndex = (index + length + direction) % length;
                    that.triggers.eq(newIndex).focus();
                    event.preventDefault();

                } else if (key == 'End') {
                    that.triggers.eq(that.triggers.length - 1).focus();
                    event.preventDefault();
                } else if (key == 'Home') {
                    that.triggers.eq(0).focus();
                    event.preventDefault();
                }
            }
 
        },
        accordionClick: function(event){
            var that = event.data;
            var isExpanded = $(this).attr('aria-expanded') == 'true';
            var active = that.accordion.find('[aria-expanded="true"]');
          
            if(active && active !== $(this) && that.settings.expandOnlyOne) {
                active.attr('aria-expanded', 'false');
                $('#'+active.attr('aria-controls')).attr('hidden', '');
            }

            if(!isExpanded) {
                
                $(this).attr('aria-expanded', 'true');
                var content = $(this).attr('aria-controls');
                $('#'+content).removeAttr('hidden');
                if(that.settings.scroll) {
                    $('html,body').animate({scrollTop:  $('#'+content).offset().top-100},'slow');
                }
            } else {
                $(this).attr('aria-expanded', 'false');
                $('#'+$(this).attr('aria-controls')).attr('hidden', '');
            }

            event.preventDefault();
        },
        accordionFocus: function(){
            $(this).addClass('focus');
        },
        accordionBlur: function() {
            $(this).removeClass('focus');
        }
        
    };
    /**
     * 
     * @param {JQuery} checkbox - checkbox element 
     * @param {Number} value - value of the checkbox
     * @param {Function} callback - callback function triggered on change
     */
    var Checkbox = function(checkbox, value, callback) {
        this.checkbox = checkbox;
        this.id = this.checkbox.attr('id');
        this.name = this.checkbox.attr('name');
        this.value = value;
        this.onUpdate = callback;
        this.updateByValue = function(val){
           this.setValue(val);
           val ? this.checkbox.prop("checked", true) : this.checkbox.prop("checked", false);
        };
        this.init();
        this.registerEvents();
    };
    Checkbox.prototype = {
        init: function(){
            this.value ? this.checkbox.prop("checked", true) : this.checkbox.prop("checked", false);
        },
        registerEvents: function(){
            this.checkbox.on('change', this, this.checkboxChange);
        },
        setValue: function(val){
            this.value = val;
        },
        checkboxChange: function(event){
            var that = event.data;
            $(this).is(':checked') ? that.setValue(1) : that.setValue(0);
            that.onUpdate(that.id);
        }
    };  
    /**
     * 
     * @param {String} name - name of radiobuttons group
     * @param {String} value - value of the radiobuttons group
     * @param {Function} callback - callback function triggered on change
     */
    var Radiobutton = function(name, value, callback) {
        this.name = name;
        this.list = $('input[name=' + this.name + ']');
        this.value = value;
        this.onUpdate = callback;
        this.updateByValue = function(val){ 
    
            this.setValue(val);
            this.list.val([val]); 
            this.list.each(function(){
                $(this).prop("checked", false)
            });
            var inputValue = this.value;
            var selected = this.list.filter(function(){
                return $(this).attr('value') === inputValue;
            })
            selected.prop('checked', true);
        }
        this.init();
        this.registerEvents();
    };
    Radiobutton.prototype = {
        init: function(){
            this.list.val([this.value]); 
            this.list.each(function(){
                $(this).prop("checked", false)
            });
            var inputValue = this.value;
            if(this.value !== '' && this.value !== null) {
                var selected = this.list.filter(function(){
                    return $(this).attr('value') === inputValue;
                });
                selected.prop('checked', true);
            }

        },
        registerEvents: function(){
            this.list.on('change', this, this.radioChange);
        },
        setValue: function(val){
            this.value = val;
        },
        getValue: function(){
            return this.list.filter(':checked').val();
        },
        radioChange: function(event){
            var that = event.data;
            that.setValue(that.getValue());
            that.onUpdate();
        }
    };  
   
    /**
     * @param {String} revealId //id of the dialog window
     * @param {Object} attributes  // optional attributes of the dialog window
        * attributes: 
        * options - foundation options for reveal modal - close_on_background_click:false;
        * lang - language, by default comes from html attribute - en|fr
     */
    var Modal = function(revealId, attributes) {
        this.revealId = revealId ? revealId : 'default';
        this.attributes = attributes;
        this.lang =  (this.attributes &&  this.attributes.lang) ? this.attributes.lang : $('html').attr('lang');
        this.dialog;
        this.close;

        this.init();
        //this.unregisterEvents();//if there already set listeners

        this.registerEvents(); //if links are static
                
        this.addClickEvent  = function(link){ //link is jQuery object 
           link.on('click', this, this.linkClick);
        };

        this.removeClick = function(link){ //link is jQuery object 
           link.off('click', this, this.linkClick);
        };
    }; 

    Modal.prototype = {
        init: function(){
            if(!$('#'+this.revealId).length) {

                var modal = '<div id="'+this.revealId+'" class="reveal-modal hint-modal" data-reveal aria-describedby="'+this.revealId +'-content" aria-hidden="true" role="dialog" data-options="'+((this.attributes && this.attributes.options) ? this.attributes.options : "")+'">' +
                               '<div class="reveal-modal-paragraph" id="'+this.revealId+'-content"></div>' + 
                               '<a class="close-reveal-modal link-modal" tabindex="-1" role="button" aria-label="'+(this.lang ==='en' ? 'Close' : 'Fermer')+'">&#215;</a>' +
                            '</div>';

                $("body").append(modal);
            }
            this.dialog = $('#'+this.revealId);
            this.close = this.dialog.find('a.close-reveal-modal');

        },
        registerEvents: function() {
            this.close.on('keydown', this, this.closeKeyEvent);
         },

        closeKeyEvent: function(event){
            var that = event.data;
            var key = event.key;
            if(event.key) {
                if(key == 'Enter' || key == ' ') {
                    $(this).trigger('click');
                    event.preventDefault();
                }
                if (key == 'Tab' && !key.shiftKey) {
                    event.preventDefault();
                    that.dialog.find('select, input, textarea, button, a').first().focus();
                }
            } 
           
        },

         linkClick: function(event){
            var that = event.data;
            var linkClicked = $(this);
            event.preventDefault();
            var content = that.dialog.find('.reveal-modal-paragraph');
            var url = $(this).attr('href');
            $.ajax ({
                url: url,
                dataType: 'html',
                success: function(response){
                    content.empty();
                    //make sure that modal contains one paren .layoutcontainer
                    content.html($(response).find('.main-content').eq(0).html());
                    content.append('<a class="modal-reset-link" aria-hidden="true" href="#" onfocus="$(\'a.close-reveal-modal\').focus();" style="left:-10000px; position:absolute">&nbsp;</a>');
                    if (content.find(".data-rds").length > 0) {
                        content.find(".data-rds").addClass("target");
                        content.find(".data-rds.target").trigger("target-rds-rates");
                    }
                    that.dialog.foundation('reveal', 'open');
                    $(document).off('opened.fndtn.reveal');
                    $(document).off('closed.fndtn.reveal');
                    $(document).on('opened.fndtn.reveal', '[data-reveal]', function () {
                        var modal = $(this);
                        modal.focus();
                    });
                    $(document).on('closed.fndtn.reveal', '[data-reveal]', function () {
                        linkClicked.focus();
                    });
                }
            });

           
        }
    };

    /**
     * 
     * @param {JQuery} element - dropdown element
     * @param {Array} options - array of objects with value, label properties
     * @param {Number} idx - selected index
     * @param {String} label - id of the dropdown label
     * @param {Boolean} concatenate - if concatenate selected value with the zero value (label)
     * @param {Function} callback - function which is triggeret on change selected value
     */
    var Dropdown = function(element, options, idx, label, concatenate, callback) {
        this.element = element;
        this.options = options;
        this.selectedIndex = idx ? idx : 0;
        this.label = label || '';
        this.concatenate = concatenate;
        this.button;
        this.select = this.element.find("select");
        this.value; 
        this.list;
        this.charsToSearch='';
        this.init();
        this.registerEvents();
        this.onUpdate = callback;
        this.updateByValue = function(val){ 
            var current = this.list.find("li[aria-selected='true']");
            var arrow = $("<span/>");
            arrow.addClass("icon icon-arrow-down");

            this.select.find('option').each((function(i, el){ 

              if($(el).attr("value") == val) {
                this.selectedIndex = i;
                this.select.prop("selectedIndex", this.selectedIndex);
                this.value = this.select.val();
                this.list.attr("aria-activedescendant", val);   
                //this.button.html(this.list.find('#'+val).html()); 
                this.button.html(this.copySelected(this.list.find('#'+val), i)); 
                this.button.append(arrow);
                current.removeClass("focused").removeAttr('aria-selected');
                this.list.find('#'+val).addClass("focused").attr('aria-selected', 'true');
                this.onUpdate();
                return false;
              }

            }).bind(this));
        }
    };

    Dropdown.prototype = {
        init: function(){
            
            $.each(this.options, (function(i, el){
                this.select.append($("<option>", {
                    value: el.value,
                    text: el.label
                }).data("icon", el.icon))
            }).bind(this));
            this.select.prop("selectedIndex", this.selectedIndex);
            this.value = this.select.val();
            this.button = this.setItem(this.select.find(":selected"), "button");
            this.button.addClass("selected");
            this.button.attr("aria-haspopup", "listbox");
            this.button.attr("id", this.element.attr('id')+'Button');
            this.button.attr("aria-labelledby", this.label + " selected");
            this.button.attr('type', 'button');
            this.element.append(this.button);

            this.list = $("<ul/>");
            this.list.addClass("list hide");
            this.list.attr("role", "listbox");
            this.list.attr("tabindex", "-1");
            this.list.attr("aria-labelledby", this.label);
            this.list.attr("aria-activedescendant", this.value);
            this.select.find('option').each((function(i, el){
                var item = this.setItem($(el), "li", this.value);
                item.addClass("item");
                item.attr("role", "option");
                item.on('click', this, this.selectItem);
                this.list.append(item);
            }).bind(this));
                        
            this.element.append(this.list);

        },
        registerEvents: function(){
        
            this.list.on("keydown", this, this.checkKeyPress);
            this.button.on("click", this, this.buttonClick);
            this.button.on("keyup", this, this.open);
            //this.list.on("blur", this, this.close);
            $(document).on("click", this, this.close);
            this.list.find('li').on("mouseenter touchstart", this, this.hoverItem);

        },
        setItem: function(element, tag, selected){
          var val, label, icon, arrow, item, iconData;
          item = $("<"+tag+"/>");
          val = element.val();
          if(selected && selected === val) {
            item.addClass("focused");
            item.attr("aria-selected", "true");
          }

          item.data("value", val);
          item.attr("id", val.toLowerCase());

          iconData = element.data('icon');
          if(iconData) {
            icon = $("<span/>");
            if(/^\/[a-zA-Z0-9]+/.test(iconData)) {
                icon.addClass("dropdown-icon");
                icon.css("background-image", "url("+iconData+")");
            } else {
                icon.addClass("dropdown-content-icon " + iconData);
            }
           
            item.append(icon);
          }

          label = $("<span/>");
          //(!selected || (selected && selected === val)) ?  label.addClass("title banner-body-copy") : label.addClass("title body-copy");
          (!selected || (val === '' || val === 'default')) ?  label.addClass("title banner-body-copy") : label.addClass("title body-copy");
          label.text(element.text());
          item.append(label);

          if(!selected) {
            arrow = $("<span/>");
            arrow.addClass("icon icon-arrow-down");
            item.append(arrow);
          }
          return item;
        },

        checkKeyPress: function(event){
            var that = event.data;
            var key = event.key;

            var focused, itemToFocus;
            focused = that.list.find(".focused");        
            if(event.key) {
                switch (key) {
                  case 'Enter':
                  case 'Escape':
                  case ' ':
                    event.preventDefault();
                    that.selectItemKeyboard();
                    $(this).addClass("hide");
                    //that.button.find(".icon").removeClass("icon-arrow-up").addClass("icon-arrow-down");
                    that.button.removeAttr("aria-expanded");
                    that.button.focus();
                    break;
                  case 'ArrowUp':
                    event.preventDefault();
                    if(focused.length && focused.prev().length) {
                      itemToFocus = focused.prev();
                      that.updateFocused(itemToFocus);
                    }              
                  break;
                  case 'ArrowDown':
                    event.preventDefault();
                    if(focused.length && focused.next().length) {
                      itemToFocus = focused.next();
                      that.updateFocused(itemToFocus);
                    }
                  break;
                  case 'Home':
                    event.preventDefault();
                    itemToFocus = $(this).find('li').first();
                    if (itemToFocus.length) {
                      that.updateFocused(itemToFocus);
                    }
               
                  break;
                  case 'End':
                    event.preventDefault();
                    itemToFocus = $(this).find('li').last();
                    if (itemToFocus.length) {
                      that.updateFocused(itemToFocus); 
                    }
                  break;
                  default:
                    itemToFocus = that.findItemToFocus(key);
                    if (itemToFocus) {
                      that.updateFocused(itemToFocus);
                    }
                  break;
                }
            } 
        },
        copySelected: function(element, idx){
            var title = $("<span/>");
            title.addClass('title banner-body-copy');
            var text = '';
           
            if(this.concatenate && idx !== 0) {
                var concatOpt = $("<span/>");
                concatOpt.addClass('concat');
                text = this.select.find('option').first().text(); 
                var dots = text.search(/\.{3}/);
                if(dots !== -1){
                    text = text.substring(0, dots);
                }
                title.text(text + ' ');
                concatOpt.text(element.text());
                title.append(concatOpt);
            } else {
                title.text(element.text());
            }
            return title;
        },
        selectItemKeyboard: function(){
          var focused, current, arrow;
          
          focused = this.list.find(".focused");
          current = this.list.find("li[aria-selected='true']");

          arrow = $("<span/>");
          arrow.addClass("icon icon-arrow-down");
            
          if(focused.attr("id") !== current.attr("id")){
            
            this.select.find('option').each((function(i, el){ 

              if($(el).attr("value") == focused.data("value")) {
                this.selectedIndex = i;
                this.select.prop("selectedIndex", this.selectedIndex);
                this.value = this.select.val();
                //this.button.html(focused.html()); 
                this.button.html(this.copySelected(focused, i));
                this.button.append(arrow);
                this.list.attr("aria-activedescendant", focused.attr("id"));   
                current.removeAttr("aria-selected").removeClass('focused');
                focused.attr("aria-selected", "true");
                this.onUpdate();
                return false;
              }

            }).bind(this));
          } 
          //close the list
          this.button.click();
        },
        updateFocused: function(el){
       
          var focused = this.list.find(".focused");
          focused.removeClass("focused");
          el.addClass("focused");
          this.list.attr("aria-activedescendant", el.attr("id"));
          //scrolling
         
          if (this.list[0].scrollHeight > this.list[0].clientHeight) {
            var scrollBottom = this.list[0].clientHeight + this.list[0].scrollTop;
            var elementBottom = el[0].offsetTop + el[0].offsetHeight;
            if (elementBottom > scrollBottom) {
              this.list[0].scrollTop = elementBottom - this.list[0].clientHeight;
            }
            else if (el[0].offsetTop < this.list[0].scrollTop) {
              this.list[0].scrollTop = el[0].offsetTop;
            }
          }

        },
        findItemToFocus: function(key){
          var itemList = this.list.find('li');
          var char = String.fromCharCode(key);
          var searchIdx=0, nextMatch;
          if (!this.charsToSearch) {
              searchIdx = this.selectedIndex;
          }

          this.charsToSearch += char;
         
          this.clearKeys();
          nextMatch = this.findMatchInRange(itemList, searchIdx + 1, itemList.length);
          if (!nextMatch) {
            nextMatch = this.findMatchInRange(itemList, 0,  searchIdx);
          }
          return nextMatch;
        },

        clearKeys: function(){
          var keyClear;
          if (keyClear) {
            clearTimeout(keyClear);
            keyClear = null;
          }
          keyClear = setTimeout((function () {
            this.charsToSearch = '';
            keyClear = null;
          }).bind(this), 1000);
        },

        findMatchInRange: function(list, start, end){

          for (var i = start; i < end; i++) {
            if ((list.eq(i).text().toUpperCase().indexOf(this.charsToSearch.toUpperCase()) === 0)) {
              return list.eq(i);
            }
          }
          return null;
        },

        selectItem: function(event){
            var that = event.data;
            var current = that.list.find("li[aria-selected='true']");
            var arrow = $("<span/>");
            //arrow.addClass("icon icon-arrow-up");
            arrow.addClass("icon icon-arrow-down");
            if($(this).attr("id") !== current.attr("id")){
                that.select.find('option').each((function(i, el){
                    if($(el).val() == $(this).data("value")) {
                        that.selectedIndex = i;
                        that.select.prop("selectedIndex", that.selectedIndex);
                        that.value = that.select.val();
                        //that.button.html($(this).html());
                        that.button.html(that.copySelected($(this), i));
                        that.button.append(arrow);
                        that.list.attr("aria-activedescendant", $(this).attr("id"));
                        current.removeAttr("aria-selected").removeClass('focused');
                        $(this).addClass("focused").attr("aria-selected", "true");
                        that.onUpdate();
                        return false;
                    }
                }).bind(this));
            }

            that.button.click();
        },

        buttonClick: function(event){
          var that = event.data;
          event.stopPropagation();
          that.list.toggleClass("hide");
          //$(this).find(".icon").toggleClass("icon-arrow-down");
          //$(this).find(".icon").toggleClass("icon-arrow-up");
          if($(this).attr("aria-expanded")) {
            $(this).removeAttr("aria-expanded");
          } else {
            $(this).attr("aria-expanded", "true");
            that.list.focus();
          }
        },

        open: function(event){
          var that = event.data;
          var key = event.key;

          if(event.key) {
              switch (key) {
                case 'ArrowUp': 
                case 'ArrowDown':
                  event.preventDefault();
                  if(!$(this).attr("aria-expanded")) {
                    that.list.toggleClass("hide");
                    //$(this).find(".icon").toggleClass("icon-arrow-down");
                    //$(this).find(".icon").toggleClass("icon-arrow-up");
                    $(this).attr("aria-expanded", "true");
                    that.list.focus();
                  }
                  break;
              }
          } 
        },

        close: function(event){
          var that = event.data;
          var target = $(event.target);
          var id = that.element.attr('id');
          if(!target.closest('#'+id).length && that.list.is(':visible')) {
            that.list.addClass("hide");
            that.button.removeAttr("aria-expanded");
            //that.button.find(".icon").removeClass("icon-arrow-up").addClass("icon-arrow-down");
          }
        },

        hoverItem: function(event){
            var that = event.data;
            that.list.find('li').removeClass('focused');
            $(this).addClass('focused');
        }

    };

    /**
     *  @param {jQuery} links //which trigger tooltips open 
     */
    var Tooltip = function(links, lang) {
        this.links = links;
        this.lang = lang ? lang : $('html').attr('lang');
        this.init();
        this.registerEvents();
    };

    Tooltip.prototype = {
        init: function(){

            this.links.each((function(i, el){
                var tipId = $(el).attr('id');
                $(el).attr('aria-expanded', 'false');
                var content = $(el).next('.tooltip-popup-content');
                content.attr('tabindex', '-1');
                content.wrap('<div class="middle"></div>');
                var middle = content.parent('.middle');
                middle.append('<button type="button" class="tooltip-close" aria-label="'+  (this.lang === 'en' ? 'Close.' : 'Fermer.') +
                '"><span class="icon icon-close"></span></button>');
                middle.wrap('<div id="' + tipId + '-popup" class="tooltip-popup hidden" aria-hidden="true" role="region"></div>');
                var wrapper = middle.parent('.tooltip-popup.hidden');
                wrapper.append('<div class="bottom"></div> ');
                $(el).attr('aria-controls', tipId+'-popup');
                if(content.hasClass('left-align')) {
                    wrapper.addClass('posLeft');
                } else if(content.hasClass('right-align')) {
                    wrapper.addClass('posRight');
                }
            }).bind(this));


        },
        registerEvents: function(){
            this.links.on('click', this, this.tipClick);
        },
        tipClick: function(event){
            var that = event.data;
            event.preventDefault();
            if ($(this).next(".tooltip-popup.hidden").length > 0) {
                //pass button and region as parameters
                that.showTooltip($(this), $('#'+$(this).attr('aria-controls')));
            }
        },

        showTooltip: function(button, region) {
            var content = region.find(".tooltip-popup-content");
            region.removeClass("hidden");
            this.size(region);

            region.addClass("visible")
                .attr("aria-hidden", "false");

            button.attr("aria-expanded", "true");

            content.attr("tabindex", "0").focus();    

            this.addListeners(button, region);    
        },

        size: function(content) {

            //content.removeClass("posRight").removeClass('posLeft');
            if(content.hasClass('posRight') || content.hasClass('posLeft')) {
                return;
            }
            var windowSize = $(window).width();
            var clientSize = content[0].getBoundingClientRect();
            var rightDistance =  windowSize - clientSize.right;
            var leftDistance = clientSize.left - 0;
            var adjust = 0;
            var pointer = content.find('.bottom');

           if(rightDistance < 0) { //not enough space from the right side 
                adjust =  rightDistance - 10; //adding extra space
                content.css('transform', 'translateX(calc(-50% + '+ adjust+'px)');
                pointer.css('left', 'calc(50% - '+ adjust +'px)');
           } else if(leftDistance < 0) { //not enough space from the left side
                adjust = leftDistance - 10;  //adding extra space
                content.css('transform', 'translateX(calc(-50% - '+ adjust+'px)');
                pointer.css('left', 'calc(50% + '+ adjust +'px)');
           } 

            /*if (clientSize.right > windowSize) {
                content.addClass("posLeft");
           
            } else if (clientSize.left < 0) {
                content.addClass("posRight");
            }  */
        },

        addListeners: function(button, region) {
            var closeBtn = region.find('.tooltip-close');
            region.on('focusout', {tip: this, button: button, region: region}, this.removeFocus);
            region.on('keydown', this, this.keyEvent);
            closeBtn.on('click', {tip: this, button: button, region: region}, this.closeClick);
        },

        removeFocus: function(event){
            var that = event.data;
            setTimeout(function() {

                var opacity = false;
                that.region.find('*').each(function() {
                    if ($(this).is(":focus")) {
                        opacity = true;
                    }
                });

                if (!opacity && !that.region.is(":focus")) {

                    that.tip.hideTooltip(that.button, that.region);
                }
            }, 1);
               
        },
        keyEvent: function(event) {
            var that = event.data;  
            var first = $(this).find(".tooltip-popup-content").eq(0)[0];
            var last= $(this).find("button").eq(0)[0];
            var key = event.key;
            if(event.key) {
                if (key == 'Tab') {
                    if (event.shiftKey) {
                        if (first && document.activeElement === first) {
                            last.focus();
                            event.preventDefault();
                        }
                    } else {
                        if (last && document.activeElement === last) {
                            first.focus();
                            event.preventDefault();
                        }
                    }
                }
            } 
        },

        closeClick: function(event){
            var that = event.data;
            event.preventDefault();
            that.tip.hideTooltip(that.button, that.region);
            that.button.focus();
        },

        hideTooltip: function(button, region){

            var content = region.find(".tooltip-popup-content");
            var pointer = region.find(".bottom");

            button.attr("aria-expanded", "false");
                region.removeClass("visible")
                .attr("aria-hidden", "true");
                
            
            setTimeout(function() {
                region.addClass("hidden");
                if(!region.hasClass('posRight') && !region.hasClass('posLeft')) {
                    region.css('transform', 'translateX(-50%)');
                    pointer.css('left', '50%');
                }
            }, 500);

            content.attr("tabindex", "-1");
            this.removeListeners(region);
        },

        removeListeners: function(region) {
     
            var closeBtn = region.find('.tooltip-close');
            region.off("keydown", this.keyEvent);
            region.off("focusout", this.removeFocus);
            closeBtn.off("click", this.closeClick);

           
        }

    };  
    /**
     * 
     * @param {JQuery} input - input element
     * @param {Object} settings - settings for autocomplete
     * @param {Function} search - function which returns serch result
     *      settings:
            * clearButton - bollean, if need to add to the input clear button, false by default
            * searchButton - bollean, if need to add search button, false by default
            * dropdownButton - bollean, if need to add drop down button, false by default
            * lang - string - language en | fr, get from html attribute by default
     */
    var Autocomplete = function(input, settings, search){

        this.input = input;
        this.search = search;
        this.settings = settings ||  {};
        this.combobox;
        this.list;
        this.clearButton;
        this.searchButton;
        this.dropdownButton;
        this.activeIndex = -1;
        this.resultsCount = 0;
        this.init();
        this.registerEvents();
    };

    Autocomplete.prototype = {
        init: function(){
            var inputId = this.input.attr('id'); 
            this.settings.clearButton = (this.settings.clearButton !== undefined ? this.settings.clearButton : false);
            this.settings.searchButton = (this.settings.searchButton !== undefined ? this.settings.searchButton : false);
            this.settings.dropdownButton = (this.settings.dropdownButton !== undefined ? this.settings.dropdownButton : false);
            this.settings.lang = this.settings.lang ?  this.settings.lang : $('html').attr('lang');
            this.input.wrap('<div role="combobox" aria-expanded="false" aria-owns="' + inputId +
            '-listbox" aria-haspopup="listbox" id="' + inputId + '-combobox"></div>');
            this.combobox = this.input.parent('[role="combobox"]');
            if(this.settings.clearButton) {
                this.combobox.append('<button type="button" class="clear-button" aria-label="'+  (this.settings.lang === 'en' ? 'clear' : 'effacer') +
                 '">&#x2715;</button>');
                this.clearButton = this.combobox.find('.clear-button');
            }
            if(this.settings.searchButton) {
                this.combobox.append('<button type="button" class="search-button" aria-label="'+  (this.settings.lang === 'en' ? 'search' : 'chercher') +
                '"><span class="icon icon-search"></span></button>');
                this.searchButton = this.combobox.find('.search-button');
            }
            if(this.settings.dropdownButton) {
                var label = $('[for="'+inputId+'"]').text();
                this.combobox.append('<button type="button" class="drop-down-button" aria-label="'+ label +'">');
                this.dropdownButton = this.combobox.find('.drop-down-button');
            }
            this.combobox.wrap('<div class="combobox-wrapper"></div>');
            var wrapper = this.combobox.parent('.combobox-wrapper');
            wrapper.append('<ul aria-labelledby="' + inputId + '-label"  role="listbox" id="' + inputId + 
            '-listbox" class="listbox hidden"></ul>');
            this.list = wrapper.find('[role="listbox"]');
            this.input.attr('aria-controls', inputId + '-listbox' );
            if(this.settings.dropdownButton) {
                this.input.attr('aria-autocomplete', 'both');
            } else {
                this.input.attr('aria-autocomplete', 'list');
            }
            
        },
        registerEvents: function(){
            $('body').on('click', this, this.checkHide);
            this.input.on('keyup', this, this.checkKey);
            this.input.on('keydown', this, this.setActiveItem);
            this.input.on('focus', this, this.checkShow);
            this.input.on('blur', this, this.checkSelection);
            this.list.on('click', this, this.clickItem);
            if(this.settings.clearButton) {
                this.clearButton.on('click', this, this.clearInput);
            }
            if(this.settings.searchButton) {
                this.searchButton.on('click', this, this.doSearch);
            }
            if(this.settings.dropdownButton) {
                this.dropdownButton.on('click', this, this.buttonClick);
            }
        },

        checkHide: function(event) {
            var that = event.data;
            if (event.target === that.input || that.combobox.has(event.target).length > 0) {
                return;
            }
            that.hideListbox();
        },
        hideListbox: function(){
           
            this.activeIndex = -1;
            this.list.empty();
            this.list.addClass('hidden');
            this.combobox.attr('aria-expanded', 'false');
            this.resultsCount = 0;
            this.input.attr('aria-activedescendant','');        
           
        },
        checkKey: function(event){
            var that = event.data;
            var key = event.key;
            if(event.key) {
                switch (key) {
                    case 'Enter': 
                    case 'Escape': 
                    case 'ArrowUp': 
                    case 'ArrowDown': 
                        event.preventDefault();              
                        break;
                    default:
                        that.updateResults(event, false, false);
                        if (that.settings.dropdownButton && key !== 'Backspace') {
                            that.autocompleteItem();
                        }
                    break;
                }

            } 
            
        },

        updateResults: function(event, showAll, backward){
            var that = event.data;
            var searchString = that.input.val();
            var results = [];

            results = that.search(searchString);
            that.hideListbox();

            if (!showAll && !searchString) {
                results = [];
            }

            if (results.length) {
                that.resultsCount = results.length;

                $.each(results, (function(idx, val){
                    this.list.append($("<li>", {
                        text: val
                    }).addClass("result").attr('role', 'option').attr('id', 'item-' + idx));
                }).bind(that));

                if(that.settings.dropdownButton){
                    var activeItem = backward ?  $('#item-'+that.resultsCount-1) : $('#item-'+0);
                    activeItem.addClass('focused').attr(('aria-selected', 'true'));     
                    that.activeIndex = backward ? that.resultsCount -1 : 0;
                }

                that.list.removeClass('hidden');
                that.combobox.attr('aria-expanded', 'true');
                
            }
        },

        setActiveItem: function(event){

            var that = event.data;
            var key = event.key;
            var activeIndex = that.activeIndex;
            if (key === 'Escape') {
                
              that.hideListbox();
              setTimeout((function () {
                // On Firefox, input does not get cleared
                this.input.val('');
              }).bind(that), 1);
              return;
            }
          
            if (that.resultsCount < 1) {
                if (that.settings.dropdownButton && (key === 'ArrowDown' || key === 'ArrowUp')) {
                    that.updateResults(event, true, true);
                }
                else {
                  return;
                }
            }

            var prevActive = $('#item-'+activeIndex);
            var activeItem;

            if(event.key) {
                switch (key) {
                  case 'ArrowUp':
                    event.preventDefault();
                    activeIndex = (activeIndex <= 0) ? that.resultsCount - 1 : activeIndex - 1;
                    that.list[0].scrollTop = $('#item-'+activeIndex)[0].offsetTop;
                    break;
                  case 'ArrowDown':
                    event.preventDefault();
                    if (activeIndex === -1 || activeIndex >= that.resultsCount - 1) {
                      activeIndex = 0;
                    }
                    else {
                      activeIndex++;
                    }
                    that.list[0].scrollTop = $('#item-'+activeIndex)[0].offsetTop;
                    break;
                  case 'Enter':
                        event.preventDefault();
                        that.selectItem($('#item-' + activeIndex));             
                    return;
                  case 'Tab':
                    event.preventDefault();
                    that.checkSelection(event);
                    that.hideListbox();
                    return;
                  default:
                    return;
                }
            }             
            activeItem = $('#item-'+activeIndex);
            that.activeIndex = activeIndex;
          
            if (prevActive.length) {
              prevActive.removeClass('focused').attr('aria-selected', 'false');
            }
          
            if (activeItem.length) {
              that.input.attr('aria-activedescendant','item-' + activeIndex);
              activeItem.addClass('focused').attr(('aria-selected', 'true'));
              if (that.settings.dropdownButton) {
                  that.input.val(activeItem.text());
              }
            }
            else {
              that.input.attr('aria-activedescendant','');
            }
        },
        selectItem: function(item){
            if (item.length) {
                this.input.val(item.text());                
            }
            this.hideListbox();
        },
        checkShow: function (event) {
            var that = event.data;
            that.updateResults(event, false, false);
        },
        buttonClick: function (event) {
            var that = event.data;
            that.updateResults(event, true);
        },
        checkSelection: function(event){
            var that = event.data;
            if(that.activeIndex < 0) return;
            that.selectItem($('#item-'+that.activeIndex));
        },
        clickItem: function(event){
            var that = event.data;
            var target = $(event.target);
            if (target.is( "li" )) {
                that.selectItem(target);
            }
        },
        clearInput: function(event){
            var that = event.data;
            that.input.val('');
            that.hideListbox();
        },
        doSearch: function(event){
            var that = event.data;
            that.selectItem($('#item-0'));
        },
        autocompleteItem: function () {
          var autocompletedItem = this.list.find('.focused');
          var inputText = this.input.val();

          if (autocompletedItem.length === 0 || !inputText) {
            return;
          }

          var content = autocompletedItem.text();
          if (inputText !== content) {
            this.input.val(content);
            this.input[0].setSelectionRange(inputText.length, content.length);
          }
        }
    };
    
      /**
     * 
     * @param {JQuery} input - input element
     * @param {JQuery} list - list element
     * @param {Object} settings - settings for autocomplete
     * @param {Function} search - function which returns serch result
     *      settings:
            * lang - String - language en | fr, get from html attribute by default
            * sort - Boolean, to sort the list or not, by default - false
            * keyword - Boolean - if true, uses list autocomplete, if false, uses inline autocomplete, by default - false
     */
    var ComboboxAutocomplete = function(input, list, settings){

        this.input = input;
        this.list = list;
        this.settings = settings ||  {};
        this.button;
        this.combobox;

        this.options = [];
        this.currentOption = null;
        this.firstOption = null;
        this.lastOption = null;

        this.filteredOptions = [];
        this.searchString = '';

        this.inputFocus = false;
        this.listFocus = false;

        this.isBoth = false;
        //this.hasHover = false;

        this.init();
        this.registerEvents();
        this.filterOptions();

    };

    ComboboxAutocomplete.prototype = {
        init: function(){
            var inputId = this.input.attr('id'); 
            var listId = this.list.attr('id');
            var label = $('[for="'+listId+'"]').text();
            this.settings.lang = this.settings.lang ?  this.settings.lang : $('html').attr('lang');
            this.settings.sort = this.settings.sort !== undefined ? this.settings.sort : false;
            this.settings.keyword = this.settings.keyword !== undefined ? this.settings.keyword : false;
            
            this.input.attr('role', 'combobox');
            this.input.attr('aria-controls', listId);
            this.input.attr('aria-expanded', 'false');

            var autocompleteValue = this.input.attr('aria-autocomplete');
            if(typeof autocompleteValue === 'undefined') {
                if(this.settings.keyword) {
                    this.input.attr('aria-autocomplete', 'list');
                    this.settings.isBoth = false;
                } else {
                    this.input.attr('aria-autocomplete', 'both');
                    this.settings.isBoth = true;
                }
            } else if(autocompleteValue === 'both') {
                if(this.settings.keyword) {
                    //inline autocomplete can't be used with serch by keywords
                    this.input.attr('aria-autocomplete', 'list');
                    this.settings.isBoth = false;
                } else {
                    this.settings.isBoth = true;
                }
            } else {
                 this.settings.isBoth = false;
            }
              
 
           
            this.input.wrap('<div class="combobox combobox-group"></div>');
            this.combobox = this.input.parent('.combobox');
    
            this.combobox.append('<button type="button" class="drop-down-button" aria-label="'+ label +
                '" aria-expanded="false" tabindex="-1" aria-controls="'+listId+'">');
            this.button = this.combobox.find('.drop-down-button');

            this.list.addClass('combobox-group');
            this.list.attr('role', 'listbox');
            this.list.attr('aria-label', label);

            $('.combobox-group').wrapAll('<div class="combobox-wrapper inline"></div>');

        },
        registerEvents: function(){
            
            this.input.on('keydown', this, this.onComboboxKeyDown);
            this.input.on('keyup', this, this.onComboboxKeyUp);
            this.input.on('click', this, this.onComboboxClick);

            this.input.on('focus', this, this.onComboboxFocus);
            this.input.on('blur', this, this.onComboboxBlur);

            this.list.on('click', this, this.onItemClick);


            if(this.settings.sort) {

                this.options = this.list.children('li').get();
                //sort options
                this.options.sort(function(a, b) {
                   return $(a).text().toLowerCase().localeCompare($(b).text().toLowerCase());
                });

                this.list.empty();
                $.each(this.options, (function(i, el){
                    if(typeof $(el).attr('id') === 'undefined') {
                        $(el).attr('id', 'item-'+i);   
                    }
                    this.list.append(el);
                }).bind(this));
            } else {

                this.list.find('li').each((function(i, el){
                    //save options
                    this.options.push($(el));
                }).bind(this));
            }

            this.button.on('click', this, this.onButtonClick);   

            $('body')[0].addEventListener('pointerup', this.onBackgroundPointerUp.bind(this), true);        
        },

        filterOptions: function() {
            var option = null;
            var previousOption = this.currentOption;
            var filter = this.searchString.toLowerCase();

            this.filteredOptions = [];
            this.list.empty();

            $.each(this.options, (function(i, el){
                var item = $(el);
                var idx = item.text().toLowerCase().indexOf(filter);
                if(this.searchString.length === 0 || 
                   (!this.settings.keyword && idx === 0) || (this.settings.keyword && idx >= 0)) {
                    this.filteredOptions.push(item);
                    this.list.append(item);
                }
            }).bind(this));


            // Use populated options array to initialize firstOption and lastOption.
            var resultCount = this.filteredOptions.length;
            if (resultCount > 0) {
                this.firstOption = this.filteredOptions[0];
                this.lastOption = this.filteredOptions[resultCount - 1];

                if (previousOption && this.filteredOptions.indexOf(previousOption) >= 0) {
                    option = previousOption;
                } else {
                    option = this.firstOption;
                }
            } else {
                this.firstOption = null;
                option = null;
                this.lastOption = null;
            }

            return option;
        },

        onComboboxKeyDown: function(event){
            var that = event.data;
            var key = event.key;
            var flag = false;
            var altKey = event.altKey;
            if (event.ctrlKey || event.shiftKey) {
                return;
            }

            switch (key) {
                case 'Enter':
                    if (that.listFocus) {
                      that.setValue(that.currentOption.text());
                      that.input.data('value', that.currentOption.data('value'));
                    }
                    that.close(true);
                    that.setInputFocus();
                    flag = true;
                    break;

                case 'Down':
                case 'ArrowDown':
                    if (that.filteredOptions.length > 0) {
                        if (altKey) {
                            that.open();
                        } else {
                            that.open();
                            if (that.listFocus || (that.settings.isBoth && that.filteredOptions.length > 1)) {
                              that.setOption(that.getNextOption(that.currentOption), true);
                              that.setListFocus();
                            } else {
                              that.setOption(that.firstOption, true);
                              that.setListFocus();
                            }
                        }
                    }
                    flag = true;
                    break;

                case 'Up':
                case 'ArrowUp':
                    if (that.filteredOptions.length > 0) {
                        if (that.listFocus) {
                            that.setOption(that.getPreviousOption(that.currentOption), true);
                        } else {
                            that.open();
                            if (!altKey) {
                              that.setOption(that.lastOption, true);
                              that.setListFocus();
                            }
                        }
                    }
                    flag = true;
                    break;

                case 'Esc':
                case 'Escape':
                    if (that.list.is(':visible')) {
                        that.close(true);
                        that.searchString = that.input.val();
                        that.filterOptions();
                        that.setInputFocus();
                    } else {
                        that.setValue('');
                        that.input.val('');
                        that.input.data('value', '');
                    }
                    that.currentOption = null;
                    flag = true;
                    break;

                case 'Tab':
                    that.close(true);
                    if (that.listFocus) {
                        if (that.currentOption) {
                            that.setValue(that.currentOption.text());
                            that.input.data('value', that.currentOption.data('value'));
                        }
                    }
                    break;

                case 'Home':
                    that.input[0].setSelectionRange(0, 0);
                    flag = true;
                    break;

                case 'End':
                    var length = that.input.val().length;
                    that.input[0].setSelectionRange(length, length);
                    flag = true;
                    break;

                default:
                    break;
                }

            if (flag) {
              event.stopPropagation();
              event.preventDefault();
            }

        },

        onComboboxKeyUp: function(event) {
            var that = event.data;
            var flag = false;
            var option = null;
            var key = event.key;

            if (that.isPrintableCharacter(key)) {
                that.searchString += key;
            }

            // this is for the case when a selection in the textbox has been deleted
            if (that.input.val().length < that.searchString.length) {
                that.searchString = that.input.val();
                that.currentOption = null;
                that.filterOptions();
            }

            if (key === 'Escape' || key === 'Esc') {
                return;
            }

            switch (key) {
                case 'Backspace':
                    that.setInputFocus();
                    that.setCurrentOptionStyle(null);
                    that.searchString = that.input.val();
                    that.currentOption = null;
                    that.filterOptions();
                    if (that.list.is(':hidden') && that.input.val().length > 0) {
                        that.open();
                    }
                    flag = true;
                    break;

                case 'Left':
                case 'ArrowLeft':
                case 'Right':
                case 'ArrowRight':
                case 'Home':
                case 'End':
                    if(that.settings.isBoth) {
                        that.searchString = that.input.val();
                    } else {
                        that.currentOption = null;
                        that.setCurrentOptionStyle(null);
                    }
                                       
                    that.setInputFocus();
                    flag = true;
                    break;

                default:
                    if (that.isPrintableCharacter(key)) {
                        that.setInputFocus();
                        that.setCurrentOptionStyle(null);
                        flag = true;

                        option = that.filterOptions();
                        if (option) {                    
                            if (that.list.is(':hidden') && that.input.val().length > 0) {
                                that.open();
                            }
                            if (option.text().toLowerCase().indexOf(that.input.val().toLowerCase()) === 0) {
                                that.currentOption = option;
                                if(that.settings.isBoth || that.listFocus) {
                                    that.setCurrentOptionStyle(option);
                                    if(that.settings.isBoth) {
                                        that.setOption(option);
                                    }
                                }

                              } else {
                                that.currentOption = null;
                                that.setCurrentOptionStyle(null);
                              }
                        } else {
                            that.close();
                            that.currentOption = null;
                            that.setActiveDescendant(null);
                        }
                      
                    }

                    break;
            }

            if (flag) {
              event.stopPropagation();
              event.preventDefault();
            }
        },

        onComboboxClick: function(event) {
            var that = event.data;
            if (that.list.is(':visible')) {
              that.close(true);
            } else {
              that.open();
            }
        },

        onComboboxFocus: function(event) {
            var that = event.data;
            that.searchString = that.input.val();
            that.filterOptions();
            that.setInputFocus();
            that.currentOption = null;
            that.setCurrentOptionStyle(null);
        },

        onComboboxBlur: function(event) {
            var that = event.data;
            that.removeFocusAll();
        },


        onItemClick: function(event) {
            var that = event.data;
            var target = $(event.target);
            if (target.is( "li" )) {
                that.input.val(target.text());
                that.input.data('value', target.data('value'));
            }
            that.close(true);
            that.removeFocusAll();
        },


        onButtonClick: function(event) {
            var that = event.data;
            if (that.list.is(':visible')) {
              that.close(true);
            } else {
              that.open();
            }
            that.input.focus();
            that.setInputFocus();
        },

        onBackgroundPointerUp: function(event) {
            if (
              !this.input[0].contains(event.target) &&
              !this.list[0].contains(event.target) &&
              !this.button[0].contains(event.target)
            ) {
              this.inputFocus = false;
              this.setCurrentOptionStyle(null);
              this.removeFocusAll();
              setTimeout(this.close(true), 300);
            }
        },

        setValue: function(value) {
            this.searchString = value;
            this.input.val(this.searchString);
            this.input.data()
            this.input[0].setSelectionRange(this.searchString.length, this.searchString.length);
            this.filterOptions();
        },

        setOption: function(option, flag) {

            if (option.length > 0) {
                this.currentOption = option;
                this.setCurrentOptionStyle(this.currentOption);
                this.setActiveDescendant(this.currentOption);

                if(this.settings.isBoth) {
                    this.input.val(this.currentOption.text());
                    if (flag) {
                            this.input[0].setSelectionRange(
                            this.currentOption.text().length,
                            this.currentOption.text().length
                        );
                    } else {
                            this.input[0].setSelectionRange(
                            this.searchString.length,
                            this.currentOption.text().length
                        );
                    }
                }             
            }
        },

        getPreviousOption: function(currentOption) {
            if (currentOption !== this.firstOption) {
              var index = this.filteredOptions.indexOf(currentOption);
              return this.filteredOptions[index - 1];
            }
            return this.lastOption;
        },

        getNextOption: function(currentOption) {
            if (currentOption !== this.lastOption) {
              var index = this.filteredOptions.indexOf(currentOption);
              return this.filteredOptions[index + 1];
            }
            return this.firstOption;
        },

        close: function(force) {
            if (force || (!this.inputFocus && !this.listFocus)) {
                this.setCurrentOptionStyle(null);
                this.list.hide();
                this.input.attr('aria-expanded', 'false');
                this.button.attr('aria-expanded', 'false');
                this.setActiveDescendant(null);
                this.combobox.addClass('focus');
            }
        },
        
        open: function() {
            this.list.show();
            this.input.attr('aria-expanded', 'true');
            this.button.attr('aria-expanded', 'true');
        },

        setCurrentOptionStyle: function(option) {
            if(!option) {
                $.each(this.filteredOptions, function(i, el) {
                    $(el).attr('aria-selected', 'false');
                });
                return;
            }

            $.each(this.filteredOptions, (function(i, el) {
                var opt = el;

                if (opt === option) {
                    opt.attr('aria-selected', 'true');
                    if (this.list[0].scrollTop + this.list[0].offsetHeight <
                        opt[0].offsetTop + opt[0].offsetHeight
                    ) {
                      this.list[0].scrollTop =
                        opt[0].offsetTop + opt[0].offsetHeight - this.list[0].offsetHeight;
                    } else if (this.list[0].scrollTop > opt[0].offsetTop + 2) {
                      this.list[0].scrollTop = opt[0].offsetTop;
                    }
                } else {
                    opt.attr('aria-selected', 'false');
                }
            }).bind(this));
        },
       
        setActiveDescendant: function(option) {
            if (option && this.listFocus) {
                this.input.attr('aria-activedescendant', option.attr('id'));
                if (!this.isOptionInView(option)) {
                    option[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } else {
                this.input.attr('aria-activedescendant', '');
            }
        },

        isOptionInView: function(option) {
            var bounding = option[0].getBoundingClientRect();
            return (
              bounding.top >= 0 &&
              bounding.left >= 0 &&
              bounding.bottom <=
                (window.innerHeight || document.documentElement.clientHeight) &&
              bounding.right <=
                (window.innerWidth || document.documentElement.clientWidth)
            );
        },
        
        setInputFocus: function() {
            this.list.removeClass('focus');
            this.combobox.addClass('focus'); 
            this.inputFocus = true;
            this.listFocus = false;
            this.setActiveDescendant(null);
        },

        setListFocus: function() {
            this.combobox.removeClass('focus');
            this.inputFocus = false;
            this.listFocus = true;
            this.list.addClass('focus');
            this.setActiveDescendant(this.currentOption);
        },
        
        removeFocusAll: function() {
            this.combobox.removeClass('focus');
            this.inputFocus = false;
            this.listFocus = false;
            this.list.removeClass('focus');
            this.option = null;
            this.setActiveDescendant(null);
        },

        isPrintableCharacter: function(str) {
            return str.length === 1 && str.match(/\S| /);
        }

    };
    /**
     * 
     * @param {JQuery} element - input element
     * @param {Number} value - value of the input 
     * @param {Object} settings - setting for the input
     * @param {Function} callback - function triggered on input change
     *  settings
        * lang            - String 'en'||'fr' - used for formatting the output - default get ftom html tag
        * type            - String 'currency'||'number'||'percentage' - used for formatting output - default 'currency'
        * precision       - Number amount of characters after comma - default 0 (used for rounding and formatting value)
        * min             - Number - minimum value - used in default validation function 
        * max             - Number - maximum value - used in default validation function 
        * autoCorrect     - default is true - any invalid value will be corrected after blurring the input field
        * keepEmpty       - default is false - set 0 if input empty 
        * addSymbol       - String '$' - no symbol by defeult
        * align           - String 'left'|'right'. Align content in the input. By default - right
     */
    var Input = function (element, value, settings, callback){
        this.element = element;
        this.error;
        this.node;
        this.display;
        this.value = value || 0;

        this.id = this.element.attr('id');

        this.settings = settings || {};
        this.onUpdate = callback || function(){};

        this.updateByValue = function(val, trigger){
            this.setValue(val, trigger);
        };

        this.updateMinMax = function(min, max){
            
            this.settings.min = min || 0;
            this.settings.max = max || 0;

            if(this.value < min) {
                this.value = min;
            } else if(this.value > max) {
                this.value = max;
            }
            this.element.attr('min', min);
            this.element.attr('max', max);
            this.element.attr('aria-valuemin', min);
            this.element.attr('aria-valuemax', max);
            this.handleValue(this.value);
        };

       
        this.addSubscribers = function(list){
            $.each(list, (function(idx, id){
                var el = $('#'+id);
                if(this.settings.subscribers.indexOf(el) < 0) {
                    this.settings.subscribers.push(el);
                }
            }).bind(this));  
            
            this.element.on('update', this, this.updateSubscribers);
            this.element.trigger('update', [this.value]);
        };

        this.removeSubscribers = function(list){
            if(typeof list === 'undefined') {
                this.settings.subscribers = [];
            } else {
                $.each(list, (function(idx, id){
                    var el = $('#'+id);
                    var index = this.settings.subscribers.indexOf(el);
                    this.settings.subscribers.splice(index, 1);
                }).bind(this));  
            }
            
            this.element.off('update', this, this.updateSubscribers);

        };

        this.validateInput = function(){
            var error = (typeof this.element.attr('required') !== 'undefined' && this.value === 0); 
            var validValue = this.validate(this.value);
            //validated should be only those which don't have autocorrect
            if(validValue !== this.value){ 
                error = true;
            } 

            if(this.error.length > 0){
                if(error) {
                    this.element.attr('aria-invalid', 'true').addClass('error-field')
                    this.error.addClass('visible');
                    if(window.digitalData && window.digitalData.utils) {
                        window.digitalData.utils.inPageError([{code: this.id, field: this.element.attr('data-input-name') ? this.element.attr('data-input-name') : this.element.attr('name'), type: 'error'}]);
                    }
                } else {
                    this.element.attr('aria-invalid', 'false').removeClass('error-field');
                    this.error.removeClass('visible');
                }
            }
        };

        this.init();
        this.registerEvents();
    };
    Input.prototype = {
        init: function() {
            //set default values
            this.settings.type = this.settings.type || 'number';
            this.settings.precision = this.settings.precision || 0;
        
            this.settings.maxlength = this.settings.maxlength || 0;

            //must be used English format with dot separator for precision
            this.settings.min = parseFloat(this.element.attr('min')) || this.settings.min ||0;
            this.settings.max = parseFloat(this.element.attr('max')) || this.settings.max;
            if(typeof this.element.attr('min') === 'undefined') {//set attributes on the html
                this.element.attr('min', this.settings.min);
            }
            if(typeof this.element.attr('max') === 'undefined' && typeof this.settings.max !== 'undefined') {//set attributes on the html
                this.element.attr('max', this.settings.max);
            }

            this.settings.autoCorrect = (this.settings.autoCorrect !== undefined ? this.settings.autoCorrect : true);
            
            this.settings.keepEmpty = (this.settings.keepEmpty !== undefined ? this.settings.keepEmpty : false);

            this.settings.lang = (this.settings.lang !== undefined ? this.settings.lang : $('html').attr('lang'));

            this.settings.align = (this.settings.align !== undefined ? this.settings.align : 'right');

            this.settings.subscribers = [];
            /* format */

            this.settings.decimalSeparator = (this.settings.lang == 'en') ? '.' : ',';
            this.settings.thousandSeparator = (this.settings.lang == 'en') ? ',' : '&nbsp;';

            if(this.settings.type == 'currency') {
                this.settings.prefix = (this.settings.lang == 'en') ? '$' : '';
                this.settings.suffix = (this.settings.lang == 'en') ? '' : '&nbsp;$';
            } else if (this.settings.type == 'percentage') {
                this.settings.suffix = (this.settings.lang == 'en') ? '%' : '&nbsp;%';
            } 

            this.settings.pattern = new RegExp('[0-9'+(this.settings.precision ? '\\'+this.settings.decimalSeparator : '')+']');

            this.element.wrap('<div class="input-wrapper"></div>');
            this.node = this.element.parent('.input-wrapper');
            if (this.settings.addSymbol !== undefined) {
                
                if(this.settings.lang === 'fr' || this.settings.addSymbol === '%') {
                    this.node.prepend('<span class="input-symbol to-right">'+this.settings.addSymbol+'</span>');
                } else {
                    this.node.prepend('<span class="input-symbol">'+this.settings.addSymbol+'</span>');
                }
            } 

            this.node.append('<span class="input-format" aria-hidden="true">&nbsp;</span>');
            this.display =  this.node.find('.input-format');


            this.node.addClass(this.settings.align+'-align');
            this.error = this.node.next('.error');
            if(this.error.length === 0){
                this.error = this.node.parent('.split-wrapper').next('.error');
            }
            
            //fix for safari
            this.element.attr('pattern', '[0-9]+([\.\,][0-9]+)?');
            this.element.attr('inputmode', 'decimal');
            this.element.val(this.value);
            this.updateDisplay(this.value);
            /*this.handleValue(this.value !== undefined ? this.value : 0);*/
        },
        
        registerEvents: function(){
            this.element.on('keydown', this, this.onKeydown); 
            this.element.on('keyup', this,this.onKeyup);
            this.element.on('focus', this, this.onFocus); 
            this.element.on('blur', this, this.onRelease); 
            this.node.on('click', this, this.onClick);
            //this.display.bind('focus',this,this.onDisplayFocus);      
        },
        onKeydown: function(event) { 
            var that = event.data;
            var key = event.key;
            
            if(event.key) { //extra precausion if event.key is not available
                if(!event.ctrlKey && key != 'Backspace' &&  key != 'Tab' && key != 'Delete' && key != 'ArrowLeft' && key != 'ArrowRight' &&
                    (!that.settings.pattern.test(key)) || 
                    (key == 'Enter') || //if there a form, prevent it from submission
                   (that.settings.maxlength && $(this).val().length > that.settings.maxlength)) {
                    event.preventDefault();
                    return false;
                } 
            } 
           
        },
        
        onKeyup: function(event){
            var that = event.data;
            var key = event.key;
            if(!event.ctrlKey && that.settings.maxlength && that.element.val().length > that.settings.maxlength){
                that.element.val(that.element.val().slice(0, that.settings.maxlength));
            } else if(key === 'Enter') {
                var focusables = $("select, input, textarea, button, a, [role='slider']");
                var current = focusables.index($(this));
                var next = focusables.eq(current+1).length ? focusables.eq(current+1) : focusables.eq(0);
                next.focus();
            }
        },

       /*onDisplayFocus: function(event){ //might be needed
            var that = event.data;
            that.node.focus();
        },*/
        onFocus: function(event) { 
            var that = event.data;

            if(parseInt(that.value) === 0) {
                that.element.val('');
            } else if (parseInt(that.value) !== 0 && that.settings.precision > 0 && that.settings.lang === 'fr') {
                 that.element.val(('' + that.value).replace(/\./,','));
            }

            that.element.select();
            that.display && that.display.html('&nbsp;');
            that.node.addClass('focus');
        },
        
        onRelease: function(event) { 
            var that = event.data;

            var currentValue = $(this).val();

            //prevent double blur on chrome (happens when leaving and returning to tab )
            //if(!that.node.hasClass('focus')){return;}

            //convert empty to null
            currentValue = currentValue === '' ? null : currentValue;
            
            if(currentValue !== that.value){
                that.handleValue(currentValue);
               // that.element.trigger('update', [currentValue]);
            } else {
                that.updateDisplay(that.value);
            }
            
            that.element.parent().removeClass('focus');
        },
        
        onClick: function(event){
            var that = event.data;
            that.element.focus();
        },

        validate: function(value){

            if(value < this.settings.min) { 
                value = this.settings.min;
            } else if (this.settings.max &&  value > this.settings.max) {
                value = this.settings.max;
            } else if (isNaN(value)){
                value = this.value;// set to previous value
            }

            return parseFloat(parseFloat(value).toFixed(this.settings.precision));
        },
        
        handleValue: function(value){
            var error = (typeof this.element.attr('required') !== 'undefined' && value === null);
            if(value !== null) {
                value = (this.settings.lang == 'en') ? ('' + value) : ('' + value).replace(/,/,'.');   
            } else {
                value = '0';
            }
            var currentValue = parseFloat(parseFloat(value).toFixed(this.settings.precision));
            var validValue = this.validate(currentValue);
            //handle input error and corrections
            if(validValue !== currentValue){
                if(this.settings.autoCorrect) {
                    error = false;
                    currentValue = validValue;
                } else {
                    error = true;
                }
            } 
            
            if(this.error.length > 0) {
                if(error) {
                    this.element.attr('aria-invalid', 'true').addClass('error-field')
                    this.error.addClass('visible');
                    if(window.digitalData && window.digitalData.utils) {
                        window.digitalData.utils.inPageError([{code: this.id, field: this.element.attr('data-input-name') ? this.element.attr('data-input-name') : this.element.attr('name'), type: 'error'}]);
                    }
                } else {
                    this.element.attr('aria-invalid', 'false').removeClass('error-field');
                    this.error.removeClass('visible');
                }
            }

            this.setValue(currentValue, !error);
            
        },

        setValue: function(value, trigger){ 
            var previousValue = this.value;            
            this.value = value;
            this.element.val(value);
            this.updateDisplay(value);
            if(trigger && previousValue !== this.value) { //trigger callback only if value changed
                this.onUpdate(this.id);
            }
            if (trigger || (!trigger && !this.element.hasClass('error-field') && this.settings.subscribers.length > 0)) { //do not update the value, let user fix it                
                this.element.trigger('update', [value]); 
            } 
        },
        updateDisplay: function(value) {
            var formattedValue = '&nbsp;';

            if(value != 0 || !this.settings.keepEmpty) {

                formattedValue = this.formatNumber(value);
            }
            this.display.html(formattedValue);
          
        },

        updateSubscribers: function(event, val) {
            var that = event.data;
            $.each(that.settings.subscribers, function(idx, el){
                var formattedValue = '&nbsp;';
                formattedValue = that.formatNumber(val);          
                if (that.settings.addSymbol !== undefined) {
                    
                    if(that.settings.lang === 'fr' || that.settings.addSymbol === '%') {
                        formattedValue = formattedValue+(that.settings.lang === 'fr' ? '&nbsp;' : '')+that.settings.addSymbol;
                    } else {
                        formattedValue = that.settings.addSymbol+formattedValue;
                    }
                } 
                el.html(formattedValue);
            });  
        },
        formatNumber: function(val) {
            val = isNaN(val = parseFloat('' + val)) ? 0 : val; //check it it's number
            val = val.toFixed(this.settings.precision !== undefined ? this.settings.precision : 2).split('.');//get number precision
            val[0] = val[0].replace(/(\d)(?=(\d{3})+\b)/g, '$1' + this.settings.thousandSeparator); //add thousands separator
            return (this.settings.prefix || '') + val.join(this.settings.decimalSeparator) + (this.settings.suffix || ''); // add currency and decimal separator
        }
    
    
    };
    
  /**
   * 
   * @param {JQuery} element - slider element 
   * @param {Number} value - value of the slider
   * @param {Object} settings - settings for slider
   * @param {Function} callback - function triggered on change
   *    settings:
        * lang         - String 'en'||'fr' - used for formatting the output - default get ftom html tag
        * type         - String 'currency'||'number'||'percentage' - used for formatting output - default 'currency'
        * precision    - Number amount of characters after comma - default 0 (used for rounding and formatting value)
        * min          -  minimim value
        * max          -  maximum value
        * marginLeft   -  optional Number left visual margin of handle, so that handle stays within width (e.g.: handle width is 25px, marginLeft:12,marginRight:13 )
        * marginRight  -  optional number right visual margin of handle, so that handle stays within width
        * marginTop    -  optional number 
        * marginBottom -  optional number
        * orientation  -  String 'horizontal'||'vertical'
        * step         -  optional interval of values 
        * multiStep    -  optional interval of multipple values 
        * ranges       -  optional non linear distribution of values ranges:["percent|value"] 
                        (e.g.:["50|1000","75|2000","90|3800"] => 1000 at 50% of width, 2000 at 75% and 3800 at 90% when max:5000)  
        * addMidLabel  -  Boolean, default false
        * addScale     -  Boolean, default false
        * adjustHandle -  Boolean, default false
        * customLabelMin  - String
        * customLabelMax  - String
   */
    var Slider = function (element, value, settings, callback) {

        this.element = element;
        this.handle = this.element.find('[role="slider"]');
        this.value = this.value || 0;
        this.percent;
        this.previousValue = value;

        //labels
        
        this.active;
        this.scale = null;
        this.labelMin;
        this.labelMax;
        this.labelMid = null;

        this.settings = settings || {};

        this.onUpdate = callback || function(){};

        this.updateByValue = function(val, trigger){
            this.setValue(val, trigger);
        };

        this.updateMinMax = function(min, max, multiStep, ranges, trigger){
            
            this.settings.min = min || 0;
            this.settings.max = max || 0;
            this.settings.multiStep = multiStep || ((max - min)/15);
            if(this.settings.step && this.settings.multiStep < this.settings.step) {
                this.settings.multiStep = this.settings.step;
            }
            this.settings.ranges = ranges;
            
            this.setRanges();

            if(this.value < min) {
                this.value = min;
            } else if(this.value > max) {
                this.value = max;
            }
            this.handle.attr('aria-valuemin', min);
            this.handle.attr('aria-valuemax', max);

            this.setValue(this.value, trigger);
            this.updateLabels();
        };

        this.addSubscribers = function(list){
            $.each(list, (function(idx, id){
                var el = $('#'+id);
                if(this.settings.subscribers.indexOf(el) < 0) {
                    this.settings.subscribers.push(el);
                }
            }).bind(this));  
            
            this.element.on('update', this, this.updateSubscribers);
            this.element.trigger('update', [this.value, this.percent]);
        };

        this.removeSubscribers = function(list){
            if(typeof list === 'undefined') {
                this.settings.subscribers = [];
            } else {
                $.each(list, (function(idx, id){
                    var el = $('#'+id);
                    var index = this.settings.subscribers.indexOf(el);
                    this.settings.subscribers.splice(index, 1);
                }).bind(this));  
            }
            
            this.element.off('update', this, this.updateSubscribers);

        };

        //r.touch=("ontouchstart" in window||window.DocumentTouch && document instanceof DocumentTouch);
        this.init();
        this.registerEvents();

    };
    
    Slider.prototype = {

        init: function() {

            this.handle.before('<div class="slider-bg">&nbsp;</div>');
            this.handle.before('<div class="slider-active"></div>');
            this.active = this.element.find('.slider-active');
            //set accessibility attributes
            if(!this.handle.attr('aria-valuemin')) {
                this.handle.attr('aria-valuemin', this.settings.min);
            }
            if(!this.handle.attr('aria-valuemax')) {
                this.handle.attr('aria-valuemax', this.settings.max);
            }
            if(!this.handle.attr('aria-valuenow')) {
                this.handle.attr('aria-valuenow', this.value);
            }
            if(!this.handle.attr('aria-valuetext')) {
                this.handle.attr('aria-valuetext', this.formatNumber(this.value));
            }
            
            //labels

            this.handle.after('<div class="sliderLabelMin" aria-hidden="true"></div>');
            this.labelMin =  this.element.find('.sliderLabelMin');

            if(this.settings.addMidLabel) {
                this.labelMin.after('<div class="sliderLabelMid" aria-hidden="true"></div>');
                this.labelMid = this.element.find('.sliderLabelMid');
                this.labelMid.after('<div class="sliderLabelMax" aria-hidden="true"></div>');
            } else {
                this.labelMin.after('<div class="sliderLabelMax" aria-hidden="true"></div>');
            }

            this.labelMax = this.element.find('.sliderLabelMax');

            this.labelMax.after('<div class="sliderClear">&nbsp;</div>');
        
            this.settings.lang = (this.settings.lang !== undefined ? this.settings.lang : $('html').attr('lang'));
            this.settings.type = this.settings.type || 'number';
            this.settings.precision = this.settings.precision >> 0 || 0;
        
            this.settings.min = this.settings.min || 0;
            this.settings.max = this.settings.max || 0;   

            this.settings.subscribers = [];

            /*margin*/
            this.settings.marginLeft = this.settings.marginLeft || 0;
            this.settings.marginRight = this.settings.marginRight || 0;
            this.settings.marginTop = this.settings.marginTop || 0;
            this.settings.marginBottom =  this.settings.marginBottom || 0;
            
            this.settings.isHorizontal = this.settings.orientation !== 'vertical';
            this.settings.minPosition = this.settings.isHorizontal ? this.settings.marginLeft  :  this.settings.marginTop;
            
            this.settings.adjustHandle !== undefined ? this.settings.adjustHandle : false;
           
            this.settings.step =  this.settings.step || null; //no restriction 
            
            this.settings.multiStep =  this.settings.multiStep || ((this.settings.max - this.settings.min)/15);
            this.setRanges();
                        
            if(this.settings.addScale) {
                this.handle.after('<div class="sliderScale"></div>'); //add number of steps    
                this.scale = this.element.find('.sliderScale');
                this.setTicks();
            }
 
            /*format*/
            if(this.settings.type == 'currency') {
                this.settings.prefix = (this.settings.lang == 'en') ? '$' : '';
                this.settings.suffix = (this.settings.lang == 'en') ? '' : '$';
            } else if (this.settings.type == 'percentage') {
                this.settings.suffix = (this.settings.lang == 'en') ? '%' : '&nbsp;%';
            } 
            this.settings.decimalSeparator = (this.settings.lang == 'en') ? '.' : ',';
            this.settings.thousandSeparator = (this.settings.lang == 'en') ? ',' : '&nbsp;';
 
            this.setHandle(this.calcPos(this.value));
            this.updateLabels();
            
        },
        
        registerEvents: function(){
  
            this.element.on('mousedown touchstart', this, this.slide);
            this.handle.on('keydown', this, this.onKeydown);
            this.handle.on('keyup', this, this.onKeyup);

        },
        
        setRanges: function(){

            var length = this.settings.ranges && this.settings.ranges.length || 0;
            var validRanges = [];
            var ratio;
            
            while(length--){
                ratio = this.settings.ranges[length].split('|');
                validRanges.unshift({percent: (ratio[0] * 1) / 100, value: ratio[1] * 1});
            }
            validRanges.unshift({percent:0, value: this.settings.min});
            this.settings.ranges = validRanges;
        },

        setTicks: function(){
            var tickLength = 0;
            var tick = null;
            var pos = 0;
            var sum = 0

            var innerSize = this.getSize();
            var size = this.settings.isHorizontal ? this.element.width() : this.element.height();
            var styleProp = this.settings.isHorizontal ? 'width' : 'height';

         
            if(this.settings.ranges && this.settings.ranges.length) {

                tickLength = this.settings.ranges.length;
                               
                for (var i = 0; i < tickLength - 1; i++){
                    tick = $('<div>', {class:'toolScale'});
                    var current = (i===0) ? 0 : (this.settings.ranges[i].percent * innerSize + this.settings.minPosition);
                    var next = (this.settings.ranges[i+1].percent * innerSize + this.settings.minPosition);
                 
                    pos = (next - current) / size;
                    tick.css(styleProp, (pos * 100) + '%');
                    this.scale.append(tick);
                    sum += pos;
                }
                
                tick = $('<div>', {class:'toolScale'});
                pos = ((1 - this.settings.ranges[tickLength-1].percent) * innerSize + this.settings.minPosition)/ size;
                tick.css(styleProp, (1-sum * 100) + '%');
                this.scale.append(tick);
            } else if(this.settings.step) {
                tickLength = (this.settings.max - this.settings.min) / this.settings.step;
            }
        },
        

        updateLabels: function(){

            if( this.labelMin && this.settings.customLabelMin) {
                this.labelMin.html(this.settings.customLabelMin);
            } else {
                this.labelMin && this.labelMin.html(this.formatNumber(this.settings.min));
            }
            if( this.labelMax && this.settings.customLabelMax) {
                this.labelMax.html(this.settings.customLabelMax);
            } else {
                this.labelMax &&  this.labelMax.html(this.formatNumber(this.settings.max));
            }
           
            if(!this.labelMid){ return; }

            var innerSize = this.getSize();
            var position = .5 * innerSize + this.settings.minPosition;

            this.labelMid.html(this.formatNumber(this.calcValue(position)));
        },
        
        getSize: function() {
           return this.settings.isHorizontal ? (this.element.width() - this.settings.marginLeft - this.settings.marginRight) : (this.element.height() - this.settings.marginTop - this.settings.marginBottom);
        },

        slide: function(event){
            var that = event.data;

            var posX = event.pageX;
            var posY = event.pageY;

            var offset = that.element.offset();
            var position;

            event.preventDefault();

            switch(event.type){
                case 'touchstart': 
                    that.element.on('touchmove', that, that.slide).on('touchend', that, that.stop);
                    that.handle.focus();
                case 'touchmove':
                    var moveTo = event.originalEvent.touches[0];

                    posX = moveTo.pageX;
                    posY = moveTo.pageY;
                    break;
                case 'mousedown': 
                    that.element.on('mousemove', that, that.slide).on('mouseup mouseleave', that, that.stop);
                    that.handle.focus();
                    break;
            }

            posX -= offset.left;
            posY -= offset.top;

            position = that.settings.isHorizontal ? posX : posY;

            if(!isNaN(position)){
                var valByPos = that.calcValue(position); // new
                that.setValue(valByPos, true); //new
                //that.setHandle(position);
                //that.element.trigger('change', [that.value, that.percent]);
                //that.previousValue = that.value;
            }
        },
        onKeydown: function(event){

            var key = event.key;
            if(event.key) {
                if(key != 'PageUp' && key != 'PageDown' && key != 'End' && key != 'Home' && key != 'ArrowLeft' && key != 'ArrowUp' && key != 'ArrowRight' && key != 'ArrowDown'){ return; }
            }
            
            event.preventDefault();
        },
        onKeyup: function(event){
            var that = event.data;
            var key = event.key;
            if(event.key) {
                if(key != 'PageUp' && key != 'PageDown' && key != 'End' && key != 'Home' && key != 'ArrowLeft' && key != 'ArrowUp' && key != 'ArrowRight' && key != 'ArrowDown'){ return; }
            } 
            
            event.preventDefault();
            
            if(event.key) { 
                switch(key){
                    case 'End':
                        that.value = that.settings.max; 
                        break; 
                    case 'Home':
                        that.value = that.settings.min; 
                        break; 
                    case 'PageDown':
                        //reverse if vertical
                        if(!that.settings.isHorizontal){
                            that.value += (that.settings.multiStep < 1 ? 1 : that.settings.multiStep);
                            break;
                        }  
                        that.value -= (that.settings.multiStep < 1 ? 1 : that.settings.multiStep);
                        break;
                    case 'ArrowDown':
                        //reverse if vertical
                        if(!that.settings.isHorizontal){
                            that.value += (that.settings.step ? that.settings.step : 1);
                            break;
                        }
                    case 'ArrowLeft':
                        that.value -= (that.settings.step ? that.settings.step : 1);
                        break;
                    case 'PageUp': 
                        //reverse if vertical
                        if(!that.settings.isHorizontal){
                            that.value -= (that.settings.multiStep < 1 ? 1 : that.settings.multiStep);
                            break;
                        }
                        that.value += (that.settings.multiStep < 1 ? 1 : that.settings.multiStep);
                        break;
                    case 'ArrowUp':
                        //reverse if vertical
                        if(!that.settings.isHorizontal){
                            that.value -= (that.settings.step ? that.settings.step : 1);
                            break;
                        }
                    case 'ArrowRight':
                        that.value += (that.settings.step ? that.settings.step : 1);
                        break;
                }
            } else {
                switch(key){
                    case 35: //end
                        that.value = that.settings.max; 
                        break; 
                    case 36: //home
                        that.value = that.settings.min; 
                        break; 
                    case 34: //PgDw 
                        //reverse if vertical
                        if(!that.settings.isHorizontal){
                            that.value += (that.settings.multiStep < 1 ? 1 : that.settings.multiStep);
                            break;
                        }  
                        that.value -= (that.settings.multiStep < 1 ? 1 : that.settings.multiStep);
                        break;
                    case 40: //down
                        //reverse if vertical
                        if(!that.settings.isHorizontal){
                            that.value += (that.settings.step ? that.settings.step : 1);
                            break;
                        }
                    case 37: //left
                        that.value -= (that.settings.step ? that.settings.step : 1);
                        break;
                    case 33: //PgUp 
                        //reverse if vertical
                        if(!that.settings.isHorizontal){
                            that.value -= (that.settings.multiStep < 1 ? 1 : that.settings.multiStep);
                            break;
                        }
                        that.value += (that.settings.multiStep < 1 ? 1 : that.settings.multiStep);
                        break;
                    case 38: //up
                        //reverse if vertical
                        if(!that.settings.isHorizontal){
                            that.value -= (that.settings.step ? that.settings.step : 1);
                            break;
                        }
                    case 39: //right
                        that.value += (that.settings.step ? that.settings.step : 1);
                        break;
                }
            }
            

            that.setValue(that.value, true);
        },
        stop: function(event){
            var that = event.data;
                   
            var eventType = event.type.substr(0,5);
                
            event.preventDefault();

            if(eventType == 'mouse') that.element.off('mousemove', that.slide).off('mouseup mouseleave', that.stop);
            else if(eventType == 'touch') that.element.off('touchmove', that.slide).off('touchend', that.stop);
                
            //that.removeSelection(); //////???????????????????

            that.setValue(that.value, true);
            //that.element.trigger('update',[that.value, that.percent]);
        },
        removeSelection: function(){ //do we need it 
            if (window.getSelection){
                window.getSelection().removeAllRanges();
            }else if (document.selection && document.selection.empty){
                document.selection.empty();
            }
        },

        setHandle: function(pos){
            
            var innerSize = this.getSize();
            var maxPosition = innerSize + this.settings.minPosition;
            var size = this.settings.isHorizontal ? this.element.width() : this.element.height();
                
            var styleProp = this.settings.isHorizontal ? 'width' : 'height';
            var stylePos = this.settings.isHorizontal ? 'left' : 'top';
            
            //validating pos
            if(pos < this.settings.minPosition) {
                pos = this.settings.minPosition;
            } else if(pos > maxPosition) {
                pos = maxPosition;
            }

            this.handle.css(stylePos,((pos / size) * 100) + '%');
            this.active.css(styleProp, ((pos / size) * 100) + '%');
            
            this.value = this.calcValue(pos);
            this.percent = (pos - this.settings.minPosition) / innerSize;


            this.handle.attr({'aria-valuenow': this.value, 'aria-valuetext': this.formatNumber(this.value)});

        },
        validate: function(value){      
            
            //step
            if(this.settings.step){
                value = (((value + this.settings.step / 2) / this.settings.step) >> 0) *this.settings.step;
            }

            if(isNaN(value) || value < this.settings.min){
                value = this.settings.min;
            } else if(value > this.settings.max){
                value = this.settings.max;
            }

            return parseFloat(value.toFixed(this.settings.precision));
        },

        setValue: function(value, trigger){
            var pos = this.calcPos(value);
            
            this.setHandle(pos);

            this.onUpdate();
            if(trigger || (!trigger && this.settings.subscribers.length > 0)){
                this.element.trigger('update', [this.value, this.percent]);
                this.previousValue = this.value;
            }
        },
        calcPos: function(value){

            var innerSize = this.getSize();
            var maxPosition = innerSize + this.settings.minPosition;

            var length = this.settings.ranges && this.settings.ranges.length || 0;
           
            var maxPercent = 1;
            var maxValue = this.settings.max;
            var percent = 0;
            var position = 0;

            value = this.validate(value);
            //calc handle pos for matching range
            while(length--) {
                var range = this.settings.ranges[length];

                if(value >= range.value){
                    if(!this.settings.adjustHandle) {
                        percent = range.percent + (maxPercent - range.percent) * ((value - range.value) / (maxValue - range.value));
                        break; 
                    } else {
                       if(value > this.previousValue && value > range.value) { // value is increasing
                            percent = maxPercent;
                            break;
                       } else if (value < this.previousValue) { //value is decreasing
                            percent = range.percent;
                            break;
                       } else {
                            percent = range.percent + (maxPercent - range.percent) * ((value - range.value) / (maxValue - range.value));
                            break; 
                       }
                    }
                }
                maxPercent = range.percent;
                maxValue = range.value;
            }
            position = percent * innerSize + this.settings.minPosition;
            //validating position
            if(position < this.settings.minPosition){
                position = this.settings.minPosition;
            }else if(position > maxPosition){
                position = maxPosition;
            }
            return position;
        },
        calcValue: function(pos){

            var innerSize = this.getSize();
            var percent = ((pos - this.settings.minPosition) / innerSize);

            var length = this.settings.ranges && this.settings.ranges.length || 0;
           
            var maxPercent = 1;
            var maxValue = this.settings.max;

            var value = 0;
            //calc handle percent for matching range
            while(length--){
                var range = this.settings.ranges[length];

                if(percent > range.percent){
                    value = range.value + (maxValue - range.value) * ((percent - range.percent) / (maxPercent - range.percent));
                    break;
                }
                maxPercent = range.percent;
                maxValue = range.value;
            }
            return this.validate(value);
        },

        updateSubscribers: function(event, val) {
            var that = event.data;
            $.each(that.settings.subscribers, function(idx, el){
                var formattedValue = '&nbsp;';
                formattedValue = that.formatNumber(val);          
                el.html(formattedValue);
            });  
        },

        formatNumber: function(val) {
            val = isNaN(val = parseFloat('' + val)) ? 0 : val; //check it it's number
            val = val.toFixed(this.settings.precision !== undefined ? this.settings.precision : 2).split('.');//get number precision
            val[0] = val[0].replace(/(\d)(?=(\d{3})+\b)/g, '$1' + this.settings.thousandSeparator); //add thousands separator
            return (this.settings.prefix || '') + val.join(this.settings.decimalSeparator) + (this.settings.suffix || ''); // add currency and decimal separator
        }
    };

    /**
     * 
     * @param {JQuery} input - input element
     * @param {JQuery} slider - slider element
     * @param {Number} value - value of the elements
     * @param {Object} settings - setting for both elements
     * @param {Function} callback - function which is triggered on changes
     *  settings:
        * common settings for both:
        * lang         - String 'en'||'fr' - used for formatting the output - default get ftom html tag
        * type         - String 'currency'||'number'||'percentage' - used for formatting output - default 'currency'
        * precision    - Number amount of characters after comma - default 0 (used for rounding and formatting value)
        * min          -  minimum value
        * max          -  maximum value
        * slider settings:
        * marginLeft   -  optional Number left visual margin of handle, so that handle stays within width (e.g.: handle width is 25px, marginLeft:12,marginRight:13 )
        * marginRight  -  optional number right visual margin of handle, so that handle stays within width
        * marginTop    -  optional number 
        * marginBottom -  optional number
        * orientation  -  String 'horizontal'||'vertical'
        * step         -  optional interval of values 
        * multiStep    -  optional interval of multipple values 
        * ranges       -  optional non linear distribution of values ranges:["percent|value"] 
                        (e.g.:["50|1000","75|2000","90|3800"] => 1000 at 50% of width, 2000 at 75% and 3800 at 90% when max:5000)  
        * addMidLabel  -  Boolean, default false
        * addScale     -  Boolean, default false
        * input settings:
        * autoCorrect  - default is true - any invalid value will be corrected after blurring the input field
        * keepEmpty    - default is false - set 0 if input empty 
        * addSymbol    - String '$' - no symbol by defeult
        * align        - String 'left'|'right'. Align content in the input. By default - right
     */
    var SliderGroup = function(input, slider, value, settings, callback) {
       
        this.input = new Input(input, value, settings, null);
        this.slider = new Slider(slider, value, settings, null);
        this.value = value || 0;
        this.percent = this.slider.percent;

        this.updateByValue = function(val) {
            this.value = val;
            this.input.updateByValue(val, false);
            this.slider.updateByValue(val, false);
            this.percent = this.slider.percent;
        };
        this.updateMinMax = function(min, max, multiStep, ranges, trigger){
            this.slider.updateMinMax(min, max, multiStep, ranges, trigger);
            this.input.updateMinMax(min, max);
        };

        this.addSubscribers = function(list){
            this.input.addSubscribers(list);
            this.slider.addSubscribers(list);
        };

        this.removeSubscribers = function(list){
            this.input.removeSubscribers(list);
            this.slider.removeSubscribers(list);
        };
        this.registerEvents();
    };

    SliderGroup.prototype = {
        registerEvents: function(){
            this.input.element.on('update', this, this.onInputUpdate);
            this.slider.element.on('update', this, this.onSliderUpdate).on('change', this, this.onSliderChange);
        },

        onSliderChange: function(event, val, percent) {
            var that = event.data;
            that.value = val;
            that.percent = percent;
            that.input.updateByValue(val, false);
        },

        onSliderUpdate: function(event, val, percent) {
            var that = event.data;
            that.value = val;
            that.percent = percent;
            that.input.updateByValue(val, false);

        },

        onInputUpdate: function(event, val){
            var that = event.data;
            that.value = val;
            that.slider.updateByValue(val, false);
            that.percent = that.slider.percent;
        }

    };

      /**
     * 
     * @param {JQuery} element - input element
     * @param {Number} value - value of the input 
     * @param {Object} settings - setting for the input
     * @param {Function} callback - function triggered on input change
     *  settings
        * lang            - String 'en'||'fr' - used for formatting the output - default get ftom html tag
        * precision       - Number amount of characters after comma - default 0 (used for rounding and formatting value)
        * min             - Number - minimum value - used in default validation function 
        * max             - Number - maximum value - used in default validation function 
        * multiStep       - Number
        * step            - Number
        * autoCorrect     - Boolean - default is true - any invalid value will be corrected after blurring the input field
        * keepEmpty       - Boolean - default is false - set 0 if input empty 
        * align           - String 'left'|'right'. Align content in the input. By default - right
        * addSymbol       - String '$' - no symbol by defeult
        * prefix          - String  before number to display
        * suffix          - String  after number to display
        * wrap            - Boolean - default is false, if true, when reach max, start from the beginning and vice versa 
        * liveContent     - String - extra accessibility content added to the live aria when user changes values
     */
    var Spinbutton = function (element, value, settings, callback){
        this.element = element;
        this.error;
        this.node;
        this.display;

        this.value = value || 0;
        this.previousValue = value;
        this.liveValue;

        this.id = this.element.attr('id');

        this.increase;
        this.decrease;

        this.settings = settings || {};
        this.onUpdate = callback || function(){};
 
        this.updateByValue = function(val, trigger){
            this.setValue(val, trigger);
        };

        this.updateMinMax = function(min, max, multiStep){
            
            this.settings.min = min || 0;
            this.settings.max = max || 0;
            this.settings.multiStep = multiStep || ((max - min)/15);
            if(this.settings.multiStep < this.settings.step) {
                this.settings.multiStep = this.settings.step;
            }
            
            if(this.value < min) {
                this.value = min;
            } else if(this.value > max) {
                this.value = max;
            }
            this.element.attr('min', min);
            this.element.attr('max', max);
            this.element.attr('aria-valuemin', min);
            this.element.attr('aria-valuemax', max);
            this.handleValue(this.value);
        };

        this.addSubscribers = function(list){
            $.each(list, (function(idx, id){
                var el = $('#'+id);
                if(this.settings.subscribers.indexOf(el) < 0) {
                    this.settings.subscribers.push(el);
                }
            }).bind(this));  
            
            this.element.on('update', this, this.updateSubscribers);
            this.element.trigger('update', [this.value]);
        };

        this.removeSubscribers = function(list){
            if(typeof list === 'undefined') {
                this.settings.subscribers = [];
            } else {
                $.each(list, (function(idx, id){
                    var el = $('#'+id);
                    var index = this.settings.subscribers.indexOf(el);
                    this.settings.subscribers.splice(index, 1);
                }).bind(this));  
            }
            
            this.element.off('update', this, this.updateSubscribers);

        };

        this.validateInput = function(){
            var error = (typeof this.element.attr('required') !== 'undefined' && this.value === 0); 
            var validValue = this.validate(this.value);
            //validated should be only those which don't have autocorrect
            if(validValue !== this.value){ 
                error = true;
            } 

            if(this.error.length > 0){
                if(error) {
                    this.element.attr('aria-invalid', 'true').addClass('error-field')
                    this.error.addClass('visible');
                    if(window.digitalData && window.digitalData.utils) {
                        window.digitalData.utils.inPageError([{code: this.id, field: this.element.attr('data-input-name') ? this.element.attr('data-input-name') : this.element.attr('name'), type: 'error'}]);
                    }
                } else {
                    this.element.attr('aria-invalid', 'false').removeClass('error-field');
                    this.error.removeClass('visible');
                }
            }
        };

        this.init();
        this.registerEvents();
    };
    Spinbutton.prototype = {
        init: function() {
            //set default values
            
            this.settings.precision = this.settings.precision || 0;
        
            this.settings.maxlength = this.settings.maxlength || 0;

            this.settings.min = parseFloat(this.element.attr('min')) || this.settings.min || 0;
            this.settings.max = parseFloat(this.element.attr('max')) || this.settings.max; 
            this.settings.step = parseFloat(this.element.attr('step')) || this.settings.step || 1;

            if(typeof this.element.attr('min') === 'undefined') {//set attributes on the html
                this.element.attr('min', this.settings.min);
            }
            if(typeof this.element.attr('max') === 'undefined' && typeof this.settings.max !== 'undefined') {//set attributes on the html
                this.element.attr('max', this.settings.max);
            }
            
            this.settings.multiStep =  this.settings.multiStep || ((this.settings.max - this.settings.min)/15);
            if(this.settings.multiStep < this.settings.step) {
                this.settings.multiStep = this.settings.step;
            } 
            
            this.settings.autoCorrect = (this.settings.autoCorrect !== undefined ? this.settings.autoCorrect : true);
            
            this.settings.keepEmpty = (this.settings.keepEmpty !== undefined ? this.settings.keepEmpty : false);

            this.settings.lang = (this.settings.lang !== undefined ? this.settings.lang : $('html').attr('lang'));

            this.settings.align = (this.settings.align !== undefined ? this.settings.align : 'right');

            this.settings.prefix = (this.settings.prefix !== undefined ? this.settings.prefix : '');
            this.settings.suffix = (this.settings.suffix !== undefined ? this.settings.suffix : '');
            
            this.settings.subscribers = [];
            /* format */

            this.settings.decimalSeparator = (this.settings.lang == 'en') ? '.' : ',';
            this.settings.thousandSeparator = (this.settings.lang == 'en') ? ',' : '&nbsp;';
           
            this.settings.wrap = (this.settings.wrap !== undefined ? this.settings.wrap : false);

            this.settings.pattern = new RegExp('[0-9'+(this.settings.precision ? '\\'+this.settings.decimalSeparator : '')+']');

            this.settings.liveContent = this.settings.liveContent || '';

            this.element.wrap('<div class="spinbutton"></div>');
            this.node = this.element.parent('.spinbutton');
            this.node.prepend('<span class="show-for-sr live-value" aria-live="assertive"></span>');
            this.node.append('<span class="input-format" aria-hidden="true">&nbsp;</span>');

            /*if(this.settings.prefix) {
                this.node.prepend('<span class="input-prefix">'+this.settings.prefix+'</span>');
            }
            if(this.settings.suffix) {
                this.node.append('<span class="input-suffix">'+this.settings.prefix+'</span>');
            }*/

            if (this.settings.addSymbol !== undefined) {
                
                if(this.settings.lang === 'fr' || this.settings.addSymbol === '%') {
                    this.node.prepend('<span class="input-symbol to-right">'+this.settings.addSymbol+'</span>');
                } else {
                    this.node.prepend('<span class="input-symbol">'+this.settings.addSymbol+'</span>');
                }
            } 

            this.display =  this.node.find('.input-format');
            this.liveValue = this.node.find('.live-value');
            this.node.addClass(this.settings.align+'-align');
           

            var wrapper = this.node.parent('.spinbutton-wrapper');
            this.decrease = wrapper.find('.button-decrease');
            this.increase = wrapper.find('.button-increase');
            this.error = wrapper.next('.error');
            
            this.element.attr('role', 'spinbutton');
            this.element.attr('aria-valuemin', this.settings.min);
            this.element.attr('aria-valuemax', this.settings.max);
           
            //fix for safari
            this.element.attr('pattern', '[0-9]+([\.\,][0-9]+)?');
            this.element.attr('inputmode', 'decimal');


            this.element.val(this.value);
            this.updateDisplay(this.value);
            
        },
        
        registerEvents: function(){
            this.element.on('keydown', this, this.onKeydown); 
            this.element.on('keyup', this,this.onKeyup);
            this.element.on('focus', this, this.onFocus); 
            this.element.on('blur', this, this.onRelease); 
            this.node.on('click', this, this.onClick);
            this.decrease.on('click', this, this.onDecrease);
            this.increase.on('click', this, this.onIncrease);
        },
        onKeydown: function(event) { 
            var that = event.data;
            var key = event.key;
            
            if(event.key) { //extra precausion if event.key is not available
                if(!event.ctrlKey && key != 'Backspace' &&  key != 'Tab' && key != 'Delete' && key != 'ArrowLeft' && key != 'ArrowRight' &&
                    (!that.settings.pattern.test(key)) || 
                    (key == 'Enter') || //if there a form, prevent it from submission
                    (key == 'PageUp') || (key == 'PageDown') || (key == 'End') || (key == 'Home') || (key == 'ArrowUp') || (key == 'ArrowDown') ||
                   (that.settings.maxlength && $(this).val().length > that.settings.maxlength)) {
                    event.preventDefault();
                    return false;
                } 
            }
           
        },
        
        onKeyup: function(event){
            var that = event.data;
            var key = event.key;
            if(!event.ctrlKey && that.settings.maxlength && that.element.val().length > that.settings.maxlength){
                that.element.val(that.element.val().slice(0, that.settings.maxlength));
            } else if(key === 'Enter') {
                event.preventDefault();
                var focusables = $("select, input, textarea, button:not(.button-increase, .button-decrease), a, [role='slider']");
                var current = focusables.index($(this));
                var next = focusables.eq(current+1).length ? focusables.eq(current+1) : focusables.eq(0);
                if(next.length > 0) {
                    next.focus();
                } 

            } else if(key == 'End') {
                event.preventDefault();
                that.handleValue(that.settings.max);
            } else if(key === 'Home') {
                event.preventDefault();
                that.handleValue(that.settings.min);
            } else if(key === 'PageDown') {
                event.preventDefault();
                that.handleValue(that.value - that.settings.multiStep);
            } else if(key === 'PageUp'){
                event.preventDefault();
                that.handleValue(that.value + that.settings.multiStep);
            } else if(key === 'ArrowDown'){
                event.preventDefault();
                that.handleValue(that.value - that.settings.step);
            } else if(key === 'ArrowUp'){
                event.preventDefault();
                that.handleValue(that.value + that.settings.step);
            } 
        },

        onFocus: function(event) { 
            var that = event.data;

            if(parseInt(that.value) === 0) {
                that.element.val('');
            } else if (parseInt(that.value) !== 0 && that.settings.precision > 0 && that.settings.lang === 'fr') {
                 that.element.val(('' + that.value).replace(/\./,','));
            }

            //that.element.select();
            that.display && that.display.html('&nbsp;');
            that.node.addClass('focus');

        },
        
        onRelease: function(event) { 
            var that = event.data;

            var currentValue = $(this).val();

            //convert empty to null
            currentValue = currentValue === '' ? null : currentValue;
            
            if(currentValue !== that.value){
                that.handleValue(currentValue);
            } else {
                that.updateDisplay(that.value);
            }
            
            that.element.parent().removeClass('focus');
        },
        
        onClick: function(event){
            var that = event.data;
            that.element.focus();
        },

        onDecrease: function(event) {
            var that = event.data;
            that.handleValue(that.value - that.settings.step);
        },

        onIncrease: function(event) {
            var that = event.data;
            that.handleValue(that.value + that.settings.step);
        },

        updateSubscribers: function(event, val) {
            var that = event.data;
            $.each(that.settings.subscribers, function(idx, el){
                var formattedValue = '&nbsp;';
                formattedValue = that.formatNumber(val);          
                if (that.settings.addSymbol !== undefined) {
                    
                    if(that.settings.lang === 'fr' || that.settings.addSymbol === '%') {
                        formattedValue = formattedValue+(that.settings.lang === 'fr' ? '&nbsp;' : '')+that.settings.addSymbol;
                    } else {
                        formattedValue = that.settings.addSymbol+formattedValue;
                    }
                } 
                el.html(formattedValue);
            });  
        },

        validate: function(value){

            if(value < this.settings.min) { 
                if(this.settings.wrap) {
                    value = this.settings.max;
                } else {
                    value = this.settings.min;
                }
            } else if (this.settings.max &&  value > this.settings.max) {
                if(this.settings.wrap) {
                    value = this.settings.min; 
                } else {
                    value = this.settings.max; 
                }
            } else if (isNaN(value)){
                value = this.value;// set to previous value
            } 

            return parseFloat(parseFloat(value).toFixed(this.settings.precision));
        },
        
        handleValue: function(value){
            var error = (typeof this.element.attr('required') !== 'undefined' && value === null); 
            if(value !== null) {
                value = (this.settings.lang == 'en') ? ('' + value) : ('' + value).replace(/,/,'.');   
            } else {
                value = '0';
            }
            var currentValue = parseFloat(parseFloat('' + value).toFixed(this.settings.precision));
            var validValue = this.validate(currentValue);
            //handle input error and corrections
            if(validValue !== currentValue){
                if(this.settings.autoCorrect) {
                    error = false;
                    currentValue = validValue;
                } else {
                    error = true;
                }
            } 

            if(this.error.length > 0){
                if(error) {
                    this.element.attr('aria-invalid', 'true').addClass('error-field')
                    this.error.addClass('visible');
                    if(window.digitalData && window.digitalData.utils) {
                        window.digitalData.utils.inPageError([{code: this.id, field: this.element.attr('data-input-name') ? this.element.attr('data-input-name') : this.element.attr('name'), type: 'error'}]);
                    }
                } else {
                    this.element.attr('aria-invalid', 'false').removeClass('error-field');
                    this.error.removeClass('visible');
                }
            }
            
            this.setValue(currentValue, !error);
            
        },

        setValue: function(value, trigger){ 
            var previousValue = this.value;
            this.value = value;
            this.element.val(value);
            this.element.attr('aria-valuenow', value);
            this.updateDisplay(value);
            if(trigger && previousValue !== this.value) { //trigger callback only if value changed
                this.onUpdate(this.id);
            }
            if (trigger || (!trigger && !this.element.hasClass('error-field') && this.settings.subscribers.length > 0)) { //do not update the value, let user fix it                
                this.element.trigger('update', [value]); 
            }
        },
        updateDisplay: function(value) {
            var formattedValue = '&nbsp;';

            if(value != 0 || !this.settings.keepEmpty) {
                formattedValue = this.formatNumber(value);          
            }

            this.display.html(formattedValue);
            this.element.attr('aria-valuetext', formattedValue);

            if (this.settings.addSymbol !== undefined) {
                
                if(this.settings.lang === 'fr' || this.settings.addSymbol === '%') {
                    formattedValue = formattedValue+this.settings.addSymbol;
                } else {
                    formattedValue = this.settings.addSymbol+formattedValue;
                }
            } 

            this.liveValue.text(formattedValue + this.settings.liveContent);

        },
        formatNumber: function(val) {
            val = isNaN(val = parseFloat('' + val)) ? 0 : val; //check it it's number
            val = val.toFixed(this.settings.precision !== undefined ? this.settings.precision : 2).split('.');//get number precision
            val[0] = val[0].replace(/(\d)(?=(\d{3})+\b)/g, '$1' + this.settings.thousandSeparator); //add thousands separator
            return (this.settings.prefix || '') + val.join(this.settings.decimalSeparator) + (this.settings.suffix || ''); // add currency and decimal separator
        }
    
    
    };
    

    /**
     * 
     * @param {JQuery} element - element where rating should be placed
     * @param {Array} values - array of objects, must containg value and description properties
     * @param {Function} callback - callback function which is called when user do a selection
     */
    var Rating = function(element, values, callback){
        this.element = element;
        this.values = values;
        this.list;
        this.inputs;
        this.label;
        this.onUpdate = callback || function () {};
        this.init();
        this.registerEvents();
    };

    Rating.prototype = {
        init: function(){
            $.each(this.values, (function(i, val){
                var item = $("<div>").addClass("rating-control");
                var input = $("<input/>")
                            .attr("name", "rating")
                            .attr("id", this.element.attr("id")+"-"+i)
                            .attr("type", "radio")
                            .val(val.value)
                            .addClass("star-rating"); 
                var label = $("<label>")
                            .attr("for", this.element.attr("id")+"-"+i) 
                            .addClass("star-label"); 
                var icon = $("<span>").addClass("icon icon-star");      
                var description = $("<span>").addClass("show-for-sr")
                                                .text(val.description);
                label.append(icon).append(description); 
                item.append(input).append(label);
                this.element.append(item);                                      
            }).bind(this));
            this.element.append('<p id="ratingLabel"></p>');
            this.list = this.element.find('.rating-control');
            this.inputs = this.element.find('input[type="radio"]');
            this.label = this.element.find('#ratingLabel');
        },
        registerEvents: function() {
            this.inputs.on('keydown', this, this.listNavigation);
            this.list.on('click', this, this.listClick);
            this.list.on('mouseenter', this, this.listEnter);
            this.list.on('mouseleave', this, this.listLeave);
        }, 

        listNavigation: function(event) {
            var that = event.data;
            var key = event.key;
            var focused = $(":focus"); 
            var index = that.inputs.index(focused);
            var length = that.inputs.length;
            var current = 0;

            if(event.key){
                if (key == 'ArrowLeft' || key == 'ArrowUp' || key == 'ArrowRight' || key == 'ArrowDown') {
                    event.preventDefault();
                    if(key == 'ArrowUp' || key == 'ArrowRight') {//up or right
                        current = (index == (length - 1)) ? 0 : (index + 1);

                    } else {//down or left
                        current = (index == 0) ? (length - 1) : (index - 1);
                    }
                    that.inputs.eq(current)[0].focus(); 
                    that.doSelection(current);
                }

                if (key == 'Enter' || key == ' ') {//enter or space
                    $(this).click();
                }

                if(key == 'Tab') { //
                    that.doSelection(-1);
                }
            }
        },
        listClick: function(event){
            var that = event.data; 
            if(!$(this).hasClass('read-only')) {
                var input = $(this).find('input[type="radio"]');
                var current = that.list.index($(this));
                that.doSelection(current);
                that.list.addClass("read-only");
                that.inputs.attr("disabled", true);
                that.onUpdate({rating : input.val(),
                    questionId: input.attr('id')});
            }
           
        },
        listEnter: function(event) {
            var that = event.data; 
            var target = $(event.target);
            if(!target.hasClass("rating-control")) {
                target = target.closest(".rating-control");
            }

            var current = that.list.index(target);
            that.doSelection(current);
        },
        listLeave: function(event) {
            var that = event.data; 
            that.doSelection(-1);
        },
        doSelection: function(index){
            if(!this.list.eq(0).hasClass("read-only")) {
                this.list.removeClass("selected");
                this.label.text("");
                for(var i = 0; i <= index; i++) {
                    this.list.eq(i).addClass("selected");
                }
                if(index != -1) {
                   var description = this.list.eq(index).find('.show-for-sr');
                    this.label.text(description.text());
                }
          
            }
            
        }
        
    };

    
    /**
     * 
     * @param {JQuery} tabs 
     */
    var TabsView = function(tabs){
        this.tabs = tabs;
        this.tablist = this.tabs.find('[role="tablist"]');
        this.tablinks = this.tablist.find('[role="tab"]');
        this.tabpanels = this.tabs.find('[role="tabpanel"]');
        this.isVertical = this.tablist.attr("aria-orientation") == "vertical";
        this.init();
        this.registerEvents();
    };

    TabsView.prototype = {
        init: function(){
            if(!this.isVertical) {
                this.tablist.addClass('tablist');
                this.tablinks.addClass('tablink');
                this.tabpanels.addClass('panel').attr('aria-hidden', 'true');
            } else {
                this.tablist.addClass('v-tablist');
                this.tablinks.addClass('v-tablink');
                this.tabpanels.addClass('v-panel').attr('aria-hidden', 'true');;
            }

            this.tablinks.attr('tabindex', '-1');
            this.tabpanels.attr('tabindex', '-1');

            this.tablinks.each(function(){
                if($(this).attr('aria-selected') === 'true'){
                    $(this).removeAttr('tabindex');
                    $(this).addClass('active');
                    $('#'+$(this).attr('aria-controls')).attr('aria-hidden', 'false').attr('tabindex', '0');
                }
            });
        },
        registerEvents: function() {
            this.tablinks.on('keydown', this, this.tabsNavigation);
            this.tablinks.on('click', this, this.tabsClick);
        }, 
        tabsNavigation: function(event) {
            var that = event.data;
            var key = event.key;
            if(event.key) {
                if(key == 'ArrowLeft' || key == 'ArrowUp' || key == 'ArrowRight' || key == 'ArrowDown') {
                    var index = that.tablinks.index($(this));
                    var direction = (key == 'ArrowRight' || key == 'ArrowDown') ? 1 : -1;
                    var length = that.tablinks.length;
                    var newIndex = (index + length + direction) % length;
                    if((that.isVertical && (key == 'ArrowUp' || key == 'ArrowDown')) || 
                    (!that.isVertical && (key == 'ArrowLeft' || key == 'ArrowRight'))) {
                        event.preventDefault();
                        that.tablinks.eq(newIndex).focus();
                        that.activateTab(that.tablinks.eq(newIndex));
                    } 
                    
                } else if (key == 'End') {
                    event.preventDefault();
                    that.tablinks.eq(that.tablinks.length - 1).focus();
                    that.activateTab(that.tablinks.eq(that.tablinks.length - 1));
                                   
                } else if (key == 'Home') {
                    event.preventDefault();
                    that.tablinks.eq(0).focus();
                    that.activateTab(that.tablinks.eq(0));
                    
                }
            } 
        }, 
        tabsClick: function(event){
            var that = event.data;
            that.activateTab($(this));

        },
        activateTab: function(tab){
            //deactivate all
            this.tablinks.attr('tabindex', '-1').attr('aria-selected', 'false').removeClass('active');
            this.tabpanels.attr('aria-hidden', 'true').attr('tabindex', '-1');
            //activate tab
            tab.removeAttr('tabindex').attr('aria-selected', 'true').addClass('active');
            $('#'+$(tab).attr('aria-controls')).attr('aria-hidden', 'false').attr('tabindex', '0');
        }
        
    };

     /**
     * @param {JQuery} tab element
     * @param {Object} settings - optional
     *      settings:
            *  expandOnlyOne - default true, collups all others section when one is expended
            *  scroll - default true, scroll to the begining of the expanded section 
            *  firstOpen - default true, expand the first section on load
     */
    var TabsToAccordion = function(tabs, settings){
        this.tabs = tabs;
        
        this.panels = this.tabs.find('[role="tabpanel"]');

        this.tablist = this.tabs.find('[role="tablist"]');
        this.tabButtons = this.tablist.find('[role="tab"]');

        this.accordion;
        this.accordionButtons;

        this.isVertical = this.tablist.attr("aria-orientation") == "vertical";

        this.settings = settings || {};
        this.settings.expandOnlyOne = (this.settings.expandOnlyOne !== undefined ? this.settings.expandOnlyOne : true);
        this.settings.scroll = (this.settings.scroll !== undefined ? this.settings.scroll : true);
        this.settings.firstOpen = (this.settings.firstOpen !== undefined ? this.settings.firstOpen : true);

        this.init();
        this.registerEvents();
        this.switchToAccordion = function(isMobile){
            if (isMobile) {
                //deactivate all
                this.panels.attr('aria-hidden', 'true').removeAttr('tabindex');
                this.accordionButtons.attr('aria-expanded', 'false');
                //reset tabs view
                this.panels.each(function(){
                    $(this).attr('aria-labelledby', $(this).attr('id')+'Label');
                    $(this).attr('role', 'region');
                });
                //open first
                if(this.settings.firstOpen){
                    var button = this.accordionButtons.eq(0);
                    button.attr('aria-expanded', 'true');
                    var content = button.attr('aria-controls');
                    $('#'+content).attr('aria-hidden', 'false');
                    if(this.settings.scroll) {
                        $('html,body').animate({scrollTop:  $('#'+content).offset().top-100},'slow');
                    }
                    //adjust active tab for print
                    this.tabButtons.removeClass('active');
                    this.tabButtons.eq(0).addClass('active');
                }

            } else {
                //deactivate all
                this.tabButtons.attr('tabindex', '-1').attr('aria-selected', 'false').removeClass('active');
                this.panels.attr('aria-hidden', 'true').attr('tabindex', '0');
                //reset accordion
                this.panels.each(function(){
                    $(this).attr('aria-labelledby', $(this).attr('id')+'Button');
                    $(this).attr('role', 'tabpanel');
                });
                //open first
                //this.tabButtons.eq(0).removeAttr('tabindex').attr('aria-selected', 'true').addClass('active');
                //this.panels.eq(0).attr('aria-hidden', 'false');
                this.activateTab(this.tabButtons.eq(0));
            }
        }
    };

    TabsToAccordion.prototype = {
        init: function(){

            this.panels.addClass('panel inner-accordion-content');
            this.panels.wrapAll('<div class="inner-accordion"></div>');
            this.accordion = this.tabs.find('.inner-accordion');

            this.panels.each(function(){
                $(this).wrap('<div class="inner-accordion-tab"></div>');
                var innerButton = $('<button>');
                innerButton.attr('aria-expanded', 'false');
                innerButton.attr('id', $(this).attr('id')+'Label');
                innerButton.attr('aria-controls', $(this).attr('id'));
                innerButton.attr('type', 'button');
                innerButton.addClass('inner-accordion-trigger');
                innerButton.append($('<span>', {
                    text: $('#'+$(this).attr('id')+'Button').text()
                }).addClass('inner-accordion-title').append('<span class="inner-accordion-icon"></span>'));

                $(this).before(innerButton);
            });

            this.accordionButtons = this.accordion.find('button');

        },

        registerEvents: function() {
            //tab links
            this.tabButtons.on('keydown', this, this.tabsNavigation);
            this.tabButtons.on('click', this, this.tabsClick);
            //accordion links
            this.accordionButtons.on('click', this, this.accordionClick);
            this.accordionButtons.on('keydown', this, this.accordionNavigation);
            this.accordionButtons.on('focus', this, this.accordionFocus);
            this.accordionButtons.on('blur', this, this.accordionBlur);
        }, 
        tabsNavigation: function(event) {
            var that = event.data;
            var key = event.key;

            if(event.key) {
                if(key == 'ArrowLeft' || key == 'ArrowUp' || key == 'ArrowRight' || key == 'ArrowDown') {
                    var index = that.tabButtons.index($(this));
                    var direction = (key == 'ArrowRight' || key == 'ArrowDown') ? 1 : -1;
                    var length = that.tabButtons.length;
                    var newIndex = (index + length + direction) % length;
                    if((that.isVertical && (key == 'ArrowUp' || key == 'ArrowDown')) || 
                    (!that.isVertical && (key == 'ArrowLeft' || key == 'ArrowRight'))) {
                        event.preventDefault();
                        that.tabButtons.eq(newIndex).focus();
                        that.activateTab(that.tabButtons.eq(newIndex));
                    } 
                    
                } else if (key == 'End') {
                    event.preventDefault();
                    that.tabButtons.eq(that.tabButtons.length - 1).focus();
                    that.activateTab(that.tabButtons.eq(that.tabButtons.length - 1));
                                   
                } else if (key == 'Home') {
                    event.preventDefault();
                    that.tabButtons.eq(0).focus();
                    that.activateTab(that.tabButtons.eq(0));                
                }      
            } 
            
        }, 
        tabsClick: function(event){
            var that = event.data;
            that.activateTab($(this));
        },
        activateTab: function(tab){
            //deactivate all
            this.tabButtons.attr('tabindex', '-1').attr('aria-selected', 'false').removeClass('active');
            this.panels.attr('aria-hidden', 'true');
            //activate tab
            tab.removeAttr('tabindex').attr('aria-selected', 'true').addClass('active');
            $('#'+$(tab).attr('aria-controls')).attr('aria-hidden', 'false');
        },
        accordionNavigation: function(event) {
            var that = event.data;
            var key = event.key;
            var ctrlModifier;
            var isExpanded = $(this).attr('aria-expanded') == 'true';
            if(event.key){
                ctrlModifier = event.ctrlKey && (key == 'PageUp' || key == 'PageDown');
            } else {
                ctrlModifier = event.ctrlKey && (key == 33 || key == 34); //PgUp PgDw
            }
            if(event.key){
                if(key == 'ArrowUp' || key == 'ArrowDown' || ctrlModifier) {
                    var index = that.accordionButtons.index($(this));
                    var direction = (key == 'PageDown' || key == 'ArrowDown') ? 1 : -1;
                    var length = that.accordionButtons.length;
                    var newIndex = (index + length + direction) % length;
                    that.accordionButtons.eq(newIndex).focus();
                    event.preventDefault();

                } else if (key == 'End') { 
                    that.accordionButtons.eq(that.accordionButtons.length - 1).focus();
                    event.preventDefault();
                } else if (key == 'Home') { 
                    that.accordionButtons.eq(0).focus();
                    event.preventDefault();
                }
            } 
        },
        accordionClick: function(event){
            var that = event.data;
            var isExpanded = $(this).attr('aria-expanded') == 'true';
            var active = that.accordion.find('[aria-expanded="true"]');
          
            if(active && active !== $(this) && that.settings.expandOnlyOne) {
                active.attr('aria-expanded', 'false');
                $('#'+active.attr('aria-controls')).attr('aria-hidden', 'true');
            }

            if(!isExpanded) {
                
                $(this).attr('aria-expanded', 'true');
                var content = $(this).attr('aria-controls');
                $('#'+content).attr('aria-hidden', 'false');
                if(that.settings.scroll) {
                    $('html,body').animate({scrollTop:  $('#'+content).offset().top-100},'slow');
                }
                //ajust tabs for print 
                var buttonIndex = that.accordionButtons.index($(this))
                that.tabButtons.removeClass('active');
                that.tabButtons.eq(buttonIndex).addClass('active');
            } else {
                $(this).attr('aria-expanded', 'false');
                $('#'+$(this).attr('aria-controls')).attr('aria-hidden', 'true');
                //ajust tabs for print 
                var buttonIndex = that.accordionButtons.index($(this))
                that.tabButtons.eq(buttonIndex).removeClass('active');
            }

            event.preventDefault();
        },
        accordionFocus: function(){
            $(this).addClass('focus');
        },
        accordionBlur: function() {
            $(this).removeClass('focus');
        }
        
    };


     /**
     * @param {JQuery} stepView parent element
     * @param {JQuery} startBtn - start button if there is an itroduction step (optional)
     * @param {JQuery} progress - element for display user progress (optional)
     * @param {JQuery} referenceLinks - links which return user to the specific step (optional)
     * @param {JQuery} skipSteps - button to skip the steps and go to the results
     * @param {Function} callbackStart - function which is called when start button clicked on the Into step (if there Intro)
     * @param {Function} callbackIntro - function which is called when user returns to the Into step (if there Intro)
     * @param {Function} callbackStep(step, n) - function which is called then user navigates by steps
     * step {JQuery} - step link
     * n {Number} - step number
     * @param {Function} callbackView(view, n, total) - function which is called when opened a specific view
     * view {JQuery} - view 
     * n {Number} - view number
     * total {number} - total number of views
     * @param labels {Object}:
            * en: { }, fr: {}
            * values :
                * completed - hidden text for stepper when step is completed
                * progress - hidden text for stepper when step is in progress
                * next - next button if need to update the verbiage on the last step
                * finish - verbiage for next button on the last step
                * progressComplete - hidden text for progress bar, how much completed
     * @param settings {Object}:
            * hideBtnLastStep - bollean - default true, to hide buttons control on last step 
            * finishBtn - boolean - default true, to rename the next button to finish on the step before last one         
            * validateOnNav - boolean - default false, if it's set, validation will be run through the input fields which have min/max and data-validate="true"
     */
    var StepView = function(stepView, startBtn, progress, referenceLinks, skipSteps, labels, settings, callbackStart, callbackIntro, callbackStep, callbackView){
        this.stepView = stepView;
        this.startElement = startBtn || null;
        this.stepProgress = progress || null;
        this.referenceLinks = referenceLinks || null;
        this.skipSteps = skipSteps || null;
        this.settings = settings || {};
        this.labels = labels || {en: {}, fr: {}};
        this.onStart = callbackStart || function () {};
        this.onIntro = callbackIntro || function () {};
        this.onStep = callbackStep || function () {};
        this.onView = callbackView || function () {};
        
        this.stepViewElement = this.stepView.find('.step-view');

        this.stepNavElement = this.stepView.find('.step-list');
        this.stepsElement = this.stepNavElement.find('.step');
        this.stepNavBtn = this.stepView.find('.nav-controls');
        this.nextElement = this.stepNavBtn.find('.next-button');
        this.backElement = this.stepNavBtn.find('.back-button');

        this.stepControlElement;
        
        this.stepAccordionElement;
        this.stepAccordionBtn;
        this.stepBtnElement;
        this.titleBtnElement;

        this.currentView = 0; 
        this.activeStep = 0;
        this.activeLabel = '';
        this.steps = [];

        this.settings.lang = (this.settings.lang !== undefined ? this.settings.lang : $('html').attr('lang'));
        this.settings.hideBtnLastStep = (this.settings.hideBtnLastStep !== undefined ? this.settings.hideBtnLastStep : true);
        this.settings.finishBtn = (this.settings.finishBtn !== undefined ? this.settings.finishBtn : true);
        this.settings.validateOnNav = (this.settings.validateOnNav !== undefined ? this.settings.validateOnNav : false);
        
        this.labels.en.stepHiddenText = 'Step ';
        this.labels.fr.stepHiddenText = 'Étape ';
        this.labels.en.stepButtonHiddenText = ' Select this button to navigate through the calculator\'s steps.';
        this.labels.fr.stepButtonHiddenText = ' Sélectionnez ce bouton pour naviguer entre les différentes parties du calculateur.'
        
        this.labels = this.labels[this.settings.lang];

        this.timer;

        this.init();
        this.registerEvents();

        this.switchView = function(isMobile){
            if(isMobile){
                this.stepNavElement.attr('aria-hidden', 'true');
                $(document).on('mouseup', 'body', this, this.checkHide);
                this.stepsElement.on('keydown', this, this.stepsElementKeydown);
                this.stepsElement.on('focus', this, this.stepsElementFocus);
                this.stepsElement.on('blur', this, this.stepsElementBlur);
            } else { 
                this.stepNavElement.attr('aria-hidden', 'false');
                $(document).off('mouseup', 'body', this.checkHide);
                this.stepsElement.off('keydown');
                this.stepsElement.off('focus');
                this.stepsElement.off('blur');
            }
            this.stepAccordionBtn.attr('aria-expanded', 'false');
        };

        this.updateSteps = function(){
            this.steps = [];
            this.stepViewElement = this.stepView.find('.step-view');
            this.stepViewElement.each((function(idx, el){
                if($(el).hasClass('sub-step')){
                    this.steps.push(0);
                } else {
                    this.steps.push(1);
                } 
            }).bind(this)); 
        };

    };

    StepView.prototype = {
        init: function(){
            var accordion = $('<div>');
            accordion.addClass('step-accordion step-control');
            var accordionBtn = $('<button>');
            accordionBtn.attr('aria-controls', this.stepNavElement.attr('id'));
            accordionBtn.attr('aria-expanded', 'false');
            accordionBtn.attr('type', 'button');
            accordionBtn.append('<span class="show-for-sr">'+this.labels.stepHiddenText+'</span>');
            accordionBtn.append('<span class="accordion-step"></span>');
            accordionBtn.append('<span class="accordion-title"></span>');
            accordionBtn.append('<span class="accordion-arrow icon-arrow-down"></span>');
            accordionBtn.append('<span class="show-for-sr">'+this.labels.stepButtonHiddenText+'</span>');
            accordion.append(accordionBtn);
            this.stepNavElement.before(accordion);
            this.stepAccordionElement = this.stepView.find('.step-accordion');
            this.stepAccordionBtn = this.stepAccordionElement.find('button');
            this.stepBtnElement = this.stepAccordionBtn.find('.accordion-step');
            this.titleBtnElement = this.stepAccordionBtn.find('.accordion-title');

            this.stepControlElement = this.stepView.find('.step-control'); //all elements which control views

            this.stepViewElement.each((function(idx, el){
                if($(el).hasClass('sub-step')){
                    this.steps.push(0);
                } else {
                    this.steps.push(1);
                } 
            }).bind(this)); 

            if(this.startElement === null) {
                this.stepControlElement.show();
                this.stepAccordionElement.show();
                
                if(this.stepProgress !== null){
                   this.stepProgress.show();
                }
                this.setDesktopStep(this.activeStep);
                this.showStepView(this.currentView);
            }

        },

        registerEvents: function() {

            this.stepsElement.on('click', this, this.stepsElementClick);

            this.stepAccordionBtn.on('click', this, this.stepAccordionBtnClick);
            

            this.nextElement.on('click', this, this.nextElementClick);
            this.backElement.on('click', this, this.backElementClick);

            if(this.startElement !== null) {
                this.startElement.on('click', this, this.startElementClick);
            }

            if(this.referenceLinks !== null) {
                this.referenceLinks.on('click', this, this.referenceClick);
            }
            if(this.skipSteps !== null) {
                this.skipSteps.on('click', this, this.skipStepsClick);
            }
           
        },

        stepsElementKeydown: function(event){
            var that = event.data;
            var key = event.key;
            var isExpanded = that.stepAccordionBtn.attr('aria-expanded') == 'true';

            if(key === 'Esc' || key === 'Escape') {
                if(isExpanded) {
                    that.hideMobileNav();
                    event.stopPropagation();
                    event.preventDefault();
                }
            } 
        },

        stepsElementFocus: function(event){
            var that = event.data;
            var isExpanded = that.stepAccordionBtn.attr('aria-expanded') == 'true';
            if(!isExpanded) {
                that.timer = null;
                return;
            } else {
                if(that.timer){
                    clearTimeout(that.timer);
                    that.timer = null;
                }
            }
        },

        stepsElementBlur: function(event){
            var that = event.data;
            var isExpanded = that.stepAccordionBtn.attr('aria-expanded') == 'true';
            if(!isExpanded) {
                that.timer = null;
                return;
            } else {
                that.timer = setTimeout((function(){
                    that.hideMobileNav();
                }).bind(that), 10);
            }
        },

        stepsElementClick: function(event){
            var that = event.data;
            event.preventDefault();
            var disabled = $(this).attr('disabled');
            var isExpanded = that.stepAccordionBtn.attr('aria-expanded') == 'true';
            if(typeof disabled !== 'undefined'){ 
                /*if (isExpanded){ 
                    that.hideMobileNav();
                }*/
                return false; 
            }

            if(that.settings.validateOnNav) {
                that.validateInputs();
            }

            var errorsCheck = that.stepViewElement.eq(that.currentView).find('.error-field');
            if(errorsCheck.length > 0) {
                errorsCheck.eq(0).focus();
                return false;
            }

            var content = $($(this).html()).eq(0).text();
            that.activeStep = $(this).parent().index();
            var view = that.findView(that.activeStep);

            that.updateStepsView(that.activeStep, view);
            //adjust the accordion
            if (isExpanded){
                that.stepBtnElement.text(that.activeStep+1)
                that.titleBtnElement.text(content);
                that.hideMobileNav();
            }
            return false;
        },

        checkHide: function(event){
            var that = event.data;
            var isExpanded = that.stepAccordionBtn.attr('aria-expanded') == 'true';
            if(isExpanded && !that.stepAccordionBtn.is(event.target) && that.stepNavElement.has(event.target).length === 0) {
                that.stepAccordionBtn.attr('aria-expanded', 'false');
                that.stepNavElement.attr('aria-hidden', 'true');
            }
        },

        hideMobileNav: function(){
            this.stepAccordionBtn.attr('aria-expanded', 'false');
            this.stepNavElement.attr('aria-hidden', 'true');
            this.stepAccordionBtn.focus();
        },

        stepAccordionBtnClick: function(event){
            var that = event.data;
            event.preventDefault();
            var isExpanded = $(this).attr('aria-expanded') == 'true';
            if(!isExpanded) {               
                $(this).attr('aria-expanded', 'true');
                that.stepNavElement.attr('aria-hidden','false');
            } else {
                $(this).attr('aria-expanded', 'false');
                that.stepNavElement.attr('aria-hidden', 'true');
            }
        },

        startElementClick: function(event){
            var that = event.data;
            event.preventDefault();
            that.startElement.hide();
            that.stepControlElement.show();
            that.stepAccordionElement.show();
            
            if(that.stepProgress !== null){
                that.stepProgress.show();
            }

            that.onStart();
            that.setDesktopStep(that.activeStep);
            that.showStepView(that.currentView);

            return false;
        },

        nextElementClick: function(event){
            var that = event.data;
            event.preventDefault();
            that.nextPrev(1);
            return false;
        },

        backElementClick: function(event){
            var that = event.data;
            event.preventDefault();
            that.nextPrev(-1);
            return false;
        },

        referenceClick: function(event){
            var that = event.data;
            event.preventDefault();
            var view = $('#'+$(this).data('reference'));
            var current = that.stepViewElement.index(view);

            that.activeStep = that.matchStep(that.findStep(current));
            that.updateStepsView(that.activeStep, current);
        },

        skipStepsClick: function(event){
            var that = event.data;
            event.preventDefault();

            if(that.settings.validateOnNav) {
                that.validateInputs();
            }

            var errorsCheck = that.stepViewElement.eq(that.currentView).find('.error-field');
            if(errorsCheck.length > 0) {
                errorsCheck.eq(0).focus();
                return false;
            }
            
            that.updateStepsView(that.stepsElement.length - 1, that.stepViewElement.length-1);

            that.stepsElement.each(function(){
                $(this).removeAttr('disabled').removeAttr('tabindex');
            }); 

        },

        findStep: function(subStep){
            if(this.steps[subStep]) return subStep;
            for(var i = subStep; i >= 0; i--) {
                if(this.steps[i]) return i;
            }
            return 0;
        },

        matchStep: function(subStep){
            var index = -1;
            for(var i = subStep; i >= 0; i--) {
                if(this.steps[i]) index++;
            }
            return index;
        },

        findView: function(subStep){
            var count = 0;
            for(var i = 0; i < this.steps.length; i++){
                if(this.steps[i] && count === subStep) {
                    return i;
                }
                else if (this.steps[i]) { 
                    count++;
                }
            }
            return 0;
        },

        showStepView: function(n) {

            if(this.steps.length <= 2) {return;}
          
            this.stepViewElement.eq(n).show();

            this.stepViewElement.eq(n).foundation('equalizer', 'reflow');

            if(this.settings.finishBtn && this.labels.hasOwnProperty('finish')) {
                if(n === this.steps.length-2) { //before the last step
                    this.nextElement.html(this.labels.finish);
                } else {
                    this.nextElement.html(this.labels.next);
                }
            }

            if(this.settings.hideBtnLastStep){
                if(n === this.steps.length-1) { //last step
                    this.stepNavBtn.hide();           
                } else {
                    this.stepNavBtn.show();     
                }
            }

            this.onView(this.stepViewElement.eq(n), n, this.steps.length); //hide/show elements depends on the view number

            if(this.stepProgress !== null){
                var progressText = (this.settings.lang === 'en') ? ($.ccom.formatNumber((n/(this.steps.length-1))*100, 0, ',', '.', '', '%') + ' ' +this.labels.progressComplete) : (this.labels.progressComplete + ' ' + $.ccom.formatNumber((n/(this.steps.length-1))*100, 0, ',', '.', '', ' %'));
                this.stepProgress.html(progressText); 
            }

            if($(window).width() <= 959) {
                $(window).scrollTop(0);
            }

        },

        setDesktopStep: function(step) {

            var notCompleted = false;
            var content = $($(this.stepsElement.eq(step).html())).eq(0).text();

            this.stepsElement.each(function(){
                $(this).removeClass('active');
                $(this).find('.show-for-sr').empty();
            }); 

            this.stepsElement.each((function(index, el){
                if(index === step) {
                    notCompleted = true;
                }
                if(notCompleted) {
                    $(el).removeClass('completed');
                    $(el).parent().removeClass('done');
                    $(el).find('.show-for-sr').empty();
                } else {
                    $(el).addClass('completed');
                    $(el).parent().addClass('done');
                    $(el).find('.show-for-sr').text(' '+this.labels.completed);

                }
            }).bind(this)); 

            var active = this.stepsElement.eq(step);
            active.addClass('active');
            active.find('.show-for-sr').text(' '+this.labels.progress);

            this.stepBtnElement.text(step+1)
            this.titleBtnElement.text(content);

            this.onStep($(this.stepsElement.eq(step), step));// when click on step, set some extra info
        },
    
        nextPrev: function(n) {

            if(this.settings.validateOnNav){
                this.validateInputs();
            }
            
            var errorsCheck = this.stepViewElement.eq(this.currentView).find('.error-field');
            if(errorsCheck.length > 0 && n === 1) {//only check forward
                errorsCheck.eq(0).focus();
                return false;
            }

            if((this.currentView + n) > this.steps.length || (this.currentView + n) < 0) { //intro step    
                this.stepControlElement.hide();
                this.stepAccordionElement.hide();
                if(this.stepProgress !== null){
                    this.stepProgress.hide();
                }
                this.stepViewElement.eq(this.currentView).hide();   
                this.startElement.show();
                this.onIntro();  //hide / show when go back to Intro or there something wrong         
                return false;
            }

        
            this.stepViewElement.eq(this.currentView).hide();      
            this.currentView = this.currentView + n;
            this.activeStep = this.matchStep(this.findStep(this.currentView));
            if(n === 1) {//only if going forward, enable steps
                this.stepsElement.eq(this.activeStep).removeAttr('disabled').removeAttr('tabindex');
            }
          
            this.setDesktopStep(this.activeStep);

            this.showStepView(this.currentView);
        },

        validateInputs: function(){

            var fieldsToValidate = this.stepViewElement.eq(this.currentView).find('[data-validate="true"]');
            fieldsToValidate.each((function(idx, el){
                var field = $(el);
                var error = this.validate(field);
                var errorElement = $('#'+field.attr('aria-describedby'));
                if(errorElement.length > 0){
                    if(error) {
                        field.attr('aria-invalid', 'true').addClass('error-field')
                        errorElement.addClass('visible');
                        if(window.digitalData && window.digitalData.utils) {
                            window.digitalData.utils.inPageError([{code: field.attr('id'), field: field.attr('data-input-name') ? field.attr('data-input-name') : field.attr('name'), type: 'error'}]);
                        }
                    } else {
                        field.attr('aria-invalid', 'false').removeClass('error-field');
                        errorElement.removeClass('visible');
                    }
                }
            }).bind(this));

        },

        validate: function(field){

            var value = field.val();
            if(field.attr('required') !== 'undefined' && (value === 0 || isNaN(value))) {
                return true;
            }

            var min = parseFloat(field.attr('min')) || 0;
            var max = parseFloat(field.attr('max')); 

            if(value < min || (max &&  value > max) || isNaN(value)) { 
                return true;
            } 

            return false;
        },

        updateStepsView: function(step, view){
            this.setDesktopStep(step);
            this.stepViewElement.eq(this.currentView).hide(); 
            this.currentView = view;
            this.showStepView(this.currentView);      
        }
       
    };

    /**
     * 
     * @param {JQuery} filterView - parent element with filter-view class
     * @param {String} selectedOption - the id of the selected option, can be omitted if all should be shown by default
     * @param {Object} settings - optional
              * addCounter {Boolean} - add counter to the filter links, default false
              * addOverlay {Boolean} - add overlay when open filters on mobile, default false
              * lang {String} - language 
     * @param {Object} srText - optional
            * en: { }, fr: {}
            * values :
                * single - hidden text for filter when only one item available
                * multi - hidden text for filter when several items available
     */
    var FilterView = function(filterView, selectedOption, settings, srText){
        this.filterView = filterView;
        this.filterNav = this.filterView.find('.filter-nav');
        this.filterAccordionElement = this.filterView.find('.filter-accordion');
        this.filterAccordionBtn = this.filterAccordionElement.find('button');
        this.titleBtnElement = this.filterAccordionBtn.find('.accordion-title');
        this.filterResult = this.filterView.find('.filter-result');
        this.filterCount = this.filterView.find('.filter-count');
        this.selectedOption = selectedOption || '';
        this.settings = settings || {};
        this.srText = srText || {en: {}, fr:{}};
        this.hasLiveRegion = false;
        this.filterCountSuccess = null;
        this.filterCountException = null;
        
        this.filterOption = this.filterNav.find('.fiter-option');
        this.filterAccordionElement;
        this.filterAccordionBtn;
        this.titleBtnElement;
        this.options = [];
        this.filteredOptions = [];
        this.optionCounter = {};

        this.settings.addCounter = (this.settings.addCounter !== undefined ? this.settings.addCounter : false);
        this.settings.addOverlay = (this.settings.addOverlay !== undefined ? this.settings.addOverlay : false);
        this.settings.lang = (this.settings.lang !== undefined ? this.settings.lang : $('html').attr('lang'));
        this.srText = this.srText[this.settings.lang];
        
        this.switchView = function(isMobile){
            if(isMobile){
                this.filterNav.attr('aria-hidden', 'true');
            } else { 
                this.filterNav.attr('aria-hidden', 'false');
                if(this.settings.addOverlay) {
                    $('.drawer-bg').hide();
                    $('body').css('overflow', 'auto');
                }
            }
            this.filterAccordionBtn.attr('aria-expanded', 'false');
        };

        this.stickToTop = function(toStick){
            if(toStick) {
                this.filterAccordionElement.addClass('sticky');
                this.filterNav.addClass('sticky');
                this.filterResult.addClass('extra-padding');
            } else {
                this.filterAccordionElement.removeClass('sticky');
                this.filterNav.removeClass('sticky');
                this.filterResult.removeClass('extra-padding');
            }

        };

        this.init();
        this.registerEvents();
    };

    FilterView.prototype = {
        init: function(){
            this.filterAccordionBtn.attr('aria-expanded', 'false');

            if(this.filterCount.length > 0) {
                this.hasLiveRegion = true;
                this.filterCountSuccess = this.filterCount.find('.success').html();
                this.filterCountException = this.filterCount.find('.exception').html();
                //this.filterCount = this.filterCount.clone().empty().wrap('<div/>').parent().html();
                this.filterCount.empty();
            }
            var filterText = '';

            this.filterResult.find('.filter-result-item').each((function(i, el){
                //save options
                this.options.push($(el).attr('role', 'listitem'));
            }).bind(this));

            this.filterResult.attr('role', 'list');

            if(this.settings.addCounter) {
                this.filterOption.each((function(i, el){
                    var id = $(el).attr('id');
                    if(typeof id === 'undefined' || id === '') {
                        var counter = $('<span/>').attr('aria-hidden', 'true').html('&nbsp;('+this.options.length+')');
                        var isMulti = this.options.length > 1;
                        var text = '';
                        if(isMulti) {
                            if(this.srText.hasOwnProperty('multi')) {
                                text = this.srText['multi'];
                            }
                        } else {
                            if(this.srText.hasOwnProperty('single')) {
                                text = this.srText['single'];
                            }
                        }

                        var hiddenText = $('<span/>').addClass('show-for-sr').text(text.replace(/\{n\}/g, this.options.length));
                        $(el).append(counter);
                        $(el).append(hiddenText);

                    } else {
                        this.optionCounter[id] = 0;
                    
                        $.each(this.options, (function(idx, element){
                            if($(element).hasClass(id)) {
                                this.optionCounter[id]++;
                            }
                        }).bind(this));
                        var counter = $('<span/>').attr('aria-hidden', 'true').html('&nbsp;('+this.optionCounter[id]+')');
                        var isMulti = this.options.length > 1;
                        var text = '';
                        if(isMulti) {
                            if(this.srText.hasOwnProperty('multi')) {
                                text = this.srText['multi'];
                            }
                        } else {
                            if(this.srText.hasOwnProperty('single')) {
                                text = this.srText['single'];
                            }
                        }

                        var hiddenText = $('<span/>').addClass('show-for-sr').text(text.replace(/\{n\}/g, this.optionCounter[id]));
                        $(el).append(counter);
                        $(el).append(hiddenText);
                    }
                }).bind(this));

            }

            var selectedContent = '';

            if(this.selectedOption) {
                filterText = $($('#'+this.selectedOption).html()).eq(0).text();    
                $('#'+this.selectedOption).addClass('active').attr('aria-pressed', 'true');
                selectedContent = $($('#'+this.selectedOption).html()).eq(0).text();
            } else {
                filterText = $(this.filterOption.eq(0).html()).eq(0).text();
                this.filterOption.eq(0).addClass('active').attr('aria-pressed', 'true');
                selectedContent = $(this.filterOption.eq(0).html()).eq(0).text();
            }

            if(this.settings.addOverlay) {
                if($('.drawer-bg').length === 0) {
                    this.filterView.before('<div class="drawer-bg"></div>');
                }
            }

            //filter
            this.filterELements(this.selectedOption, filterText);
            
        },
        registerEvents: function() {
            this.filterOption.on('click', this, this.filterOptionClick);
            this.filterAccordionBtn.on('click', this, this.filterAccordionBtnClick);
        },

        filterOptionClick: function(event){
            var that = event.data;
            event.preventDefault();

            that.filterOption.removeClass('active').attr('aria-pressed', 'false');
            $(this).addClass('active').attr('aria-pressed', 'true');

            var isExpanded = that.filterAccordionBtn.attr('aria-expanded') == 'true';
            
            var content = $($(this).html()).eq(0).text();
            var value = $(this).attr('id');

            that.filterELements(value, content);

            //adjust the accordion
            if (isExpanded){
                that.filterAccordionBtn.attr('aria-expanded', 'false');
                that.filterNav.attr('aria-hidden', 'true');
                that.filterAccordionBtn.focus();
                if(that.settings.addOverlay) {
                    $('.drawer-bg').hide();
                    $('body').css('overflow', 'auto');
                }

            }
            return false;
        },

        filterAccordionBtnClick: function(event){
            var that = event.data;
            event.preventDefault();
            var isExpanded = $(this).attr('aria-expanded') == 'true';
            if(!isExpanded) {               
                $(this).attr('aria-expanded', 'true');
                that.filterNav.attr('aria-hidden','false');
                if(that.settings.addOverlay) {
                    $('.drawer-bg').show();
                    $('body').css('overflow', 'hidden');
                }
            } else {
                $(this).attr('aria-expanded', 'false');
                that.filterNav.attr('aria-hidden', 'true');
                if(that.settings.addOverlay) {
                    $('.drawer-bg').hide();
                    $('body').css('overflow', 'auto');
                }
            }
        },

        filterELements: function(value, content){
            this.filteredOptions = [];
            this.filterResult.empty();

            $.each(this.options, (function(i, el){
                var item = $(el);
                if(typeof value === 'undefined' || value === '' || 
                   item.hasClass(value)) {
                    this.filteredOptions.push(item);
                    this.filterResult.append(item);
                }
            }).bind(this));
            if(this.hasLiveRegion) {
                this.setLiveRegion(this.filteredOptions.length, content);
            }
        }, 

        setLiveRegion: function(total, content){
            var text = '';
            if(total > 0) {
                text = this.filterCountSuccess.toString().replace(/\{total\}/g, total).replace(/\{filter\}/g, content);
            } else {
                text = this.filterCountException.toString().replace(/\{filter\}/g, content);
            }
            //this.filterResult.prepend($(this.filterCount));
            //this.filterResult.find('.filter-count').show().html(text);    
            $(this.filterCount).text(text);        
        }
        
    };
  
    
})(jQuery);

