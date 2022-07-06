var makeTable = [];//记录拼图的位置
var templateObjList = [];//记录底部拼图的位置
var lisMove = document.getElementById('ul').getElementsByTagName('li');
var ulEl = document.getElementById('ul');
var ulElClinetTop = ulEl.getBoundingClientRect().top;//ul距离顶部距离
var ulLiHeigth = ulEl.getElementsByTagName('li')[0].clientHeight;
var index = 10;

init();
start();
function init(col,row){// 初始化  行、列
    col = col ? col : 3;// 默认为3
    row = row ? row : 3;// 默认为3
    var lis = document.getElementById('img').getElementsByTagName('li');
    for(var i=0; i<lis.length; i++){
        lis[i].setAttribute('class', 'img' + i);
        lis[i].setAttribute('id', i);
        lis[i].style.position =  'absolute';
        lis[i].style.height = "100px";
        lis[i].style.width = "100px";
        lis[i].style.left = i % row * 100 + (parseInt(i % row / row) + 10) + "px";
        lis[i].style.top = parseInt(i / col) * 100 + 10 + "px";
        const liClinetRect = lis[i].getBoundingClientRect();
        makeTable[i] = new Object();
        makeTable[i].left = parseInt(liClinetRect.left);
        makeTable[i].top = parseInt(liClinetRect.top);

        makeTable[i].right = parseInt(liClinetRect.left) + parseInt(lis[i].style.width);
        makeTable[i].bottom = parseInt(liClinetRect.top) + parseInt(lis[i].style.height);

        makeTable[i].middleX = (makeTable[i].left + makeTable[i].right) / 2;
        makeTable[i].middleY = (makeTable[i].top + makeTable[i].bottom) / 2;
        makeTable[i].status = false;//是否被填充
        makeTable[i].num = null;//填充的是哪个
        makeTable[i].fillNum = 0;//填充的是哪个元素
    }
}

// 拖拽
function drag(obj, currentX, currentY, successAction){
    var objClinetRect = obj.getBoundingClientRect();
    // console.log(objClinetRect)
    var templateObj = {
        left: objClinetRect.left,
        top: objClinetRect.top,
        bottom: objClinetRect.bottom,
        currentX: currentX,
        currentY: currentY,
        flag: false,
        rightFlag: false
    }
    if(objClinetRect.top === ulElClinetTop){
        templateObj.flag = true;
    }
    const id = parseInt(obj.dataset['id']);
    if(makeTable[id].status) { return }
    
    obj.style.zIndex = index++;//图片层级

    obj.addEventListener('touchmove',listener)
    function listener(e) {

        if(templateObj.rightFlag){ return};
        var nowX = e.touches[0].clientX,
        nowY = e.touches[0].clientY;
        var disX = nowX - templateObj.currentX,
        disY = nowY - templateObj.currentY;
        console.log(disY)
        if((Math.abs(disY) < 5)){
            return
        }
        if(objClinetRect.bottom + disY > ulElClinetTop) {
            if(templateObj.flag){
                disY > 100 ?  100 : disY;
                obj.style.position = 'relative';
                obj.style.top = disY + "px";
                obj.style.left = 0;
            }else{
                obj.style.position = 'relative';
                obj.style.top = 0 + "px";
                obj.style.left = 0;
            }
            
            return;
        }else{
            obj.style.position = 'fixed';
            obj.style.left = templateObj.left + disX + "px";
            obj.style.top = templateObj.top + disY + "px";
            if (e.preventDefault) {
                e.preventDefault();
                obj.style.position = 'relatvie';
            }
            templateObj.flag = false;
        }
        return false;
    }

    obj.addEventListener('touchend',touchEnd)

    function touchEnd(){
        if(obj.getBoundingClientRect().bottom > ulElClinetTop){
            obj.style.left = "0px";
            obj.style.top = "0px";
        }
        obj.removeEventListener('touchmove',listener);
        obj.removeEventListener('touchend',touchEnd);

        var oLI = getOverlay(obj);
        if(oLI !== undefined){
            var OverLay = makeTable[oLI];
            if(OverLay.status){return};
            
            if(OverLay.num !==null && OverLay.num !== parseInt(obj.dataset['id'])){//有元素被填充了
                var li = ulEl.getElementsByTagName('li')[OverLay.num];
                if (parseInt(li.style.left) === OverLay.left && parseInt(li.style.top)=== OverLay.top) {
                    li.style.left = 0;
                    li.style.top = 0;
                    li.style.position = 'relative';
                }
                
            }
            obj.style.left = OverLay.left + 'px';
            obj.style.top = OverLay.top + 'px';
            
            OverLay.num = parseInt(obj.dataset['id']);//保存所填充元素的id
            
            if(oLI === parseInt(obj.dataset['id'])){//填充正确位置则锁定
                OverLay.status = true;
            }
        }else{
            // var num = parseInt(obj.dataset['id']);
            // if(num || num === 0){
            //     makeTable[num].num = null;
            // }
        }
        if(makeTable.every(item => item.status)) { 
            setTimeout(()=> {
                alert('拼图成功啦！')
            },1000)
        }
        
    }
}

function start(){
    for(var i = 0; i< lisMove.length; i ++){
        lisMove[i].addEventListener('touchstart',function (event) { 
            drag(event.target, event.touches[0].clientX, event.touches[0].clientY, successFunction);//拖拽
         })
    }
}

//拼图成功后的提示。
var successFunction = function() {
    alert("成功");
};

//计算当前拖拽元素到哪个表格里去了
function getOverlay(_hover){
    var objClinetRect = _hover.getBoundingClientRect(); 
    var _Hover = new Object();//计算当前拖拽元素的中心点位置
    _Hover.middleX = parseInt(objClinetRect.left) + parseInt(getCss(_hover, 'width')) / 2;
    _Hover.middleY = parseInt(objClinetRect.top) + parseInt(getCss(_hover, 'height')) / 2;
    for (i = 0; i < makeTable.length; i++) {
        if ((makeTable[i].left < _Hover.middleX && _Hover.middleX < makeTable[i].right) && (makeTable[i].top < _Hover.middleY && _Hover.middleY < makeTable[i].bottom)) {
            return i;
        }
    }
}

function getCss(elementObj, key) {
    return elementObj.currentStyle ? elementObj.currentStyle[key] : window.getComputedStyle(elementObj, false)[key];
}