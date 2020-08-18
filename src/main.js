const statusMap = new Map([
  [0, 'info'],
  [1, 'info'],
  [2, 'success'],
  [3, 'warning'],
  [4, 'error'],
  [5, 'error'],
])
new Vue({
  el: '#app',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectInfo: {
        env: ['dev', 'beta', 'gold'],
        service: ['auth2', 'chat', 'gateway', 'message', 'pay2', 'translate', 'auth', 'file-server', 'geoip', 'link', 'pay', 'ucenter'],
        game: ['tgstest', 'ba', 'G301', 'g303', 'B001', 'c4'],
        userType: [{
          label: '服务账号',
          options: [{
            value: 'game',
            label: 'game'
          }, {
            value: 'system',
            label: 'system'
          }]
        }, {
          label: '玩家账号',
          options: [{
            value: 'anonymous',
            label: 'anonymous'
          }, {
            value: 'baidu',
            label: 'baidu'
          }, {
            value: 'downjoy',
            label: 'downjoy'
          }, {
            value: 'facebook',
            label: 'facebook'
          }, {
            value: 'gamecenter',
            label: 'gamecenter'
          }, {
            value: 'googleplus',
            label: 'googleplus'
          }, {
            value: 'huawei',
            label: 'huawei'
          }, {
            value: 'ly',
            label: 'ly'
          }, {
            value: 'mobojoy',
            label: 'mobojoy'
          }, {
            value: 'openweixin',
            label: 'openweixin'
          }, {
            value: 'openqq',
            label: 'openqq'
          }, {
            value: 'oppo',
            label: 'oppo'
          }, {
            value: 'qq',
            label: 'qq'
          }, {
            value: 'twitter',
            label: 'twitter'
          }, {
            value: 'uc',
            label: 'uc'
          }, {
            value: 'vivo',
            label: 'vivo'
          }, {
            value: 'weibo',
            label: 'weibo'
          }, {
            value: 'weixin',
            label: 'weixin'
          }, {
            value: 'xiaomi',
            label: 'xiaomi'
          }, {
            value: '1sdk',
            label: '1sdk'
          }, {
            value: '360',
            label: '360'
          }]
        }],
        queryMethod: ['GET', 'POST', 'PUT', 'DELETE'],
        scope: [{
          label: '基础权限',
          children: [{
            label: 'auth'
          }, {
            label: 'ads'
          }, {
            label: 'pay'
          }, {
            label: 'message'
          }, {
            label: 'chat'
          }, {
            label: 'ads_rw'
          }]
        }, {
          label: '管理权限',
          children: [{
            label: 'auth_game_admin'
          }, {
            label: 'message_admin'
          }, {
            label: 'chat_admin'
          }, {
            label: 'mail_admin'
          }, {
            label: 'link_admin'
          }, {
            label: 'pay_game_admin'
          }, {
            label: 'gateway_game_admin'
          }]
        }, {
          label: '系统权限',
          children: [{
            label: 'chat_system'
          }, {
            label: 'system'
          }, {
            label: 'pay_system'
          }, {
            label: 'message_system'
          }, {
            label: 'gateway_system'
          }, {
            label: 'auth_system'
          }]
        }]
      },
      formData: {
        env: 'dev',
        service: 'chat',
        game: 'ba',
        clientId: '',
        authType: '0',
        userType: '',
        username: '',
        password: '',
        token: '',
        authWay: 'auth',
        queryMethod: 'GET',
        queryPath: '',
        params: [{
          key: '',
          value: ''
        }],
        scopeList: ''
      },
      nameUrl: '',
      accessToken: '',
      requestTime: '未请求',
      statusCode: '-',
      activeName: 'first',
      checkedKeys: [],
      historyList: [],
      queryUrl: '',
      result: ''
    }
  },
  mounted() {
    let emptyParams = [{ key: '', value: '' }]
    // 读取缓存数据
    this.formData.env = localStorage.getItem('env') || 'dev'
    this.formData.service = localStorage.getItem('service') || 'chat'
    this.formData.game = localStorage.getItem('game') || 'ba'
    this.formData.authType = localStorage.getItem('authType') || '0'
    this.formData.userType = localStorage.getItem('userType') || ''
    this.formData.username = localStorage.getItem('username') || ''
    this.formData.password = localStorage.getItem('password') || ''
    this.formData.token = localStorage.getItem('token') || ''
    this.formData.authWay = localStorage.getItem('authWay') || 'auth'
    this.formData.queryMethod = localStorage.getItem('queryMethod') || 'GET'
    this.formData.queryPath = localStorage.getItem('queryPath') || ''
    this.formData.params = JSON.parse(localStorage.getItem('params')) || emptyParams
    this.checkedKeys = localStorage.getItem('scopeList') || []
    if (typeof (this.checkedKeys) == 'string') {
      this.checkedKeys = this.checkedKeys.split(',')
    }
    let h = JSON.parse(localStorage.getItem('historyList'))
    this.historyList = (h == '' || h == null) ? [] : h
  },
  created() {
    // 页面卸载之前存储信息
    window.onbeforeunload = () => {
      localStorage.setItem('env', this.formData.env)
      localStorage.setItem('service', this.formData.service)
      localStorage.setItem('game', this.formData.game)
      localStorage.setItem('authType', this.formData.authType)
      localStorage.setItem('userType', this.formData.userType)
      localStorage.setItem('username', this.formData.username)
      localStorage.setItem('password', this.formData.password)
      localStorage.setItem('token', this.formData.token)
      localStorage.setItem('authWay', this.formData.authWay)
      localStorage.setItem('queryMethod', this.formData.queryMethod)
      localStorage.setItem('queryPath', this.formData.queryPath)
      this.getScopes()
      localStorage.setItem('params', JSON.stringify(this.formData.params))
      localStorage.setItem('scopeList', this.formData.scopeList)
      localStorage.setItem('historyList', JSON.stringify(this.historyList))
    }
  },
  methods: {
    // 获取scope
    getScopes() {
      let arr = this.$refs.tree.getCheckedKeys(true)
      this.formData.scopeList = Array.from(new Set(arr)).join()
    },
    // 添加参数
    addParams() {
      this.formData.params.push({})
    },
    isBlank() {
      let l = this.formData.params.length - 1
      if (this.formData.params[l].key || this.formData.params[l].value) {
        this.addParams()
      }
    },
    // 删除参数
    removeParam(idx) {
      this.formData.params.splice(idx, 1)
    },
    // 获取参数
    getParams() {
      let l = this.formData.params.length
      let data = {}
      if (l) {
        for (let i = 0; i < l; i++) {
          let key = this.formData.params[i].key
          let value = this.formData.params[i].value
          data[key] = value
        }
      }
      return data
    },
    send(formName) {
      let checkAuth
      if (this.formData.authType == '0') {
        checkAuth = this.formData.userType && this.formData.username && this.formData.password
      } else {
        checkAuth = this.formData.token
      }
      if (checkAuth) {
        let pattern = /^\//i
        if (pattern.test(this.formData.queryPath)) {
          let loading = this.$loading({ text: '正在请求...' })
          this.formData.clientId = this.formData.game + ':1.0.0'
          var myDate = new Date();
          this.requestTime = myDate.toLocaleString()
          this.statusCode = '-'
          this.getScopes()
          this.getNameAddr(this.formData.env)
          loading.close()
        } else {
          this.$message.error('请求路径格式错误！')
        }
      } else {
        this.$message.error('验证信息没有填写完整！')
      }
    },
    // 获取name服务的地址
    getNameAddr(env) {
      let that = this
      if (env != "gold") {
        env = "-" + env
      } else {
        env = ''
      }
      let url
      axios({
        method: 'GET',
        url: url,
        params: {
          client_id: that.formData.clientId
        },
        responseType: 'json'
      }).then(async function (res) {
        if (res.data.error_msg) {
          that.$notify.error({
            title: '错误',
            message: res.data.error_msg
          });
          return
        }
        that.nameUrl = res.data.cfn.servers.name
        let authdata = { client_id: that.formData.clientId };
        let apiData = { client_id: that.formData.clientId, service: that.formData.service };
        // 如果验证类型为”用户名密码“，则先获取token
        if (that.formData.authType == "0") {
          authdata.service = that.formData.authWay
          let authUrl = await that.getServiceAddr('GET', authdata)
          if (authUrl === false) {
            return
          }
          let authorizeData = {}
          authorizeData.client_id = that.formData.clientId
          authorizeData.user = that.formData.userType + ':' + that.formData.username
          authorizeData.password = that.formData.password
          authorizeData.scope = that.formData.scopeList
          let authorizeResult = await that.authorize(authUrl, authorizeData)
          if (authorizeResult === false) {
            return
          }
        } else {
          that.accessToken = that.formData.token
        }
        // 调用获取服务的方法
        serviceUrl = await that.getServiceAddr(that.formData.queryMethod, apiData)
        if (serviceUrl === false) {
          return
        }
        let serviceData = that.getParams()
        serviceData.access_token = that.accessToken
        // 发送api请求
        await that.checkAPI(serviceUrl, serviceData)
        that.setHistory()
      })
    },
    // 获取具体服务的地址
    async getServiceAddr(queryMethod, data) {
      let url
      await axios({
        url: this.nameUrl + "/locate",
        method: queryMethod,
        params: data,
        responseType: "json"
      }).then((res) => {
        if (res.data.error_msg) {
          this.$notify.error({
            title: '错误',
            message: res.data.error_msg
          });
          return false
        }
        url = res.data.schema + "://" + res.data.host + ":" + res.data.https_port + res.data.path
      })
      return url
    },
    // 获取access_token
    async authorize(baseUrl, data) {
      let that = this
      await axios({
        url: baseUrl + "/authorize", //请求地址
        method: 'GET',   //请求方式
        params: data, //请求参数
        responseType: "json"
      }).then((res) => {
        if (res.data.error_msg) {
          that.$notify.error({
            title: '错误',
            message: res.data.error_msg
          });
          return false
        }
        this.accessToken = res.data.access_token
      })
    },
    // 调试api
    async checkAPI(baseUrl, data) {
      this.getQueryUrl(baseUrl)
      await axios({
        url: baseUrl + this.formData.queryPath, //请求地址
        method: 'GET',   //请求方式
        params: data, //请求参数
        responseType: "json"
      }).then((res) => {
        this.result = res
        this.showResult(res)
      })
    },
    // 展示结果
    showResult(res) {
      this.statusCode = res.status
      let code = document.getElementById("response")
      code.innerHTML = JSON.stringify(res.data, null, 2)
      let headers = document.getElementById("headers")
      headers.innerHTML = JSON.stringify(res.headers, null, 2)
      hljs.highlightBlock(code);
      hljs.highlightBlock(headers);
    },
    // 获取状态码样式
    getStatus(statuscode) {
      switch (Math.floor(statuscode / 100)) {
        case 1:
          code = 1
          break;
        case 2:
          code = 2
          break;
        case 3:
          code = 3
          break;
        case 4:
          code = 4
          break;
        case 5:
          code = 5
          break;
        default:
          code = 0
      }
      return statusMap.get(code)
    },
    getQueryUrl(baseUrl) {
      let queryParam = '?'
      let l = this.formData.params.length
      for (let i = 0; i < l - 1; i++) {
        if (this.formData.params[i].key) {
          queryParam += this.formData.params[i].key + '=' + this.formData.params[i].value + '&'
        }
      }
      queryParam = queryParam.substr(0, queryParam.length - 1)
      this.queryUrl = baseUrl + this.formData.queryPath + queryParam
    },
    setHistory() {
      let history = {}
      history.formData = JSON.parse(JSON.stringify(this.formData))
      history.result = this.result
      history.requestTime = this.requestTime
      history.queryUrl = this.queryUrl
      this.historyList.unshift(history)
    },
    // 删除历史记录
    removeHistory(idx) {
      this.historyList.splice(idx, 1)
    },
    showHistory(row) {
      this.formData.env = row.formData.env
      this.formData.service = row.formData.service
      this.formData.game = row.formData.game
      this.formData.authType = row.formData.authType
      this.formData.userType = row.formData.userType
      this.formData.username = row.formData.username
      this.formData.password = row.formData.password
      this.formData.token = row.formData.token
      this.formData.authWay = row.formData.authWay
      this.formData.queryMethod = row.formData.queryMethod
      this.formData.queryPath = row.formData.queryPath
      this.formData.params = row.formData.params
      this.$refs.tree.setCheckedKeys(row.formData.scopeList.split(","))
      this.showResult(row.result)
      this.requestTime = row.requestTime
    }
  }
})
