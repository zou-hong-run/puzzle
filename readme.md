[TOC]

# 前端技术搭建（动态图片）拖拽拼图(内含实现原理)

![拼图封面.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd9cad1b0b8644c59af48a29567e3d8f~tplv-k3u1fbpfcp-watermark.image?)
# 导言
> 两年半前，老师要求我们实现一个拼图拖拽游戏。
> 基于此，我重构了当年的代码，实现了更加丰富的游戏
# 功能介绍
动态拖拽拼图，是将以往的二维移动方块的方式，变成了三维移动方式，目标是将一张图片切割打乱，然后，重组为原图的游戏。
>**功能介绍**
>- 等待用户输入玩家名，选择游戏难度
>- 期待用户上传自定义图片（支持gif，jpg，png等）
>- 开始游戏
>- 切割打乱图片
>- 用户拖拽拼图快完成图片
>- 烟花效果
>- 排行榜

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f8657c33e654a33ae6b768c6451eccc~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ace00944a25f4c5e99c0e1a9285ed250~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46fe40f213764f1ca4455d5c280ce395~tplv-k3u1fbpfcp-watermark.image?)

# 效果演示链接（觉得不错的，请一键三连嘤嘤嘤）
[通过gif动态图，我开发了一个动态图拖拽拼图网页游戏_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1DV41157tz/)

# 项目目录
- puzzle
    - css
        - index.css
    - pic
    - utils
        - confetti.js
        - index.js
    - index.html
    - index.js

## 页面搭建
首先实现游戏界面搭建，引入相关文件。

我将游戏分为三个部分
- 游戏准备页面 （id="start"）
- 游戏界面 （id="game_container"），游戏界面也分为三个部分
     1. 左边打乱拼图区域 id="puzzle"
     2. 中间游戏目标完整图片id="puzzle_map"
     3. 右边游戏目标id="puzzle_destionation"
- 游戏结束页面 （id="end"）
>index.html
>界面布局
>详情请看代码

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>拖拽拼图</title>
    <script src="./utils/confetti.js"></script>
    <link rel="stylesheet" href="css/index.css">
</head>

<body>
    <div id="start" class="">
        <div class="box">
            <h1>欢迎玩家</h1>
            <p>请创建的你的游戏信息</p>
            <div class="form">
                <!-- 标题 -->
                <div class="group">
                    <label for="nickname">玩家昵称</label>
                    <input type="text" value="red润" id="nickname" name="nickname">
                </div>
                <!-- 难度 -->
                <div class="group">
                    <label for="difficult">
                        难度
                    </label>
                    <select name="difficult" id="difficult">
                        <option value="">请选择难度</option>
                        <option value="3">简单</option>
                        <option value="5">一般</option>
                        <option value="7">困难</option>
                        <option value="9">地狱</option>
                        <option value="11">天堂</option>
                        <option value="15">不要尝试的难度</option>
                    </select>
                </div>
                <!-- 放入图片 -->
                <div class="group" id="drop">
                    <div class="preview">
                        <img src="./pic/upload.png" alt="放入拼图">
                        <input type="file" name="pic" id="pic" accept="image/gif, image/jpeg ,image/png">
                    </div>
                    <p>点击加号（选择你要放入的图片）</p>
                </div>
                <div class="group">
                    <button name="submit">
                        开始(请先上传图片)
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div id="game_container" class="hidden">
        <span>用户名</span>
        <div id="timer">
            <span>00:00</span>
        </div>
        <div id="puzzle_container">
            <div id="puzzle"></div>
            <div id="puzzle_map"></div>
            <div id="puzzle_destionation"></div>
        </div>
        <div class="buttons">
            <button class="stop">暂停</button>
            <button class="restart">重新开始</button>
        </div>
    </div>
    <div id="end" class="hidden">
        <div class="box" style="overflow: scroll;">
            <h3>拼图完成</h3>
            <p>游戏胜利！</p>
            <table>
                <thead>
                    <tr>
                        <th>排名</th>
                        <th>难度</th>
                        <th>用户名</th>
                        <th>游戏时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>不要尝试的难度</td>
                        <td>red润</td>
                        <td>11:11::23</td>
                    </tr>
                </tbody>
            </table>
            <button onclick="document.querySelector('#end').classList.add('hidden'),document.querySelector('#start').classList.remove('hidden')">再来亿遍</button>
        </div>
    </div>
    <script type="module">
        import Main from "./index.js"
        new Main()
    </script>
