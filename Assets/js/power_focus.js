Mautic.mPowerFocusOnLoad = function() {
    if (typeof Mautic.loadedPreviewImage !== 'undefined') {
        delete Mautic.loadedPreviewImage;
    }

    if (mQuery('.builder').length) {
        // Activate droppers
        mQuery('.btn-dropper').each(function() {
            mQuery(this).click(function() {
                if (mQuery(this).hasClass('active')) {
                    // Deactivate
                    mQuery(this).removeClass('active btn-primary').addClass('btn-default');

                    mQuery('#websiteCanvas').css('cursor', 'inherit');
                } else {
                    // Remove active state from all the droppers
                    mQuery('.btn-dropper').removeClass('active btn-primary').addClass('btn-default');

                    // Activate this dropper
                    mQuery(this).removeClass('btn-default').addClass('active btn-primary');

                    // Activate the cross hairs for image
                    mQuery('#websiteCanvas').css('cursor', 'crosshair');
                }
            });
        });

        // Update type
        var activateType = function(el, thisType) {
            mQuery('[data-focus-type]').removeClass('focus-active');
            mQuery(el).addClass('focus-active');

            mQuery('#focusFormContent').removeClass(function (index, css) {
                return (css.match(/(^|\s)focus-type\S+/g) || []).join(' ');
            }).addClass('focus-type-' + thisType);

            mQuery('.focus-type-header').removeClass('text-danger');
            mQuery('#mpower_focus_type').val(thisType);

            var props = '.focus-' + thisType + '-properties';
            mQuery('#focusTypeProperties').appendTo(
                mQuery(props)
            ).removeClass('hide');

            mQuery('#focusType .focus-properties').each(function() {
                if (!mQuery(this).is(':hidden') && mQuery(this).data('focus-type') != thisType) {
                    mQuery(this).slideUp('fast', function() {
                        mQuery(this).hide();
                    });
                }
            });
            if (mQuery(props).length) {
                if (mQuery(props).is(':hidden')) {
                    mQuery(props).slideDown('fast');
                }
            }
        }

        mQuery('[data-focus-type]').on({
            click: function () {
                var thisType = mQuery(this).data('focus-type');

                if(mQuery('#mpower_focus_type').val() == thisType) {
                    return;
                }

                activateType(this, thisType);

                Mautic.mPowerFocusUpdatePreview();
            },
            mouseenter: function () {
                mQuery(this).addClass('focus-hover');
            },
            mouseleave: function() {
                mQuery(this).removeClass('focus-hover');
            }
        });

        var activateStyle = function(el, thisStyle) {
            mQuery('[data-focus-style]').removeClass('focus-active');
            mQuery(el).addClass('focus-active');

            if (!mQuery('#focusType').hasClass('hidden-focus-style-all')) {
                mQuery('#focusType').addClass('hidden-focus-style-all');
            }

            mQuery('#focusFormContent').removeClass(function (index, css) {
                return (css.match(/(^|\s)focus-style\S+/g) || []).join(' ');
            }).addClass('focus-style-' + thisStyle);

            mQuery('.focus-style-header').removeClass('text-danger');
            mQuery('#mpower_focus_style').val(thisStyle);

            var props = '.focus-' + thisStyle + '-properties';
            mQuery('#focusStyleProperties').appendTo(
                mQuery(props)
            ).removeClass('hide');

            mQuery('#focusStyle .focus-properties').each(function () {
                if (!mQuery(this).is(':hidden')) {
                    mQuery(this).slideUp('fast', function () {
                        mQuery(this).hide();
                    });
                }
            });
            if (mQuery(props).length) {
                if (mQuery(props).is(':hidden')) {
                    mQuery(props).slideDown('fast');
                }
            }
        };

        // Update style
        mQuery('[data-focus-style]').on({
            click: function () {
                var thisStyle = mQuery(this).data('focus-style');

                if(mQuery('#mpower_focus_style').val() == thisStyle) {
                    return;
                }

                activateStyle(this, thisStyle);

                Mautic.mPowerFocusUpdatePreview();
            },
            mouseenter: function () {
                mQuery(this).addClass('focus-hover');
            },
            mouseleave: function() {
                mQuery(this).removeClass('focus-hover');
            }
        });

        // Select the current type and style
        var currentType  = mQuery('#mpower_focus_type').val();
        if (currentType) {
            activateType(mQuery('[data-focus-type="' + currentType + '"]'), currentType);
        }

        var currentStyle = mQuery('#mpower_focus_style').val();
        if (currentStyle) {
            activateStyle(mQuery('[data-focus-style="' + currentStyle + '"]'), currentStyle);
        }

        mQuery('#mpower_focus_properties_content_font').on('chosen:showing_dropdown', function() {
            // Little trickery to add style to the chosen dropdown font list
            var arrayIndex = 1;
            mQuery('#mpower_focus_properties_content_font option').each(function () {
                mQuery('#mpower_focus_properties_content_font_chosen li[data-option-array-index="' + arrayIndex + '"]').css('fontFamily', mQuery(this).attr('value'));
                arrayIndex++;
            });
        });

        mQuery('.btn-fetch').on('click', function() {
            var url = mQuery('#websiteUrlPlaceholderInput').val();
            if (url) {
                mQuery('#mpower_focus_website').val(url);
                Mautic.launchFocusBuilder(true);
            } else {
                return;
            }
        });

        mQuery('.btn-viewport').on('click', function() {
            if (mQuery(this).data('viewport') == 'mobile') {
                mQuery('.btn-viewport i').removeClass('fa-desktop fa-2x').addClass('fa-mobile-phone fa-3x');
                mQuery(this).data('viewport', 'desktop');
                Mautic.launchFocusBuilder(true);
            } else {
                mQuery('.btn-viewport i').removeClass('fa-mobile-phone fa-3x').addClass('fa-desktop fa-2x');
                mQuery(this).data('viewport', 'mobile');
                Mautic.launchFocusBuilder(true);
            }
        });
    } else {
        Mautic.renderMpowerStatsChart();
    }
};

