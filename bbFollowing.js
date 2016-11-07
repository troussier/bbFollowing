/*
 * スクロール追従プラグイン
 * REQUIRE jQuery throttle / debounce
 */
;(function($){
    'use strict';
    
    $.fn.bbFollowing = function(options) {
        var settings = $.extend({
            padding: 0, //追従させるときに上からどれだけ離すか
            paddingBottom: 0, //追従を止めるときに下からどれだけ離すか
            initPositionTop: false, //ターゲット要素の初期位置 上
            initPositionLeft: false, //ターゲット要素の初期位置 左
            parent: $('body'), //親要素を指定 デフォルト以外にする場合は該当要素の position を absolute か relative にすること
            autoWidth: false, //自動的に親要素の幅を設定する
            xxx: false
        }, options);
        
        return this.each(function() {
            var $this = $(this);
            if (settings.initPositionTop) {
                $this.css('top', settings.initPositionTop);
            }
            var elmHeight = $this.outerHeight(); //要素の高さ
            var elmPaddingTop = parseInt($this.css('padding-top')); //要素のパディングトップ
            var breakPoint = $this.offset().top - settings.padding + elmPaddingTop; //ブレイクポイント
            
            if (settings.autoWidth) {
                $this.css('width', settings.parent.width());
                
                $(window).off('resize.following');
                $(window).on('resize.following', $.throttle(200, function() {
                    $this.css('width', settings.parent.width());
                }));
            }
            
            //アクセス時イベント
            navFixed();
            
            //スクロール時イベント
            $(window).off('scroll.following');
            $(window).on('scroll.following', $.throttle(200, function() {
                navFixed();
            }));
            
            function navFixed() {
                var offset = settings.parent.offset();
                var offsetTop = offset.top; //親要素のページ上辺からの距離
                var docHeight = $(document).height(); //ドキュメントの高さ
                var distanceFromBottom = docHeight - $(document).scrollTop(); //ボトムからの距離
                var bottomBreakPoint = elmHeight + settings.paddingBottom + settings.padding - elmPaddingTop; //下側のブレイクポイント
                
                //ブレイクポイントと下側のブレイクポイントの合計値がドキュメントの高さを下回る場合のみ発動させる
                if ((breakPoint + bottomBreakPoint) < docHeight) {
                    if (distanceFromBottom < bottomBreakPoint) {
                        $this.css({'position': 'absolute', 'top': docHeight - (elmHeight + settings.paddingBottom + offsetTop)});
                    } else if ($(document).scrollTop() > breakPoint ) {
                        $this.css({'position': 'fixed', 'top': settings.padding - elmPaddingTop});
                    } else {
                        $this.css({'position': '', 'top': settings.initPositionTop});
                    }
                }
            }
        });
    };
}(jQuery));
