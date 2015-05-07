var React = require('react');

var Alert = React.createClass({

    _onClickClose: function (e) {
        e.preventDefault();
        $('blockquote').slideUp();
    },

    render: function () {
        return (
            <blockquote className="hidden-xs">If you are playing the game on a desktop browser, drag the button below to you bookmarks bar and click it while in the game.
                <h5><a className="label label-primary"
                       href="javascript:(function(){if(location.href.indexOf('http://littlealchemy.com')>-1){lahUrl='http://littlealchemyhelper.com/index.html?type=iframe&version=0.4&import='+game.progress.sort(function(a,b){return a-b;}).join(',');if(!$('#laHelper').size()){$('<iframe/>').prop({id:'laHelper',src:lahUrl}).css({position:'absolute',top:50,left:50,width:425,height:$(window).height()-100}).appendTo('body');}else{$('#laHelper').remove();}}})();">LittleAlchemyHelper</a>
                </h5>
                <a href="#" className="close" onClick={this._onClickClose}><i className="fa fa-times-circle"></i></a>
            </blockquote>
        );
    }

});

module.exports = Alert;