</body>

</html>
```
## css样式设置
>index.css 布局样式 详细请看代码
``` css
* {
    margin: 0;
    padding: 0;
    /* 比如输入框选中时候的边框 */
    outline: none;

    font-family: "Arial", sans-serif;
    color: #282828;
    /* 下划线 */
    text-decoration: none;
    /* 列表前面的 点 */
    list-style-type: none;
    box-sizing: border-box;
}

html,
body {
    width: 100%;
    height: 100%;
    background-color: black;
    background: url("../pic/坤坤1.gif");
    background-size: 100% 100%;
}

.hidden {
    display: none !important;
}

/* 公用样式 */
#start {
    width: 100%;
    height: 100%;
    position: fixed;
}

#end {
    width: 100%;
    height: 100%;
    position: fixed;
    mix-blend-mode:luminosity;
}

.box {
    border-radius: 15px;
    padding: 40px;
    margin: 40px 40px;
    width: calc(100% - 80px);
    height: calc(100% - 80px);
    text-align: center;
    background-color: #F2F2F2;
}

/* 游戏开始 */
#start .group {
    margin-top: 20px;
}

#start .group input,
#start .group select {
    width: 99%;
    height: 40px;
    line-height: 40px;
    text-align: center;
}

#start .group label {
    text-transform: uppercase;
    font-size: 15px;
    text-align: left;
}

#start .group button {
    width: 100%;
    height: 60px;
}

/* 选择上传图片功能 */
#start #drop {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: dotted 1px rgba(0, 0, 0, 0.2);
}

#start #drop p {
    width: calc(100% - 100px);
}

#start .preview {
    position: relative;
    background-color: red;
    width: 100px;
    height: 100px;
}

#start .preview img {
    position: absolute;
    width: 100px;
    height: 100px;
    left: 0;
}

#start .preview input {
    left: 0;
    top: 0;
    width: 100px;
    height: 100px;
    position: absolute;
    opacity: 0;
}

/* 游戏内容区域 */
#game_container {
    width: 100%;
    height: 100%;
    background-color: #009BBC;
    padding: 70px 50px 50px;
    text-align: center;

}

#game_container>span {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    width: 100%;
    background-color: white;
    ;
}

#game_container #timer span {
    display: inline-block;
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #004D5E;
}

/* 拼图区域 */
#puzzle_container {

    height: 300px;
    width: 100%;
    display: flex;
    flex-direction: row;
}

#puzzle_container #puzzle {
    width: 300px;
    height: 300px;
    border: dotted 1px black;
    position: relative;
}

#puzzle_container #puzzle_map {
    border-radius: 0;
    flex: 1;
    height: 300px;
    border: dotted 1px rgb(0, 0, 0);
}

#puzzle_container #puzzle_destionation {
    width: 300px;
    height: 300px;
    position: relative;
    border: dotted 1px black;
}

#game_container .buttons button {
    width: 100%;
    height: 30px;
}

/* 游戏结束 */
#end {
    width: 100%;
    height: 100%;
}

#end h3 {
    text-align: center;
}

#end p {
    text-align: center;
}

#end table {

    width: 100%;
    /* 共享边框 */
    border-collapse: collapse;
}

#end table th,
td {
    padding: 10px;
    border: solid 1px rgb(0, 0, 0, 0.2);
}

#end button {
    width: 100%;
    text-align: center;
    height: 50px;
}

