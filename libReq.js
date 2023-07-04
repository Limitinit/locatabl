
"use strict"

//When using a device with a small screen such as iphone 5 it was impossible to login because some buttons didn't fit into the screen. I'm guessing this was the problem.
//So now I have made sure one can use it down to a 280x280 screen.

// redis interface 4.0 does not work

// globalThis
// Do extra exchange of fb-token, to get longer expiration time
// FB: how to enable public photo
// test fast zip
// Ability to set default hideTimer in plugin
// boUseIdPImg => boUseOwnImg ??
// blue/pink quickDiv background
// usage of geohash:
//   boCalcZoom: 2-dim search seam slow but I don't think one can use geohash.
//   getRectangleSelection could be called on client side (although boCalcZoom has to be done i a separate request)

// globSubscription must be stored in a database mustn't it. (It seams to work, when tested with multiple users.) 
// Should one use dataSet instead of prop when storing data in the DOM.
// Use element.classList.add / toggle etc instead of custom library methods.
// Reduce the need of user-agent-string
// dotenv
// nodemon
// test dbeaver and posman
// substr depricated ?!?!?
// sendgrid to sendinblue in idPlace
// In client.js: Use viewUploadImagePopCreator (with reduceImageSize) instead of viewUploadImagePop. (In viewTeamCreator and image.crInp )
// Instead of idTeam, strKey (more easy to remember) should be used.
// in taxi_sellerTeam ... id should be idSeller ... instead of idUser
// After a push-message has arrived, and one clicks "Activate" the latest tab opens (I think) not necessarily the tab with a map on.
// Some times a push-message is sent, the image doesn't come along (sec-fetch-mode header not allowed (no-cors)) (only when debugger window is closed)
// Should perhaps use onDomContentLoaded instead of onLoad  +  use defer instead of async
// Pier-Pier Messaging:
//   WebRtc
// Client-Server Messaging:
//   Web sockets (older)
//   Web transport (promoted in chrome 97 as alternative to Web sockets) (server needs to support http3 (generaly easier than setting up a webrtc server))
//     Reliable (Streams api)
//     Unreliable (Datagram api)

// How to attach Chrome DevTools to node --inspect
// Sampling heap profiler (heap-profile module)

// Not on all browsers:
// SanitizerAPI (only supported by chrome)
// Element.isVisible (not yet supported by safari and firefox)
// Use Navigation API instead of History API (only supported by chrome)
// cqi, cqw (not in FF)
// popup api (<div popup>) (chrome 106 (Origin trial))
// inert (in ff not until 107), (in ios not until 15)

// tHide should be renamed cached_tHide in database

// webpush on FF

// LoginWithEmail, forgottPassword, login (and maybe others): send email regardless if email was found in db.
// "If the email was in the database, an email was sent."

// locatabl must use flex box because ios overscrolls if one don't have overflow:hidden, and if one have overflow:hidden then any view using fix foot will not scroll.


// After googling "node.js connect debugger to running process" I found:
//   kill -USR1 <node-pid>   // starts debugger

//https://192.168.0.5:5000/dataDelete?signed_request=YzebdCqzGfhnx3LQHtvNEuqq5DkLFIpi18CgZfZuc6A.eyJ1c2VyX2lkIjoiMTAwMDAyNjQ2NDc3OTg1In0
//https://192.168.0.5:5000/deAuthorize?signed_request=YzebdCqzGfhnx3LQHtvNEuqq5DkLFIpi18CgZfZuc6A.eyJ1c2VyX2lkIjoiMTAwMDAyNjQ2NDc3OTg1In0


// How to get an alias of an gmail-address: abc+1@gmail.com

/******************************************************************************
 * reqCurlEnd
 ******************************************************************************/
app.reqCurlEnd=async function(){  
  var {req, res}=this, {site, objQS}=req, {siteName}=site;
  
  
  res.setHeader('Content-Type', MimeType.json);
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  
  //var http_origin = req.uDomain; 
  if('origin' in req.headers){ //if cross site
    var http_origin=req.headers.origin;
    //var boAllowDbg=boDbg && RegExp("^http\:\/\/(localhost|192\.168\.0)").test(http_origin);
    var boAllowDbg=boDbg && RegExp("^https?\:\/\/(localhost|192\.168\.0)").test(http_origin);
    //boAllowDbg=1;
    if(boAllowDbg || http_origin == "https://control.locatabl.com" || http_origin == "https://controllocatabl.herokuapp.com" || http_origin == "https://emagnusandersson.github.io" ){
        res.setHeader("Access-Control-Allow-Origin", http_origin);
        res.setHeader("Vary", "Origin"); 
    }
    if(req.method=='OPTIONS'){  res.out200('');  return;}
  }

  //res.setHeader('Cache-Control', 'no-cache'); // Seem to work fine without this


  //var keyRemoteControl; if("keyRemoteControl" in objQS) { keyRemoteControl=objQS.keyRemoteControl; }  else{ res.out200('No public key "keyRemoteControl" in the query line'); return;}
  //var sixSignature; if("signature" in objQS) { sixSignature=objQS.signature; }  else{ res.out200('No "signature" in the query line'); return;}
  var {dataFromRemoteControl}=objQS;
  //var data; if("data" in objQS) { data=objQS.data; }  else{ res.out200('No "data" in the query line'); return;}

  //var pemPub=keyRemoteControl, sixPub=keyRemoteControl.split('\n').slice(1,-2).join('\n');
  //var pemPub=`-----BEGIN PUBLIC KEY-----\n${keyRemoteControl}-----END PUBLIC KEY-----`, sixPub=keyRemoteControl;
  //var keyTmp = new NodeRSA(pemPub);
  //var boOK=keyTmp.verify(data, sixSignature, 'utf8', 'base64');
  //var boOK; if(!boOK){ res.out200('Message does NOT authenticate'); return;}
  //console.log('boVerifies: '+boOK);

  //var inObj=JSON.parse(data);//json_last_error_msg()
  try{ var inObj=JSON.parse(dataFromRemoteControl); }catch(e){ res.out200('error parsing "dataFromRemoteControl"');  return; }
  //inObj=JSON.parse("{iSec:22, lat:59.83934260, lng:17.60569680}");
  var {keyRemoteControl, iSeq:iSeqN, boCheck, boShow, iRole, hideTimer, lat, lng}=inObj;
  //var keyRemoteControl; if("keyRemoteControl" in inObj) { keyRemoteControl=inObj.iSeq; }  else{  res.out200('"keyRemoteControl" is not set'); return;}
  //var iSeqN; if("iSeq" in inObj) { iSeqN=inObj.iSeq; }  else{  res.out200('"iSeq" is not set'); return;}
  
  
  if(typeof keyRemoteControl=='undefined') {  res.out200('"keyRemoteControl" is not set'); return;}
  if(keyRemoteControl.length!=32) {  res.out200(`The length of keyRemoteControl should be 32 (length is ${keyRemoteControl.length})`); return;}
  if(typeof iSeqN=='undefined') {  res.out200('"iSeq" is not set'); return;}
  //if(typeof iRole=='undefined') {  res.out200('"iRole" is not set'); return;}

  //console.log(moment().format('HH:mm:ss')+` ${req.connection.remoteAddress} ${keyRemoteControl}`);
  var Sql=[],Val=[];
  if(boCheck){
    //Sql.push(`CALL ${siteName}GetValuesToController(?, ?, @boShow, @hideTimer, @tDiff, @iRoleActive, @boOk, @mess);`); Val.push(keyRemoteControl, iSeqN);
    Sql.push(`CALL ${siteName}GetValuesToController(?, ?, @boShow, @hideTimer, @tNow, @tPos, @tHide, @iRoleActive, @boOk, @mess);`); Val.push(keyRemoteControl, iSeqN);

    Sql.push("SELECT @boShow AS boShow, @hideTimer AS hideTimer, @tNow AS tNow, @tPos AS tPos, @tHide AS tHide, @iRoleActive AS iRoleActive, @boOk AS boOK, @mess AS mess;");
    var sql=Sql.join('\n');
    var [err, results]=await this.myMySql.query(sql, Val);  if(err){ res.out500(err); return; } 
    var {boShow, hideTimer, tNow, tPos, tHide, iRoleActive, boOK, mess}=results[1][0];
    var tDiff=tHide-tNow, tPosDiff=tNow-tPos;
    if(!boOK) {res.out200(mess); return;}
    var strRoleActive=iRoleActive?'Seller':'Buyer', strRoleActiveB= ` (${strRoleActive})`;
    var str='Hidden'+strRoleActiveB;
    if(boShow){ 
      var str='Visible'+strRoleActiveB; 
      var [ttmp,u]=getSuitableTimeUnit(tPosDiff), tDiffF=ttmp.toFixed(0);   
      str+=`, last update ${tDiffF} ${u} ago`; 
      var [ttmp,u]=getSuitableTimeUnit(tDiff), tDiffF=ttmp.toFixed(0);   
      //if(hideTimer!=intMax) str+=`, hiding in ${tDiffF} ${u}`; 
      if(hideTimer!=intMax) str+=`, hiding in ${tDiffF} ${u}`; 
    };
    res.out200(str);
  }
  else{
    var {boShow, hideTimer=0, lat=0, lng=0, boSetTHide=false}=inObj;
    if(!("boShow" in inObj)) { res.out200('"boShow" is not set'); return;} 
    if(boShow && !("lat" in inObj || "lng" in inObj)){res.out200('"lng" or "lat" are not set'); return;}
    hideTimer=bound(hideTimer, 0, intMax);
    var projs=new MercatorProjection(),   [x,y]=projs.fromLatLngToPointV([lat, lng]);
    //var strGeoHash=GeoHash.pWC2GeoHash({x,y});
    Sql.push(`CALL ${siteName}SetValuesFromController(?, ?, ?, ?, ?, ?, ?, ?, @iRoleActive, @boOk, @mess);`); Val.push(keyRemoteControl, iSeqN, x, y, lat, boShow, hideTimer, boSetTHide);
    Sql.push("SELECT @iRoleActive AS iRoleActive, @boOk AS boOK, @mess AS mess;");
    var sql=Sql.join('\n');
    var [err, results]=await this.myMySql.query(sql, Val);  if(err){ res.out500(err); return; } 
    //var {boShow, tDiff, boOK, mess}=results[1][0];
    var {iRoleActive, boOK, mess}=results[1][0];
    if(!boOK) {res.out200(mess); return;}
    var str=boShow?'Visible':'Hidden';
    var strRoleActive=iRoleActive?'Seller':'Buyer', strRoleActiveB=` (${strRoleActive})`;
    str+=strRoleActiveB
    res.out200(str);
  }
}



/******************************************************************************
 * reqKeyRemoteControlSave
 ******************************************************************************/
app.reqKeyRemoteControlSave=async function(){
  var {req, res}=this, {site, objQS, uSite}=req, {siteName}=site;

  
  var strT=req.headers['sec-fetch-mode'];
  if(strT && !(strT=='navigate' || strT=='same-origin')) { res.outCode(400, `sec-fetch-mode header not allowed (${strT})`); return;}
  
  //this.mesO=mesOMake('\n');
  
  var keyRemoteControl=objQS.keyRemoteControl||'';
  var strLang='en';

  //var Str=this.Str=[];
  var Str=[];
  Str.push(`<!DOCTYPE html>
<html lang="en"><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" id="viewportMy" content="width=device-width, initial-scale=1, minimum-scale=1" />
<meta name="robots" content="noindex">
</head>
<body>`); //, interactive-widget=resizes-content

  var uCommon=req.strSchemeLong+wwwCommon;
  Str.push(`<script>window.app=window;</script>`);
  Str.push(`<base href="${uCommon}">`);


          // If boDbg then set vTmp=0 so that the url is the same, this way the debugger can reopen the file between changes
  var pathTmp='/stylesheets/style.css', vTmp=CacheUri[pathTmp].eTag; if(boDbg) vTmp=0;    Str.push(`<link rel="stylesheet" href="${pathTmp}?v=${vTmp}" type="text/css">`);

    // Include site specific JS-files
  //var keyCache=siteName+'/'+leafSiteSpecific, vTmp=CacheUri[keyCache].eTag; if(boDbg) vTmp=0;  Str.push(`<script type="module" src="${uSite}/${leafSiteSpecific}?v=${vTmp}" ></script>`);
  
  var StrTmp=[siteName+'_'+leafSiteSpecific, `lang/${strLang}.js`, 'lib.js', 'libClient.js', 'clientKeyRemoteControlSave.js'];
  for(var i=0;i<StrTmp.length;i++){
    var pathTmp='/'+StrTmp[i], vTmp=CacheUri[pathTmp].eTag; if(boDbg) vTmp=0;    Str.push(`<script type="module" src="${pathTmp}?v=${vTmp}" ></script>`);
  }


  var caller="keyRemoteControlSave",  CSRFCode=randomHash();
  await setRedis(req.sessionID+'_CSRFCode'+ucfirst(caller), CSRFCode, maxUnactivity); 
  

  Str.push("<script>");
  var objOut={CSRFCode, caller, userInfoFrDBZero, keyRemoteControl, maxList, wwwCommon, leafBE, flImageFolder, UrlOAuth, response_type};
  copySome(objOut,req,['wwwSite', 'boTLS']);

  Str.push(`var tmp=${serialize(objOut)};
Object.assign(window, tmp);
function indexAssign(){
  setItem('CSRFCode',CSRFCode);
}
`);
  Str.push("</script>");
  Str.push("</body></html>");
  //this.mesO();

  res.setHeader('Content-Type', MimeType.html);
  var str=Str.join('\n');   res.writeHead(200, "OK");   res.end(str); 
}


/******************************************************************************
 * reqDataDelete   // From IdP
 ******************************************************************************/

function parseSignedRequest(signedRequest, secret) {
  var [b64UrlMac, b64UrlPayload] = signedRequest.split('.', 2);
  //var mac = b64UrlDecode(b64UrlMac);
  var payload = b64UrlDecode(b64UrlPayload),  data = JSON.parse(payload);
  var b64ExpectedMac = myCrypto.createHmac('sha256', secret).update(b64UrlPayload).digest('base64');
  var b64UrlExpectedMac=b64ExpectedMac.replace(/\+/g, '-').replace(/\//g, '_').replace('=', '');
  if (b64UrlMac !== b64UrlExpectedMac) {
    //return [Error(`Invalid mac: ${b64UrlMac}. Expected ${b64UrlExpectedMac}`)];
    return [Error(`Invalid mac: ${b64UrlMac}. Expected ${b64UrlExpectedMac}`)];
  }
  return [null,data];
}

app.deleteOne=async function(site,user_id){  //
  var {req}=this, {userTab, buyerTab, sellerTab}=site.TableName;

  var Sql=[], Val=[];
  //Sql.push(`DELETE r FROM ${userTab} u JOIN ${buyerTab} r ON u.idUser=r.idUser WHERE idFB=?;`); Val.push(user_id);
  //Sql.push(`DELETE r FROM ${userTab} u JOIN ${sellerTab} r ON u.idUser=r.idUser WHERE idFB=?;`); Val.push(user_id);
  Sql.push(`SELECT count(*) AS n FROM ${buyerTab};`);
  Sql.push(`SELECT count(*) AS n FROM ${sellerTab};`);
  Sql.push(`DELETE FROM ${userTab} WHERE idFB=?;`); Val.push(user_id);
  Sql.push(`SELECT count(*) AS n FROM ${userTab};`);
  Sql.push(`SELECT count(*) AS n FROM ${buyerTab};`);
  Sql.push(`SELECT count(*) AS n FROM ${sellerTab};`);
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) return [err];
  var nTotBO=Number(results[0][0].n);
  var nTotSO=Number(results[1][0].n);
  var c=results[2].affectedRows;

  site.nUser=Number(results[3][0].n);
  site.nTotB=Number(results[4][0].n);
  site.nTotS=Number(results[5][0].n);
  if(nTotBO!=site.nTotB) site.boGotNewBuyers=1;
  if(nTotSO!=site.nTotS) site.boGotNewSellers=1;
  return [null, c];
}
app.reqDataDelete=async function(){  //
  var {req, res}=this, {objQS, uSite, site}=req, {siteName}=site

  //if(req.method=='GET' && boDbg){ var objUrl=url.parse(req.url), qs=objUrl.query||'', strData=qs; } else 
  if(req.method=='POST'){var strData=await app.getPost.call(this, req);}
  else {res.outCode(400, "Post request wanted"); return; }
  
  //try{ var obj=JSON.parse(jsonInput); }catch(e){ res.outCode(400, "Error parsing json: "+e);  return; }

  var Match=strData.match(/signed_request=(.*)/); if(!Match) {res.outCode(400, "String didn't start with \"signed_request=\""); return; }
  var strDataB=Match[1];

  var [err, data]=parseSignedRequest(strDataB, req.rootDomain.fb.secret); if(err) { res.outCode(400, "Error in parseSignedRequest: "+err.message); return; }
  var {user_id}=data;

  var StrMess=[];
  // for(var i=0;i<SiteName.length;i++){
  //   var siteName=SiteName[i], site=Site[siteName];
  //   var [err,c]=await deleteOne.call(this, site, user_id);
  //   if(c) StrMess.push(`${siteName} (${c})`);
  // }

  var [err,c]=await deleteOne.call(this, site, user_id); if(err){  res.out500(err); return; }
  var strC=c>1?` (${c} entries deleted?!)`:''; // Incase there is more than one
  if(c) StrMess.push(siteName+strC);

  var mess=`User ${user_id}:`;     if(StrMess.length) mess+=' deleted on: '+StrMess.join(', '); else mess+=' not found.';
  console.log('reqDataDelete: '+mess);
  var confirmation_code=genRandomString(32);
  await setRedis(confirmation_code+'_DeleteRequest', mess, timeOutDeleteStatusInfo); //3600*24*30

  res.setHeader('Content-Type', MimeType.json); 
  //res.end(`{ url: '${uSite}/${leafDataDeleteStatus}?confirmation_code=${confirmation_code}', confirmation_code: '${confirmation_code}' }`);
  res.end(JSON.stringify({ url: `${uSite}/${leafDataDeleteStatus}?confirmation_code=${confirmation_code}`, confirmation_code }));
}

app.reqDataDeleteStatus=async function(){
  var {req, res}=this, {site, objQS, uSite}=req;
  var objUrl=url.parse(req.url), qs=objUrl.query||'', objQS=parseQS2(qs);
  var confirmation_code=objQS.confirmation_code||'';
  var [err,mess]=await getRedis(confirmation_code+'_DeleteRequest'); 
  if(err) {var mess=err.message;}
  else if(mess==null) {
    var [t,u]=getSuitableTimeUnit(timeOutDeleteStatusInfo);
    //var mess=`The delete status info is only available for ${t}${u}.\nAll delete requests are handled immediately. So if you pressed delete, you are deleted.`;
    var mess=`No info of deletion status found, (any info is deleted ${t}${u} after the deletion request).`;
  }
  res.end(mess);
}

