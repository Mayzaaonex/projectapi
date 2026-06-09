// ==================== TEXTFIT POLYFILL ====================
(function(root,factory){"use strict";if(typeof define==="function"&&define.amd){define([],factory)}else if(typeof exports==="object"){module.exports=factory()}else{root.textFit=factory()}})(typeof global==="object"?global:this,function(){"use strict";var defaultSettings={alignVert:false,alignHoriz:false,multiLine:true,detectMultiLine:true,minFontSize:6,maxFontSize:60,reProcess:true,widthOnly:false,alignVertWithFlexbox:false};return function textFit(els,options){if(!options)options={};var settings={};for(var key in defaultSettings){if(options.hasOwnProperty(key)){settings[key]=options[key]}else{settings[key]=defaultSettings[key]}}if(typeof els.toArray==="function"){els=els.toArray()}var elType=Object.prototype.toString.call(els);if(elType!=='[object Array]'&&elType!=='[object NodeList]'&&elType!=='[object HTMLCollection]'){els=[els]}for(var i=0;i<els.length;i++){processItem(els[i],settings)}};function processItem(el,settings){if(!isElement(el)||(!settings.reProcess&&el.getAttribute('textFitted'))){return false}if(!settings.reProcess){el.setAttribute('textFitted',1)}var innerSpan,originalHTML,originalWidth,originalHeight;var low,mid,high;originalHTML=el.innerHTML;originalWidth=innerWidth(el);originalHeight=innerHeight(el);if(!originalWidth||(!settings.widthOnly&&!originalHeight)){if(!settings.widthOnly)throw new Error('Set a static height and width on the target element '+el.outerHTML+' before using textFit!');else throw new Error('Set a static width on the target element '+el.outerHTML+' before using textFit!')}if(originalHTML.indexOf('textFitted')===-1){innerSpan=document.createElement('span');innerSpan.className='textFitted';innerSpan.style['display']='inline-block';innerSpan.innerHTML=originalHTML;el.innerHTML='';el.appendChild(innerSpan)}else{innerSpan=el.querySelector('span.textFitted');if(hasClass(innerSpan,'textFitAlignVert')){innerSpan.className=innerSpan.className.replace('textFitAlignVert','');innerSpan.style['height']='';el.className.replace('textFitAlignVertFlex','')}}if(settings.alignHoriz){el.style['text-align']='center';innerSpan.style['text-align']='center'}var multiLine=settings.multiLine;if(settings.detectMultiLine&&!multiLine&&innerSpan.getBoundingClientRect().height>=parseInt(window.getComputedStyle(innerSpan)['font-size'],10)*2){multiLine=true}if(!multiLine){el.style['white-space']='nowrap'}low=settings.minFontSize;high=settings.maxFontSize;var size=low;while(low<=high){mid=(high+low)>>1;innerSpan.style.fontSize=mid+'px';var innerSpanBoundingClientRect=innerSpan.getBoundingClientRect();if(innerSpanBoundingClientRect.width<=originalWidth&&(settings.widthOnly||innerSpanBoundingClientRect.height<=originalHeight)){size=mid;low=mid+1}else{high=mid-1}}if(innerSpan.style.fontSize!=size+'px')innerSpan.style.fontSize=size+'px';if(settings.alignVert){addStyleSheet();var height=innerSpan.scrollHeight;if(window.getComputedStyle(el)['position']==="static"){el.style['position']='relative'}if(!hasClass(innerSpan,"textFitAlignVert")){innerSpan.className=innerSpan.className+" textFitAlignVert"}innerSpan.style['height']=height+"px";if(settings.alignVertWithFlexbox&&!hasClass(el,"textFitAlignVertFlex")){el.className=el.className+" textFitAlignVertFlex"}}}function innerHeight(el){var style=window.getComputedStyle(el,null);return el.getBoundingClientRect().height-parseInt(style.getPropertyValue('padding-top'),10)-parseInt(style.getPropertyValue('padding-bottom'),10)}function innerWidth(el){var style=window.getComputedStyle(el,null);return el.getBoundingClientRect().width-parseInt(style.getPropertyValue('padding-left'),10)-parseInt(style.getPropertyValue('padding-right'),10)}function isElement(o){return(typeof HTMLElement==="object"?o instanceof HTMLElement:o&&typeof o==="object"&&o!==null&&o.nodeType===1&&typeof o.nodeName==="string")}function hasClass(element,cls){return(' '+element.className+' ').indexOf(' '+cls+' ')>-1}function addStyleSheet(){if(document.getElementById("textFitStyleSheet"))return;var style=[".textFitAlignVert{","position: absolute;","top: 0; right: 0; bottom: 0; left: 0;","margin: auto;","display: flex;","justify-content: center;","flex-direction: column;","}",".textFitAlignVertFlex{","display: flex;","}",".textFitAlignVertFlex .textFitAlignVert{","position: static;","}"].join("");var css=document.createElement("style");css.type="text/css";css.id="textFitStyleSheet";css.innerHTML=style;document.body.appendChild(css)}});