```
## 工具函数
> utils/index.js 工具函数 封装复用函数
``` javascript
export default class Utils {
    /**
     * 通过传入的文件，拿到文件数据流
     * @param {object} file 传入的文件
     * @returns {string} url 返回图片url
     */
    static getUrlByFile(file) {
        let url = null;
        // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
    /**
     * 将秒转换为 天时分秒
     * @param {*} value 毫秒
     * @returns {string} str 格式化后的字符串
     */
    static formatSeconds(value) {
        let s = value//秒
        let m = 0;//分
        let h = 0;//小时
        let d = 0;//天
        if (s > 60) {
            m = parseInt(s / 60)
            s = parseInt(s % 60)
            if (m > 60) {
                h = parseInt(m / 60)
                m = parseInt(m % 60)
                if (h > 24) {
                    d = parseInt(h / 24)
                    h = parseInt(h % 24)
                }
            }
        }
        let result = ''
        if (s > 0) {
            if (s < 10) {
                result = "0" + s + "秒"
            } else {
                result = s + "秒"
            }
        }
        if (m > 0) {
            if (m < 10) {
                result = "0" + m + "分" + ":" + result
            } else {
                result = m + "分" + ":" + result
            }
        }
        if (h > 0) {
            if (h < 10) {
                result = "0" + h + "时" + ":" + result
            } else {
                result = h + "时" + ":" + result
            }
        }
        if (d > 0) {
            if (d < 10) {
                result = "0" + d + "天" + ":" + result
            } else {
                result = d + "天" + ":" + result
            }
        }
        return result
    }

    /**
     * 只显示一个用户场景
     * @param {*} name 
     */
    static showOne(that,name){
        // this.startEle.classList.remove("hidden")
        // this.gameContainerEle.classList.add("hidden")
        // this.endEle.classList.add("hidden")
        that[name].classList.remove('hidden')
        let names = ["startEle","gameContainerEle",'endEle']
        names.filter(item=>item!==name).forEach(item=>{
            that[item].classList.add('hidden')
        })
    }

    /**
     * 根据传入的数值,返回一个和数值长度大小相等的数组
     * @param {*} num 
     * @returns {arr[]}
     */
    static rM(num){
        let randomArr = []
        // 保存有序数组
        for(let a=0;a<num;a++){
            randomArr.push(a)
        }
        // 打乱有序数组
        randomArr.sort((a,b)=>Math.random()-0.5)
        return randomArr
    }
}



```
## 游戏实现逻辑
> index.js 游戏实现完整逻辑 详情请看代码
``` javascript
import Utils from './utils/index.js';
export default class Main {