app.reqDeAuthorize=async function(){  //
  var {req, res}=this, {objQS, uSite, site}=req, {siteName}=site

  //if(req.method=='GET' && boDbg){ var objUrl=url.parse(req.url), qs=objUrl.query||'', strData=qs; } else 
  if(req.method=='POST'){var strData=await app.getPost.call(this, req);}
  else {res.outCode(400, "Post request wanted"); return; }

  var Match=strData.match(/signed_request=(.*)/); if(!Match) {res.outCode(400, "String didn't start with \"signed_request=\""); return; }
  var strDataB=Match[1];

  var [err, data]=parseSignedRequest(strDataB, req.rootDomain.fb.secret); if(err) { res.outCode(400, "Error in parseSignedRequest: "+err.message); return; }

  var StrMess=[];
  // for(var i=0;i<SiteName.length;i++){
  //   var siteName=SiteName[i], site=Site[siteName];
  //   var objArg={site, idFB:data.user_id};
  //   var [err, {iRole, objR}]=await RHide.call(this, objArg); if(err) continue;
  //   StrMess.push(siteName);
  // }
  var objArg={site, idFB:data.user_id};
  var [err, {iRole, objR}]=await RHide.call(this, objArg); if(err){  res.out500(err); return; }
  StrMess.push(siteName);

  if(StrMess.length) var mess='Hidden on site(s): '+StrMess.join(', '); else var mess='Nothing hidden';
  console.log(`reqDeAuthorize (id: ${data.user_id}): ${mess}`);
  
  res.setHeader('Content-Type', MimeType.json); 
  res.end(JSON.stringify({ mess }));
}

/******************************************************************************
 * reqPrev
 ******************************************************************************/
app.reqPrev=async function() {
  var {req, res}=this;
  
  var strT=req.headers['sec-fetch-mode'];
  if(strT && !(strT=='navigate' || strT=='same-origin')) { res.outCode(400, `sec-fetch-mode header not allowed (${strT})`); return;}
  
  res.end(`<!DOCTYPE html>
<html lang="en"><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" id="viewportMy" content="initial-scale=1" />
<meta name="robots" content="noindex">
</head>
<body>
<p>Prev
<p><a href=${req.uSite}>index</a>
</body></html>`);
}

/******************************************************************************
 * reqIndex
 ******************************************************************************/

// Stuff that varies with index call parameters: site, lang, boTLS
// Allways same: coordApprox;
// Not used: strLangBrowser
app.reqIndex=async function() {
  var {req, res}=this, {site, wwwSite, objQS, uSite}=req, {siteName}=site;
  
  var strT=req.headers['sec-fetch-mode'];
  if(strT && !(strT=='navigate' || strT=='same-origin')) { res.outCode(400, `sec-fetch-mode header not allowed (${strT})`); return;}
  

  var ip='';
    // AppFog ipClient
  if('x-forwarded-for' in req.headers){
    var tmp=req.headers['x-forwarded-for'];
    //tmp="79.136.116.122, 127.0.0.1";
    var Match=/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.exec(tmp);
    ip=Match[0];
  }else if('REMOTE_ADDR' in req.headers){ip=req.headers.REMOTE_ADDR;}
   
  if(boDbg) ip='79.136.116.122';
  var strTmp='43.4,3.00000000009';
  var strTmp="59.33330000000001,18.05000000000001";
  var strTmp="0,0";
  var Match=/^(.*),(.*)$/.exec(strTmp);
  var boOK=Boolean(Match.length);
  //if(!boOK) coordApprox=[0,0]; else coordApprox=Match.slice(1);
  var coordApprox; if(!boOK) coordApprox=[0,0]; else coordApprox=[Number(Match[1]),Number(Match[2])];


  var strLangBrowser=getBrowserLang(req); if(!checkIfLangIsValid(strLangBrowser)){ strLangBrowser='en'; }

  var ua=req.headers['user-agent']||''; ua=ua.toLowerCase();
  var boIOS= RegExp('iphone','i').test(ua);
  if(/facebookexternalhit/.test(ua)) {
    objQS.lang='en'; 
  }
  if('fb_locale' in objQS) objQS.lang=objQS.fb_locale.substr(0,2);   

  //var strLang;
  var strLang='en';
  /*
  if('lang' in objQS) strLang=objQS.toLowerCase();   
  else {
    var arrT=[req.qs];arrT.push("lang="+strLangBrowser);
    var str=arrT.join('&'); if(str.length) str='?'+str;
    var uTmp=uSite+str; //echo uTmp; exit;
    res.setHeader("Location",uTmp); res.end(); return false;
  }
  if(!checkIfLangIsValid(strLang)){ strLang=strLangBrowser; }
  */

  var requesterCacheTime=getRequesterTime(req.headers);

  res.setHeader("Cache-Control", "must-revalidate");  res.setHeader('Last-Modified',tIndexMod.toUTCString());

  if(requesterCacheTime && requesterCacheTime>=tIndexMod && 0) { res.out304(); return false;   } 
  res.statusCode=200;   
  

  var Str=[];
  Str.push(`<!DOCTYPE html>
<html 
lang="en"
xmlns="http://www.w3.org/1999/xhtml"
xmlns:og="http://ogp.me/ns#"
xmlns:fb="http://www.facebook.com/2008/fbml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>`);

  var uCommon=req.strSchemeLong+wwwCommon;
  Str.push(`<base href="${uCommon}">`);
  
  

  //<meta name="apple-mobile-web-app-capable" content="yes" /> 

  
  var srcIcon16=site.SrcIcon[IntSizeIconFlip[16]];
  var srcIcon114=site.SrcIcon[IntSizeIconFlip[114]];
  Str.push(`<link rel="icon" type="image/png" href="${srcIcon16}" />`);
  Str.push(`<link rel="apple-touch-icon" href="${srcIcon114}"/>`);


  Str.push("<meta name='viewport' id='viewportMy' content='initial-scale=1'/>");
  Str.push('<meta name="theme-color" content="#ff0"/>');

  await import(`./lang/${strLang}.js`);  langServerFunc();
  site.langSetup();
  var {strTitle, strH1, strDescription, strKeywords, strSummary}=site.serv;


  Str.push(`
<meta name="description" content="${strDescription}"/>
<meta name="keywords" content="${strKeywords}"/>
<link rel="canonical" href="${uSite}"/>`);

  var uIcon200=uSite+site.SrcIcon[IntSizeIconFlip[200]];
  var fbTmp=req.rootDomain.fb, fiIdTmp=fbTmp?fbTmp.id:``;
  var tmp=`
<meta property="og:title" content="${wwwSite}"/>
<meta property="og:type" content="website" />
<meta property="og:url" content="${uSite}"/>
<meta property="og:image" content="${uIcon200}"/>
<meta property="og:site_name" content="${wwwSite}"/>
<meta property="fb:admins" content="100002646477985"/>
<meta property="fb:app_id" content="${fiIdTmp}"/>
<meta property="og:description" content="${strDescription}"/>
<meta property="og:locale:alternate" content="sv_se" />
<meta property="og:locale:alternate" content="en_US" />`;
  if(!boDbg) Str.push(tmp);

    // Testing broser functionality
  Str.push(`<script> (function(){
    var err=null, m0="This browser does not support ", m1;
    try { m1="generators"; eval("(function *(){})");
      m1="default parameters"; eval("(function(a=0){})");
      m1="destructuring assignment"; eval("var {a}={a:1};");
      m1+=" with arrays"; eval("var [a]=[1];");
      //m1="this obvious nonsens"; eval("function;");
    } catch(err) { alert(m0+m1+':\\n'+err); }
  })();</script>`);
  
  Str.push(`<script>window.app=window;</script>`);

  Str.push(`<style>
:root { --maxWidth:800px; height:100%}
body {margin:0; height:100%; display:flow-root; font-family:arial, verdana, helvetica; }
.mainDiv { margin: 0em auto; height: 100%; width:100%; display:flex; flex-direction:column; max-width:var(--maxWidth) }
.mainDivR { box-sizing:border-box; margin:0em auto; width:100%; display:flex; max-width:var(--maxWidth) }
h1.mainH1 { box-sizing:border-box; margin:0em auto; width:100%; border:solid 1px; color:black; font-size:1.6em; font-weight:bold; text-align:center; padding:0.4em 0em 0.4em 0em; background:#ff0;  }
</style>`);


    //
    // FB
    //
  var tmp=`
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '${fiIdTmp}',
      cookie     : true,
      xfbml      : true,
      version    : 'v9.0'
    });
      
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>`;
  Str.push(tmp);

    //
    // Google
    //
  var strTracker, tmpID=site.googleAnalyticsTrackingID||null;
  tmpID=null;  // Disabling ga
  if(boDbg||!tmpID){strTracker="<script> ga=function(){};</script>";}else{ 
  strTracker=`
<script type="text/javascript">
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', '${tmpID}', { 'storage': 'none' });
  ga('send', 'pageview');
</script>`;
  }
  Str.push(strTracker);
  //ga('create', '${tmpID}', 'auto');
  
  const uRecaptcha='https://www.google.com/recaptcha/api.js?onload=cbRecaptcha&render=explicit';

  var strT=''; if('googleAPIKey' in req.rootDomain) strT="?key="+req.rootDomain.googleAPIKey;
  if(typeof boGoogleMap!='undefined' && boGoogleMap) Str.push(`<script type='text/javascript' src='https://maps.googleapis.com/maps/api/js${strT}'></script>`);
  
  //Str.push(`<link rel="preconnect" href="${uCommon}">`);
  //Str.push(`<link rel="preconnect" href="https://connect.facebook.net">`);
  

    // If boDbg then set vTmp=0 so that the url is the same, this way the debugger can reopen the file between changes

    // Use normal vTmp on iOS (since I don't have any method of disabling cache on iOS devices (nor any debugging interface))
    var boDbgT=boDbg; if(boIOS) boDbgT=0; if(typeof boSlowNetWork!='undefined' && boSlowNetWork) boDbgT=0;

  Str.push(`<script>
//var StrMainProt=[];
//var StrMainProtRole=[];
var MainDivFull=[];
var MainDivPop=[];
</script>`);

  var keyTmp=`/${siteName}_${leafManifest}`, vTmp=boDbgT?0:CacheUri[keyTmp].eTag;
  //Str.push(`<link rel="manifest" href="${uSite}/${leafManifest}?v=${vTmp}"/>`);
  Str.push(`<link rel="manifest" href="${keyTmp}?v=${vTmp}"/>`);
  var keyTmp='/'+leafServiceWorker, vTmp=boDbgT?0:CacheUri[keyTmp].eTag;     const srcServiceWorker=`/${leafServiceWorker}?v=${vTmp}`;

    // File with delayed loading
  var pathTmp='/lib/foundOnTheInternet/sha1.js', vTmp=boDbgT?0:CacheUri[pathTmp].eTag;   const wsSha1=pathTmp+'?v='+vTmp;
  //Str.push(`<script type="module" src="${uSite}/lib/foundOnTheInternet/sha1.js" async></script>`);


  var objOut={strLang, coordApprox, UrlOAuth, response_type, strReCaptchaSiteKey, uRecaptcha, strSalt, m2wc, nHash, VAPID_PUBLIC_KEY, boEnablePushNotification, srcServiceWorker};
  copySome(objOut, req, ['boTLS']);
  extend(objOut, {wsSha1});

  Str.push(`<script>`);
  Str.push(`var tmp=${serialize(objOut)};\n Object.assign(window, tmp);`);
  Str.push(`</script>`);


  
    // Include stylesheets
  var pathTmp='/stylesheets/style.css', vTmp=boDbgT?0:CacheUri[pathTmp].eTag;    Str.push(`<link rel="stylesheet" href="${pathTmp}?v=${vTmp}" type="text/css" >`);

    // Include site specific JS-files
  //var keyCache=siteName+'/'+leafSiteSpecific, vTmp=boDbgT?0:CacheUri[keyCache].eTag;  Str.push(`<script type="module" src="${uSite}/${leafSiteSpecific}?v=${vTmp}" ></script>`);

    // Include JS-files
  var StrTmp=[siteName+'_'+leafSiteSpecific, 'lib.js', 'libClient.js', 'lang/en.js', 'filter.js'];
  for(var i=0;i<StrTmp.length;i++){
    var pathTmp='/'+StrTmp[i], vTmp=boDbgT?0:CacheUri[pathTmp].eTag;    Str.push(`<script type="module" src="${pathTmp}?v=${vTmp}" ></script>`);
  }

    // Include plugins
  Str.push(`<script> window.CreatorPlugin={};</script>`);
  var StrPlugInNArg=site.StrPlugInNArg;
  for(var i=0;i<StrPlugInNArg.length;i++){
    var nameT=StrPlugInNArg[i], n=nameT.length, charRoleUC=nameT[n-1]; if(charRoleUC=='B' || charRoleUC=='S') {nameT=nameT.substr(0, n-1);} else charRoleUC='';
    var Name=ucfirst(nameT); 
    var pathTmp=`/plugin${Name}.js`, vTmp=boDbgT?0:CacheUri[pathTmp].eTag;    Str.push(`<script type="module" src="${pathTmp}?v=${vTmp}" ></script>`);
  }

  var StrTmp=['client.js'];
  for(var i=0;i<StrTmp.length;i++){
    var pathTmp='/'+StrTmp[i], vTmp=boDbgT?0:CacheUri[pathTmp].eTag;    Str.push(`<script type="module" src="${pathTmp}?v=${vTmp}" ></script>`);
  }


  Str.push("</head>");
  Str.push(`<body>
<title>${strTitle}</title>
<div class="viewFront mainDiv">
<div id=divEntryBar class="mainDivR" style="min-height:2rem; visibility:hidden;"></div>
<h1 class=mainH1>${strH1}</h1>
<noscript><div style="text-align:center">Javascript is disabled, so this app won't work.</div></noscript>
<div class=summary style="visibility:hidden">${strSummary}</div>
</div>`); //style="display:none"
  

  Str.push(`
<form  id=formLogin style="display:none">
<section name=email><label name=email>Email</label><input type=email name=email></section>
<section name=password><label name=password>Password</label><input type=password name=password></section>
<button type=submit name=submit class=highStyle value="Sign in">Sign in</button> 
</form>
<form  id=formCreateAccount style="display:none">
<section name=name><label name=name>Full name</label><input type=text name=name></section>
<section name=email><label name=email>Email</label><input type=email name=email></section>
<section name=password><label name=password>Password</label><input type=password name=password></section>
<section name=passwordB><label name=passwordB>Password again</label><input type=password name=passwordB></section>
</form>
</body>
</html>`);  //visibility:hidden

  var str=Str.join('\n');
  //res.writeHead(200, "OK", {'Content-Type': MimeType.html});   res.end(str);    
  res.setHeader("Content-Encoding", 'gzip'); 
  res.setHeader('Content-Type', MimeType.html);  
  Streamify(str).pipe(zlib.createGzip()).pipe(res); 
}




/******************************************************************************
 * reqLoginWLink
 ******************************************************************************/
app.reqLoginWLink=async function(){
  var {req, res}=this, {site, objQS}=req; //this.pool=DB[site.db].pool;
  var {userTab}=site.TableName;
  var tmp='code'; if(!(tmp in objQS)) { res.out200(`The parameter ${tmp} is required`); return;}
  var code=objQS.code;
  //var email=await getRedis(code+'_LoginWLink');
  var [err,email]=await getRedis(code+'_LoginWLink'); 
  if(!email) {  res.out200('No such code'); return;  }
  //if(email!=inObj.email) {  res.out200('email does not match'); return; }


  var sql=`SELECT idUser FROM ${userTab} WHERE email=?;`, Val=[email];
  var [err, results]=await this.myMySql.query(sql, Val); if(err) {  res.out500(err); return; }
  if(results.length==0) { res.out200('No such email in the database'); return;}
  
  var idUser=results[0].idUser;
  await setRedis(req.sessionID+'_LoginIdUser', idUser, maxLoginUnactivity);
  //var [err,tmp]=await setRedis(req.sessionID+'_LoginIdUser',idUser, maxLoginUnactivity);

  res.end("You are now logged in, close this tab, go back the web app and reload.");
}




/******************************************************************************
 * reqImage
 ******************************************************************************/
app.reqImage=async function() {
  var {req, res}=this, {site, objQS, uSite, pathName}=req, {siteName}=site, id, kind;

  this.eTagIn=getETag(req.headers);
  var keyCache=siteName+'/'+pathName;
  if(keyCache in ETagImage && ETagImage[keyCache]===this.eTagIn) { res.out304(); return; }

  var Match=RegExp('^/image/(u|b|s)([0-9]+)$').exec(pathName);
  if(Match && Match.length>2){kind=Match[1]; id=Number(Match[2]);} else { res.out404('404 Not found'); return; }

  var {userImageTab, buyerTeamImageTab, sellerTeamImageTab}=site.TableName;
  
  var tab;
  if(kind=='u')tab=userImageTab; 
  else if(kind=='b') tab=buyerTeamImageTab;
  else if(kind=='s')tab=sellerTeamImageTab; 
  var sql = `SELECT data FROM ${tab} WHERE idUser=?`, Val=[id];
  var [err, results]=await this.myMySql.query(sql, Val);  if(err) { res.out500(err); return;}
  if(results.length>0){
    var strData=results[0].data;
    var eTag=md5(strData);
    ETagImage[keyCache]=eTag;  if(eTag===this.eTagIn) { res.out304(); return; }
    var maxAge=3600*8760, mimeType=MimeType.jpg;
    res.writeHead(200, {"Content-Type": mimeType, "Content-Length":strData.length, ETag: eTag, "Cache-Control":"public, max-age="+maxAge}); // "Last-Modified": maxModTime.toUTCString(),
    res.end(strData);
  }else{
    //res.setHeader("Content-type", MimeType.png);
    id=id%32;
    var tmp; if(kind=='u'){tmp='anonPng'; }else tmp='anonTeamPng';
    var uCommon=req.strSchemeLong+wwwCommon;
    var uNew=`${uCommon}/lib/image/${tmp}/a${id}.png`;
    res.writeHead(302, {'Location': uNew});
    res.end();
  }
}


// Need to do server-side-granting instead of client-side-granting (autherization-code-granting rather than implicit-granting). The reason for this is that I want to use window.opener.postMessage (in reqLoginBack) (postMessage is safer than window.opener.[ANY FUNCTION]). And postMessage requires you to know the subdomain of the receiver (if you want things safe). So the subdomain must be stored at the server between the call to reqLogin and reqLoginBack.

// 20230207 checking
// So response_type can be "code" or "token". "code" is the default
// locatable and idplace specifically uses "code"
// nsVote and syncameeting doesn't specify, so the default ("code") is used

/******************************************************************************
 * reqLogin
 ******************************************************************************/
app.reqLogin=async function(){
  var {req, res}=this, {objQS, uDomain, rootDomain}=req;
  var sessionIDLogin=randomHash();
  var state=randomHash(); //CSRF protection
  var {IP,caller="index"}=objQS,    objT={state, IP, caller};
  var [err]=await setRedis(sessionIDLogin+'_Login', objT, 300);   if(err) res.out500(err);
  res.replaceCookie("sessionIDLogin="+sessionIDLogin+StrSessionIDLoginProp[1])
  var uLoginBack=uDomain+"/"+leafLoginBack;
  var arrQ=["client_id="+site.client_id[IP], "redirect_uri="+encodeURIComponent(uLoginBack), "state="+state, 'display=popup', "response_type="+response_type];
  var uTmp=`${UrlOAuth.fb}?client_id=${rootDomain.fb.id}&redirect_uri=${encodeURIComponent(uLoginBack)}&state=${state}&display=popup`;
  var uTmp=UrlOAuth[IP]+"?"+arrQ.join('&');
  res.writeHead(302, {'Location': uTmp}); res.end();
}