Mautic.mPowerFocusOnUnload = function() {
    if (typeof Mautic.loadedPreviewImage != 'undefined') {
        delete Mautic.loadedPreviewImage;
    }

    if (typeof Mautic.mPowerFocusStatsChart != 'undefined') {
        Mautic.mPowerFocusStatsChart.destroy();
    }
};

Mautic.launchFocusBuilder = function(forceFetch) {
    mQuery('.website-placeholder').addClass('hide');
    mQuery('body').css('overflow-y', 'hidden');

    // Prevent preview updates till the website snapshot is loaded
    Mautic.ignoreMpowerFocusPreviewUpdate = true;

    if (!mQuery('#builder-overlay').length) {
        var builderCss = {
            margin: "0",
            padding: "0",
            border: "none",
            width: "100%",
            height: "100%"
        };

        var spinnerLeft = (mQuery(document).width() - 300) / 2;
        var overlay = mQuery('<div id="builder-overlay" class="modal-backdrop fade in"><div style="position: absolute; top:50%; left:' + spinnerLeft + 'px"><i class="fa fa-spinner fa-spin fa-5x"></i></div></div>').css(builderCss).appendTo('.builder-content');
    } else {
        mQuery('#builder-overlay').removeClass('hide');
    }

    // Disable the close button until everything is loaded
    mQuery('.btn-close-builder').prop('disabled', true);

    // Activate the builder
    mQuery('.builder').addClass('builder-active').removeClass('hide');

    var url = mQuery('#mpower_focus_website').val();

    if (!url) {
        Mautic.setFocusDefaultColors();
        mQuery('.website-placeholder').removeClass('hide');
        mQuery('#builder-overlay').addClass('hide');
        mQuery('.btn-close-builder').prop('disabled', false);
        mQuery('#websiteUrlPlaceholderInput').prop('disabled', false);
    } else if (forceFetch || typeof Mautic.loadedPreviewImage == 'undefined' || Mautic.loadedPreviewImage != url) {
        Mautic.loadedPreviewImage = url;

        // Fetch image
        var data = {
            id:      mQuery('#mpower_focus_unlockId').val(),
            website: url
        }

        mQuery('.preview-body').html('');
        Mautic.ajaxActionRequest('plugin:mpowerFocus:getWebsiteSnapshot', data, function (response) {
            mQuery('#builder-overlay').addClass('hide');
            mQuery('.btn-close-builder').prop('disabled', false);

            if (response.image) {
                // Enable droppers
                mQuery('.btn-dropper').removeClass('disabled');
                mQuery('#websiteUrlPlaceholderInput').prop('disabled', true);

                var canvas = document.getElementById('websiteCanvas');
                var context = canvas.getContext('2d');
                var img = new Image();
                img.onload = function() {
                    mQuery('#websiteScreenshot').removeClass('css-device css-device--mobile');

                    // Get the width of the
                    var useWidth  = mQuery('.website-preview').width();

                    if (useWidth > img.width) {
                        useWidth = img.width;
                    }

                    // Get height proportionate to image width used
                    var ratio = useWidth / img.width;
                    var useHeight = img.height * ratio;

                    mQuery('#websiteCanvas').attr({width: useWidth, height: useHeight})
                    context.drawImage(this, 0, 0, useWidth, useHeight);

                    function findPos(obj){
                        var current_left = 0, current_top = 0;
                        if (obj.offsetParent){
                            do{
                                current_left += obj.offsetLeft;
                                current_top += obj.offsetTop;
                            }while(obj = obj.offsetParent);
                            return {x: current_left, y: current_top};
                        }
                        return undefined;
                    }

                    function rgbToHex(r, g, b){
                        if (r > 255 || g > 255 || b > 255)
                            throw "Invalid color component";
                        return ((r << 16) | (g << 8) | b).toString(16);
                    }

                    mQuery('#websiteCanvas').off('click.canvas');
                    mQuery('#websiteCanvas').on('click.canvas', function(e){
                        // Check that a dropper is active
                        if (mQuery('button.btn-dropper.active').length) {
                            var dropper = mQuery('button.btn-dropper.active').data('dropper');

                            var position = findPos(this);
                            var x = e.pageX - position.x;
                            var y = e.pageY - position.y;
                            var canvas = this.getContext('2d');
                            var p = canvas.getImageData(x, y, 1, 1).data;
                            var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);

                            mQuery('#' + dropper).minicolors('value', hex);
                        }
                    });

                    if (mQuery('.btn-viewport').data('viewport') == 'mobile') {
                        mQuery('#websiteScreenshot').addClass('css-device css-device--mobile');
                    }
                };

                img.src = (mQuery('.btn-viewport').data('viewport') == 'mobile') ? response.image.mobile : response.image.desktop ;

                if (response.colors) {
                    mQuery('#mpower_focus_properties_colors_primary').minicolors('value', response.colors.primaryColor);
                    mQuery('#mpower_focus_properties_colors_text').minicolors('value', response.colors.textColor);
                    mQuery('#mpower_focus_properties_colors_button').minicolors('value', response.colors.buttonColor);
                    mQuery('#mpower_focus_properties_colors_button_text').minicolors('value', response.colors.buttonTextColor);
                } else if (!response.ignoreDefaultColors) {
                    Mautic.setFocusDefaultColors();
                }

                if (response.palette) {
                    // Wipe them out
                    mQuery('.site-color-list').html('').removeClass('hide');

                    var colorTypes = ['primary', 'text', 'button', 'button_text'];
                    response.palette.push('#ffffff');
                    response.palette.push('#000000');
                    mQuery.each(response.palette, function(index, value) {
                        mQuery.each(colorTypes, function(ctIndex, ctValue) {
                            mQuery('<span class="label label-site-color" />')
                                .css('backgroundColor', value)
                                .css('border', '1px solid #cccccc')
                                .on('click', function() {
                                    mQuery('#mpower_focus_properties_colors_' + ctValue).minicolors('value', value);
                                })
                                .appendTo('#' + ctValue + '_site_colors');
                        });
                    });
                }

                Mautic.ignoreMpowerFocusPreviewUpdate = false;
                Mautic.mPowerFocusUpdatePreview();
            } else {
                mQuery('.website-placeholder').removeClass('hide');
                mQuery('#websiteUrlPlaceholderInput').prop('disabled', false);

                // Disable droppers
                mQuery('.btn-dropper').addClass('disabled');

                Mautic.ignoreMpowerFocusPreviewUpdate = false;
            }
        });
    } else {
        mQuery('#builder-overlay').addClass('hide');
        mQuery('.btn-close-builder').prop('disabled', false);

        Mautic.ignoreMpowerFocusPreviewUpdate = false;
        if (url) {
            Mautic.mPowerFocusUpdatePreview();
        }
    }
};