    constructor() {
        // 记录游戏时间
        this.time = 0;
        // 定时器对象
        this.timer = null;
        // 游戏是否暂停
        this.stop = false;
        // 游戏难度等级
        this.level = 3
        // 玩家昵称
        this.nickname = null

        // 拖拽拼图的宽高
        this.width = 300;
        this.height = 300;

        // 用户上传的图片文件
        this.file = null
        // 用户上传图片后转换为数据流 作为url路径
        this.url = null

        // start容器元素
        this.startEle = document.querySelector("#start");
        // game_container容器元素
        this.gameContainerEle = document.querySelector("#game_container")
        // end容器元素
        this.endEle = document.querySelector("#end")

        // start元素下面的img
        this.startImg = document.querySelector("#start img")
        // start元素下面的用户名
        this.startNickName = document.querySelector("#start #nickname")
        // start元素下面的等级
        this.startLevel = document.querySelector("#start #difficult")
        // start元素下面的开始按钮
        this.startBtn = document.querySelector("#start button")
        // start元素input上传文件元素
        this.startPic = document.querySelector("#start #pic")

        // game_container下面的timer
        this.gameTimer = document.querySelector("#game_container #timer")
        // 暂停按钮
        this.gameStopBtn = document.querySelector("#game_container .stop")
        // 重新开始按钮
        this.gameRestartBtn = document.querySelector("#game_container .restart")

        // 左边拼图块
        this.puzzle = document.querySelector('#puzzle')
        // 中间拼图块
        this.puzzleMap = document.querySelector('#puzzle_map')
        // 右边拼图块
        this.puzzleDestionation = document.querySelector("#puzzle_destionation")

        this.init()
    }
    init() {
        // 烟花
        this.jsConfetti = new JSConfetti()
        const addFire = (i = 1) => {
            for (i; i > 0; i--) {
                setTimeout(() => {
                    this.jsConfetti.addConfetti()

                    
                }, i * 500)
            }
        }
        addFire(11)

        console.log("游戏初始化");
        // 初始化排行榜
        this.initRank()
        // 显示开始界面，隐藏其他界面
        Utils.showOne(this, "endEle")

        // 禁用开始按钮
        this.startBtn.disabled = true
        this.startBtn.style.cursor = "not-allowed";
        // 监听图片上传
        this.addEventListenerStartPicChange()
        // 监听开始游戏按钮
        this.addEventListenerStartBtn()
        // 监听是否点击游戏暂停按钮
        this.addEventListenerIsStop()
        // 监听是否重新游戏
        this.gameRestartBtn.addEventListener("click", () => {
            this.restartGame()
        })

    }
    initRank() {
        let tbody = document.querySelector("table>tbody")
        let rankArr = JSON.parse(localStorage.getItem("ranking"))
        let objs = []
        objs.push(`<tr>
            <td>1</td>
            <td>不要尝试的难度</td>
            <td>red润</td>
            <td>4天:3时:5分:18秒</td>
        </tr>
        `)
        for (const key in rankArr) {
            let obj = rankArr[key]
            parseInt(obj.level)
            if (obj.level == 3) {
                obj.level = "简单"
            } else if (obj.level == 5) {
                obj.level = "一般"
            } else if (obj.dif == 7) {
                obj.level = "困难"
            } else if (obj.level == 9) {
                obj.level = "地狱"
            } else if (obj.level == 11) {
                obj.level = "天堂"
            } else if (obj.level == 15) {
                obj.level = "不要尝试的难度"
            }
            let node = `<tr>
              <td>${parseInt(key) + 2}</td>
              <td>${obj.level}</td>
              <td>${obj.name}</td>
              <td>${obj.time}</td>
            </tr>`
            objs.push(node)
        }
        tbody.innerHTML = objs

    }
    // 监听用户是否点击上传图片，将上传的图片存储下来
    addEventListenerStartPicChange() {
        // 注意this的指向
        this.startPic.addEventListener("change", (e) => {
            // 存储用户上传的图片
            this.file = e.target.files[0];
            // 转换
            this.url = Utils.getUrlByFile(this.file);

            if (this.url !== null) {
                this.startBtn.disabled = false
                this.startBtn.style.cursor = "pointer";
                this.startImg.src = this.url

                this.initGameContainer()
            }

        })
    }
    // 监听开始游戏按钮
    addEventListenerStartBtn() {
        this.startBtn.addEventListener('click', () => {
            this.initGameContainer()
        })
    }
    // 监听 暂停按钮 点击
    addEventListenerIsStop() {
        this.gameStopBtn.addEventListener("click", () => {
            this.stop = !this.stop
            if (this.stop === false) {
                this.startCountTime()
                this.gameStopBtn.innerHTML = "暂停游戏"
            } else {
                this.stopCountTime()
                this.gameStopBtn.innerHTML = "继续游戏"
            }

        })
    }
    // 开始定时
    startCountTime() {
        if (this.timer) clearInterval(this.timer)
        this.timer = setInterval(() => {
            this.time++
            this.gameTimer.innerHTML = Utils.formatSeconds(this.time)
        }, 1000)
    }
    // 暂停
    stopCountTime() {
        if (this.timer) clearInterval(this.timer)
    }
    // 重新游戏
    restartGame() {
        window.location.reload()
    }