/******************************************************************************
 * reqLoginBack
 ******************************************************************************/
app.reqLoginBack=async function(){
  var {req, res}=this, {cookies}=req;
  
  var strT=req.headers['sec-fetch-mode'];
  //if(strT && !(strT=='navigate' || strT=='same-origin')) { res.outCode(400, `sec-fetch-mode header not allowed (${strT})`); return;}
  console.log('sec-fetch-mode: '+strT);
  
  //var {sessionIDLogin}=cookies; if(!sessionIDLogin) { res.out500("!sessionIDLogin"); return; }
  //var redisVar=sessionIDLogin+'_Login'; 
  //var [err, sessionLogin]=await getRedis(redisVar,1); if(err) { res.out500(err); return; }
  //if(!sessionLogin) { res.out500('!sessionLogin');  return; }

  //var wwwLoginScopeTmp=req.site.wwwLoginScope??null;
  //var uSite=req.strSchemeLong+req.wwwSite;

  var Str=[];
  Str.push(`<!DOCTYPE html>
<html lang="en"><head><meta name='robots' content='noindex'></head>
<body>
<script>
const getCookie=(c_name)=>{
  var arr=document.cookie.split(";");
  for (var i=0;i<arr.length;i++){
    var [k,v]=arr[i].split("=");
    if (k.trim()==c_name){return unescape(v);}   
  }
}
var uSiteLogin=getCookie('uSiteLogin');
//var strBroadcastChannel=getCookie('strBroadcastChannel');
//var strBroadcastChannel='broadcastChannel_0123456789abcdef0123456789abcdef';
//var strBroadcastChannel=sessionStorage.getItem('strBroadcastChannel');
//var uSiteLogin=location.origin;
var {search:strQS, hash:strHash}=location;
debugger
//console.log('window.opener: '+window.opener)
//console.log('uSiteLogin: '+uSiteLogin)
//console.log('strBroadcastChannel: '+strBroadcastChannel)
//window.opener.postMessage(strQS, uSiteLogin);
//new BroadcastChannel(strBroadcastChannel).postMessage(strQS);
//window.close();
window.location.href=uSiteLogin+'/${leafLoginBackB}'+strQS+strHash;
</script>
</body></html>
`);
  res.setHeader('Content-Type', MimeType.html);
  var str=Str.join('\n');  res.end(str);
}

app.reqLoginBackB=async function(){
  var {req, res}=this, {cookies}=req;
  
  var strT=req.headers['sec-fetch-mode'];
  //if(strT && !(strT=='navigate' || strT=='same-origin')) { res.outCode(400, `sec-fetch-mode header not allowed (${strT})`); return;}
  console.log('sec-fetch-mode: '+strT);
  
  //var {sessionIDLogin}=cookies; if(!sessionIDLogin) { res.out500("!sessionIDLogin"); return; }
  //var redisVar=sessionIDLogin+'_Login'; 
  //var [err, sessionLogin]=await getRedis(redisVar,1); if(err) { res.out500(err); return; }
  //if(!sessionLogin) { res.out500('!sessionLogin');  return; }

  //var wwwLoginScopeTmp=req.site.wwwLoginScope??null;
  //var uSite=req.strSchemeLong+req.wwwSite;

  var Str=[];
  Str.push(`<!DOCTYPE html>
<html lang="en"><head><meta name='robots' content='noindex'></head>
<body>
<script>
const getCookie=(c_name)=>{
  var arr=document.cookie.split(";");
  for (var i=0;i<arr.length;i++){
    var [k,v]=arr[i].split("=");
    if (k.trim()==c_name){return unescape(v);}   
  }
}
//var uSiteLogin=getCookie('uSiteLogin');
var strBroadcastChannel=getCookie('strBroadcastChannel');
//var strBroadcastChannel='broadcastChannel_0123456789abcdef0123456789abcdef';
//var strBroadcastChannel=sessionStorage.getItem('strBroadcastChannel');
//var uSiteLogin=location.origin;
var {search:strQS, hash:strHash}=location;
debugger
//console.log('window.opener: '+window.opener)
//console.log('uSiteLogin: '+uSiteLogin)
//console.log('strBroadcastChannel: '+strBroadcastChannel)
//window.opener.postMessage(strQS, uSiteLogin);
new BroadcastChannel(strBroadcastChannel).postMessage(strQS);
window.close();
</script>
</body></html>
`);
  res.setHeader('Content-Type', MimeType.html);
  var str=Str.join('\n');  res.end(str);
}



app.reqVerifyEmailReturn=async function() {
  var {req, res}=this, {site, objQS}=req; //this.pool=DB[site.db].pool;
  var {userTab}=site.TableName;
  var tmp='code'; if(!(tmp in objQS)) { res.out200(`The parameter ${tmp} is required`); return;}
  var codeIn=objQS.code;
  //var idUser=await getRedis(codeIn+'_verifyEmail');
  var [err,idUser]=await getRedis(codeIn+'_verifyEmail'); 
  
  if(idUser===null) { res.out200('No such code'); return;}

  var Sql=[], Val=[];
  Sql.push(`UPDATE ${userTab} SET boEmailVerified=1 WHERE idUser=?;`);
  Val.push(idUser);

  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) {  res.out500(err); return; }

  var c=results.affectedRows, mestmp; 
  if(c==1) { mestmp="Email verified"; } else {mestmp="Error (Nothing done)"; }
  res.end(mestmp);
}

app.reqVerifyPWResetReturn=async function() {
  var {req, res}=this, {site, objQS}=req; //this.pool=DB[site.db].pool;
  var {userTab}=site.TableName;
  var tmp='code'; if(!(tmp in objQS)) { res.out200(`The parameter ${tmp} is required`); return;}
  var codeIn=objQS.code;
  //var email=await getRedis(codeIn+'_verifyPWReset');
  var [err,email]=await getRedis(codeIn+'_verifyPWReset'); 
  
  if(email===null) { res.out200('No such code'); return;}

  var password=randomHash();
  //var passwordHash=SHA1(password+strSalt);
  var hashPW=password+strSalt; for(var i=0;i<nHash;i++) hashPW=SHA1(hashPW);

  var Sql=[], Val=[];
  Sql.push(`UPDATE ${userTab} SET hashPW=? WHERE email=?;`);
  Val.push(hashPW, email);

  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) {  res.out500(err); return; }

  var c=results.affectedRows, mestmp; 
  if(c!=1) { res.out500(`Error (${c} affectedRows)`); return; }


  var wwwSite=req.wwwSite;
  var strTxt=`<h3>New password on ${wwwSite}</h3>
<p>Your new password on ${wwwSite} is ${password}</p>`;
  
  if(boDbg) wwwSite="locatabl.com";
  const msg = { to:email, from:emailRegisterdUser, subject:'Password reset', html:strTxt };

  //var [err]=await sgMail.send(msg).toNBP();
  // if(err) {res.out500(err); return; }
  // res.end("A new password has been generated and sent to your email address.");
  let sendResult=await smtpTransport.sendMail(msg)
  res.end(sendResult.response);
}

app.reqVerifyEmailNCreateUserReturn=async function() {
  var {req, res}=this, {site, objQS}=req; //this.pool=DB[site.db].pool;
  var {userTab, buyerTab, sellerTab}=site.TableName;
  
  
  var tmp='code'; if(!(tmp in objQS)) { res.out200(`The parameter ${tmp} is required`); return;}
  var codeIn=objQS.code;
  
  
  //var objT=await getRedis(codeIn+'_verifyEmailNCreateUser', true); if(!objT) { res.out200('No such code'); return;}
  var [err,value]=await getRedis(codeIn+'_verifyEmailNCreateUser'),   objT=JSON.parse(value);  if(!objT) { res.out200('No such code'); return;}
  var {name, email, password, iRole}=objT;
  name=myJSEscape(name); email=myJSEscape(email); //password=myJSEscape(password);


  var oRole=site.ORole[iRole];
  var {charRole, strRole}=oRole;
  var roleTab=iRole?sellerTab:buyerTab;

  
  var Sql=[], Val=[];
  Sql.push("SET @tNow=now();");
  Sql.push(`INSERT INTO ${userTab} (email, nameIP, displayName, hashPW, iRoleActive, tCreated) VALUES (?, ?, ?, ?, ?, @tNow) ON DUPLICATE KEY UPDATE idUser=LAST_INSERT_ID(idUser);`);
  Sql.push("SELECT @idUser:=LAST_INSERT_ID() AS idUser;");
  Val.push(email, name, name, password, iRole);
  Sql.push(`INSERT INTO ${roleTab} (idUser, tCreated, tLastPriceChange, tPos, tLastWriteOfTA, histActive) VALUES (@idUser, @tNow, @tNow, @tNow, @tNow, 1 ) ON DUPLICATE KEY UPDATE idUser=idUser;`);
  //Sql.push("SET OboInserted=(ROW_COUNT()=1);");  Sql.push("SELECT @boInserted AS boInserted;");
  Sql.push("SELECT @boInserted:=(ROW_COUNT()=1) AS boInserted;");

  Sql.push(`SELECT count(*) AS n FROM ${userTab};`);
  Sql.push(`SELECT count(*) AS n FROM ${buyerTab};`);
  Sql.push(`SELECT count(*) AS n FROM ${sellerTab};`);
  
  var sql=Sql.join('\n');
  var [err, results]=await this.myMySql.query(sql, Val); if(err) {  res.out500(err); return; }
  var c=results[1].affectedRows; if(c!=1) { res.out500(`Error (${c} affectedRows)`); return; }
  var idUser=Number(results[2][0].idUser);    await setRedis(req.sessionID+'_LoginIdUser', idUser, maxLoginUnactivity);
  
  var boIns=Number(results[4][0].boInserted);   if(iRole) site.boGotNewSellers=boIns; else site.boGotNewBuyers=boIns;
  site.nUser=Number(results[5][0].n);
  site.nTotB=Number(results[6][0].n);
  site.nTotS=Number(results[7][0].n);
  var tmp=boIns?'created':'updated';
  var Str=[`<!DOCTYPE html><html lang="en"><head>
<meta name='viewport' id='viewportMy' content='initial-scale=1'/>
</head><body>`];
  var uSite=req.strSchemeLong+req.wwwSite
  //if(boIns) Str.push(`An account has been created. Go back to <a href=\"${uSite}\">${req.wwwSite}</a>.`); else Str.push("Your account was updated."); //and you can login with the email / password you 
  if(boIns) Str.push("<b>Account created!</b><p>Now close this tab, go back, and login with your new account."); else Str.push("Your account was updated."); //and you can login with the email / password you selected
  //Str.push("<a href=\"javascript:window.open('','_self').close();\">close</a>, ");
  //Str.push(`<a href=\"${uSite}\">${req.wwwSite}</a>`);
  Str.push('</body></html>');
  res.setHeader('Content-Type', MimeType.html);
  res.end(Str.join('\n'));
}




/******************************************************************************
 * reqStatic (request for static files)
 ******************************************************************************/
app.reqStatic=async function() {
  var {req, res}=this, {site, pathName}=req, {siteName}=site;


  //var RegAllowedOriginOfStaticFile=[RegExp("^https\:\/\/(locatabl\.com|gavott\.com)")];
  //var RegAllowedOriginOfStaticFile=[RegExp("^http\:\/\/(localhost|192\.168\.0)")];
  var RegAllowedOriginOfStaticFile=[];
  setAccessControlAllowOrigin(req, res, RegAllowedOriginOfStaticFile);
  if(req.method=='OPTIONS'){ res.end(); return ;}

  var eTagIn=getETag(req.headers);
  var keyCache=pathName;
  //if(pathName==='/'+leafSiteSpecific || pathName==='/'+leafManifest) keyCache=siteName+keyCache;
  if(!(keyCache in CacheUri)){
    var filename=pathName.substr(1);
    var [err]=await readFileToCache(filename);
    if(err) {
      if(err.code=='ENOENT') {res.out404(); return;}
      if('host' in req.headers) console.error(`Faulty request to ${req.headers.host} (${pathName})`);
      if('Referer' in req.headers) console.error('Referer:'+req.headers.Referer);
      res.out500(err); return;
    }
  }
  var {buf, type, eTag, boZip, boUglify}=CacheUri[keyCache];
  if(eTag===eTagIn){ res.out304(); return; }
  var mimeType=MimeType[type];
  if(typeof mimeType!='string') console.log(`type: ${type}, mimeType: `, mimeType);
  if(typeof buf!='object' || !('length' in buf)) console.log('typeof buf: '+typeof buf);
  if(typeof eTag!='string') console.log('typeof eTag: '+eTag);
  var objHead={"Content-Type": mimeType, "Content-Length":buf.length, ETag: eTag, "Cache-Control":"public, max-age=31536000"};
  if(boZip) objHead["Content-Encoding"]='gzip';
  res.writeHead(200, objHead); // "Last-Modified": maxModTime.toUTCString(),
  res.write(buf); //, this.encWrite
  res.end();
}


/******************************************************************************
 * reqMonitor
 ******************************************************************************/
app.reqMonitor=async function(){
  var {req, res}=this, {site, objQS}=req;
  var timeCur=unixNow(), boRefresh=0;   if(site.timerNUserLast<timeCur-5*60) {boRefresh=1; site.timerNUserLast=timeCur;}
  var {siteName}=site, {userTab, sellerTab, buyerTab}=site.TableName;

  
  //if(!req.boGotSessionCookie) {res.outCode(401, "Cookie not set");  return;  }

  if(boRefresh){ 
    var Sql=[];
    //Sql.push(`SELECT count(u.idUser) AS n FROM ${userTab} u JOIN ${sellerTab} ro ON u.idUser=ro.idUser  WHERE boShow=1 AND ${sqlBoBeforeHiding};`);
    Sql.push(`SELECT count(*) AS n FROM ${buyerTab} WHERE boShow=1 AND now()<tHide;`);
    Sql.push(`SELECT count(*) AS n FROM ${buyerTab};`);
    Sql.push(`SELECT count(*) AS n FROM ${sellerTab} WHERE boShow=1 AND now()<tHide;`);
    //Sql.push(`SELECT count(*) AS n FROM ${userTab} u JOIN ${sellerTab} ro ON u.idUser=ro.idUser;`);
    Sql.push(`SELECT count(*) AS n FROM ${sellerTab};`);

    var sql=Sql.join('\n'), Val=[];
    var [err, results]=await this.myMySql.query(sql, Val); if(err){ res.out500(err); return; }
    site.nVisB=results[0][0].n;
    site.nTotB=results[1][0].n;
    site.nVisS=results[2][0].n;
    site.nTotS=results[3][0].n;
  }

  var {nVisB, nTotB, nVisS, nTotS}=site;
  var Str=[];
  Str.push(`<!DOCTYPE html>
<html lang="en"><head><meta name="robots" content="noindex"></head>`);
  //var strTotB=nTotB, strTotS=nTotS;
  //var strColor='';
  //if('admin' in objQS && objQS.admin){
    //if(boRefresh) strColor=';background-color:var(--bg-green)';
    //if(site.boGotNewBuyers) strTotB=`<span style="background-color:var(--bg-buyer)">${nTotB}</span>`;
    //if(site.boGotNewSellers) strTotS=`<span style="background-color:var(--bg-seller)">${nTotS}</span>`;
  //}
  //Str.push(`<body style="margin: 0px${strColor}">${nVisB}/${strTotB}, ${nVisS}/${strTotS}</body>`);
  
  var strColor='';
  //var strColorB='var(--bg-buyer)', strColorS='var(--bg-seller)';
  var strColorB='pink', strColorS='lightblue';
  if('admin' in objQS && objQS.admin){
    //if(boRefresh) strColor=';background-color:var(--bg-green)';
    if(boRefresh) strColor=';background-color:lightgreen';
    if(site.boGotNewBuyers) strColorB='red';
    if(site.boGotNewSellers) strColorS='blue';
  }
  var strB=`<span style="background-color:${strColorB}">${nVisB}/${nTotB}</span>`;
  var strS=`<span style="background-color:${strColorS}">${nVisS}/${nTotS}</span>`;
  Str.push(`<body style="margin: 0px${strColor}">${strB}, ${strS}</body>`);
  
  Str.push("</html>");
  
  res.removeHeader("Content-Security-Policy");
  res.setHeader('Content-Type', MimeType.html);
  var str=Str.join('\n'); res.end(str);
}



/******************************************************************************
 * reqStat (request for status of the tables)
 ******************************************************************************/

