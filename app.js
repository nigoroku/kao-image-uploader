const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ejs = require('ejs');
const image_analysis = require('./lib/image_analysis');

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('progress', (msg) => {
        io.emit('progress', msg);
        console.log(`message: ${msg}`);
    });
});

const server = http.listen(3000, function(){
    console.log("listening to PORT:" + server.address().port);
});

app.use(express.static('./public'));

app.set("view engine", "ejs");
app.engine('ejs', ejs.renderFile);

var multer = require('multer');
var upload = multer({ dest: './public/uploads/' })

app.post('/search', upload.single('file'), function(req, res) {
    io.emit('progress', '50');

    // 判定後コールバック処理
    const file = req.file
    const analyze_callback = () => {
        console.log(file)
        const classes = file.analysis.images[0].classifiers[0].classes[0]
        const result = {
            "class": classes.class,
            "score": classes.score,
            "filename": file.filename
        }
        // 判定結果を画面に表示する
        io.emit('result', result);
    }

    // WatsonVRで画像を判定
    const analysis = () => {
        image_analysis.analyzeImage(file, analyze_callback)
        io.emit('progress', '20');
    }
    analysis()
});

app.get("/", function(req, res, next){
    res.render("index", {});
});