Mautic.closeFocusBuilder = function(el) {
    // Kill preview updates
    if (typeof Mautic.ajaxActionXhr != 'undefined' && typeof Mautic.ajaxActionXhr['plugin:mpowerFocus:generatePreview'] != 'undefined') {
        Mautic.ajaxActionXhr['plugin:mpowerFocus:generatePreview'].abort();
        delete Mautic.ajaxActionXhr['plugin:mpowerFocus:generatePreview'];
    }

    mQuery('#websiteUrlPlaceholderInput').prop('disabled', true);

    // Make sure a style and a type are chosen
    if (!mQuery('#mpower_focus_type').val()) {
        mQuery('.focus-type-header').addClass('text-danger');
        mQuery('.builder-panel-focus .nav-tabs a[href="#focusType"]').tab('show');
        mQuery(el).blur();

        return;
    } else {
        mQuery('.focus-type-header').removeClass('text-danger');
    }

    if (!mQuery('#mpower_focus_style').val()) {
        mQuery('.focus-style-header').addClass('text-danger');
        mQuery('.builder-panel-focus .nav-tabs a[href="#focusStyle"]').tab('show');
        mQuery(el).blur();

        return;
    } else {
        mQuery('.focus-style-header').removeClass('text-danger');
    }

    Mautic.stopIconSpinPostEvent();

    // Kill the overlay
    mQuery('#builder-overlay').remove();

    // Hide builder
    mQuery('.builder').removeClass('builder-active').addClass('hide');

    mQuery('body').css('overflow-y', '');
};