app.reqStat=async function(){
  var {req, res}=this, {site, objQS}=req;
  
  if(!req.boGotSessionCookie) {res.outCode(401, "Cookie not set");  return;  }

  var {ORole, siteName}=site;
  var {userTab, userImageTab, buyerTab, buyerTeamTab, buyerTeamImageTab, sellerTab, sellerTeamTab, sellerTeamImageTab}=site.TableName;
  
  var iRole=Number(objQS.role=='s'), iRoleAlt=1-iRole;
  var oRole=ORole[iRole], oRoleAlt=ORole[iRoleAlt];
  var {charRole, strRole}=oRole;
  var roleTab=iRole?sellerTab:buyerTab,   roleAltTab=iRole?buyerTab:sellerTab;

  var Sql=[];
  Sql.push(`SELECT count(*) AS n FROM ${userTab};`);
  Sql.push(`SELECT count(*) AS n FROM ${buyerTab};`);
  Sql.push(`SELECT count(*) AS n FROM ${sellerTab};`);
  
  //var strCols="u.idUser, idFB, image, boUseIdPImg, displayName, homeTown, currency, boShow, tPos, CONVERT(BIN(histActive),CHAR(30)) AS histActive, tLastWriteOfTA, tAccumulated, hideTimer, u.boWebPushOK"; //, idIdPlace, idOpenId
  
  var strCols="u.idUser, idFB, image, boUseIdPImg, displayName, r.homeTown, r.currency, r.boShow, r.tPos, CONVERT(BIN(r.histActive),CHAR(30)) AS histActive, r.tLastWriteOfTA, r.tAccumulated, r.hideTimer, u.boWebPushOK"; //, idIdPlace, idOpenId
  var strColAlt=", IF(a.idUser,1,'') AS "+"IsAlso"+ucfirst(oRoleAlt.strRole);

  //Sql.push(`SELECT ${strCols} FROM ${userTab} u LEFT JOIN ${roleTab} r ON u.idUser=r.idUser  UNION   SELECT ${strCols} FROM ${userTab} u RIGHT JOIN ${roleTab} r ON u.idUser=r.idUser;`);

  Sql.push(`SELECT ${strCols}${strColAlt} FROM ${roleTab} r LEFT JOIN ${userTab} u ON u.idUser=r.idUser LEFT JOIN ${roleAltTab} a ON u.idUser=a.idUser;`);
  //LEFT JOIN ${userImageTab} i ON u.idUser=u.idUser

  Sql.push(`SELECT ${strCols} FROM ${roleTab} r LEFT JOIN ${userTab} u ON u.idUser=r.idUser WHERE u.idUser IS NULL;`);
  Sql.push("SELECT now() AS now;");
  var sql=Sql.join('\n'), Val=[];
  var [err, results]=await this.myMySql.query(sql, Val); if(err){ res.out500(err); return;  }

  if('code' in objQS && objQS.code=='amfoen') {
    if(iRole) site.boGotNewSellers=0; else site.boGotNewBuyers=0;
    site.nUser=Number(results[0][0].n);
    site.nTotB=Number(results[1][0].n);
    site.nTotS=Number(results[2][0].n);
  }
  var matA=results[3], matB=results[4], curTime=results[5][0].now; 
  
  var Str=[];
  Str.push(`<!DOCTYPE html>
<html lang="en"><head>
<meta name="robots" content="noindex">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style>
table,td,tr,th {border: solid 1px;border-collapse:collapse}
thead{font-size:85%}
thead,th{position: sticky; top: 0;word-break: break-all; opacity:0.7; background-color:var(--bg-color);}
tr td:empty { background:#bbb}
</style>
</head>
<body>`);
  var nA=matA.length;
  Str.push(`${strRole} LEFT JOIN user (${nA})`);
  if(nA>0){
    var Keys=Object.keys(matA[0]);
    for(var i=0;i<matA.length;i++){
      var row=matA[i]
      var {idUser, idFB, image, boShow, boUseIdPImg, tPos, tLastWriteOfTA, tAccumulated, hideTimer, histActive, boWebPushOK}=row;

      if(idFB){  row.idFB=`<image src="https://graph.facebook.com/${idFB}/picture" title=${idFB}>`; } else row.idFB='';
      row.idUser=`<image src="/image/u${idUser}" title=${idUser}>`;
      row.boUseIdPImg=boUseIdPImg?'fr IdP':"own";
      row.boShow=boShow?'1':"";
      row.boWebPushOK=boWebPushOK?'1':"";
      if(histActive===null){ row.histActive='' } else{
        histActive=histActive.replace(/0/g,'_').replace(/1/g,'1');  row.histActive=`<font style="font-size:50%; float:right;">${histActive}</font>`;
      }
      //var [ttmp,u]=getSuitableTimeUnit((tPos-curTime)/1000); row.tPos=`<font title="${tPos}">${Math.round(ttmp)}${u}</font>`;
      var [ttmp,u]=getSuitableTimeUnit((tPos-curTime)/1000); row.tPos=`<font title="${tPos}">${Math.round(ttmp)}${u}</font>`;
      //var [ttmp,u]=getSuitableTimeUnit((tLastWriteOfTA-curTime)/1000); row.tLastWriteOfTA=`<font title="${tLastWriteOfTA}">${Math.round(ttmp)}${u}</font>`;
      var [ttmp,u]=getSuitableTimeUnit((tLastWriteOfTA-curTime)/1000); row.tLastWriteOfTA=`<font title="${tLastWriteOfTA}">${Math.round(ttmp)}${u}</font>`;

      row.image=`<image src="${image}">`;
      for(var j=0;j<Keys.length;j++){
        var key=Keys[j], t=row[key];
          // Format t
        if(t===null){ row[key]=''; continue; }
        if(/^histActive/.test(key)) {
            t=t.replace(/0/g,'_');//.replace(/1/g,'￨');
            row[key]=`<font style="font-size:50%; float:right;">${t}</font>`;
        }else if(/^(tAccumulated|hideTimer)/.test(key)) {
          var [ttmp,u]=getSuitableTimeUnit(t); row[key]=`<font title="${t}">${Math.round(ttmp)}${u}</font>`;
        }else if(t instanceof Date){
          var [ttmp,u]=getSuitableTimeUnit((t-curTime)/1000); row[key]=`<font title="${t}">${Math.round(ttmp)}${u}</font>`;
        }
      }
    }
    Str.push(makeTable(matA));
  }
  var nA=matA.length, nB=matB.length;
  Str.push(`<hr>${strRole}.idUser with no user.idUser (${nB}/${nA})`);
  Str.push(makeTable(matB));
  
  
  Str.push("</body></html>");
  var str=Str.join('\n');
  //res.end(str);
  res.setHeader("Content-Encoding", 'gzip'); 
  res.setHeader('Content-Type', MimeType.html);  
  Streamify(str).pipe(zlib.createGzip()).pipe(res); 
}



app.reqStatBoth=async function(){
  var {req, res}=this, {site, objQS}=req;
  
  if(!req.boGotSessionCookie) {res.outCode(401, "Cookie not set");  return;  }

  var {siteName}=site, {userTab, buyerTab, sellerTab}=site.TableName;

  var Sql=[];
  Sql.push(`SELECT count(*) AS n FROM ${userTab};`);
  Sql.push(`SELECT count(*) AS n FROM ${buyerTab};`);
  Sql.push(`SELECT count(*) AS n FROM ${sellerTab};`);
  
  var strColsU="u.idUser, idFB, idIdPlace, idOpenId, image, boUseIdPImg, displayName, u.boWebPushOK";
  //var strColsB="b.homeTown, b.currency, b.boShow, b.tPos, CONVERT(BIN(b.histActive),CHAR(30)) AS c_histActive, b.tLastWriteOfTA, b.tAccumulated, b.hideTimer";
  //var strColsS="s.homeTown, s.currency, s.boShow, s.tPos, CONVERT(BIN(s.histActive),CHAR(30)) AS s_histActive, s.tLastWriteOfTA, s.tAccumulated, s.hideTimer";

  var StrRoleCols=[];
  var StrColsProt=["homeTown", "currency", "boShow", "tPos", "tLastWriteOfTA", "tAccumulated", "hideTimer"];
  for(var i=0;i<2;i++){
    var strRole=i?'s':'b', StrTmp=[];
    for(var j=0;j<StrColsProt.length;j++){
      //StrTmp[j]=`${strRole}.${StrColsProt[j]} AS ${strRole}_${StrColsProt[j]}`;
      StrTmp[j]=`${strRole}.${StrColsProt[j]} AS ${strRole}_${StrColsProt[j]}`;
    }
    StrTmp.push(`CONVERT(BIN(${strRole}.histActive),CHAR(30)) AS ${strRole}_histActive`);
    StrRoleCols[i]=StrTmp.join(', ');
  }
  var [strColsB, strColsS]=StrRoleCols;
  //strColsB="b.boShow";

  Sql.push(`SELECT ${strColsU}, ${strColsB}, ${strColsS} FROM ${userTab} u LEFT JOIN ${buyerTab} b ON u.idUser=b.idUser LEFT JOIN ${sellerTab} s ON u.idUser=s.idUser;`);

  Sql.push(`SELECT ${strColsU}, ${strColsB} FROM ${userTab} u RIGHT JOIN ${buyerTab} b ON u.idUser=b.idUser WHERE u.idUser IS NULL;`);
  Sql.push(`SELECT ${strColsU}, ${strColsS} FROM ${userTab} u RIGHT JOIN ${sellerTab} s ON u.idUser=s.idUser WHERE u.idUser IS NULL;`);
  Sql.push("SELECT now() AS now;");
  var sql=Sql.join('\n'), Val=[];
  var [err, results]=await this.myMySql.query(sql, Val); if(err){ res.out500(err); return;  }
  if('code' in objQS && objQS.code=='amfoen') {
    site.boGotNewSellers=0;  site.boGotNewBuyers=0;
    site.nUser=Number(results[0][0].n);
    site.nTotB=Number(results[1][0].n);
    site.nTotS=Number(results[2][0].n);
  }
  var matA=results[3], matB=results[4], matC=results[5], curTime=results[6][0].now;
  
  var Str=[];
  Str.push(`<!DOCTYPE html>
<html lang="en"><head>
<meta name="robots" content="noindex">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style>
table,td,tr,th {border: solid 1px;border-collapse:collapse}
td:nth-child(n+9):nth-child(-n+16){background:var(--bg-buyer)}
td:nth-child(n+17){background:var(--bg-seller)}
thead{font-size:85%}
thead,th{position: sticky; top: 0;word-break: break-all; opacity:0.7; background-color:var(--bg-color);}
tr td:empty { background:#bbb !important} 
</style>
</head>
<body>`);
  var nA=matA.length;
  Str.push(`user OUTER JOIN seller (${nA})`);
  if(nA>0){
    var Keys=Object.keys(matA[0]);
    for(var i=0;i<matA.length;i++){
      var row=matA[i];
      var {idUser, image, boUseIdPImg, idFB, tPos, tLastWriteOfTA, b_tAccumulated, b_hideTimer, s_tAccumulated, s_hideTimer, histActive}=row;
      row.image=`<image src="${image}">`;
      row.boUseIdPImg=boUseIdPImg?`<div style="background:var(--bg-green)">yes</div>`:`<image style="background:var(--bg-red)" src="/image/u${idUser}">`;
      if(idFB){  row.idFB=`<image src="https://graph.facebook.com/${idFB}/picture" title=${idFB}>`; } else row.idFB='';

      for(var j=0;j<Keys.length;j++){
        var key=Keys[j], t=row[key];
          // Format t
        if(t===null){ row[key]=''; continue; }
        if(/^[bs]_(histActive)/.test(key)) {
          t=t.replace(/0/g,'_');//.replace(/1/g,'￨');
          row[key]=`<font style="font-size:50%; float:right;">${t}</font>`;
        }else if(/^[bs]_(tAccumulated|hideTimer)/.test(key)) {
          var [ttmp,u]=getSuitableTimeUnit(t); row[key]=`<font title="${t}">${Math.round(ttmp)}${u}</font>`;
        }else if(t instanceof Date){
          var [ttmp,u]=getSuitableTimeUnit((t-curTime)/1000); row[key]=`<font title="${t}">${Math.round(ttmp)}${u}</font>`;
        }
      }
    }
    Str.push(makeTable(matA));
  }
  var nB=matB.length;
  Str.push(`<hr>buyers with no user (${nB})`);
  Str.push(makeTable(matB));
  
  var nC=matC.length;
  Str.push(`<hr>sellers with no user (${nC})`);
  Str.push(makeTable(matC));
  
  
  Str.push("</body></html>");
  var str=Str.join('\n');
  //res.end(str);
  res.setHeader("Content-Encoding", 'gzip'); 
  res.setHeader('Content-Type', MimeType.html);  
  Streamify(str).pipe(zlib.createGzip()).pipe(res); 
}

app.reqStatTeam=async function(){
  var {req, res}=this, {site, objQS}=req, {siteName}=site;
  var tNow=new Date();
  
  if(!req.boGotSessionCookie) {res.outCode(401, "Cookie not set");  return;  }
  if('code' in objQS && objQS.code=='amfoen') {} else {res.outCode(401, "Not authorized");  return;  }
  
  var {userTab, userImageTab, buyerTab, buyerTeamTab, buyerTeamImageTab, sellerTab, sellerTeamTab, sellerTeamImageTab}=site.TableName;
  
  var iRole=Number(objQS.role=='s');
  var oRole=site.ORole[iRole];
  var {charRole, strRole}=oRole;
  var roleTab=iRole?sellerTab:buyerTab;
  var roleTeamTab=iRole?sellerTeamTab:buyerTeamTab;

  var Sql=[];
  Sql.push(`SELECT count(*) AS n FROM ${buyerTeamTab};`);
  Sql.push(`SELECT count(*) AS n FROM ${sellerTeamTab};`);
  Sql.push(`SELECT count(*) AS n FROM ${buyerTeamImageTab};`);
  Sql.push(`SELECT count(*) AS n FROM ${sellerTeamImageTab};`);
  
  var strCols="u.idUser, u.nameIP, s.tCreated";

  //Sql.push(`SELECT ${strCols} FROM ${userTab} u JOIN ${roleTeamTab} s ON u.idUser=s.idUser;`);
  Sql.push(`SELECT ${strCols}, COUNT(*) FROM ${userTab} u JOIN ${roleTeamTab} s ON u.idUser=s.idUser LEFT JOIN ${roleTab} rMember ON u.idUser=rMember.idTeam GROUP BY u.idUser;`);

  var sql=Sql.join('\n'), Val=[];
  var [err, results]=await this.myMySql.query(sql, Val); if(err){ res.out500(err); return;  }

  if(iRole) site.boGotNewSellers=0; else site.boGotNewBuyers=0;
  var nTotB=Number(results[0][0].n);
  var nTotS=Number(results[1][0].n);
  var nTotBI=Number(results[2][0].n);
  var nTotSI=Number(results[3][0].n);
  
  var matA=results[4];
  
  var Str=[];
  Str.push(`<!DOCTYPE html>
<html lang="en"><head>
<meta name="robots" content="noindex">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style>
table,td,tr,th {border: solid 1px;border-collapse:collapse}
thead{font-size:85%}
thead,th{position: sticky; top: 0;word-break: break-all; opacity:0.7; background-color:var(--bg-color);}
tr td:empty { background:#bbb}
</style>
</head>
<body>`);
  var nA=matA.length;
  Str.push(`user ${roleTeamTab} (${nA})`);
  for(var i=0;i<matA.length;i++){ 
    var row=matA[i], t=row.tCreated;
    var [ttmp,u]=getSuitableTimeUnit((tNow-t)/1000); row.tCreated=`<font title="${t}">${Math.round(ttmp)}${u}</font>` 
  }
  Str.push(makeTable(matA));
  

  Str.push("</body></html>");
  var str=Str.join('\n');
  //res.end(str);
  res.setHeader("Content-Encoding", 'gzip'); 
  res.setHeader('Content-Type', MimeType.html);  
  Streamify(str).pipe(zlib.createGzip()).pipe(res); 
}

  
/******************************************************************************
 * SetupSql
 ******************************************************************************/