    // 初始化游戏地图
    initGameContainer() {
        if (!this.startNickName.value || !this.startLevel.value) {
            alert("用户名或者游戏难度不能为空");
            return;

        }
        // 存储用户选择的难度等级
        this.level = this.startLevel.value
        // 存储玩家名字
        this.nickname = this.startNickName.value

        // 显示游戏地图，隐藏其他地图
        Utils.showOne(this, "gameContainerEle")
        // 初始化拼图
        this.initPuzzle()
        // 开始计时
        this.startCountTime()


    }
    // 初始化拼图
    initPuzzle() {
        // 左边
        this.puzzle.style.background = `url(${this.url})`
        this.puzzle.style.backgroundSize = "100% 100%";
        // 中间
        this.puzzleMap.style.background = `url(${this.url})`
        this.puzzleMap.style.backgroundSize = "100% 100%";

        // 右边
        this.puzzleDestionation.style.background = `url(${this.url})`
        this.puzzleDestionation.style.backgroundSize = "100% 100%";

        // 创建左边拖拽
        this.createPuzzle(this.puzzle)
        // 创建右边接收区
        this.createPuzzle(this.puzzleDestionation)

    }
    // 根据传入的puzzle,创建拖拽元素
    createPuzzle(ele) {
        // 存储打乱后的div
        let arr = [];
        // 给每个div设置一个唯一id
        let id_num = 0;
        // 每行/每列 puzzle块的数量 300/3 = 10
        let ppx = `${Math.floor(this.width / this.level)}`;
        // 根据用户选择的难度,产生对应的随机数组 3*3
        let randomNum = Utils.rM(this.level);
        for (let i = 0; i < this.level; i++) {
            for (let j = 0; j < this.level; j++) {
                let div = document.createElement("div");
                div.style.backgroundRepeat = "no-repeat";
                div.style.zIndex = '100'
                div.style.width = ppx + 'px'
                div.style.height = ppx + 'px'
                div.style.position = 'absolute'


                if (ele.id === 'puzzle') {
                    div.style.border = `${1}px solid yellow`
                    // 打乱拼图位置
                    div.style.top = `${randomNum[j] * ppx}px`
                    div.style.left = `${randomNum[i] * ppx}px`
                    div.style.background = `url(${this.url})`
                    div.style.boxSizing = 'border-box'
                    div.style.backgroundSize = "300px 300px"
                    div.draggable = true
                    // 虽然位置是乱的，但是id是正常的
                    div.id = id_num
                    // 水平/垂直
                    div.style.backgroundPosition = `-${(j * ppx)}px -${(i * ppx)}px`
                    arr.push(div)
                } else {
                    div.style.border = `${1}px solid pink`
                    //不能打乱图片顺序
                    div.style.top = (i * ppx) + 'px'
                    div.style.left = (j * ppx) + 'px'
                    div.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
                    div.className = id_num
                    div.id = id_num + "1"
                    arr.push(div)
                }
                id_num++;
            }
        }
        // 设置拖拽事件和放置事件
        this.setPuzzleEvent(ele, arr)


    }
    setPuzzleEvent(ele, arr) {
        // 左边拼图拖拽的时候，设置id
        if (ele.id === 'puzzle') {
            for (let i = 0; i < arr.length; i++) {
                ele.appendChild(arr[i])
                arr[i].ondragstart = (e) => {
                    e.dataTransfer.setData("Id", e.target.id)
                }
            }
        } else {
            for (let i = 0; i < arr.length; i++) {
                ele.appendChild(arr[i])
                arr[i].ondragover = (e) => {
                    e.preventDefault()
                }
                let that = this
                arr[i].ondrop = function (e) {
                    let leftId = e.dataTransfer.getData("Id");

                    let leftDiv = document.getElementById(leftId);
                    leftDiv.style.top = 0;
                    leftDiv.style.left = 0;
                    // 将拖拽方块，从左边放到右边
                    this.appendChild(leftDiv);

                    // 右边的所有元素节点
                    let allNodes = this.parentNode.childNodes;
                    that.isWin(allNodes)

                }
            }
        }
    }
    // 是否胜利
    isWin(allNodes) {
        // 判断游戏是否胜利
        let allChild = []

        // 存储右边元素的儿子节点的id
        allNodes.forEach(element => {
            let child = element.childNodes[0]
            if (child) {
                allChild.push(child.id)
            }
        });
        // 长度要相等，然后，判断是否完全重合
        if (allNodes.length === allChild.length) {
            for (let i = 0; i < allChild.length; i++) {
                if (i == allChild[i]) {
                    alert("游戏胜利")
                    this.joinRank()
                    return
                }
            }
        } else {
            console.log("加油马上就成功了");
        }
    }
    // 加入排行榜
    joinRank() {
        let rankArr = []
        if (localStorage.getItem("ranking")) {
            rankArr = JSON.parse(localStorage.getItem("ranking"))
        }
        let obj = {
            name: this.nickname,
            level: this.level,
            time: Utils.formatSeconds(this.time)
        }
        rankArr.unshift(obj)
        localStorage.setItem("ranking", JSON.stringify(rankArr))
        this.stopCountTime();
        this.time = 0;
        
        this.restartGame()
    }

}


```
# 开源地址
- 开源地址：zou-hong-run/puzzle: 拖拽拼图 (github.com) 
- 项目在线体验地址（电脑体验，手机尚未适配）：https://zou-hong-run.github.io/puzzle/new_version
# 总结
> - 通过本次编写代码体验，加强了拖拽api的理解，面向对象的理解
> - 还有很多不足，请大家指教
> - 大佬们觉得不错的话，请一键三连呀