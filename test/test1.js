var samp = {
    "id": null,
    "type": "donut",
    "name": "Old Fashioned",
    "ppu": 0.55,
    "batters": {
        "batter": [
            {
                "id": "1001",
                "type": "Regular"
            },
            {
                "id": "1002",
                "type": "Chocolate"
            }
        ]
    },
    "topping": [
        {
            "id": "5001",
            "type": "None"
        },
        {
            "id": "5002",
            "type": "Glazed"
        },
        {
            "id": "5003",
            "type": "Chocolate"
        },
        {
            "id": "5004",
            "type": "Maple"
        }
    ]
}

//File f = new File('./')
function createLongJson(){
    var sampdata=[];
    for(var i=0;i<10;i++){
        var obj = new Object();
        obj.id = i;
        obj.name= 'A';
        obj.size ='small';
        obj.total_units=100;
        obj.avbl_units=100;
        obj.price=500;
        obj.color='chrome';
        obj.material='steel';
        //console.log(obj);
        sampdata.push(obj);
    }
    console.log(sampdata);
}

createLongJson();