Mautic.onFocusBrandingChange = function(event) {
    setTimeout(function() {
        mQuery('#mpower_focus_properties_hide_branding_0').parents('label').first().addClass('active');
        mQuery('#mpower_focus_properties_hide_branding_0').prop('checked', true);
        mQuery('#mpower_focus_properties_hide_branding_1').parents('label').first().removeClass('active');
        mQuery('#mpower_focus_properties_hide_branding_1').prop('checked', false);
    }, 200);

    mQuery('.focus-branding-alert').removeClass('hide');

    event.stopPropagation();

    return false;
};

Mautic.mPowerFocusUpdatePreview = function() {
    if (!Mautic.ignoreMpowerFocusPreviewUpdate)
        var url = mQuery('#mpower_focus_website').val();
    if (url) {
        mQuery('.preview-body').html('');
        // Generate a preview
        var data = mQuery('form[name=mpower_focus]').formToArray();
        Mautic.ajaxActionRequest('plugin:mpowerFocus:generatePreview', data, function (response) {
            var container      = mQuery('<div />').html(response.style);
            var innerContainer = mQuery('<div />').html(response.html);

            if (mQuery('.btn-viewport').data('viewport') == 'mobile') {
                innerContainer.addClass('mf-responsive');
            } else {
                innerContainer.removeClass('mf-responsive');
            }

            container.append(innerContainer);

            mQuery('.preview-body').html(container);
        });
    }
};

