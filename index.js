import imageCard from 'components/Slider/imageCard'

var cli = {};

cli.version = function() {
	console.log("version");
};

cli.help = function(){
    console.log("help");
};

cli.imageCard = imageCard;

module.exports = cli;