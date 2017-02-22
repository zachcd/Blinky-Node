'use strict'
const blessed = require('blessed');
const blink1 = require('node-blink1');
const options = require('./menu.json');
const color = require('./colors.json');

// Create a screen object. 
var screen = blessed.screen({
    smartCSR: true
});

let kill = true;
screen.title = 'Blink Control';


const menuList = blessed.list({
    label: 'Choose a Color Option',
    tags: true,
    draggable: true,
    top: "5%",
    left: "5%",
    right: "5%",
    height: '70%',
    width: "80%",
    keys: true,
    border: 'line',
})

const loadBar = blessed.ProgressBar({
    orientation:'horizontal',
    filled: 0,
    label:"System Startup",
    top:"50%",
    right:"center",
    left:"center",
    width:"75%",
    height:'20%',
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'blue',
        border: {
            fg: '#f0f0f0'
        }
    }
});

const spinner = blessed.loading({
    label: "Startup Complete",
    left:"center",
    right:"center",
    top:"center",
    width:"100%",
    hieght:"100%"
})


const currentBox = blessed.box({
    labe: "Current Mode",
    top:"76%",
    left:"5%",
    content:"clean bootup",
    width:"80%",
    height: "25%",
    border:'line'
});


menuList.setItems(options)




// Quit on Escape, q, or Control-C. 
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
});

screen.key(["1","2","3","4","5","6","7","8"], function (ch, key) {
    currentBox.setContent("Current Mode is " + ch);
    kill = true
    screen.render();
    switch(ch){
        case '1':
            light.fadeToRGB(1000, color.red.r, color.red.g, color.red.b)
            break;
        case '2':
            light.fadeToRGB(1000, color.green.r, color.green.g, color.green.b)
            break;
        case '3':
            light.fadeToRGB(1000, color.magenta.r, color.magenta.g, color.magenta.b)
            break;
        case '4':
            light.fadeToRGB(1000, color.yellow.r, color.yellow.g, color.yellow.b)
            break;
        case '5':
            light.fadeToRGB(1000, color.blue.r, color.blue.g, color.blue.b)
            break;
        case '6':
            kill = false;
            breath(1)
            break;
        case '7':
            kill = false;
            rage(1)
            break;
        case '8':
            break;
        case '9':
            break;
        case '0':
            break;
    }
    return true;
});


//Mount the loadBar
screen.append(loadBar);


if(blink1.devices() !== 0){
    loadBar.progress(40);
    screen.render();
} 

const light = new blink1();
light.setRGB(0,0,0);

light.fadeToRGB(0.01 * 60 * 1000, color.green.r, color.green.g, color.green.b, 1, (data)=>{
    loadBar.progress(30);
    screen.render();
    
    light.fadeToRGB(0.01 * 60 * 1000, color.green.r, color.green.g, color.green.b, 2, (data)=>{
        loadBar.progress(30);
        screen.render();
        loadup();
    })
})


function loadup(){
    setTimeout(()=>{
        loadBar.progress(100);
        screen.render();
        setTimeout(()=>{
            screen.remove(loadBar);
            // screen.append(spinner);
            screen.render();
            setTimeout(()=>{
                screen.append(menuList);
                screen.render();
                setTimeout(()=>{
                    screen.append(currentBox);
                    screen.render();
                    menuList.focus();
                }, 0.01 * 60 * 1000)
            }, 0.01 * 60 * 1000)
        }, 0.01 * 60 * 1000)
    }, 0.01 * 60 * 1000)
}

function breath(led){
    light.fadeToRGB(1000, color.blue.r, color.blue.g, color.blue.b, led,()=>{
        if(kill) return
        light.fadeToRGB(1000, 0, 0, 0, led, ()=>{ 
            if(kill) return
            if(led == 1){
                breath(2);
            } else {
                breath(1);
            }
        })
    })
}


function rage(led){
    light.fadeToRGB(1000, color.red.r, color.red.g, color.red.b, led,()=>{
        if(kill) return
        light.fadeToRGB(1000, 0, 0, 0, led, ()=>{ 
            if(kill) return
            if(led == 1){
                rage(2);
            } else {
                rage(1);
            }
        })
    })
}

// Render the screen. 
screen.render();