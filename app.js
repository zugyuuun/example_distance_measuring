var SLAVE_ADDR  = 0x40;
var REG_SHIFT   = 0x35;
var REG_DIST_HI = 0x5e;
var REG_DIST_LO = 0x5f;
var REG_RESET   = 0xee;
var RESET_VAR   = 0x06;

ZGN(function() {

    var term = ZGN.term('1');
    var i2c = term.i2c;

    // 測距センサの初期化
    i2c.writeReg8(SLAVE_ADDR, REG_RESET, RESET_VAR, function(){});

    // 距離の読み取り
    setInterval(function(){
        var fs = flo = fhi = 0;
        var s  = lo = hi = 0;

        i2c.readReg8(SLAVE_ADDR, REG_SHIFT, function(data){
            s = data;
            fs = 1;
            output();
        });
        i2c.readReg8(SLAVE_ADDR, REG_DIST_LO, function(data){
            lo = data;
            flo = 1;
            output();
        });
        i2c.readReg8(SLAVE_ADDR, REG_DIST_HI, function(data){
            hi = data;
            fhi = 1;
            output();
        });

        // 読み取った距離の出力
        function output() {
            if( (fs == 1) && (flo == 1) && (fhi == 1) ) {
                var distance = ( ((hi << 4) | lo) / 16 ) >> s;
                $('#status').text(distance+'cm');
            }
        }

    }, 200);
});