app.SetupSql=function(argv){
  var {sql}=argv;
  this.sql=sql;
}
app.SetupSql.prototype.createTable=
app.SetupSql.prototype.dropTable=async function(siteName){
  var site=Site[siteName]; 
  
  var SqlTabDrop=[], SqlTab=[];
  var {TableName, ViewName, ORole}=site, [oB, oS]=ORole;
  //eval(extractLoc(TableName,'TableName'));
  var {sellerTab, sellerTeamTab, sellerTeamImageTab, buyerTab, buyerTeamTab, buyerTeamImageTab, userImageTab, complaintTab, adminTab, settingTab, userTab, webPushSubscriptionTab}=TableName;
  //eval(extractLoc(ViewName,'ViewName'));
  //var {histView}=site.ViewName;

  var StrTabName=object_values(TableName);
  var tmp=StrTabName.join(', ');
  SqlTabDrop.push(`DROP TABLE IF EXISTS ${siteName}_teamImage, ${siteName}_sellerImage, ${siteName}_team,${siteName}_marketer,${siteName}_payment,${siteName}_rebateCode,${siteName}_webPushSubscription`);  // temporary thing
  SqlTabDrop.push(`DROP TABLE IF EXISTS ${siteName}_binsCreated, ${siteName}_binsPosTime, ${siteName}_binsTimeAccumulated`);  // temporary thing
  SqlTabDrop.push("DROP TABLE IF EXISTS "+tmp);     
  SqlTabDrop.push('DROP TABLE IF EXISTS '+userTab);     
  var tmp=object_values(ViewName).join(', ');   if(tmp.length) SqlTabDrop.push(`DROP VIEW IF EXISTS ${tmp}`);


  //var nameDB=DB[db].nameDB;
  var collate="utf8_general_ci";
  var engine='INNODB';  //engine='MyISAM';
  var auto_increment=1;

  //var strIPEnum="ENUM('"+Prop.IP.Enum.join("', '")+"')";
  //var strIPDefault=Prop.IP.Enum[0];


    // Create users
  SqlTab.push(`CREATE TABLE ${userTab} ( 
  idUser int(4) NOT NULL auto_increment, 
  tCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  idFB varchar(128) CHARSET utf8 NULL, 
  idIdPlace varchar(128) CHARSET utf8 NULL, 
  idOpenId varchar(128) CHARSET utf8 NULL, 
  email varchar(65) CHARSET utf8 NOT NULL DEFAULT '', 
  nameIP varchar(128) CHARSET utf8 NOT NULL DEFAULT '', 
  image varchar(512) CHARSET utf8 NOT NULL DEFAULT '', 
  hashPW char(40) NOT NULL DEFAULT '', 
  imTag int(4) NOT NULL DEFAULT 0, 
  boUseIdPImg tinyint(1) NOT NULL DEFAULT 0, 
  displayName VARCHAR(32) NOT NULL DEFAULT '', 
  donatedAmount DOUBLE NOT NULL DEFAULT 0, 
  keyRemoteControl VARCHAR(32) NOT NULL DEFAULT '', 
  iSeq int(4) NOT NULL DEFAULT 0, 
  nComplaint int(4) UNSIGNED NOT NULL DEFAULT 0, 
  nComplaintCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  nComplaintGiven int(4) UNSIGNED NOT NULL DEFAULT 0, 
  nComplaintGivenCum int(4) UNSIGNED NOT NULL DEFAULT 0, 
  boWebPushOK BOOL NOT NULL DEFAULT 0,
  iRoleActive int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (idUser), 
  UNIQUE KEY (idFB), 
  UNIQUE KEY (idIdPlace), 
  UNIQUE KEY (idOpenId), 
  UNIQUE KEY (email) 
  ) AUTO_INCREMENT = ${auto_increment}, ENGINE=${engine} COLLATE ${collate}`); 
 


    // Create webPushSubscription
  SqlTab.push(`CREATE TABLE ${webPushSubscriptionTab} ( 
  idUser int(4) NOT NULL auto_increment, 
  strSubscription text CHARSET utf8 NULL, 
  PRIMARY KEY (idUser), 
  FOREIGN KEY (idUser) REFERENCES ${userTab}(idUser) ON DELETE CASCADE
  ) ENGINE=${engine} COLLATE ${collate}`); 

  //strSubscription varchar(512) CHARSET utf8 NULL, 
    // Create sellerTab
  //var StrProp=Object.keys(oS.Prop);
  var arrCols=[];
  for(var i=0;i<oS.StrOrder.length;i++){
    var name=oS.StrOrder[i], prop=oS.Prop[name], b=prop.b;
    if(Number(b[oS.bFlip.sellerTab])){
      var strType=prop.type || '';
      if(strType=='ENUM'){
        //$tmpName='enum'.ucfirst($name);
        //$arra=$$tmpName;$str=implode("','",$arra); if(count($arra)>0) $str="'$str'";
        var arra=prop.Enum, str=arra.join("','"); if(arra.length) str=`'${str}'`;
        strType=`ENUM(${str})`;
      }
      var strNull=Number(b[oS.bFlip.notNull])?'NOT NULL':'';
      var strDefault=''; 
      if('default' in prop){
        if(prop.type.toUpperCase()=='TIMESTAMP'){strDefault=prop.default;}
        else {
          if(typeof prop.default=='string') strDefault=`'${prop.default}'`; else strDefault=prop.default;
        }
        strDefault="DEFAULT "+strDefault;
      }
      //arrCols.push(`\`${name}\` ${strType} ${strNull} ${strDefault}`);
      arrCols.push(`\`${name}\` ${strType} ${strNull} ${strDefault}`);
    }//``
  }
  var strSql=arrCols.join(",\n");

  SqlTab.push(`CREATE TABLE ${sellerTab} (
  ${strSql},
  PRIMARY KEY (idUser),
  FOREIGN KEY (idUser) REFERENCES ${userTab}(idUser) ON DELETE CASCADE
  ) ENGINE=${engine} COLLATE ${collate}`); 


  if(boUseDBIndex){
      // Create SellerTab indexes
    for(var name in oS.Prop){
      var prop=oS.Prop[name], b=prop.b;
      if(Number(b[oS.bFlip.sellerTabIndex])) SqlTab.push(`CREATE INDEX ${name}Index ON ${sellerTab}(\`${name}\`)`); 
    }
  }

    // Create buyerTab
  //var StrProp=Object.keys(oB.Prop);
  var arrCols=[];
  for(var i=0;i<oB.StrOrder.length;i++){
    var name=oB.StrOrder[i], prop=oB.Prop[name], b=prop.b;
    if(Number(b[oB.bFlip.buyerTab])){
      var strType=prop.type || '';
      if(strType=='ENUM'){
        //$tmpName='enum'.ucfirst($name);
        //$arra=$$tmpName;$str=implode("','",$arra); if(count($arra)>0) $str="'$str'";
        var arra=prop.Enum, str=arra.join("','"); if(arra.length) str=`'${str}'`;
        strType=`ENUM(${str})`;
      }
      var strNull=Number(b[oB.bFlip.notNull])?'NOT NULL':'';
      var strDefault=''; 
      if('default' in prop){
        if(prop.type.toUpperCase()=='TIMESTAMP'){strDefault=prop.default;}
        else {
          if(typeof prop.default=='string') strDefault=`'${prop.default}'`; else strDefault=prop.default;
        }
        strDefault="DEFAULT "+strDefault;
      }
      //arrCols.push(`\`${name}\` ${strType} ${strNull} ${strDefault}`);
      arrCols.push(`\`${name}\` ${strType} ${strNull} ${strDefault}`);
    }//``
  }
  var strSql=arrCols.join(",\n");

  SqlTab.push(`CREATE TABLE ${buyerTab} (
  ${strSql},
  PRIMARY KEY (idUser),
  FOREIGN KEY (idUser) REFERENCES ${userTab}(idUser) ON DELETE CASCADE
  ) ENGINE=${engine} COLLATE ${collate}`); 


  if(boUseDBIndex){
      // Create BuyerTab indexes
    for(var name in oB.Prop){
      var prop=oB.Prop[name], b=prop.b;
      if(Number(b[oB.bFlip.buyerTabIndex])) SqlTab.push(`CREATE INDEX ${name}Index ON ${buyerTab}(\`${name}\`)`);
    }
  }
  
  
  
  //SqlTab.push`CREATE VIEW ${histView} (idUser, histActive, tPos) AS SELECT idUser, BIN(histActive), tPos FROM ${sellerTab}`);



  SqlTab.push(`CREATE TABLE ${settingTab} (
  name varchar(65) CHARSET utf8 NOT NULL,
  value varchar(65) CHARSET utf8 NOT NULL,
  UNIQUE KEY (name)
  ) ENGINE=${engine} COLLATE ${collate}`);


    // Create admin
  SqlTab.push(`CREATE TABLE ${adminTab} (
  idUser int(4) NOT NULL,
  boApproved tinyint(1) NOT NULL DEFAULT 0,
  tCreated TIMESTAMP default CURRENT_TIMESTAMP,
  FOREIGN KEY (idUser) REFERENCES ${userTab}(idUser) ON DELETE CASCADE,
  UNIQUE KEY (idUser)
  ) ENGINE=${engine} COLLATE ${collate}`);



    // Create complaintTab
  SqlTab.push(`CREATE TABLE ${complaintTab} (
  idComplainee  int(4) NOT NULL,
  idComplainer int(4) NOT NULL,
  comment TEXT CHARSET utf8,
  answer TEXT CHARSET utf8,
  tCreated TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
  tCommentModified TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
  tAnswerModified TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
  UNIQUE KEY (idComplainee,idComplainer),
  FOREIGN KEY (idComplainee) REFERENCES ${userTab}(idUser) ON DELETE CASCADE,
  FOREIGN KEY (idComplainer) REFERENCES ${userTab}(idUser) ON DELETE CASCADE
  ) ENGINE=${engine} COLLATE ${collate}`);



    // Create buyerTeamTab
  SqlTab.push(`CREATE TABLE ${buyerTeamTab} (
  idUser int(4) NOT NULL,
  link varchar(128) CHARSET utf8 NOT NULL DEFAULT '',
  imTag int(4) NOT NULL default 0,
  boApproved tinyint(1) NOT NULL default 0,
  tCreated TIMESTAMP default CURRENT_TIMESTAMP,
  FOREIGN KEY (idUser) REFERENCES ${userTab}(idUser) ON DELETE CASCADE,
  UNIQUE KEY (idUser)
  ) ENGINE=${engine} COLLATE ${collate}`);
  
    // Create sellerTeamTab
  SqlTab.push(`CREATE TABLE ${sellerTeamTab} (
  idUser int(4) NOT NULL,
  link varchar(128) CHARSET utf8 NOT NULL DEFAULT '',
  imTag int(4) NOT NULL default 0,
  boApproved tinyint(1) NOT NULL default 0,
  tCreated TIMESTAMP default CURRENT_TIMESTAMP,
  FOREIGN KEY (idUser) REFERENCES ${userTab}(idUser) ON DELETE CASCADE,
  UNIQUE KEY (idUser)
  ) ENGINE=${engine} COLLATE ${collate}`);

    //
    // Image tables
    //
    
  SqlTab.push(`CREATE TABLE ${userImageTab} (
  idUser int(4) NOT NULL,
  data BLOB NOT NULL,
  UNIQUE KEY (idUser),
  FOREIGN KEY (idUser) REFERENCES ${userTab}(idUser) ON DELETE CASCADE
  ) ENGINE=${engine} COLLATE ${collate}`); 


  SqlTab.push(`CREATE TABLE ${buyerTeamImageTab} (
  idUser int(4) NOT NULL,
  data BLOB NOT NULL,
  UNIQUE KEY (idUser),
  FOREIGN KEY (idUser) REFERENCES ${buyerTeamTab}(idUser) ON DELETE CASCADE
  ) ENGINE=${engine} COLLATE ${collate}`); 
  
  SqlTab.push(`CREATE TABLE ${sellerTeamImageTab} (
  idUser int(4) NOT NULL,
  data BLOB NOT NULL,
  UNIQUE KEY (idUser),
  FOREIGN KEY (idUser) REFERENCES ${sellerTeamTab}(idUser) ON DELETE CASCADE
  ) ENGINE=${engine} COLLATE ${collate}`);
  
  
  //name varchar(64) CHARSET utf8 NOT NULL,
  //boFB tinyint(1) NOT NULL,

  addBinTableSql(SqlTabDrop, SqlTab, siteName, oS.Prop, engine, collate);
  addBinTableSql(SqlTabDrop, SqlTab, siteName, oB.Prop, engine, collate);

  
  var boDropOnly=this.sql.slice(0,4)=='drop'; 
  if(boDropOnly) var Sql=SqlTabDrop;
  else var Sql=array_merge(SqlTabDrop, SqlTab);
  
  var strDelim=';', sql=Sql.join(strDelim+'\n')+strDelim, Val=[];
  var [err, results]=await this.myMySql.query(sql, Val);  if(err) {  return [err]; }
  return [null];
}


  
app.SetupSql.prototype.createFunction=
app.SetupSql.prototype.dropFunction=async function(siteName){
  var site=Site[siteName]; 

  var SqlFunctionDrop=[], SqlFunction=[];
  
  var {TableName, ViewName, ORole}=site, [oB, oS]=ORole;
  var {sellerTab, sellerTeamTab, sellerTeamImageTab, buyerTab, buyerTeamTab, buyerTeamImageTab, userImageTab, complaintTab, adminTab, settingTab, userTab}=TableName;
  //eval(extractLoc(ViewName,'ViewName'));
  //var {histView}=site.ViewName;


  //var strIPEnum="ENUM('"+Prop.IP.Enum.join("', '")+"')";
  //var strIPDefault=Prop.IP.Enum[0];


  //RShow ${siteName}TimeAccumulatedUpdOne -> UPDATE ${sellerTab} SET boShow=1, tPos=now(), hideTime=date_add(now(), INTERVALL hideTimer SECOND) WHERE idUser=id
  //RHide ${siteName}TimeAccumulatedUpdOne -> UPDATE ${sellerTab} SET boShow=0, tPos=0, hideTime=0 WHERE idUser=id
  //IFun ${siteName}TimeAccumulatedUpdMult

  // If setting boShow then one must call ${siteName}TimeAccumulatedUpdOne before. Hence tLastWriteOfTA will never be < than tPos
  var sqlTimeSinceLastWriteOfTA="UNIX_TIMESTAMP(VtNow)-UNIX_TIMESTAMP(tLastWriteOfTA)";  // tLastWriteOfTA, tPos, hideTimer are a columns in roleTab
  var sqlTWritten="UNIX_TIMESTAMP(tLastWriteOfTA)-UNIX_TIMESTAMP(tPos)"; // This variable is only used to make the expression sqlTRemaining (below) clearer
  var sqlTRemaining=`GREATEST(hideTimer-(${sqlTWritten}),0)`;
  
    // Note TimeAccumulatedUpdOne doesn't set boShow unlike TimeAccumulatedUpdMult (I think because one wants to keep the old boShow to as input to histActivity)
  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}TimeAccumulatedUpdOne`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}TimeAccumulatedUpdOne(IN IidUser INT)
      BEGIN
        DECLARE VtNow TIMESTAMP DEFAULT now();
        UPDATE ${buyerTab} SET tAccumulated=tAccumulated+LEAST(${sqlTimeSinceLastWriteOfTA},${sqlTRemaining})*boShow, tLastWriteOfTA=VtNow WHERE idUser=IidUser;
        UPDATE ${sellerTab} SET tAccumulated=tAccumulated+LEAST(${sqlTimeSinceLastWriteOfTA},${sqlTRemaining})*boShow, tLastWriteOfTA=VtNow WHERE idUser=IidUser;
      END`);

    // IFunPoll
  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}IFunPoll`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}IFunPoll(Itimer INT) BEGIN      CALL ${siteName}TimeAccumulatedUpdMult(Itimer);   CALL ${siteName}HistActiveUpdMult;   END`);
  
    // Idea of using tHide instead of tPos (or as well as tPos)  in roleTab
    // TimeAccumulatedUpdMult is only used in IFunPoll
  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}TimeAccumulatedUpdMult`);  // Update tAccumulated, tLastWriteOfTA and boShow
  SqlFunction.push(`CREATE PROCEDURE ${siteName}TimeAccumulatedUpdMult(Itimer INT)
      BEGIN
        DECLARE tLastWriteOfBoShow INT;
        DECLARE VtNow TIMESTAMP DEFAULT now();
        SELECT value INTO tLastWriteOfBoShow FROM ${settingTab} WHERE name='tLastWriteOfBoShow';
        IF UNIX_TIMESTAMP(VtNow)>tLastWriteOfBoShow+Itimer THEN
          UPDATE ${sellerTab} SET tAccumulated=tAccumulated+LEAST(${sqlTimeSinceLastWriteOfTA},${sqlTRemaining})*boShow, tLastWriteOfTA=VtNow, boShow=IF(now()<tHide,boShow,0) 
            WHERE boShow=1 AND VtNow>tHide;
          UPDATE ${buyerTab} SET tAccumulated=tAccumulated+LEAST(${sqlTimeSinceLastWriteOfTA},${sqlTRemaining})*boShow, tLastWriteOfTA=VtNow, boShow=IF(now()<tHide,boShow,0)
            WHERE boShow=1 AND VtNow>tHide;
          UPDATE ${settingTab} SET value=UNIX_TIMESTAMP(VtNow) WHERE name='tLastWriteOfBoShow';
        END IF;
      END`);

  //sPerDay=10;
  //var dayDiff=`floor( UNIX_TIMESTAMP(VtNow)/${sPerDay} )  -  floor( UNIX_TIMESTAMP(tPos)/${sPerDay} )`;
  // tLastWriteOfHA lastHistActiveWrite

  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}HistActiveUpdMult`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}HistActiveUpdMult()
    BEGIN
      DECLARE tLastWriteOfHA, recentDay, dayDiff INT;
      DECLARE VtNow TIMESTAMP DEFAULT now();
      START TRANSACTION;
      SELECT value INTO tLastWriteOfHA FROM ${settingTab} WHERE name='tLastWriteOfHA';
      SET recentDay=floor( UNIX_TIMESTAMP(VtNow)/${sPerDay} );   SET dayDiff=recentDay-tLastWriteOfHA;
      IF dayDiff>0 THEN
        UPDATE ${sellerTab} SET histActive= (histActive<<dayDiff | boShow) ${sqlMaskHistActive};
        UPDATE ${buyerTab} SET histActive= (histActive<<dayDiff | boShow) ${sqlMaskHistActive};
        UPDATE ${settingTab} SET value=recentDay WHERE name='tLastWriteOfHA';
      END IF;
      COMMIT;
    END`);


      // Create an array from keys in Prop with DBSelOne-bit set
  
  var {SqlColSelOne}=site;
  var sqlColUTmp="@idUserTmp:=idUser AS idUser, idFB, idIdPlace, idOpenId, email, nameIP, image, displayName, boUseIdPImg, imTag, boWebPushOK, keyRemoteControl, iSeq, iRoleActive";

  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}GetUserInfo`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}GetUserInfo(IidUser INT, IidFB varchar(128), IidIdPlace varchar(128), IidOpenId varchar(128), IboBuyer INT, IboSeller INT, IboBuyerTeam INT, IboSellerTeam INT, IboAdmin INT, IboComplainer INT, IboComplainee INT)
    proc_label:BEGIN
      START TRANSACTION;
      IF IidUser IS NOT NULL THEN
        SELECT SQL_CALC_FOUND_ROWS ${sqlColUTmp} FROM ${userTab} WHERE idUser=IidUser;
        IF FOUND_ROWS()=0 THEN ROLLBACK; SELECT 'idUserNotFound' AS mess; LEAVE proc_label; END IF;
      ELSEIF IidFB IS NOT NULL THEN
        SELECT SQL_CALC_FOUND_ROWS ${sqlColUTmp} FROM ${userTab} WHERE idFB=IidFB;
        IF FOUND_ROWS()=0 THEN ROLLBACK; SELECT CONCAT('idFB not found: ', IidFB) AS mess; LEAVE proc_label; END IF;
        SET IidUser=@idUserTmp;
      ELSEIF IidIdPlace IS NOT NULL THEN
        SELECT SQL_CALC_FOUND_ROWS ${sqlColUTmp} FROM ${userTab} WHERE idIdPlace=IidIdPlace;
        IF FOUND_ROWS()=0 THEN ROLLBACK; SELECT CONCAT('idIdPlace not found: ', IidIdPlace) AS mess; LEAVE proc_label; END IF;
        SET IidUser=@idUserTmp;
      ELSE
        SELECT SQL_CALC_FOUND_ROWS ${sqlColUTmp} FROM ${userTab} WHERE idOpenId=IidOpenId;
        IF FOUND_ROWS()=0 THEN ROLLBACK; SELECT CONCAT('idOpenId not found: ', IidOpenId) AS mess; LEAVE proc_label; END IF;
        SET IidUser=@idUserTmp;
      END IF;
      IF IboBuyer THEN     SELECT ${SqlColSelOne[0]} FROM (${buyerTab} ro LEFT JOIN ${buyerTeamTab} tea on tea.idUser=ro.idTeam) WHERE ro.idUser=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      IF IboSeller THEN       SELECT ${SqlColSelOne[1]} FROM (${sellerTab} ro LEFT JOIN ${sellerTeamTab} tea on tea.idUser=ro.idTeam) WHERE ro.idUser=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      IF IboBuyerTeam THEN SELECT * FROM ${buyerTeamTab} WHERE idUser=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      IF IboSellerTeam THEN   SELECT * FROM ${sellerTeamTab} WHERE idUser=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      IF IboAdmin THEN        SELECT * FROM ${adminTab} WHERE idUser=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      IF IboComplainer THEN   SELECT count(*) AS n FROM ${complaintTab} WHERE idComplainer=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      IF IboComplainee THEN   SELECT count(*) AS n FROM ${complaintTab} WHERE idComplainee=IidUser;     ELSE SELECT 1 FROM dual; END IF;
      COMMIT;
    END`);

  
  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}MakeUserTeamLeader`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}MakeUserTeamLeader(IidUser INT, IRole INT)
    proc_label:BEGIN
      DECLARE VtNow TIMESTAMP DEFAULT now();
      IF IRole THEN
        INSERT INTO ${sellerTeamTab} (idUser, tCreated, boApproved) VALUES (IidUser,VtNow,1);
      ELSE
        INSERT INTO ${buyerTeamTab} (idUser, tCreated, boApproved) VALUES (IidUser,VtNow,1);
      END IF;
    END`);
  
  // CALL MakeUserTeamLeader(16,1);
  // UPDATE taxi_seller SET idTeam=0 WHERE idUser=16;
  // DELETE FROM taxi_sellerTeam WHERE idUser=16;
  
  
  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}UpdateComplaint`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}UpdateComplaint(IidComplainee INT, IidComplainer INT, Icomment TEXT)
    proc_label:BEGIN
      DECLARE VtNow TIMESTAMP DEFAULT now();
      START TRANSACTION;
      IF Icomment IS NULL OR LENGTH(Icomment)=0 THEN
        UPDATE ${complaintTab} SET comment=NULL WHERE idComplainee=IidComplainee AND idComplainer=IidComplainer;
        DELETE FROM ${complaintTab} WHERE idComplainer=IidComplainer AND idComplainee=IidComplainee AND answer IS NULL;
        IF ROW_COUNT() THEN
          UPDATE ${userTab} SET nComplaint=GREATEST(0, nComplaint-1) WHERE idUser=IidComplainee;
          UPDATE ${userTab} SET nComplaintGiven=GREATEST(0, nComplaintGiven-1) WHERE idUser=IidComplainer;
          UPDATE ${buyerTab} SET nComplaint=GREATEST(0, nComplaint-1) WHERE idUser=IidComplainee;
          UPDATE ${buyerTab} SET nComplaintGiven=GREATEST(0, nComplaintGiven-1) WHERE idUser=IidComplainer;
          UPDATE ${sellerTab} SET nComplaint=GREATEST(0, nComplaint-1) WHERE idUser=IidComplainee;
          UPDATE ${sellerTab} SET nComplaintGiven=GREATEST(0, nComplaintGiven-1) WHERE idUser=IidComplainer;
        END IF;
        SELECT 'entry deleted' AS mess;
      ELSE
        INSERT INTO ${complaintTab} (idComplainee,idComplainer,comment,tCreated,tCommentModified) VALUES (IidComplainee,IidComplainer,Icomment,VtNow,VtNow) ON DUPLICATE KEY UPDATE comment=Icomment, tCommentModified=VtNow;
        IF ROW_COUNT()=1 THEN   # If inserted
          UPDATE ${userTab} SET nComplaint=GREATEST(0, nComplaint+1), nComplaintCum=GREATEST(0, nComplaintCum+1) WHERE idUser=IidComplainee;
          UPDATE ${userTab} SET nComplaintGiven=GREATEST(0, nComplaintGiven+1), nComplaintGivenCum=GREATEST(0, nComplaintGivenCum+1) WHERE idUser=IidComplainer;
          UPDATE ${buyerTab} SET nComplaint=GREATEST(0, nComplaint+1), nComplaintCum=GREATEST(0, nComplaintCum+1) WHERE idUser=IidComplainee;
          UPDATE ${buyerTab} SET nComplaintGiven=GREATEST(0, nComplaintGiven+1), nComplaintGivenCum=GREATEST(0, nComplaintGivenCum+1) WHERE idUser=IidComplainer;
          UPDATE ${sellerTab} SET nComplaint=GREATEST(0, nComplaint+1), nComplaintCum=GREATEST(0, nComplaintCum+1) WHERE idUser=IidComplainee;
          UPDATE ${sellerTab} SET nComplaintGiven=GREATEST(0, nComplaintGiven+1), nComplaintGivenCum=GREATEST(0, nComplaintGivenCum+1) WHERE idUser=IidComplainer;
          SELECT 'entry inserted' AS mess;
        ELSE
          SELECT 'entry updated' AS mess;
        END IF;
      END IF;
      #SELECT count(*) AS nComplaintFromComplainer FROM ${complaintTab} WHERE idComplainer=IidComplainer;
      #SELECT count(*) AS nComplaintsOnComplainee FROM ${complaintTab} WHERE idComplainee=IidComplainee;
      COMMIT;
    END`);
  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}UpdateAnswer`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}UpdateAnswer(IidComplainee INT, IidComplainer INT, Ianswer TEXT)
    proc_label:BEGIN
      START TRANSACTION;
      IF Ianswer IS NULL OR LENGTH(Ianswer)=0 THEN
        UPDATE ${complaintTab} SET answer=NULL WHERE idComplainee=IidComplainee AND idComplainer=IidComplainer;
        DELETE FROM ${complaintTab} WHERE idComplainer=IidComplainer AND idComplainee=IidComplainee AND comment IS NULL;
        IF ROW_COUNT() THEN
          UPDATE ${userTab} SET nComplaint=GREATEST(0, nComplaint-1) WHERE idUser=IidComplainee;
          UPDATE ${userTab} SET nComplaintGiven=GREATEST(0, nComplaintGiven-1) WHERE idUser=IidComplainer;
          UPDATE ${buyerTab} SET nComplaint=GREATEST(0, nComplaint-1) WHERE idUser=IidComplainee;
          UPDATE ${buyerTab} SET nComplaintGiven=GREATEST(0, nComplaintGiven-1) WHERE idUser=IidComplainer;
          UPDATE ${sellerTab} SET nComplaint=GREATEST(0, nComplaint-1) WHERE idUser=IidComplainee;
          UPDATE ${sellerTab} SET nComplaintGiven=GREATEST(0, nComplaintGiven-1) WHERE idUser=IidComplainer;
        END IF;
        SELECT 'entry deleted' AS mess;
      ELSE
        UPDATE ${complaintTab} SET answer=Ianswer WHERE idComplainee=IidComplainee AND idComplainer=IidComplainer;
        SELECT 'entry updated' AS mess;
      END IF;
      #SELECT count(*) AS nComplaintFromComplainer FROM ${complaintTab} WHERE idComplainer=IidComplainer;
      #SELECT count(*) AS nComplaintsOnComplainee FROM ${complaintTab} WHERE idComplainee=IidComplainee;
      COMMIT;
    END`);

/*
      SELECT idUser, count(*) INTO OidUser,Vc FROM ${userTab} WHERE IP=IIP AND idFB=IidFB;
      IF Vc=0 THEN
        INSERT INTO ${userTab} (IP,idFB) VALUES (IIP,IidFB);
        SELECT LAST_INSERT_ID() INTO OidUser;
      END IF;
CLIENT_FOUND_ROWS
*/


  
    //IF VcreatedA<VcreatedB THEN SET VidUserNew=VidUserA, VidUserOld=VidUserB; ELSE SET VidUserNew=VidUserB, VidUserOld=VidUserA; END IF;


  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}sellerSetup`);
  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}userSetup`);
  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}reporterSetup`);
  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}complainerSetup`);
  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}MergeID`);