Mautic.setFocusDefaultColors = function() {
    mQuery('#mpower_focus_properties_colors_primary').minicolors('value', '4e5d9d');
    mQuery('#mpower_focus_properties_colors_text').minicolors('value', 'ffffff');
    mQuery('#mpower_focus_properties_colors_button').minicolors('value', 'fdb933');
    mQuery('#mpower_focus_properties_colors_button_text').minicolors('value', 'ffffff');
};

Mautic.toggleBarCollapse = function() {
    var svg              = '.mf-bar-collapser-icon svg';
    var currentSize      = mQuery(svg).data('transform-size');
    var currentDirection = mQuery(svg).data('transform-direction');
    var currentScale     = mQuery(svg).data('transform-scale');
    var newDirection = (parseInt(currentDirection) * -1);

    setTimeout(function() {
        mQuery(svg).find('g').first().attr('transform', 'scale(' + currentScale + ') rotate(' + newDirection + ' ' + currentSize + ' ' + currentSize + ')');
        mQuery(svg).data('transform-direction', newDirection);
    }, 500);

    if (mQuery('.mf-bar-collapser').hasClass('mf-bar-collapsed')) {
        // Open
        if (mQuery('.mf-bar').hasClass('mf-bar-top')) {
            mQuery('.mf-bar').css('margin-top', 0);
        } else {
            mQuery('.mf-bar').css('margin-bottom', 0);
        }
        mQuery('.mf-bar-collapser').removeClass('mf-bar-collapsed');
    } else {
        // Collapse
        if (mQuery('.mf-bar').hasClass('mf-bar-top')) {
            mQuery('.mf-bar').css('margin-top', -60);
        } else {
            mQuery('.mf-bar').css('margin-bottom', -60);
        }
        mQuery('.mf-bar-collapser').addClass('mf-bar-collapsed');
    }
}

Mautic.closeFocusModal = function(style) {
    mQuery('.mf-' + style).remove();
    if (mQuery('.mf-' + style + '-overlay').length) {
        mQuery('.mf-' + style + '-overlay').remove();
    }

    setTimeout(function() {
        Mautic.mPowerFocusUpdatePreview();
    }, 500);
}

Mautic.updatemPowerFocusStatsChart = function(element, amount, unit) {
    var id    = Mautic.getEntityId();
    var query = "amount=" + amount + "&unit=" + unit + "&id=" + id;

    Mautic.getChartData(element, 'plugin:mpowerFocus:updateViewStatsChart', query, 'renderMpowerStatsChart');
}

Mautic.renderMpowerStatsChart = function(chartData) {
    if (!mQuery('#focus-stats-chart').length) {
        return;
    }
    if (!chartData) {
        chartData = mQuery.parseJSON(mQuery('#focus-stats-chart-data').text());
    } else if (chartData.stats) {
        chartData = chartData.stats;
    }

    var ctx = document.getElementById('focus-stats-chart').getContext('2d');
    var options = {};

    if (typeof Mautic.mPowerFocusStatsChart === 'undefined') {
        Mautic.mPowerFocusStatsChart = new Chart(ctx).Line(chartData, options);
    } else {
        Mautic.mPowerFocusStatsChart.destroy();
        Mautic.mPowerFocusStatsChart = new Chart(ctx).Line(chartData, options);
    }

    var legendHolder = document.createElement('div');
    legendHolder.innerHTML = Mautic.mPowerFocusStatsChart.generateLegend();
    mQuery('#focus-stats-legend').html(legendHolder.firstChild);
    Mautic.mPowerFocusStatsChart.update();
};