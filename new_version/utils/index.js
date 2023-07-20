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