/*
    SELECT idUser, count(*) INTO OidComplainer,Vc FROM ${userTab} WHERE IP=IIP AND idFB=IidFB;
      IF Vc=0 THEN
        INSERT INTO ${userTab} (IP,idFB) VALUES (IIP,IidFB);
        SELECT LAST_INSERT_ID() INTO OidComplainer;
      END IF;

      SELECT LAST_INSERT_ID() INTO OidComplainer;
*/
  //SqlFunction.push(`INSERT INTO ${userTab} (IP,idFB) VALUES ('fb',$id)`); 

  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}setPassword`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}setPassword(IidUser int(4), IpwOld VARCHAR(40), IpwNew VARCHAR(40))
    proc_label:BEGIN
      DECLARE VpwOld VARCHAR(40);
      SELECT hashPW INTO VpwOld FROM ${userTab} WHERE idUser=IidUser;
      IF FOUND_ROWS()!=1 THEN SELECT CONCAT('Found ', FOUND_ROWS(), ' users') AS mess; LEAVE proc_label; END IF;
      IF VpwOld!=IpwOld THEN SELECT 'Old password does not match' AS mess; LEAVE proc_label; END IF;
      UPDATE ${userTab} SET hashPW=IpwNew WHERE idUser=IidUser;
      SELECT 'Password changed' AS mess;
    END`);




  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}GetIdUserNSetISeq`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}GetIdUserNSetISeq(Ikey varchar(32), iSeqN INT, OUT OidUser INT, OUT OiRoleActive INT, OUT OboOK TINYINT, OUT Omess varchar(128))
    proc_label:BEGIN
      DECLARE Vc, Vn, ViSeq, Vdiff INT;
      SELECT SQL_CALC_FOUND_ROWS idUser, iRoleActive, iSeq INTO OidUser, OiRoleActive, ViSeq FROM ${userTab} WHERE keyRemoteControl=Ikey LIMIT 1;
      SET Vc=FOUND_ROWS();
      IF Vc>1 THEN SET OboOK=0, Omess=CONCAT('keyRemoteControl exist multiple times Vc=',Vc); LEAVE proc_label; END IF;
      IF Vc=0 THEN SET OboOK=0, Omess='No such keyRemoteControl stored!'; LEAVE proc_label; END IF;

      #SET Vdiff=ViSeq-iSeqN+1;
      #IF iSeqN<=ViSeq THEN SET OboOK=0, Omess=CONCAT('Sequence error, ', Vdiff, ' request(s) behind (Server=', ViSeq, ', Client=', iSeqN, ')'); LEAVE proc_label; END IF;
      #UPDATE ${userTab} SET iSeq=iSeqN WHERE idUser=OidUser;
      SET OboOK=1, Omess='';
    END`);


    // GetValuesToController should return tElapsed instead of tDiff, then one could let hideTimer unsigned int (Mysql can't have unsigned in an expression that end up negative)
  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}GetValuesToController`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}GetValuesToController(Ikey varchar(32), iSeqN INT, OUT OboShow TINYINT, OUT OhideTimer INT, OUT OtNow INT, OUT OtPos INT, OUT OtHide INT, OUT OiRoleActive INT, OUT OboOK INT, OUT Omess varchar(128))
    proc_label:BEGIN
      DECLARE Vc, Vn, VidUser, ViSeq, intMax, VtDiff INT;
      DECLARE VtNow TIMESTAMP DEFAULT now();
      SET OtNow=UNIX_TIMESTAMP(VtNow);
      CALL ${siteName}GetIdUserNSetISeq(Ikey, iSeqN, VidUser, OiRoleActive, OboOK, Omess);
      IF OboOK=0 THEN LEAVE proc_label; END IF;
      CALL ${siteName}TimeAccumulatedUpdOne(VidUser);

      IF OiRoleActive=0 THEN
        SELECT SQL_CALC_FOUND_ROWS boShow, hideTimer, UNIX_TIMESTAMP(tPos), UNIX_TIMESTAMP(tHide) INTO OboShow, OhideTimer, OtPos, Othide FROM ${buyerTab} WHERE idUser=VidUser;
      ELSE
        SELECT SQL_CALC_FOUND_ROWS boShow, hideTimer, UNIX_TIMESTAMP(tPos), UNIX_TIMESTAMP(tHide) INTO OboShow, OhideTimer, OtPos, OtHide FROM ${sellerTab} WHERE idUser=VidUser;
      END IF;
      SET Vc=FOUND_ROWS();
      IF Vc=0 THEN SET OboOK=0, Omess='No such idUser!';  LEAVE proc_label; END IF;
      SET VtDiff=OtHide-OtNow;
      IF VtDiff<0 THEN SET OboShow=0; END IF;
      SET OboOK=1, Omess='';
    END`);
    //IiRole INT, 

  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}SetValuesFromController`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}SetValuesFromController(Ikey varchar(32), iSeqN INT, Ix DOUBLE, Iy DOUBLE, Ilat DOUBLE, IboShow TINYINT, IhideTimer INT, IboSetTHide INT, OUT OiRoleActive INT, OUT OboOK TINYINT, OUT Omess varchar(128))
    proc_label:BEGIN
      DECLARE VtNow TIMESTAMP DEFAULT now();
      DECLARE Vc, Vn, VidUser, ViSeq, VresM INT;
      START TRANSACTION;
      CALL ${siteName}GetIdUserNSetISeq(Ikey, iSeqN, VidUser, OiRoleActive, OboOK, Omess);
      IF OboOK=0 THEN ROLLBACK; LEAVE proc_label; END IF;
      CALL ${siteName}TimeAccumulatedUpdOne(VidUser);

      IF IboShow=0 THEN
        IF OiRoleActive=0 THEN
          UPDATE ${buyerTab} SET boShow=IboShow, tPos=VtNow, tHide=FROM_UNIXTIME(  LEAST(UNIX_TIMESTAMP(VtNow)+hideTimer,${intMax})), histActive=histActive|1 WHERE idUser=VidUser;
        ELSE
          UPDATE ${sellerTab} SET boShow=IboShow, tPos=VtNow, tHide=FROM_UNIXTIME(  LEAST(UNIX_TIMESTAMP(VtNow)+hideTimer,${intMax})), histActive=histActive|1 WHERE idUser=VidUser;
        END IF;
        SET OboOK=1, Omess='';
      ELSE
        IF OiRoleActive=0 THEN
          SELECT SQL_CALC_FOUND_ROWS coordinatePrecisionM INTO VresM FROM ${buyerTab} WHERE idUser=VidUser;
        ELSE
          SELECT SQL_CALC_FOUND_ROWS coordinatePrecisionM INTO VresM FROM ${sellerTab} WHERE idUser=VidUser;
        END IF;
        SET Vc=FOUND_ROWS();
        IF Vc=0 THEN SET OboOK=0, Omess='No such idUser!'; ROLLBACK; LEAVE proc_label; END IF;
        IF VresM<1 THEN SET VresM=1; END IF;
        CALL roundNObscure(VresM, Ix, Iy, Ilat, Ix, Iy);

        SET @bigIntGeoHash=pWC2GeoHash(Ix, Iy);

        IF OiRoleActive=0 THEN
          UPDATE ${buyerTab} SET x=Ix, y=Iy, geoHash=@bigIntGeoHash, histActive=histActive|1, boShow=IboShow, hideTimer=IF(IhideTimer, IhideTimer, hideTimer), tPos=VtNow, 
            tHide=IF(IboSetTHide, FROM_UNIXTIME(  LEAST(UNIX_TIMESTAMP(VtNow)+hideTimer,${intMax})), tHide) 
            WHERE idUser=VidUser;
          UPDATE ${sellerTab} SET histActive=histActive|boShow, boShow=0, tPos=VtNow, tHide=VtNow WHERE idUser=VidUser;
        ELSE
          UPDATE ${buyerTab} SET histActive=histActive|boShow, boShow=0, tPos=VtNow, tHide=VtNow WHERE idUser=VidUser;
          UPDATE ${sellerTab} SET x=Ix, y=Iy, geoHash=@bigIntGeoHash, histActive=histActive|1, boShow=IboShow, hideTimer=IF(IhideTimer, IhideTimer, hideTimer), tPos=VtNow, 
            tHide=IF(IboSetTHide, FROM_UNIXTIME(  LEAST(UNIX_TIMESTAMP(VtNow)+hideTimer,${intMax})), tHide) 
            WHERE idUser=VidUser;
        END IF;
        SET OboOK=1, Omess='';
      END IF;
      COMMIT;
    END`);

  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}dupMake`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}dupMake()
      BEGIN
        CALL copyTable('${userTab}_dup','${userTab}');
        CALL copyTable('${sellerTab}_dup','${sellerTab}');
        CALL copyTable('${sellerTeamTab}_dup','${sellerTeamTab}');
        CALL copyTable('${sellerTeamImageTab}_dup','${sellerTeamImageTab}');
        CALL copyTable('${buyerTab}_dup','${buyerTab}');
        CALL copyTable('${buyerTeamTab}_dup','${buyerTeamTab}');
        CALL copyTable('${buyerTeamImageTab}_dup','${buyerTeamImageTab}');
        CALL copyTable('${userImageTab}_dup','${userImageTab}');
        CALL copyTable('${complaintTab}_dup','${complaintTab}');
        CALL copyTable('${adminTab}_dup','${adminTab}');
      END`);




  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}dupTrunkOrgNCopyBack`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}dupTrunkOrgNCopyBack()
      BEGIN
        DELETE FROM ${sellerTab} WHERE 1;
        DELETE FROM ${sellerTeamTab} WHERE 1;
        DELETE FROM ${sellerTeamImageTab} WHERE 1;
        DELETE FROM ${buyerTab} WHERE 1;
        DELETE FROM ${buyerTeamTab} WHERE 1;
        DELETE FROM ${buyerTeamImageTab} WHERE 1;
        DELETE FROM ${userImageTab} WHERE 1;
        DELETE FROM ${complaintTab} WHERE 1;
        DELETE FROM ${adminTab} WHERE 1;
        DELETE FROM ${userTab} WHERE 1;

        INSERT INTO ${userTab} SELECT * FROM ${userTab}_dup;
        INSERT INTO ${sellerTab} SELECT * FROM ${sellerTab}_dup;
        INSERT INTO ${sellerTeamTab} SELECT * FROM ${sellerTeamTab}_dup;
        INSERT INTO ${sellerTeamImageTab} SELECT * FROM ${sellerTeamImageTab}_dup;
        INSERT INTO ${buyerTab} SELECT * FROM ${buyerTab}_dup;
        INSERT INTO ${buyerTeamTab} SELECT * FROM ${buyerTeamTab}_dup;
        INSERT INTO ${buyerTeamImageTab} SELECT * FROM ${buyerTeamImageTab}_dup;
        INSERT INTO ${userImageTab} SELECT * FROM ${userImageTab}_dup;
        INSERT INTO ${complaintTab} SELECT * FROM ${complaintTab}_dup;
        INSERT INTO ${adminTab} SELECT * FROM ${adminTab}_dup;
      END`);

  SqlFunctionDrop.push(`DROP PROCEDURE IF EXISTS ${siteName}dupDrop`);
  SqlFunction.push(`CREATE PROCEDURE ${siteName}dupDrop()
      BEGIN
        DROP TABLE IF EXISTS ${sellerTab}_dup;
        DROP TABLE IF EXISTS ${sellerTeamTab}_dup;
        DROP TABLE IF EXISTS ${sellerTeamImageTab}_dup;
        DROP TABLE IF EXISTS ${buyerTab}_dup;
        DROP TABLE IF EXISTS ${buyerTeamTab}_dup;
        DROP TABLE IF EXISTS ${buyerTeamImageTab}_dup;
        DROP TABLE IF EXISTS ${userImageTab}_dup;
        DROP TABLE IF EXISTS ${complaintTab}_dup;
        DROP TABLE IF EXISTS ${adminTab}_dup;
        DROP TABLE IF EXISTS ${userTab}_dup;
      END`);

  

  var boDropOnly=this.sql.slice(0,4)=='drop'; 
  if(boDropOnly) var Sql=SqlFunctionDrop;
  else var Sql=array_merge(SqlFunctionDrop, SqlFunction);
  
  var strDelim=';', sql=Sql.join(strDelim+'\n')+strDelim, Val=[];
  var [err, results]=await this.myMySql.query(sql, Val);  if(err) {  return [err]; }
  return [null];
}

