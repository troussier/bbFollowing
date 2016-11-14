/*
 * スクロール追従プラグイン
 */
;(function($){
    'use strict';
    
    $.fn.bbFollowing = function(options) {
        /*
            padding             追従させるときに上からどれだけ離すか
            paddingBottom       追従を止めるときに下からどれだけ離すか
            initPositionTop     ターゲット要素の初期位置 上
            initPositionLeft    ターゲット要素の初期位置 左
            parent              親要素を指定 デフォルト以外にする場合は該当要素の position を absolute か relative にすること
            autoWidth           自動的に親要素の幅を設定する
        */
        var settings = $.extend({
            padding: 0,
            paddingBottom: 0,
            initPositionTop: false,
            initPositionLeft: false,
            parent: $('body'),
            autoWidth: false
        }, options);
        
        var $this = this, elmHeight, elmPaddingTop, breakPoint;
        
        var init = function() {
            if (settings.initPositionTop) {
                $this.css('top', settings.initPositionTop);
            }
            elmHeight = $this.outerHeight(); //要素の高さ
            elmPaddingTop = parseInt($this.css('padding-top')); //要素のパディングトップ
            breakPoint = $this.offset().top - settings.padding + elmPaddingTop; //ブレイクポイント
            
            setup();
        };
        
        var setup = function() {
            if (settings.autoWidth) {
                $this.css('width', settings.parent.width());
            }
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
        };
        
        $this.update = function() {
            setup();
        };
        
        init();
        
        return this;
    };
}(jQuery));
