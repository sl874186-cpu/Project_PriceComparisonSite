
const showList = document.querySelector(".showList")
const typeButton = document.querySelector(".button-group")
const showMoreButton = document.querySelector(".showMoreButton")
const search = document.querySelector(".search");
const crop = document.querySelector("#crop");
const showResult = document.querySelector("#js-crop-name")

let allData=[];
let showData=[];


// 表格中顯示單行提示文字
function showMessage(text) {
  showList.innerHTML = `<tr><td colspan="7" class="text-center p-3">${text}</td></tr>`;
}

// 初始化，拿到api資料
function init(){

showMessage("資料載入中，請稍候…");

axios.get("https://data.moa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx?IsTransData=1&UnitId=037")
.then(function(response){
    
    allData = response.data.filter(function (item) {
        return item.作物名稱 && item.作物名稱 !== "休市";
    });
    showMessage("請輸入並搜尋想比價的作物名稱^＿^");
})
}
init();

//渲染畫面
function renderData(data,showAll){
    if (data.length == 0) {
        showMessage("查詢不到交易資訊 QQ");
        showMoreButton.classList.add("d-none")
        return;
    }

    let list = [];
    let str =``
    
    //判斷要顯示20筆還是全部
    if (showAll) {
        list = data;
    } else {
        list = data.filter(function(item, index){
            return index < 20;
        });
    }

    list.forEach(function(item){
    str+=`
    <tr>
    <td>${item.作物名稱}</td>
    <td>${item.市場名稱}</td>
    <td>${item.上價}</td>
    <td>${item.中價}</td>
    <td>${item.下價}</td>
    <td>${item.平均價}</td>
    <td>${item.交易量}</td>
    </tr>
    `
    })
    
    showList.innerHTML = str;
    
    //如果資料內容大於20筆，出現顯示更多
    if(data.length > 20){
        showMoreButton.classList.remove("d-none")
    }else{
        showMoreButton.classList.add("d-none")
    };
}


//切換分頁標籤
typeButton.addEventListener("click",function(e){
    
    if(e.target.nodeName !== "BUTTON"){
        return
    }else if(e.target.textContent==="蔬菜"){
        console.log("點到蔬菜區了喔")
        showData = allData.filter(function(item){
            return item.種類代碼 ==="N04"
        })
        renderData(showData);

    }else if(e.target.textContent==="水果"){
        console.log("點到水果區了喔")
        showData = allData.filter(function(item){
            return item.種類代碼 ==="N05"
        })
        renderData(showData);
    }else if(e.target.textContent==="花卉"){
        console.log("點到花卉區了喔")
        showData = allData.filter(function(item){
            return item.種類代碼 ==="N06"
        })
        renderData(showData);
    }
    
})

//按下顯示更多按鈕
showMoreButton.addEventListener("click",function(e){
    renderData(showData,true);
    showMoreButton.classList.add("d-none")
})

//搜尋功能
function toSearch(){
    const keyword = crop.value.trim();
    if (keyword === "") {
        showMessage("請輸入作物名稱！");
        return;
    }
    showData = allData.filter(function(item){
    return item.作物名稱.includes(keyword);
    })
    renderData(showData);
    
    showResult.textContent =`查看「${keyword}」的比價結果`
}

search.addEventListener("click",function(e){
    toSearch();
})
crop.addEventListener("keydown",function(e){
    if (e.key === "Enter" && !e.isComposing) {
        toSearch();
    }
})

//排序功能
//1. 按表頭排序
function sortData(key,order){
    showData.sort(function(a,b){
        if(order==="up"){
            return a[key]-b[key] //由小到大
        }else if(order==="down"){
            return b[key]-a[key] //由大到小
        }
    })
    renderData(showData);
}
const tableTr = document.querySelector(".js-sort-advanced")
tableTr.addEventListener("click",function(e){
    const key = e.target.getAttribute("data-price")
    const order = e.target.getAttribute("data-sort")
    sortData(key,order);
})


//2. 按下拉選單排序 (pc)
const select = document.querySelector("#js-select")

select.addEventListener("change",function(e){
    const key = e.target.value;
    if(key === ""){
        return
    }
    sortData(key,"down"); //下拉選單一律用""down"由大排到小
})


//3. 按下拉選單排序 (mobile)
const selectMobile = document.querySelector("#js-mobile-select")
selectMobile.addEventListener("change",function(e){
    const key = e.target.value;
    if(key === ""){
        return
    }
    sortData(key,"down"); //下拉選單一律用""down"由大排到小
})