app.SetupSql.prototype.funcGen=async function(){
  var SqlFunction=[], SqlFunctionDrop=[];
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS copyTable");
  SqlFunction.push(`CREATE PROCEDURE copyTable(INameN varchar(128),IName varchar(128))
    BEGIN
      SET @q=CONCAT('DROP TABLE IF EXISTS ', INameN,';');     PREPARE stmt1 FROM @q;  EXECUTE stmt1;  DEALLOCATE PREPARE stmt1;
      SET @q=CONCAT('CREATE TABLE ',INameN,' LIKE ',IName,';');   PREPARE stmt1 FROM @q;  EXECUTE stmt1; DEALLOCATE PREPARE stmt1;
      SET @q=CONCAT('INSERT INTO ',INameN, ' SELECT * FROM ',IName,';');    PREPARE stmt1 FROM @q;  EXECUTE stmt1;  DEALLOCATE PREPARE stmt1;
    END`);


  //SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS roundXY");
  //SqlFunction.push(`CREATE PROCEDURE roundXY(resM DOUBLE, x DOUBLE, y DOUBLE, OUT Ox DOUBLE, OUT Oy DOUBLE)
    //proc_label:BEGIN
      //DECLARE resT DOUBLE;
      //DECLARE resP DOUBLE;
      //SET resT=resM;
      //IF ABS(y-128)>53.66 THEN SET resT=ROUND(resT/2); END IF;
      //IF ABS(y-128)>84.08 THEN SET resT=ROUND(resT/2); END IF;
      //SET resP=resT*${m2wc}, Ox=ROUND(x/resP)*resP, Oy=ROUND(y/resP)*resP;
    //END`);


    app.normalizeAng=function(angIn, angCenter=0, lapSize=twoPi){
      var lapSizeHalf=lapSize/2;
    
      //var upper=angCenter+lapSizeHalf, lower=angCenter-lapSizeHalf, angInRelative=angIn-angCenter;
      //var tmp, nLapsCorrection;
      //if(angIn>=upper){tmp=angInRelative+lapSizeHalf; nLapsCorrection=Math.floor(tmp/lapSize);}
      //else if(angIn<lower){tmp=angInRelative+lapSizeHalf; nLapsCorrection=Math.floor(tmp/lapSize);}
      //else return [angIn,0];
      
      var upper=angCenter+lapSizeHalf, lower=angCenter-lapSizeHalf;   if(angIn<upper && angIn>=lower){return [angIn,0];}
      var angInRelative=angIn-angCenter;  // angInRelative: angIn relative to angCenter
      var tmp=angInRelative+lapSizeHalf, nLapsCorrection=Math.floor(tmp/lapSize);
    
      var angOut=angIn-nLapsCorrection*lapSize;  
      return [angOut,nLapsCorrection];
    }

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS normalizeAng");
  SqlFunction.push(`CREATE PROCEDURE normalizeAng(angIn DOUBLE, angCenter DOUBLE, lapSize DOUBLE, OUT angOut DOUBLE, OUT nLapsCorrection INT)
  proc_label:BEGIN
      DECLARE lapSizeHalf, upper, lower, angInRelative, angIn_InCycle DOUBLE;
      IF angCenter IS NULL THEN SET angCenter=0; END IF;
      IF lapSize IS NULL THEN SET lapSize=${twoPi}; END IF;
      SET lapSizeHalf=lapSize/2;
      SET upper=angCenter+lapSizeHalf, lower=angCenter-lapSizeHalf;
      IF angIn<upper && angIn>=lower THEN SET angOut=angIn, nLapsCorrection=0; LEAVE proc_label; END IF;
      SET angInRelative=angIn-angCenter;
      SET angIn_InCycle=angInRelative+lapSizeHalf, nLapsCorrection=FLOOR(angIn_InCycle/lapSize);
      SET angOut=angIn-nLapsCorrection*lapSize; 
    END`);

  SqlFunctionDrop.push("DROP FUNCTION IF EXISTS resM2resP");
  SqlFunctionDrop.push("DROP FUNCTION IF EXISTS resM2resWC");
  SqlFunction.push(`CREATE FUNCTION resM2resWC(resM DOUBLE, lat DOUBLE) RETURNS DOUBLE DETERMINISTIC
    BEGIN
      DECLARE resT, fac DOUBLE;
      SET fac=COS(${deg2r}*lat);
      SET resT=resM/fac;
      IF resT<1 THEN SET resT=1; END IF;
      RETURN resT*${m2wc};
    END`);
    

  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS roundXY");
  SqlFunctionDrop.push("DROP PROCEDURE IF EXISTS roundNObscure");
  SqlFunction.push(`CREATE PROCEDURE roundNObscure(resM DOUBLE, x DOUBLE, y DOUBLE, lat DOUBLE, OUT Ox DOUBLE, OUT Oy DOUBLE)
    proc_label:BEGIN
      DECLARE resP DOUBLE;
      SET resP=resM2resWC(resM,lat);
      SET Ox=ROUND(x/resP)*resP, Oy=ROUND(y/resP)*resP;

      SET @xNoise=resP*${facNoiseCoordinate}*(RAND()-0.5), @yNoise=resP*${facNoiseCoordinate}*(RAND()-0.5);
      SET Ox=Ox+@xNoise, Oy=Oy+@yNoise;
      CALL normalizeAng(Ox, 128, 256, Ox, @trash);
      CALL normalizeAng(Oy, 128, 256, Oy, @trash);
    END`);


  
  SqlFunctionDrop.push("DROP FUNCTION IF EXISTS zipperMergeInt");
  SqlFunction.push(`CREATE FUNCTION zipperMergeInt(Ia INT UNSIGNED, Ib INT UNSIGNED) RETURNS BIGINT UNSIGNED DETERMINISTIC
    BEGIN
      DECLARE strA, strB VARCHAR(32);
      DECLARE strOut VARCHAR(64);
      SET strA=LPAD(BIN(Ia),32,0), strB=LPAD(BIN(Ib),32,0);
      
      SET strOut=CONCAT(MID(strB,1,1), MID(strA,1,1), MID(strB,2,1), MID(strA,2,1),    MID(strB,3,1), MID(strA,3,1), MID(strB,4,1), MID(strA,4,1),
      MID(strB,5,1), MID(strA,5,1), MID(strB,6,1), MID(strA,6,1),       MID(strB,7,1), MID(strA,7,1), MID(strB,8,1), MID(strA,8,1),
      MID(strB,9,1), MID(strA,9,1), MID(strB,10,1), MID(strA,10,1),     MID(strB,11,1), MID(strA,11,1), MID(strB,12,1), MID(strA,12,1),
      MID(strB,13,1), MID(strA,13,1), MID(strB,14,1), MID(strA,14,1),   MID(strB,15,1), MID(strA,15,1), MID(strB,16,1), MID(strA,16,1),
      MID(strB,17,1), MID(strA,17,1), MID(strB,18,1), MID(strA,18,1),   MID(strB,19,1), MID(strA,19,1), MID(strB,20,1), MID(strA,20,1),
      MID(strB,21,1), MID(strA,21,1), MID(strB,22,1), MID(strA,22,1),   MID(strB,23,1), MID(strA,23,1), MID(strB,24,1), MID(strA,24,1),
      MID(strB,25,1), MID(strA,25,1), MID(strB,26,1), MID(strA,26,1),   MID(strB,27,1), MID(strA,27,1), MID(strB,28,1), MID(strA,28,1),
      MID(strB,29,1), MID(strA,29,1), MID(strB,30,1), MID(strA,30,1),   MID(strB,31,1), MID(strA,31,1), MID(strB,32,1), MID(strA,32,1));
  
      RETURN CONV(strOut,2,10);
    END`);
  SqlFunctionDrop.push("DROP FUNCTION IF EXISTS wc2uint32");
  SqlFunction.push(`CREATE FUNCTION wc2uint32(Ix DOUBLE) RETURNS INT UNSIGNED DETERMINISTIC
    BEGIN
      RETURN FLOOR(Ix*0x1000000); # So basically left shifting 24 (Since Ix should be below 256, the result should be within 32 bits)
    END`);
  SqlFunctionDrop.push("DROP FUNCTION IF EXISTS pWC2GeoHash");
  SqlFunction.push(`CREATE FUNCTION pWC2GeoHash(Ix DOUBLE, Iy DOUBLE) RETURNS BIGINT UNSIGNED DETERMINISTIC
    BEGIN
      SET @x=wc2uint32(Ix), @y=wc2uint32(Iy);
      RETURN zipperMergeInt(@x,@y);
    END`);

  var boDropOnly=this.sql.slice(0,4)=='drop'; 
  if(boDropOnly) var Sql=SqlFunctionDrop;
  else var Sql=array_merge(SqlFunctionDrop, SqlFunction);
  
  
  var strDelim=';', sql=Sql.join(strDelim+'\n')+strDelim, Val=[];
  var [err, results]=await this.myMySql.query(sql, Val);  if(err) {  return [err]; }
  return [null];
}

app.AddressMachine=class {
  constructor() {
    var arrAddress=this.arrAddress=[];
    //arrAddress.push({country:'Sweden', homeTown:'Uppsala', currency:'SEK', x:140.51976455111, y:74.570362445619, n:5, std:0.1});
    arrAddress.push({country:'Sweden', homeTown:'Stockholm', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
    
    if(1){
      /*
      arrAddress.push({country:'Sweden', homeTown:'Solna', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Upplands Väsby', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Sollentuna', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Nortälje', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Södertälje', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Sigtuna', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Värmdö', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Haninge', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Nynäshamn', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Nykvarn', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Ekerö', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      */
      /*arrAddress.push({country:'Sweden', homeTown:'Salem', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Botkyrka', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Huddinge', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Tyresö', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Nacka', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Lindingö', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Sundbyberg', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Järfälla', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Danderyd', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Vaxholm', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Täby', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Vallentuna', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      arrAddress.push({country:'Sweden', homeTown:'Österåker', currency:'SEK', x:140.84200964814016, y:75.28506309708814, n:5, std:0.01});
      */
      /*
      arrAddress.push({country:'Sweden', homeTown:'Göteborg', currency:'SEK', x:136.51532755738089, y:77.49346382340636, n:7, std:0.3});
      arrAddress.push({country:'Denmark', homeTown:'København', currency:'DKK', x:136.93473555466124, y:80.13125508448312, n:7, std:0.3});
      arrAddress.push({country:'Norway', homeTown:'Oslo', currency:'NOK', x:135.64994551559874, y:74.46792500635812, n:7, std:0.3});
      arrAddress.push({country:'Finland', homeTown:'Helsinki', currency:'EUR', x:145.73099340101697, y:74.05775005653538, n:7, std:0.3});
      */
    
      //arrAddress.push({country:'UK', homeTown:'London', currency:'GBP', x:127.92629919892141, y:85.11312706193192, n:10, std:0.5});
      ////arrAddress.push({country:'France', homeTown:'Paris', currency:'EUR', x:129.6294241989214, y:88.07406456193192, n:10, std:0.5});
      ////arrAddress.push({country:'Italy', homeTown:'Rom', currency:'EUR', x:136.8811346138079, y:95.13470489701334, n:10, std:0.5});
      ////arrAddress.push({country:'Spain', homeTown:'Madrid', currency:'EUR', x:125.37955748049507, y:96.54275866022407, n:10, std:0.5});
      //arrAddress.push({country:'USA', homeTown:'NY', currency:'USD', x:75.39355286293579, y:96.21422827476029, n:10, std:0.5});
      ////arrAddress.push({country:'USA', homeTown:'Chicago', currency:'USD', x:65.67872790747845, y:95.16096079575951, n:10, std:0.5});
      //arrAddress.push({country:'USA', homeTown:'LA', currency:'USD', x:43.95576759128889, y:102.2555423122189, n:10, std:0.5});
      //arrAddress.push({country:'Japan', homeTown:'Tokyo', currency:'JPY', x:227.3887757633159, y:100.80702770236107, n:10, std:0.5});
      //arrAddress.push({country:'China', homeTown:'Beijing', currency:'CNY', x:210.7708451431501, y:96.99141526807438, n:10, std:0.5});
      //arrAddress.push({country:'India', homeTown:'Mumbai', currency:'INR', x:179.7837377942387, y:114.25584433021675, n:10, std:0.5});
      //arrAddress.push({country:'ACountry', homeTown:'ATown', currency:'USD', x: 135.5377777777778, y: 1.46571534506883, n:10, std:20});
      arrAddress.push({country:'ACountry', homeTown:'ATown', currency:'USD', x: 128, y: 128, n:10, std:64});
    
    }
    var arrBucket=[]; // To make users from big cities more likely to appear than users from small cities
    for(var i=0;i<arrAddress.length;i++){
      var objT=arrAddress[i];
      //arrBucket=array_mergeM(arrBucket,array_fill(objT.n,i.toString()));
      var arrT=Array(objT.n).fill(i)
      arrBucket=arrBucket.concat(arrT);
    }
    this.arrBucket=arrBucket;
  }
  getRandomPostAddress(){
    var {arrAddress, arrBucket}=this;
    var key=arrBucket[randomInt(0, arrBucket.length-1)];
    var AddressT=extend({}, arrAddress[key]);
    AddressT.x=bound(AddressT.x+gauss_ms(0,AddressT.std),0,256-wcResolution); AddressT.y=bound(AddressT.y+gauss_ms(0,AddressT.std),0,256-wcResolution);
    //var intX=GeoHash.wc2ustr32(AddressT.x,1), intY=GeoHash.wc2ustr32(AddressT.y,1),   strGeoHash=GeoHash.int2GeoHash({x:intX, y:intY});      AddressT.geoHash=BigInt('0b'+strGeoHash); 
    var strGeoHash=GeoHash.pWC2GeoHash({x:AddressT.x, y:AddressT.y}), bigIntGeoHash=BigInt('0b'+strGeoHash);
    AddressT.geoHash=bigIntGeoHash;
    return AddressT;
  }
}


app.SetupSql.prototype.createDummy=async function(siteName){
  var nData=this.n||1;
  var site=Site[siteName];
  var {TableName, ViewName, ORole}=site;

  var {sellerTab, sellerTeamTab, sellerTeamImageTab, buyerTab, buyerTeamTab, buyerTeamImageTab, userImageTab, complaintTab, adminTab, settingTab, userTab}=TableName;
  //var {histView}=site.ViewName;
  

  var StrPlugInNArg=site.StrPlugInNArg, StrPlugIn=[];
  // for(var i=0;i<StrPlugInNArg.length;i++){
  //   var strTmp=StrPlugInNArg[i], n=strTmp.length, charLast=strTmp[n-1];
  //   if(charLast=='B' || charLast=='S') { strTmp=strTmp.substr(0,n-1); }
  //   StrPlugIn.push(strTmp); 
  // }

  var SEK2CUR={SEK:1,USD:0.14,GBP:0.1,EUR:0.12,CNY:0.72,JPY:14.37,INR:7.35,DKK:1,NOK:1}
        
  
  //merProj.fromLatLngToPoint({lat:54.6, lng:10.6})


  
  var makeEnumRandF=function(name){  var enumT=PropBucket[name].Enum; return enumT[randomInt(0, enumT.length-1)];  };
  var getRandomDate=function(diff){ var now=unixNow(), t0, t1; if(diff>0){t0=now; t1=now+diff;} else{t0=now+diff; t1=now;} return randomInt(t0, t1);}; // Random historic time in [now-diff,now]
  var makeDateRandF=function(name){ var dateSpan=PropBucket[name].dateSpan; return getRandomDate(dateSpan);};
  var makeRandSpanF=function(name){ var [tmpl,tmpu]=PropBucket[name].RandSpanData; return randomInt(tmpl,tmpu);};
  var makeRandSpanPriceF=function(name){ var [tmpl,tmpu]=PropBucket[name].RandSpanDataPrice,  tmp=randomInt(tmpl,tmpu), cur='SEK', fac=SEK2CUR[cur];  tmp=tmp*fac; return tmp;};
  var makeFixedF=function(name){ return PropBucket[name].FixedData; };


  
  var PropBucket={
    tCreated:{dateSpan:-2*8760*3600},
    donatedAmount:{RandSpanData:[0, 1000]}
  }


  var StringData=['displayName', 'tel', 'link', 'homeTown', 'currency', 'vehicleType', 'strUnitDist', 'standingByMethod', 'idDriverGovernment', 'brand', 'otherLang', 'compassPoint', 'destination', 'fixedPricePerUnitUnit', 'fruit', 'database', 'language', 'other'];

  var Sql=[];
  Sql.push(`SELECT count(*) AS n FROM ${userTab};`);
  var sql=Sql.join('\n'), Val=[];
  var [err, results]=await this.myMySql.query(sql, Val);  if(err) {  return [err]; }
  var {n:nStart}=results[0];

  var addressMachine=new AddressMachine();

  var Sql=[];
        

    //
    // Insert into userTab
    // arrUser: (user) data that is used to create buyerTab and sellerTab below
    // SqlAllU: data that is used to create the userTab
    //
  var arrUser=Array(nData), SqlAllU=Array(nData);
  for(var i=0;i<nData;i++){
    var id=nStart+i+1; 
    let strName="dummy"+id, strNameUC=ucfirst(strName), email=strName+'@example.com', donatedAmount=makeRandSpanF('donatedAmount'), iRoleActive=i%2; 
    arrUser[i]={idFB:strName, email, displayName:strNameUC, tel:"07000000"+id, iRoleActive};
 
    //var SqlT=[id, 'null', 'null', `'${strNameUC}'`, `'${email}'`, `'${strNameUC}'`, "''", `'${strNameUC}'`, donatedAmount];
    //SqlAllU[i]="("+SqlT.join(', ')+")";
    var SqlT=[id, null, null, strNameUC, email, strNameUC, "", strNameUC, donatedAmount, iRoleActive];
    var SqlT=DB.default.pool.escape(SqlT);
    SqlAllU[i]=`(${SqlT})`;

    arrUser[i]=extend(arrUser[i],addressMachine.getRandomPostAddress());
  }
  var tmp=SqlAllU.join(",\n");
  Sql.push(`INSERT INTO ${userTab} (idUser, idFB, idIdPlace, idOpenId, email, nameIP, image, displayName, donatedAmount, iRoleActive) VALUES \n${tmp}`);
  
  
  var strDelim=';', sql=Sql.join(strDelim+'\n')+strDelim, Val=[];
  var [err, results]=await this.myMySql.query(sql, Val);  if(err) {  return [err]; }


  // Columns in userTab:
  //   idUser, tCreated, idFB, idIdPlace, idOpenId, email, nameIP, image, hashPW, imTag, boUseIdPImg, displayName, donatedAmount, keyRemoteControl, iSeq, nComplaint, nComplaintCum, nComplaintGiven, nComplaintGivenCum, boWebPushOK, iRoleActive 
  



    // Roles


  for(var iRole=0;iRole<ORole.length;iRole++){
    var oRole=ORole[iRole];
    var {Prop, charRole, charRoleUC}=oRole;
    var roleTab=charRole=='b'?buyerTab:sellerTab;

    var PropBucket={
      //vehicleType:{Enum:['sedan']},
      vehicleType:{Enum:Prop.vehicleType?.Enum??['sedan']},
      
      brand:{Enum:['Volvo','Saab','VW','Toyota','Ford','Hyundai','Mercedes','Fiat','Dodge','Mazda','BMW','Audi','Lloyd','Opel','Skoda','Ferrari','Lamborgini','Seat','Chrysler','Chevrolet','Scania','Aston Martin','Bentley','Jaguar','Land Rover','Honda','Nissan','Rolls Royce']},
      link:{Enum:['example.com','www.example.com','locatabl.com','gavott.com','example.com','']},
      nPassengers:{Enum:range(2,20,1)},
      nChildSeat:{Enum:[0,1,2]}, nExtraSeat:{Enum:[0,1,2]}, nWheelChairPlaces:{Enum:[0,1,2]},
      idTeam:{Enum:[1,2,3]}, idTeamWanted:{Enum:[1,2,3]},
      strUnitDist:{Enum:["km","mile"]},
      payload:{Enum:range(0,15,0.5)},
      cuttingWidth:{Enum:range(30,150,2)},
      otherLang:{Enum:['','Matlab','Babyloninan','D']},
  
      tCreated:{dateSpan:-2*8760*3600},
      tPos:{dateSpan:-12*3600},
      tLastWriteOfTA:{dateSpan:0},
      //terminationDate:{dateSpan:4*30*24*3600},
      tLastPriceChange:{dateSpan:-30*24*3600},
      shiftEnd:{dateSpan:12*3600},
  
      tAccumulated:{RandSpanData:[0, 2*8760*3600]},
      priceStart:{RandSpanDataPrice:[20,45]},
      pricePerDist:{RandSpanDataPrice:[10,20]},
      //pricePerTravelHour:{RandSpanDataPrice:[200,400]},
      pricePerHour:{RandSpanDataPrice:[200,400]},
      idDriverGovernment:{RandSpanData:[1000,2000]},
      
      hideTimer:{FixedData:3600*24*365},
      //boShow:{Enum:[0,1]},
      boShow:{FixedData:0},
      histActive:{FixedData:1},
      coordinatePrecisionM:{FixedData:1},
      //tHide:{FixedData:""},
      
      otherContainer:{Enum:[0,1]},
      boBuyerHasEquipment:{Enum:[0,1]},
      nWindows:{Enum:range(1,30,1)},
      area:{Enum:range(1,1000,1)},
      boRoad:{Enum:[0,1]},
      boDriveWay:{Enum:[0,1]},
      boRoof:{Enum:[0,1]},
      fruit:{Enum:['apple', 'strawberry', 'cabbage']},
      database:{Enum:['mysql', 'neo4j', 'redis']},
      language:{Enum:['c', 'javascript', 'java']},
      distStartToGoal:{RandSpanData:[1000,20000]},
      price:{RandSpanDataPrice:[100,200]},
      //compassPoint,
      destination:{Enum:['Göteborg', 'Umeå', 'Oslo']},
      fixedPricePerUnit:{RandSpanDataPrice:[100,200]},
      fixedPricePerUnitUnit:{Enum:["apple","kg"]},
      //compassPoint:{Enum:['-', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']},
      //standingByMethod:{Enum:['inCar','atHome','5min','10min']}
    };

      // If there are things that are not assigned in the above "PropBucket" then assign them from the prop.
    for(var name in Prop){
      var prop=Prop[name];
      if(!(name in PropBucket)){
        PropBucket[name]={};
        if('Enum' in prop) PropBucket[name].Enum=prop.Enum.concat([]);
      }
    }


    var arrAssign=[]; // arrAssign: as in draw a random number from a bucket
    if(in_array("general", StrPlugInNArg)){ 
      arrAssign=['boShow', 'tCreated', 'tPos', 'hideTimer', 'tHide', 'histActive', 'tLastWriteOfTA', 'tAccumulated', 'tel', 'link', 'homeTown', 'currency', 'tLastPriceChange', 'x', 'y', 'geoHash', 'idTeam', 'idTeamWanted', 'coordinatePrecisionM'];
      if(charRole=='s') arrAssign.push('experience');
    }

    if(in_array("vehicleType"+charRoleUC, StrPlugInNArg)){ arrAssign.push('vehicleType');  }
    if(in_array("distNTimePrice", StrPlugInNArg) && charRole=='s'){ arrAssign.push('priceStart', 'strUnitDist', 'pricePerDist', 'pricePerHour');  }
    if(in_array("transportBuyer", StrPlugInNArg) && charRole=='b'){ arrAssign.push('distStartToGoal', 'compassPoint', 'destination'); }
    if(in_array("standingByMethod", StrPlugInNArg) && charRole=='s'){  arrAssign.push('standingByMethod');   }
    if(in_array("shiftEnd", StrPlugInNArg) && charRole=='s'){ arrAssign.push('shiftEnd');  }
    if(in_array("hourlyPrice"+charRoleUC, StrPlugInNArg)){   arrAssign.push('pricePerHour');    }
    if(in_array("price"+charRoleUC, StrPlugInNArg)){   arrAssign.push('price');    }

    if(in_array("fixedPricePerUnit", StrPlugInNArg) && charRole=='b'){  arrAssign.push('fixedPricePerUnit', 'fixedPricePerUnitUnit');}

    if(in_array("taxi", StrPlugInNArg)){
      array_mergeM(arrAssign, site.StrPropE);
      if(charRole=='s') array_mergeM(arrAssign, oRole.StrPropE);
    }
    if(in_array("transport", StrPlugInNArg)){
      array_mergeM(arrAssign, site.StrPropE); //['payload'], StrTmp
      var StrTmp=site.StrTransportBool;
      for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1]; }
      if(charRole=='s') array_mergeM(arrAssign, oRole.StrPropE);
    }
    if(in_array("vehicledriver", StrPlugInNArg)){
      array_mergeM(arrAssign, site.StrPropE);

      var StrTmp=oRole.StrBool;
      for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1]; }
      var StrTmp=oRole.StrPropE;
      array_mergeM(arrAssign, StrTmp);
      if(charRole=='s') arrValRemove(arrAssign, 'experience');
    }
    if(intersectBool(["cleaner"], StrPlugInNArg)){ 
      if(charRole=='b') { 
        var StrTmp=oRole.StrPropE;
        for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1]; }
        array_mergeM(arrAssign, StrTmp);
      }
    }
    if(intersectBool(["windowcleaner"], StrPlugInNArg)){ 
      if(charRole=='b') array_mergeM(arrAssign, oRole.StrPropE); // 'nWindows', 'boBuyerHasEquipment'
      if(charRole=='s') { 
        var StrTmp=oRole.StrPropE;
        for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1]; }
        array_mergeM(arrAssign, StrTmp);
      }
    }
    if(in_array("lawnmowing", StrPlugInNArg)){ 
      if(charRole=='b') array_mergeM(arrAssign, oRole.StrPropE);   // 'area', 'boBuyerHasEquipment'
      if(charRole=='s') { 
        var StrTmp=oRole.StrBool;
        for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1]; }
        array_mergeM(arrAssign, StrTmp, ['cuttingWidth']);
      }
    }
    if(in_array("snowremoval", StrPlugInNArg)){
      if(charRole=='b') {
        var StrTmp=oRole.StrBool;  //
        for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1]; }
        array_mergeM(arrAssign, StrTmp, ['area']);
      }
      if(charRole=='s') { 
        var StrTmp=oRole.StrBool;
        for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1]; }
        array_mergeM(arrAssign, StrTmp);
      }
    }
    if(in_array("fruitpicker", StrPlugInNArg)){ 
      if(charRole=='b') arrAssign.push('fruit');
    }
    if(in_array("programmer", StrPlugInNArg)){ 
      if(charRole=='b') arrAssign.push('database', 'language');
      if(charRole=='s') { 
        var StrTmp=oRole.StrProgrammerLang;
        for(var i=0;i<StrTmp.length;i++){ var name=StrTmp[i]; PropBucket[name].Enum=[0,1,2,3,4,5]; }
        array_mergeM(arrAssign, StrTmp, ['otherLang']);
        arrValRemove(arrAssign, 'experience');
      }
    }


    var SqlAllRole=Array(nData);

    for(var i=0;i<nData;i++){
      var id=nStart+i+1; 
      var StrName=[];
      var StrIns=[];
      for(var j=0;j<arrAssign.length;j++){
        var name=arrAssign[j], prop=Prop[name], QMark="?", value=0;
        if(name in arrUser[i]) value=arrUser[i][name]; 
        //if(name in person) value=person[name]; 
        //else if(name in AddressT) value=AddressT[name];
        else if('Enum' in PropBucket[name]){ value=makeEnumRandF(name);  }
        else if('dateSpan' in PropBucket[name]){ value=makeDateRandF(name);  }
        else if('RandSpanData' in PropBucket[name]){ value=makeRandSpanF(name);  }
        else if('RandSpanDataPrice' in PropBucket[name]){ value=makeRandSpanPriceF(name);  }
        else if('FixedData' in PropBucket[name]){ value=makeFixedF(name);  }
        if(name in Prop && 'roleUpdF' in prop){ [QMark]=prop.roleUpdF.call(Prop,name,value);  }
        var valT=QMark.replace(/\?/,value);     
        if(in_array(name,StringData) && value!==null){ valT=`'${valT}'`;}
        
        StrName.push(`\`${name}\``);
        StrIns.push(valT);
      }
      var strName=StrName.join(', ');
      var strIns=StrIns.join(', ');  

      var sqlCurRole=`(${id}, ${strIns})`;

      SqlAllRole[i]=sqlCurRole;
      
    }

    var Sql=[];
    var tmp=SqlAllRole.join(",\n");
    Sql.push(`INSERT INTO ${roleTab} (idUser, ${strName}) VALUES \n${tmp}`);


    var strDelim=';', sql=Sql.join(strDelim+'\n')+strDelim, Val=[];
    var [err, results]=await this.myMySql.query(sql, Val);  if(err) {  return [err]; }


  } // end of loop through ORole
  

  var Sql=[];
  Sql.push(`UPDATE ${buyerTab} r JOIN ${userTab} u ON r.idUser=u.idUser SET r.nComplaint=u.nComplaint, r.nComplaintCum=u.nComplaintCum,  r.nComplaintGiven=u.nComplaintGiven, r.nComplaintGivenCum=u.nComplaintGivenCum, r.donatedAmount=u.donatedAmount, r.boShow=(u.iRoleActive=0)`);
  Sql.push(`UPDATE ${sellerTab} r JOIN ${userTab} u ON r.idUser=u.idUser SET r.nComplaint=u.nComplaint, r.nComplaintCum=u.nComplaintCum,  r.nComplaintGiven=u.nComplaintGiven, r.nComplaintGivenCum=u.nComplaintGivenCum, r.donatedAmount=u.donatedAmount, r.boShow=(u.iRoleActive=1)`);
  
  var strDelim=';', sql=Sql.join(strDelim+'\n')+strDelim, Val=[];
  var [err, results]=await this.myMySql.query(sql, Val);  if(err) {  return [err]; }
  return [null];
}