// ==================== SIDEBAR INIT ====================
if (typeof Sidebar !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => Sidebar.render('maker'));
}

// ==================== DOM ELEMENTS ====================
const textInput   = document.getElementById('textInput');
const textOverlay = document.getElementById('textOverlay');
const apiUrlEl    = document.getElementById('apiUrl');
let currentApiUrl = '';

// ==================== UPDATE PREVIEW ====================
function updatePreview() {
    const text = textInput.value || 'brat';
    textOverlay.innerText = text;
    textFit(textOverlay, { maxFontSize: 60 });
    const span = textOverlay.querySelector('span.textFitted');
    if (span) {
        span.style.filter = 'blur(2px)';
        span.style.webkitFilter = 'blur(2px)';
    }
    currentApiUrl = `${window.location.origin}/maker/brat?text=${encodeURIComponent(text)}`;
    apiUrlEl.textContent = currentApiUrl;
    trackUsage();
}

textInput.addEventListener('input', updatePreview);

// ==================== AUTO DOWNLOAD ====================
async function checkAutoDownload() {
    const params = new URLSearchParams(window.location.search);
    const text = params.get('text');
    if (text) {
        textInput.value = text;
        updatePreview();
        setTimeout(() => downloadImage(), 1000);
    }
}

// ==================== DOWNLOAD IMAGE ====================
async function downloadImage() {
    const container = document.getElementById('memeContainer');

    try {
        const sharpCanvas = await html2canvas(container, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false
        });

        const blurredCanvas = document.createElement('canvas');
        blurredCanvas.width = sharpCanvas.width;
        blurredCanvas.height = sharpCanvas.height;
        const ctx = blurredCanvas.getContext('2d');

        ctx.filter = 'blur(3px)';
        ctx.drawImage(sharpCanvas, 0, 0);
        ctx.filter = 'none';

        blurredCanvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'brat-sticker.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('✅ Download selesai!');
        }, 'image/png');

        trackUsage();
    } catch (e) {
        showToast('❌ Gagal!', 'error');
    }
}

// ==================== COPY URL ====================
function copyApiUrl() {
    navigator.clipboard.writeText(currentApiUrl).then(() => showToast('✅ URL disalin!'));
}

// ==================== TOAST ====================
function showToast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    if (type === 'error') t.style.background = '#ef4444';
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 2000);
}

// ==================== TRACKING ====================
let trackTimeout;
function trackUsage() {
    clearTimeout(trackTimeout);
    trackTimeout = setTimeout(async () => {
        try {
            await fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'brat' })
            });
        } catch (e) {
            let stats = JSON.parse(localStorage.getItem('api_stats') || '{"total":0,"credits":0}');
            stats.total++;
            stats.credits++;
            localStorage.setItem('api_stats', JSON.stringify(stats));
        }
    }, 500);
}

// ==================== INIT ====================
window.addEventListener('load', () => {
    updatePreview();
    checkAutoDownload();
});