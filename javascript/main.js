/* Global variables */
var latency=0;
var latencySum=0;
var latencyCount=0;
var latencyStart;

var downloadStart;
var downloadCount=0;
var downloadSum=0;

var doneCount = 0;

/* At startup */
$(init);

/* Init function */
function init() {
  /*
  $('#barLatency').barrating('show', {
        theme: 'bars-movie'
      });
      */

  $(window).resize(doWindowResize);
  /*
  var chartLatency = new Chart($("#chartLatency").get(0).getContext("2d"));
  */

  setTimeout(doLatencyTest, 500);
  setTimeout(doDownloadTest, 250);

}

/********** populate gui ***********/


/********** action function ***********/

function doLatencyTest() {

  latencyStart = new Date();
  latencyCount++;
  $.getScript('javascript/latency.js'); //?_='+latencyCount);

}

function doDownloadTest() {

  $.ajax({
    beforeSend: function(){
        downloadStart = new Date();
    },

    // send the request to the root URI of this host
    url: 'onemegabytefile.txt?_='+(new Date()).getTime(),

    success: downloadCallback
});

}


/********** test callbacks ************/
function latencyCallback() {
  var latencyEnd = new Date();
  var tmp = latencyEnd - latencyStart;
  latencySum+=tmp;
  latency = Math.round(latencySum/latencyCount);

  $('#lblLatency').text(latency+" ms");

  // Quality: 10ms or smaller is 100%, 1000ms is 0%
  var quality;
  var top=20;
  var bottom=1000;
  if (latency<top) {
    quality = 100;
  } else if (latency>bottom) {
    quality = 0;
  } else {
    quality = ((bottom)-(latency))/10;
  }
  $('#lblLatencyQuality').text(getQualityText(quality));

  if (latencyCount<30) setTimeout(doLatencyTest, 500);
  else testDone();
}

function downloadCallback() {
  var downloadEnd = new Date();
  downloadCount++;
  downloadTime = downloadEnd - downloadStart;
  if (downloadTime>latency) downloadTime-=latency;
  var downloadSpeed = Math.round((1024)/(downloadTime/1000));
  downloadSum+=downloadSpeed;
  downloadSpeed=Math.round(downloadSum/downloadCount);
  $('#lblDownloadSpeed').text(downloadSpeed+" kbytes/s");
  downloadSpeed=Math.sqrt(downloadSpeed); // use the square root

  // Quality: 2048 kb/s is 100%, 64 kb/s is 0%
  var quality;
  var top=Math.sqrt(4096);
  var bottom=Math.sqrt(32);
  if (downloadSpeed>=top) {
    quality = 100;
  } else if (downloadSpeed<=bottom) {
    quality = 0;
  } else {
    quality = Math.round(((downloadSpeed-bottom)/(top-bottom))*100);
  }
  $('#lblDownloadQuality').text(getQualityText(quality));

  if (downloadCount<15) setTimeout(doDownloadTest, 1000);
  else testDone();
}

function getQualityText(pc) {
  var s=pc+"% ";
  if (pc>=99) s+="Superb!";
  else if (pc>=80) s+="Great!";
  else if (pc>=60) s+="Very good!";
  else if (pc>=40) s+="Good!";
  else if (pc>=30) s+="Poor!";
  else if (pc>=20) s+="Bad!";
  else if (pc>=10) s+="Very bad!";
  else if (pc>0) s+="Terrible!";
  else s+="Worthless!";
  return s;
}

function testDone() {
  doneCount++;
  if (doneCount>=2) $("#status").html("Done!");
}

/********** events listeners ***********/


function doWindowResize() {
  var w = $(this).width();
  /*
  var kitComponents = $('#kit_components');
  if (kitComponents.length) {
    var kcw = w-168;
    $('#kit_components').width(kcw);
    var titlew = (kcw - 150)/2;
    if (titlew<100) titlew=100;
    $('.kc_title').width(titlew);
    $('.kc_subtitle').width(titlew);
  }
  */

}


/********** layout function **********/