app.SetupSql.prototype.addDummyComplaints=async function(siteName){
  var site=Site[siteName];
  var {TableName, ViewName, ORole}=site;
  var {sellerTab, sellerTeamTab, sellerTeamImageTab, buyerTab, buyerTeamTab, buyerTeamImageTab, userImageTab, complaintTab, adminTab, settingTab, userTab}=TableName;
  
  var nStart=0;
  var Sql=[]
    // Insert into complaintTab
  var IdComplainer=[2, 3, 4];
  var StrComplaint=['He never answered the phone', 'No good', 'Bad bad bad'];
  var StrAns=['I was on the toilet', "Sorry, it was my first time.", ''];
  var nComplainer=IdComplainer.length;
  for(var j=0;j<10;j++){ //loop through drivers
    for(var i=0;i<nComplainer;i++){
      var idComplainer=IdComplainer[i], iComplaint=(i+j)%nComplainer, strRep=StrComplaint[iComplaint], iAns=(i+2*j)%nComplainer, strAns=StrAns[iAns];
      Sql.push(`INSERT INTO ${complaintTab} (idComplainee, idComplainer, comment, answer, tCreated, tCommentModified, tAnswerModified) SELECT idUser, ${idComplainer}, "${strRep}", "${strAns}", now(), now(), now() FROM ${userTab} WHERE idUser%10=${j} AND idUser>${nStart}`);
    }
  }
  var strDelim=';', sql=Sql.join(strDelim+'\n')+strDelim, Val=[];
  var [err, results]=await this.myMySql.query(sql, Val);  if(err) {  return [err]; }
  
  var Sql=[]
    // Update nComplaint, nComplaintCum, nComplaintGiven and nComplaintGivenCum
  Sql.push(`DROP TABLE IF EXISTS tmp`);
  Sql.push(`CREATE TEMPORARY TABLE tmp AS SELECT idComplainee, COUNT(*) AS n FROM ${complaintTab} c GROUP BY c.idComplainee`);
  Sql.push(`UPDATE ${userTab} u JOIN tmp ON u.idUser=tmp.idComplainee SET u.nComplaint = n, u.nComplaintCum = n`);
  Sql.push(`UPDATE ${buyerTab} u JOIN tmp ON u.idUser=tmp.idComplainee SET u.nComplaint = n, u.nComplaintCum = n`);
  Sql.push(`UPDATE ${sellerTab} u JOIN tmp ON u.idUser=tmp.idComplainee SET u.nComplaint = n, u.nComplaintCum = n`);
  
  Sql.push(`DROP TABLE IF EXISTS tmp`);
  Sql.push(`CREATE TEMPORARY TABLE tmp AS SELECT idComplainer, COUNT(*) AS n FROM ${complaintTab} c GROUP BY c.idComplainer`);
  Sql.push(`UPDATE ${userTab} u JOIN tmp ON u.idUser=tmp.idComplainer SET u.nComplaintGiven = n, u.nComplaintGivenCum = n`);
  Sql.push(`UPDATE ${buyerTab} u JOIN tmp ON u.idUser=tmp.idComplainer SET u.nComplaintGiven = n, u.nComplaintGivenCum = n`);
  Sql.push(`UPDATE ${sellerTab} u JOIN tmp ON u.idUser=tmp.idComplainer SET u.nComplaintGiven = n, u.nComplaintGivenCum = n`);
  
  var strDelim=';', sql=Sql.join(strDelim+'\n')+strDelim, Val=[];
  var [err, results]=await this.myMySql.query(sql, Val);  if(err) {  return [err]; }
  return [null];
  
}

app.SetupSql.prototype.truncate=
app.SetupSql.prototype.truncateAllExceptSetting=async function(siteName){
  var {sql}=this;
  var boSkippSetting=sql=='truncateAllExceptSetting';
  var site=Site[siteName];
  
  var Sql=[];
  var TableNameTmp=extend({}, site.TableName);
  if(boSkippSetting) delete TableNameTmp.settingTab;

  var StrTabName=object_values(site.TableName);

  var SqlTmp=[];
  for(var i=0;i<StrTabName.length;i++){
    SqlTmp.push(StrTabName[i]+" WRITE");
  }
  Sql.push('SET FOREIGN_KEY_CHECKS=0');
  var tmp="LOCK TABLES "+SqlTmp.join(', ');
  Sql.push(tmp);
  for(var i=0;i<StrTabName.length;i++){
    Sql.push("DELETE FROM "+StrTabName[i]);
    Sql.push(`ALTER TABLE ${StrTabName[i]} AUTO_INCREMENT = 1`);
  }
  Sql.push('UNLOCK TABLES');
  Sql.push('SET FOREIGN_KEY_CHECKS=1');
  
  var strDelim=';', sql=Sql.join(strDelim+'\n')+strDelim, Val=[];
  var [err, results]=await this.myMySql.query(sql, Val);  if(err) {  return [err]; }
  return [null];
}


app.SetupSql.prototype.populateSetting=async function(siteName){
  var site=Site[siteName]; 
  var Sql=[];
  var {TableName}=site, {settingTab}=TableName;

  Sql.push(`INSERT INTO ${settingTab} VALUES
  ('tLastWriteOfHA', floor( UNIX_TIMESTAMP(now())/${sPerDay} )),
  ('tLastWriteOfBoShow', 0),
  ('boAllowEmailAccountCreation', '0')`); 
  //('boShowTeam', '0'),
  //('nUser', '0'),
  //('boGotNewSellers', '0'),


  var strDelim=';', sql=Sql.join(strDelim+'\n')+strDelim, Val=[];
  var [err, results]=await this.myMySql.query(sql, Val);  if(err) {  return [err]; }
  return [null];
}


  // Called when --sql command line option is used
app.SetupSql.prototype.doQuery=async function(){
  var {sql}=this, strMeth=sql;
  
  if(strMeth=='createFunction' || strMeth=='dropFunction'){ 
    var [err]=await this.funcGen(); if(err){  return [err]; }  // Create common functions
  }

  var strDummyCmd='createDummy', l=strDummyCmd.length;
  if(strMeth.slice(0,l)==strDummyCmd){ 
    this.n=parseInt(strMeth.slice(l)||'1'); strMeth=strDummyCmd;
  }

  if(StrValidSqlCalls.indexOf(strMeth)==-1){var tmp=strMeth+' is not valid input, try any of these: '+StrValidSqlCalls.join(', '); return [new ErrorWLab('erraticInput', tmp)]; }

  for(var iSite=0;iSite<SiteName.length;iSite++){
    var siteName=SiteName[iSite];
    console.log(siteName);
    var [err]=await this[strMeth](siteName);  if(err){  return [err]; }
  }
  return [null];
}

var writeMessTextOfMultQuery=function(Sql, err, results){
  var nSql=Sql.length, nResults='(single query)'; if(results instanceof Array) nResults=results.length;
  console.log(`nSql=${nSql}, nResults=${nResults}`);
  var StrMess=[];
  if(err){
    StrMess.push(`err.index: ${err.index}, err: ${err}`);
    if(nSql==nResults){
      var tmp=Sql.slice(bound(err.index-1,0,nSql), bound(err.index+2,0,nSql)),  sql=tmp.join('\n');
      StrMess.push('Since "Sql" and "results" seem correctly aligned (has the same size), then 3 queries are printed (the preceding, the indexed, and following query (to get a context)):\n'+sql); 
    }
    console.log(StrMess.join('\n'));
  }
}

app.createDumpCommand=function(){ 
  var strCommand='', StrTabType=['seller','sellerTeam','sellerTeamImage','buyer','buyerTeam','buyerTeamImage','userImage','complaint','admin','setting','user'];
  for(var i=0;i<StrTabType.length;i++){
    var strTabType=StrTabType[i], StrTab=[];
    for(var j=0;j<SiteName.length;j++){
      var siteName=SiteName[j];
      StrTab.push(siteName+'_'+strTabType);
    }
    strCommand+='          '+StrTab.join(' ');
  }
  strCommand=`mysqldump mmm --user=root -p --no-create-info --hex-blob${strCommand}          >tracker.sql`;

  return strCommand;
}


/*
CREATE DATABASE ip2location;
USE ip2location;

CREATE TABLE `ip2location_db1`(
  `ip_from` INT(10) UNSIGNED,
  `ip_to` INT(10) UNSIGNED,
  `country_code` CHAR(2),
  `country_name` VARCHAR(64),
  INDEX `idx_ip_from` (`ip_from`),
  INDEX `idx_ip_to` (`ip_to`),
  INDEX `idx_ip_from_to` (`ip_from`, `ip_to`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

LOAD DATA LOCAL
  INFILE '/home/magnus/Downloads/IP2LOCATION-LITE-DB1.CSV/IP2LOCATION-LITE-DB1.CSV'
INTO TABLE
  `ip2location_db1`
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 0 LINES;



CREATE TABLE `countries`(
  `country_code` CHAR(2),
  `longitude` float,
  `latitude` float,
  `name` VARCHAR(128),
   
  INDEX `idx_country_code` (`country_code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin


LOAD DATA LOCAL
  INFILE '/home/magnus/Downloads/IP2LOCATION-LITE-DB1.CSV/countries.txt'
INTO TABLE
  `countries`
FIELDS TERMINATED BY '\t'
ENCLOSED BY ''
LINES TERMINATED BY '\n'
IGNORE 0 LINES;


SELECT * FROM ip2location_db1 WHERE country_code='-'

SELECT * FROM ip2location_db1 ip LEFT JOIN countries c ON ip.country_code=c.country_code WHERE c.country_code IS NULL
SELECT * FROM ip2location_db1 ip LEFT JOIN countries c ON ip.country_code=c.country_code WHERE c.country_code IS NULL AND ip.country_code!='-'
SELECT * FROM ip2location_db1 ip LEFT JOIN countries c ON ip.country_code=c.country_code WHERE c.country_code IS NULL AND ip.country_code!='-' GROUP BY ip.country_code


SET @a=79, @b=136, @c=116, @d=124;
SET @ip=(((@a*256+@b)*256)+@c)*256+@d;
SELECT @a, @b, @c, @d, @ip;
SELECT * FROM ip2location_db1 ip LEFT JOIN countries c ON ip.country_code=c.country_code WHERE @ip>=ip.ip_from AND @ip<=ip.ip_to;

*/




