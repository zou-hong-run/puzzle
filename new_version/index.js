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
