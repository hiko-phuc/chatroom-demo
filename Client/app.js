(function(){
    var socket = io();

    var vue = new Vue({
        el:'#app',
        data: {
            userName: "",
            userList:[],
            userLoggedIn: false,
            message: "",
            messagesHist:[],
            messages: []
        },
        methods: {
            joinRoom: function() {
                socket.emit('join', '');
            },
            login: function(userName){
                socket.emit('join', userName);
                this.userLoggedIn = true;
            },
            sendMessage: function(message){
                if (!this.userName) {
                    alert('Vui lòng nhập tên hiển thị');
                    return;
                }
                if (!message) return;
                this.login(this.userName);
                socket.emit('message', message);
                this.message = "";
                return false;
            },
            initSocket: function(){
                socket.on('message', function(data){
                    console.log(data)
                    this.messagesHist.push(data);
                    $(".panel-body").scrollTop($(".panel-body")[0].scrollHeight);
                }.bind(this));

                socket.on('refreshUserList', function(data){
                    this.userList = data.users || [];
                    this.messages = data.messages || [];
                    console.log('data', data)
                    setTimeout(() => {
                        $(".panel-body").scrollTop($(".panel-body")[0].scrollHeight);
                    },500)
                }.bind(this));
            }
        }
    });

    vue.joinRoom();
    vue.initSocket();
}());